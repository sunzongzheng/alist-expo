import React, {useCallback, useLayoutEffect, useRef, useState} from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  NativeModules, Button, ActivityIndicator, Linking,
} from "react-native";
import dayjs from 'dayjs'
import DirectoryImage from "@/assets/images/directory.png";
import VideoImage from "@/assets/images/video.png";
import AudioImage from "@/assets/images/audio.png";
import FileImage from "@/assets/images/file.png";
import {router, useFocusEffect, useLocalSearchParams, useNavigation} from "expo-router";
import axios from 'axios'
import {Feather, MaterialIcons} from "@expo/vector-icons";
import {useAppSelector} from "@/app/store";
import Toast from 'react-native-root-toast';
import noDataImage from "@/assets/images/无服务.png";

const {Alist, VideoPlayer, AudioPlayer} = NativeModules

interface FileItem {
  name: string;
  size: number;
  is_dir: boolean;
  modified: string;
  sign: string;
  thumb: string;
  type: number;
  raw_url: string;
  readme: string;
  provider: string;
  created: string;
  hashinfo: string;
  header: string;
}

const UA_CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'

const http = axios.create({
  timeout: 5000,
  baseURL: 'http://127.0.0.1:5244/api',
  headers: {
    Authorization: '',
    'User-Agent': UA_CHROME
  }
})

http.interceptors.response.use(function (response) {
  if (response.status === 200 && response.data.code === 200) {
    return response.data.data;
  } else {
    return Promise.reject(response);
  }
});

let token = ''

function isSupportVideoFile (filename: string) {
  const format = filename.split('.').slice(-1)[0]
  return ['mp4', 'flv', 'm3u8', 'mkv', 'avi', 'mov', 'wmv', 'rm', 'rmvb', '3gp', 'm4v', 'dat', 'vob', 'mpeg', 'dv', 'mod'].includes(format.toLowerCase())
}

function isSupportAudioFile (filename: string) {
  const format = filename.split('.').slice(-1)[0]
  return ['mp3', 'flac', 'ogg', 'm4a', 'wav', 'opus', 'wma', 'ape'].includes(format.toLowerCase())
}

function formatBytes(bytes: number)  {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function RenderItem({item, index}: {item: FileItem; index: number;}) {
  const {path} = useLocalSearchParams() as { path: string };
  const [loading, setLoading] = useState(false)

  const play = useCallback(async (filename: string) => {
    console.log('play', filename)
    setLoading(true)
    try {
      const data: FileItem = await http.post(`/fs/get`, {
        path: `${path}/${filename}`,
      })
      console.log('getFileInfo', data)
      const header: Record<string, string> = {}
      if (data.provider.includes('Baidu')) {
        header['User-Agent'] = 'pan.baidu.com'
      } else {
        header['User-Agent'] = UA_CHROME
      }
      if (isSupportVideoFile(filename)) {
        VideoPlayer.play(data.raw_url, header)
      } else if (isSupportAudioFile(filename)) {
        AudioPlayer.play(data.raw_url, header)
      }
    } catch (e: any) {
      console.warn(e)
      Toast.show(e?.data?.message || '加载失败', {
        position: Toast.positions.CENTER,
      })
    }
    setLoading(false)
  }, [path])

  const handleFileItem = useCallback(() => {
    if (loading) return
    if (item.is_dir) {
      const targetPath = `${path || ''}/${item.name}`
      console.log('goToDirectoryDetail', targetPath)
      router.push(`/files?path=${encodeURIComponent(targetPath)}`)
    } else {
      if (isSupportVideoFile(item.name)) {
        play(item.name)
      } else if (isSupportAudioFile(item.name)) {
        play(item.name)
      } else {
        Toast.show('暂不支持此文件格式', {
          position: Toast.positions.CENTER,
        })
      }
    }
  }, [item, loading])

  return (
    <TouchableOpacity onPress={handleFileItem}>
      <View
        key={item.name + index}
        style={styles.fileItem}
      >
        {loading ? (
          <View style={[styles.image, {alignItems: 'center', justifyContent: 'center'}]}>
            <ActivityIndicator color={'#2196F3'}/>
          </View>
        ) : (
          <Image
            source={item.is_dir ? DirectoryImage : isSupportVideoFile(item.name) ? VideoImage : isSupportAudioFile(item.name) ? AudioImage : FileImage}
            style={styles.image}
          />
        )}

        <View style={{overflow: 'hidden', flex: 1}}>
          <Text style={styles.title} lineBreakStrategyIOS={'standard'}>{item.name}</Text>
          <View style={styles.subView}>
            <Text
              style={styles.subtitle}>{dayjs(item.modified).format('YYYY/MM/DD')}</Text>
            {!item.is_dir ?
              <Text style={styles.size}>- {formatBytes(item.size)}</Text> : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function Files() {
  const navigation = useNavigation();
  const {path} = useLocalSearchParams() as { path: string };
  const isRunning = useAppSelector(state => state.server.isRunning)
  const [items, setItems] = useState<FileItem[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const refresh = useCallback(async () => {
    try {
      setErrorMsg('')
      if (!token || !path) {
        // 每次进根目录时获取token
        const data: any = await http.post(`/auth/login`, {
          username: 'admin',
          password: await Alist.getAdminPassword()
        })
        http.defaults.headers.Authorization = token = data.token
      }
      const data: any = await http.post(`/fs/list`, {
        path,
      })
      navigation.setOptions({
        headerTitle: path?.split('/').slice(-1)[0] || '根目录',
      })
      // 文件夹在前 按文件名排序
      setItems(data.content.sort((a: any, b: any) => a.name > b.name ? 1 : -1).sort((a: any, b: any) => Number(b.is_dir) - Number(a.is_dir)))
    } catch (e: any) {
      console.warn(e)
      setErrorMsg(e?.data?.message || '加载失败')
      setItems([])
    }
  }, [path, navigation, setItems])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isRunning && path ? () => (
        <MaterialIcons
          name="arrow-back-ios"
          size={18}
          color="white"
          style={{marginLeft: 16}}
          onPress={() => {
            const paths = path.split('/')
            if (paths.length > 1) {
              router.push(`/files?path=${encodeURIComponent(paths.slice(0, -1).join('/'))}`)
            } else {
              router.push('/files')
            }
          }}
        />
      ) : null,
      headerRight: isRunning && path ? () => (
        <Feather
          name="external-link"
          size={22}
          color="white"
          onPress={() => Linking.openURL(`http://127.0.0.1:5244${path}`)}
          style={{ marginRight: 16 }}
        />
      ) : null
    });
  }, [path, isRunning]);

  useFocusEffect(React.useCallback(() => {
    if (isRunning) {
      refresh()
    }
  }, [isRunning, refresh]));

  return isRunning ? errorMsg ? (
    <View style={styles.errorMsgView}>
      <Text style={styles.errorMsgText}>{errorMsg}</Text>
      <Button onPress={refresh} title={'重试'}></Button>
    </View>
  ) : (
    <View style={styles.files}>
      <FlatList
        data={items}
        keyExtractor={(item, index) => item.name + index}
        renderItem={props => <RenderItem {...props}/>}
      />
    </View>
  ) : (
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      paddingBottom: 50,
    }}>
      <Image source={noDataImage} style={{width: 200, height: 200}}/>
      <Text>请先启动服务</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  files: {
    flex: 1,
    flexDirection: 'column',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingRight: 12,
  },
  image: {
    width: 32,
    height: 32,
    marginHorizontal: 16,
  },
  title: {
    color: 'rgb(36, 36, 36)',
    fontSize: 14,
  },
  subView: {
    flexDirection: 'row',
  },
  subtitle: {
    color: 'gray',
    fontSize: 12,
    marginTop: 4,
  },
  size: {
    color: 'gray',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  errorMsgView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorMsgText: {
    fontSize: 20,
    marginBottom: 12
  }
})
