import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  NativeModules,
  Button,
  ActivityIndicator,
  Linking,
  TVFocusGuideView,
  Pressable,
  TVEventControl,
  BackHandler,
  useColorScheme,
} from "react-native";
import dayjs from 'dayjs'
import DirectoryImage from "@/assets/images/directory.png";
import VideoImage from "@/assets/images/video.png";
import AudioImage from "@/assets/images/audio.png";
import FileImage from "@/assets/images/file.png";
import {router, useFocusEffect, useLocalSearchParams, useNavigation, usePathname} from "expo-router";
import axios from 'axios'
import {Feather, MaterialIcons} from "@expo/vector-icons";
import {useAppSelector} from "@/app/store";
import Toast from 'react-native-root-toast';
import noDataImage from "@/assets/images/无服务.png";
import NoData from "@/components/NoData";
import Text from '@/components/ColorSchemeText'
import {useTextStyles} from "@/hooks/useTextStyles";
import {useScale} from "@/hooks/useScale";

const {Alist, VideoPlayer, AudioPlayer} = NativeModules
TVEventControl.enableTVMenuKey()

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
  const scale = useScale()
  const colorScheme = useColorScheme()
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false)

  const subTextStyle = useMemo(() => {
    return {
      fontSize: 12 * scale,
      color: focused ? colorScheme === 'dark' ? '#ddd' : '#999' : 'gray'
    }
  }, [focused, scale, colorScheme])

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
    <Pressable
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={handleFileItem}
    >
      {() => (
        <View
          key={item.name + index}
          style={[styles.fileItem, {backgroundColor: focused ? colorScheme === 'dark' ? 'gray' : '#ddd' : 'transparent'}]}
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
            <Text style={{fontSize: 16 * scale}} lineBreakStrategyIOS={'standard'}>{item.name}</Text>
            <View style={styles.subView}>
              <Text
                style={[styles.subtitle, subTextStyle]}>{dayjs(item.modified).format('YYYY/MM/DD')}</Text>
              {!item.is_dir ?
                <Text style={[styles.size, subTextStyle]}>- {formatBytes(item.size)}</Text> : null}
            </View>
          </View>
        </View>
      )}
    </Pressable>
  )
}

let readyForExit = false

export default function Files() {
  const navigation = useNavigation();
  const pathname = usePathname();
  const {path} = useLocalSearchParams() as { path: string };
  const isRunning = useAppSelector(state => state.server.isRunning)
  const scale = useScale()
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

  useFocusEffect(React.useCallback(() => {
    if (isRunning) {
      refresh()
    }
  }, [isRunning, refresh]));

  useEffect(() => {
    const cb = () => {
      console.log('按下返回按钮', pathname, path)
      if (pathname === '/files') {
        const paths = path?.split('/') || ['']
        if (paths.length > 1) {
          router.push(`/files?path=${encodeURIComponent(paths.slice(0, -1).join('/'))}`)
          return true
        }
      }
      if (readyForExit) {
        readyForExit = false
        console.log('退出app')
        return false
      }
      readyForExit = true
      TVEventControl.disableTVMenuKey()
      Toast.show('再按一次退出App', {
        containerStyle: {
          paddingHorizontal: 24 * scale,
          paddingVertical: 12 * scale,
        },
        textStyle: {
          fontSize: 16 * scale
        },
        duration: 1000
      })
      setTimeout(() => {
        readyForExit = false
        TVEventControl.enableTVMenuKey()
      }, 1000)
      return true
    }
    BackHandler.addEventListener('hardwareBackPress', cb)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', cb)
    }
  }, [path, pathname]);

  return isRunning ? errorMsg ? (
    <TVFocusGuideView style={styles.errorMsgView} autoFocus={true}>
      <Text style={styles.errorMsgText}>{errorMsg}</Text>
      <Button onPress={refresh} title={'重试'}></Button>
    </TVFocusGuideView>
  ) : (
    <View style={styles.files}>
      <FlatList
        data={items}
        keyExtractor={(item, index) => item.name + index}
        renderItem={props => <RenderItem {...props}/>}
      />
    </View>
  ) : (
    <NoData text={'请先启动服务'}/>
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
    width: 64,
    height: 64,
    marginHorizontal: 32,
  },
  subView: {
    flexDirection: 'row',
  },
  subtitle: {
    marginTop: 4,
  },
  size: {
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
    marginBottom: 12
  }
})
