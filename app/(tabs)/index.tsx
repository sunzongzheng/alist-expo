import {
  Image,
  StyleSheet,
  Platform,
  NativeModules,
  Button,
  View,
  Switch,
  NativeEventEmitter,
  ScrollView, TouchableOpacity
} from 'react-native';
import React, {useCallback, useEffect, useState} from "react";
import {useFocusEffect} from "expo-router";
import { addEventListener } from "@react-native-community/netinfo";
import {useAppDispatch, useAppSelector} from "@/app/store";
import {refreshIsRunning} from "@/app/store/server";
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from "react-native-root-toast";
import Text from '@/components/ColorSchemeText'
import ColorSchemeCard from "@/components/ColorSchemeCard";

const {Alist} = NativeModules;
const DEFAULT_PASSWORD = 'admin'

export default function HomeScreen() {
  const isRunning = useAppSelector(state => state.server.isRunning)
  const dispatch = useAppDispatch()
  const [adminPwd, setAdminPwd] = useState('')
  const [adminUsername, setAdminUsername] = useState('')
  const [ip, setIP] = useState(null)
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
  const updateAdminInfo = useCallback(async () => {
    const pwd = await Alist.getAdminPassword()
    const username = await Alist.getAdminUsername()
    if (!pwd) {
      // 只有首次启动服务会获取不到密码，那么直接设置初始密码为admin
      await changePassword(DEFAULT_PASSWORD)
      setAdminPwd(DEFAULT_PASSWORD)
    } else {
      setAdminPwd(pwd)
    }
    setAdminUsername(username)
  }, [setAdminPwd, setAdminUsername])

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

  const copy = useCallback((ip: string) => {
    Clipboard.setString(ip);
    Toast.show('已复制到剪切板', {
      position: Toast.positions.CENTER
    })
  }, [])

  useFocusEffect(React.useCallback(() => {
    if (isRunning) {
      updateAdminInfo()
    }
  }, [isRunning, updateAdminInfo]));

  useEffect(() => {
    return addEventListener(state => {
      // @ts-ignore
      setIP(state.details?.ipAddress)
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1, paddingHorizontal: 16,}} showsVerticalScrollIndicator={false}>
        <ColorSchemeCard>
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
        </ColorSchemeCard>
        <ColorSchemeCard style={styles.cardMarginTop}>
          <View style={styles.cardItem}>
            <Text style={styles.bold}>账号信息</Text>
          </View>
          <View style={[styles.cardItem]}>
            <Text>用户名</Text>
            <Text>{isRunning ? adminUsername : '请先启动服务'}</Text>
          </View>
          <View style={[styles.cardItem]}>
            <Text>密码</Text>
            <Text>{isRunning ? adminPwd : '请先启动服务'}</Text>
          </View>
        </ColorSchemeCard>
        <ColorSchemeCard style={styles.cardMarginTop}>
          <View style={styles.cardItem}>
            <Text style={styles.bold}>WebDAV信息</Text>
          </View>
          <View style={[styles.cardItem, ip ? styles.multiRow : null]}>
            <Text>服务器地址</Text>
            <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
              {ip ? (
                <TouchableOpacity onPress={() => copy(ip)}>
                  <Text style={{textAlign: 'right', marginBottom: 8}}>{ip}（局域网访问）</Text>
                </TouchableOpacity>
              ) : null }
              <TouchableOpacity onPress={() => copy('127.0.0.1')}>
                <Text style={{textAlign: 'right'}}>127.0.0.1（限本机访问）</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.cardItem]}>
            <Text>端口</Text>
            <TouchableOpacity onPress={() => copy('5244')}>
              <Text>5244</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.cardItem]}>
            <Text>路径</Text>
            <TouchableOpacity onPress={() => copy('dav')}>
              <Text>dav</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.cardItem]}>
            <Text>用户名/密码</Text>
            <Text>同“账号信息”</Text>
          </View>
        </ColorSchemeCard>
        <Text style={styles.runningTip}>请保持App前台运行，否则服务可能不可用</Text>
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 32,
    flex: 1,
  },
  cardItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  multiRow: {
    minHeight: 50,
    alignItems: 'flex-start',
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
