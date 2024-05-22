import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {WebView} from 'react-native-webview';
import {NativeModules, View, Text, Button, Image, Linking} from "react-native";
import useAppInActive from "@/hooks/useAppInActive";
import {useFocusEffect, useNavigation} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {EvilIcons, Feather, FontAwesome} from '@expo/vector-icons';
import noDataImage from '../../assets/images/无服务.png'
import {useAppDispatch, useAppSelector} from "@/app/store";
import {refreshIsRunning} from "@/app/store/server";

export default function Webview() {
  const isRunning = useAppSelector(state => state.server.isRunning)
  const dispatch = useAppDispatch()
  const webviewRef = useRef<any>(null)
  const appInActive = useAppInActive()
  const navigation = useNavigation()
  const url = 'http://127.0.0.1:5244'

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isRunning ? () => (
        <Ionicons
          name="refresh-outline"
          size={22}
          color="white"
          onPress={() => webviewRef.current.reload()}
          style={{ marginLeft: 16 }}
        />
      ) : null,
      headerRight: isRunning ? () => (
        <Feather
          name="external-link"
          size={22}
          color="white"
          onPress={() => Linking.openURL(url)}
          style={{ marginRight: 16 }}
        />
      ) : null
    });
  }, [isRunning]);

  useFocusEffect(React.useCallback(() => {
    dispatch(refreshIsRunning())
  }, [appInActive]));

  return isRunning ? <WebView source={{ uri: url }} style={{ flex: 1 }} ref={webviewRef}/> : (
    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, paddingBottom: 50,}}>
      <Image source={noDataImage} style={{width: 200, height: 200}}/>
      <Text>请先启动服务</Text>
    </View>
  );
}
