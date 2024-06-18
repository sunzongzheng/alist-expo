import {useFocusEffect} from 'expo-router';
import React, {useCallback, useEffect} from 'react';

import { Colors } from '@/constants/Colors';
import {appendLog} from "@/app/store/log";
import {NativeEventEmitter, NativeModules, useColorScheme, Platform, Pressable} from "react-native";
import {useAppDispatch, useAppSelector} from "@/app/store";
import {refreshIsRunning} from "@/app/store/server";
import RNFS from 'react-native-fs'
import useAppInActive from "@/hooks/useAppInActive";
import axios from "axios";
import {BottomTabBarButtonProps} from "@react-navigation/bottom-tabs";
import {useTextStyles} from "@/hooks/useTextStyles";
import TabsNavigator from '@/components/TabNavigator'

const {Alist, HCKeepBGRunManager} = NativeModules;
const eventEmitter = new NativeEventEmitter(Alist);
const {isTV} = Platform

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const textStyles = useTextStyles();
  const dispatch = useAppDispatch();
  const backgroundMode = useAppSelector(state => state.setting.backgroundMode)
  const isRunning = useAppSelector(state => state.server.isRunning)
  const appInActive = useAppInActive()

  const ensureConfigDirectory = useCallback(async () => {
    /*
    背景：
    1. ios覆盖安装应用时，会创建一个新的Document目录，同时会把旧文件拷贝过去
    2. config文件中存储的日志文件、临时目录等路径都是绝对路径

    问题：由于Document目录已更新，但是config文件中存储的文件路径没有更新，服务启动后仍向旧的Document目录读写文件，会导致读写无权限

    解法：这里对config文件中存储的文件路径进行处理，替换为新的Document目录
     */
    try {
      const directoryPath = isTV ? RNFS.CachesDirectoryPath : RNFS.DocumentDirectoryPath
      const configPath = directoryPath + '/config.json'
      if (!await RNFS.exists(configPath)) return
      const configData = await RNFS.readFile(configPath)
      if (configData.includes(directoryPath)) return
      let patternString = directoryPath.replace(/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\//, '/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/')
      const regexPattern = new RegExp(patternString, 'g');
      const newConfigData = configData.replace(regexPattern, directoryPath)
      await RNFS.writeFile(directoryPath + `/config.json`, newConfigData)
      console.log('已更新配置文件')
    } catch (e) {
      console.error(e)
    }
  }, [])

  const checkIsRunning = useCallback(async () => {
    try {
      await axios.get('http://127.0.0.1:5244/ping', {
        timeout: 1000
      })
      console.log('检查服务：可用')
    } catch (e) {
      console.log('检查服务：不可用')
      // 如果服务实际上不可用，则自动关闭，更新状态
      await Alist.stop()
      dispatch(refreshIsRunning())
    }
  }, [])

  const tabBarButton = (props: BottomTabBarButtonProps) => {
    const style: any = props.style ?? {};
    return (
      <Pressable
        {...props}
        style={({ pressed, focused }) => [
          style,
          {
            opacity: pressed || focused ? 0.6 : 1.0,
          },
        ]}
      />
    );
  };

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

  useFocusEffect(useCallback(() => {
    dispatch(refreshIsRunning())
  }, [appInActive]));

  useEffect(() => {
    if (backgroundMode && isRunning) {
      if (appInActive) {
        HCKeepBGRunManager.stopBGRun()
      } else {
        HCKeepBGRunManager.startBGRun()
      }
    }
  }, [appInActive, backgroundMode, isRunning])

  useEffect(() => {
    if (appInActive && isRunning) {
      // 切到前台时，如果服务处于运行状态，通过接口再检测一下服务是否可用，防止服务进程被系统杀掉
      checkIsRunning()
    }
  }, [appInActive, isRunning, checkIsRunning]);

  return (
    <TabsNavigator.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          height: textStyles.title.lineHeight * 2,
          marginBottom: 0,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].headerBackgroundColor,
        },
        headerTitleStyle: {
          fontSize: 20,
        },
        headerTintColor: 'white',
      }}>
      <TabsNavigator.Screen
        name="index"
        options={{
          headerTitle: 'AList',
          title: '首页',
          tabBarButton,
          tabBarLabelStyle: textStyles.default,
        }}
        component={require('./index').default}
      />
      <TabsNavigator.Screen
        name="files"
        options={{
          title: '浏览',
          tabBarButton,
          tabBarLabelStyle: textStyles.default,
        }}
        component={require('./files').default}
      />
      <TabsNavigator.Screen
        name="manage"
        options={{
          title: '管理',
          tabBarButton,
          tabBarLabelStyle: textStyles.default,
        }}
        component={require('./manage').default}
      />
      <TabsNavigator.Screen
        name="log"
        options={{
          title: '日志',
          tabBarButton,
          tabBarLabelStyle: textStyles.default,
        }}
        component={require('./log').default}
      />
      <TabsNavigator.Screen
        name="setting"
        options={{
          title: '设置',
          tabBarButton,
          tabBarLabelStyle: textStyles.default,
        }}
        component={require('./setting').default}
      />
    </TabsNavigator.Navigator>
  );
}
