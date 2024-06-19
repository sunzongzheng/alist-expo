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
import {useAppSelector} from "@/app/store";
import NoData from "@/components/NoData";
import Text from '@/components/ColorSchemeText'
import {useScale} from "@/hooks/useScale";
import {VideoPlayer} from "@/app/store/setting";
import useToast from "@/hooks/useToast";

const {Alist, VideoPlayer: VideoPlayerModule, AudioPlayer} = NativeModules
TVEventControl.enableTVMenuKey()

export enum ObjType {
  UNKNOWN,
  FOLDER,
  // OFFICE,
  VIDEO,
  AUDIO,
  TEXT,
  IMAGE,
}

interface FileItem {
  name: string;
  size: number;
  is_dir: boolean;
  modified: string;
  sign: string;
  thumb: string;
  type: ObjType;
  raw_url: string;
  readme: string;
  provider: string;
  created: string;
  hashinfo: string;
  header: string;
}

export const players: { key: string; name: string; scheme: string }[] = [
  { key: "vlc", name: "VLC", scheme: "vlc://$durl" },
  {
    key: "infuse",
    name: "Infuse",
    scheme: "infuse://x-callback-url/play?url=$durl",
  },
  {
    key: "fileball",
    name: "Fileball",
    scheme: "filebox://play?url=$edurl",
  },
  {
    key: "vidhub",
    name: "VidHub",
    scheme: "open-vidhub://x-callback-url/open?url=$edurl",
  },
  {
    key: "yybx",
    name: "yybx",
    scheme: "yybx://play?$durl",
  },
]

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
  const toast = useToast()
  const videoPlayer = useAppSelector(state => state.setting.videoPlayer || VideoPlayer.Default)
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
      if (item.type === ObjType.VIDEO) {
        VideoPlayerModule.play(data.raw_url, header)
      } else if (item.type === ObjType.AUDIO) {
        AudioPlayer.play(data.raw_url, header)
      }
    } catch (e: any) {
      console.warn(e)
      toast(e?.data?.message || '加载失败')
    }
    setLoading(false)
  }, [path, toast, item])

  const handleFileItem = useCallback(() => {
    if (loading) return
    if (item.is_dir) {
      const targetPath = `${path || ''}/${item.name}`
      console.log('goToDirectoryDetail', targetPath)
      router.push(`/files?path=${encodeURIComponent(targetPath)}`)
    } else {
      if (item.type === ObjType.VIDEO) {
        if (videoPlayer !== VideoPlayer.Default) {
          const playerItem = players.find(player => player.key === videoPlayer)
          const videoUrl = `http://127.0.0.1:5244/d${path}/${item.name}?sign=${item.sign}`
          const url = playerItem?.scheme?.replace('$durl', videoUrl)?.replace('$edurl', encodeURIComponent(videoUrl)) ?? ''
          Linking.openURL(url)
            .catch(() => {
              toast(`无法拉起${playerItem?.name}，请确认是否安装`)
            })
        } else {
          play(item.name)
        }
      } else if (item.type === ObjType.AUDIO) {
        play(item.name)
      } else {
        toast('暂不支持此文件格式')
      }
    }
  }, [item, loading, videoPlayer, toast, path])

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
              source={item.is_dir ? DirectoryImage : item.type === ObjType.VIDEO ? VideoImage : item.type === ObjType.AUDIO ? AudioImage : FileImage}
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
  const toast = useToast()
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
      toast('再按一次退出App')
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
  }, [path, pathname, toast]);

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
