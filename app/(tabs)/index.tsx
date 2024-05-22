import {Image, StyleSheet, Platform, NativeModules, Button, Text, View, Switch, NativeEventEmitter} from 'react-native';
import React, {useCallback, useEffect, useState} from "react";
import useAppInActive from "@/hooks/useAppInActive";
import {useFocusEffect} from "expo-router";
import { addEventListener } from "@react-native-community/netinfo";
import {useAppDispatch, useAppSelector} from "@/app/store";
import {refreshIsRunning} from "@/app/store/server";

const {Alist} = NativeModules;
const DEFAULT_PASSWORD = 'admin'
const DEFAULT_IP = '127.0.0.1'

export default function HomeScreen() {
  const isRunning = useAppSelector(state => state.server.isRunning)
  const dispatch = useAppDispatch()
  const [adminPwd, setAdminPwd] = useState('')
  const [ip, setIP] = useState(DEFAULT_IP)
  const appInActive = useAppInActive()
  const start = async () => {
    if (isRunning) return
    try {
      await Alist.init()
      await Alist.start();
      dispatch(refreshIsRunning())
    } catch (e) {
      console.error(e);
    }
  };

  const stop = async () => {
    if (!isRunning) return
    try {
      await Alist.stop()
      dispatch(refreshIsRunning())
    } catch (e) {
      console.error(e);
    }
  };
  const updateAdminPwd = useCallback(async () => {
    const pwd = await Alist.getAdminPassword()
    if (!pwd) {
      // 只有首次启动服务会获取不到密码，那么直接设置初始密码为admin
      await changePassword(DEFAULT_PASSWORD)
      setAdminPwd(DEFAULT_PASSWORD)
    } else {
      setAdminPwd(pwd)
    }
  }, [setAdminPwd])

  const toggleSwitch = useCallback(() => {
    if (isRunning) {
      stop()
    } else {
      start()
    }
  }, [isRunning, stop, start])

  const changePassword = useCallback((pwd: string) => {
    return Alist.setAdminPassword(pwd)
  }, [])

  useEffect(() => {
    dispatch(refreshIsRunning())
  }, [appInActive]);

  useFocusEffect(React.useCallback(() => {
    if (isRunning) {
      updateAdminPwd()
    }
  }, [isRunning, updateAdminPwd]));

  useEffect(() => {
    return addEventListener(state => {
      // @ts-ignore
      setIP(state.details?.ipAddress || DEFAULT_IP)
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardItem}>
          <Text>服务状态：{isRunning ? '运行中' : '未运行'}</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isRunning ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isRunning}
          />
        </View>
      </View>
      <View style={[styles.card, styles.cardMarginTop]}>
        <View style={styles.cardItem}>
          <Text style={styles.bold}>账号信息</Text>
        </View>
        <View style={[styles.cardItem]}>
          <Text>用户名</Text>
          <Text>admin</Text>
        </View>
        <View style={[styles.cardItem]}>
          <Text>密码</Text>
          <View>
            <Text>{isRunning ? adminPwd : '请先启动服务'}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.card, styles.cardMarginTop]}>
        <View style={styles.cardItem}>
          <Text style={styles.bold}>WebDAV信息</Text>
        </View>
        <View style={[styles.cardItem]}>
          <Text>服务器地址</Text>
          <Text>{ip}</Text>
        </View>
        <View style={[styles.cardItem]}>
          <Text>端口</Text>
          <Text>5244</Text>
        </View>
        <View style={[styles.cardItem]}>
          <Text>路径</Text>
          <Text>dav</Text>
        </View>
        <View style={[styles.cardItem]}>
          <Text>用户名/密码</Text>
          <Text>同“账号信息”</Text>
        </View>
      </View>
      <Text style={styles.runningTip}>请保持App前台运行，否则服务可能不可用</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cardItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  cardItemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(228, 228, 228)',
  },
  cardMarginTop: {
    marginTop: 40,
  },
  bold: {
    fontWeight: 'bold',
  },
  runningTip: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 36,
  }
});
