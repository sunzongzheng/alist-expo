import { Tabs } from 'expo-router';
import React, {useEffect} from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {appendLog} from "@/app/store/log";
import {useDispatch} from "react-redux";
import {NativeEventEmitter, NativeModules} from "react-native";
// import RNFS from 'react-native-fs'

const {Alist} = NativeModules;
const eventEmitter = new NativeEventEmitter(Alist);

export default function TabLayout() {
  // const colorScheme = useColorScheme();
  const colorScheme = 'light';
  const dispatch = useDispatch();

  useEffect(() => {
    const subscription = eventEmitter.addListener('onLog', (logInfo) => {
      // console.log(logInfo); // {"level": ..., "time": ..., "message": ...}
      dispatch(appendLog(logInfo))
    });

    return () => {
      subscription.remove();
    }
  }, [])

  // console.log('RNFS.DocumentDirectoryPath', RNFS.DocumentDirectoryPath)
  // RNFS.readDir(RNFS.DocumentDirectoryPath + '/alist')
  //     .then((result) => {
  //       console.log('GOT RESULT', result.map(item => item.name));
  //     })
  // RNFS.readFile(RNFS.DocumentDirectoryPath + `/alist/config.json`)
  //     .then((result) => {
  //       console.log(result);
  //     })

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
          headerTitle: 'Alist',
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
