import React, {useLayoutEffect, useMemo, useState} from 'react'
import {FlatList, Pressable, StyleSheet, useColorScheme, View} from "react-native";
import dayjs from 'dayjs'
import Ionicons from "@expo/vector-icons/Ionicons";
import {clearLogs, LogLevel} from "@/app/store/log";
import {useAppDispatch, useAppSelector} from "@/app/store";
import NoData from "@/components/NoData";
import {Colors} from "@/constants/Colors";
import Text from '@/components/ColorSchemeText'
import {useNavigation} from "expo-router";
import {useScale} from "@/hooks/useScale";

const getLevelText = (level: LogLevel) => {
  return {
    [LogLevel.error]: 'error',
    [LogLevel.warn]: 'warn',
    [LogLevel.info]: 'info',
    [LogLevel.debug]: 'debug'
  }[level] as 'error' | 'warn' | 'info' | 'debug'
}

function RenderItem({item} : any) {
  const colorScheme = useColorScheme()
  const scale = useScale()
  const levelText = getLevelText(item.level) ?? 'unknow'
  const color: string = {
    error: 'red',
    warn: '#faad14',
    info: Colors[colorScheme ?? 'light'].text,
    debug: 'gray',
    unknow: '#faad14',
  }[levelText]
  const [focused, setFocused] = useState(false);
  const subTextStyle = useMemo(() => {
    return {
      fontSize: 12 * scale,
      color: focused ? colorScheme === 'dark' ? '#ddd' : '#999' : 'gray'
    }
  }, [focused, scale, colorScheme])

  return (
    <Pressable
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <View style={[styles.item, {backgroundColor: focused ? colorScheme === 'dark' ? 'gray' : '#ddd' : 'transparent'}]}>
        <Text style={[styles.level, {color}]}>{levelText}</Text>
        <View style={{flex: 1}}>
          <Text style={[styles.message, {fontSize: 16 * scale}]}>{item.message}</Text>
          <Text style={subTextStyle}>{dayjs(item.time).format('MM-DD HH:mm:ss')}</Text>
        </View>
      </View>
    </Pressable>
  )
}

export default function Log() {
  const logs = useAppSelector(
    (state) => state.log.logs,
  );
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => logs.length ? (
        <Ionicons
          name="trash-outline"
          color="white" size={22}
          style={{marginRight: 16}}
          onPress={() => dispatch(clearLogs())}
        />
      ) : null
    });
  }, [logs]);

  return logs.length ? (
    <View style={styles.container}>
      <FlatList
        data={logs}
        renderItem={props => <RenderItem {...props}/>}
      />
    </View>
  ) : (
    <NoData text={'暂无日志'}/>
  )
}

const styles: Record<string, any> = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
  },
  item: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  level: {
    flexBasis: 84,
    flexShrink: 0,
    marginLeft: 12,
  },
  message: {
    marginBottom: 4,
  },
})
