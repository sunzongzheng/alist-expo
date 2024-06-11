import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect, useImperativeHandle, useLayoutEffect, useRef,
  useState
} from 'react'
import {WebView} from 'react-native-webview';
import {NativeModules, View, Text, Image, Linking, ActivityIndicator} from "react-native";
import {useFocusEffect, useNavigation} from "expo-router";
import noDataImage from '@/assets/images/无服务.png'
import {useAppSelector} from "@/app/store";
import axios from "axios";
import sha256 from 'sha256'
import Toast from "react-native-root-toast";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Feather} from "@expo/vector-icons";

const {Alist, AppInfo} = NativeModules

const hash_salt = "https://github.com/alist-org/alist"

export function hashPwd(pwd: string) {
  return sha256(`${pwd}-${hash_salt}`)
}

interface AListWebViewProps {
  path: string;
}

export interface AListWebviewRef {
  reload: WebView['reload'];
  getCurrentUrl: () => string;
}

const AListWebview = forwardRef((props: AListWebViewProps, forwardedRef: ForwardedRef<AListWebviewRef>) => {
  const { path } = props;
  const isRunning = useAppSelector(state => state.server.isRunning)
  const webviewRef = useRef<WebView>(null)
  const navigation = useNavigation()
  const url = `http://127.0.0.1:5244${path}`
  const [injectedJS, setInjectedJS] = useState('')
  const [schemes, setSchemes] = useState([])
  const currentUrlRef = useRef(url)

  useImperativeHandle(forwardedRef, () => ({
    reload: () => {
      if (webviewRef.current) {
        webviewRef.current.reload();
      }
    },
    getCurrentUrl: () => currentUrlRef.current,
  }));

  const refreshWebToken = useCallback(async () => {
    if (isRunning) {
      try {
        const username = await Alist.getAdminUsername()
        const password = await Alist.getAdminPassword()
        const res = await axios.post('http://127.0.0.1:5244/api/auth/login/hash', {
          username: username,
          password: hashPwd(password),
          otp_code: ""
        })
        const script = `
          localStorage.setItem("token", "${res.data.data.token}");
          true;
        `
        // console.log('injectJavaScript', script)
        if (webviewRef.current) {
          webviewRef.current.injectJavaScript(script)
        } else {
          setInjectedJS(script)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [isRunning])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isRunning ? () => (
        <Ionicons
          name="refresh-outline"
          size={22}
          color="white"
          onPress={() => webviewRef.current?.reload()}
          style={{ marginLeft: 16 }}
        />
      ) : null,
      headerRight: isRunning ? () => (
        <Feather
          name="external-link"
          size={22}
          color="white"
          onPress={() => Linking.openURL(currentUrlRef.current)}
          style={{ marginRight: 16 }}
        />
      ) : null
    });
  }, [isRunning, injectedJS]);

  useFocusEffect(useCallback(() => {
    refreshWebToken()
  }, [refreshWebToken]));

  useEffect(() => {
    AppInfo.getApplicationQueriesSchemes().then(setSchemes)
  }, []);

  return isRunning ? injectedJS ? (
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        ref={webviewRef}
        injectedJavaScriptBeforeContentLoaded={injectedJS}
        webviewDebuggingEnabled={true}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={request => {
          if (schemes.some(item => request.url.startsWith(`${item}:`))) {
            Linking.openURL(request.url).catch(err => {
              Toast.show('无法打开，请确认是否安装该App', {
                position: Toast.positions.CENTER,
              })
            });
            return false;
          }
          return true;
        }}
        applicationNameForUserAgent={'AListServer'}
        allowsBackForwardNavigationGestures={true}
        onNavigationStateChange={({url}) => currentUrlRef.current = url}
        onOpenWindow={({nativeEvent: {targetUrl}}) => {
          Linking.openURL(targetUrl)
        }}
        onFileDownload={({ nativeEvent: { downloadUrl } }) => {
          Linking.openURL(downloadUrl)
        }}
      />
    ) : (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1,}}>
        <ActivityIndicator color={'#2196F3'} size={'large'}/>
      </View>
    ) : (
    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, paddingBottom: 50,}}>
      <Image source={noDataImage} style={{width: 200, height: 200}}/>
      <Text>请先启动服务</Text>
    </View>
  );
})

export default AListWebview
