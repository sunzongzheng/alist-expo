import { Tabs } from 'expo-router';
import React, {useCallback, useEffect} from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import {appendLog} from "@/app/store/log";
import {NativeEventEmitter, NativeModules} from "react-native";
import {useAppDispatch} from "@/app/store";
import {refreshIsRunning} from "@/app/store/server";
import RNFS from 'react-native-fs'

const {Alist} = NativeModules;
const eventEmitter = new NativeEventEmitter(Alist);

export default function TabLayout() {
  // const colorScheme = useColorScheme();
  const colorScheme = 'light';
  const dispatch = useAppDispatch();
  const ensureConfigDirectory = useCallback(async () => {
    /*
    背景：
    1. ios覆盖安装应用时，会创建一个新的Document目录，同时会把旧文件拷贝过去
    2. config文件中存储的日志文件、临时目录等路径都是绝对路径

    问题：由于Document目录已更新，但是config文件中存储的文件路径没有更新，服务启动后仍向旧的Document目录读写文件，会导致读写无权限

    解法：这里对config文件中存储的文件路径进行处理，替换为新的Document目录
     */
    try {
      const configPath = RNFS.DocumentDirectoryPath + '/config.json'
      if (!await RNFS.exists(configPath)) return
      const configData = await RNFS.readFile(configPath)
      if (configData.includes(RNFS.DocumentDirectoryPath)) return
      let patternString = RNFS.DocumentDirectoryPath.replace(/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\//, '/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/')
      const regexPattern = new RegExp(patternString, 'g');
      const newConfigData = configData.replace(regexPattern, RNFS.DocumentDirectoryPath)
      await RNFS.writeFile(RNFS.DocumentDirectoryPath + `/config.json`, newConfigData)
      console.log('已更新配置文件')
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    const onLog = eventEmitter.addListener('onLog', (logInfo) => {
      dispatch(appendLog(logInfo))
    });
    const onProcessExit = eventEmitter.addListener('onProcessExit', (logInfo) => {
      console.log('onProcessExit', logInfo)
      dispatch(refreshIsRunning())
    });
    const onShutdown = eventEmitter.addListener('onShutdown', (logInfo) => {
      console.log('onShutdown', logInfo)
      dispatch(refreshIsRunning())
    });
    const onStartError = eventEmitter.addListener('onStartError', (logInfo) => {
      console.log('onStartError', logInfo)
      dispatch(refreshIsRunning())
    });

    return () => {
      onLog.remove();
      onProcessExit.remove();
      onShutdown.remove();
      onStartError.remove();
    }
  }, [])

  useEffect(() => {
    ensureConfigDirectory()
  }, [])

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerStyle: {
          backgroundColor: 'rgb(59, 112, 184)'
        },
        headerTitleStyle: {
          fontSize: 20,
        },
        headerTintColor: 'white',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: 'AList',
          title: '首页',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="webview"
        options={{
          title: '浏览',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: '日志',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'reader' : 'reader-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: '设置',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
