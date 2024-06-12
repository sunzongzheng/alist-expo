import React, {useLayoutEffect} from 'react'
import {FlatList, StyleSheet, useColorScheme, View} from "react-native";
import dayjs from 'dayjs'
import Ionicons from "@expo/vector-icons/Ionicons";
import {useNavigation} from "expo-router";
import {clearLogs, LogLevel} from "@/app/store/log";
import {useAppDispatch, useAppSelector} from "@/app/store";
import NoData from "@/components/NoData";
import {Colors} from "@/constants/Colors";
import Text from '@/components/ColorSchemeText'


const getLevelText = (level: LogLevel) => {
  return {
    [LogLevel.error]: 'error',
    [LogLevel.warn]: 'warn',
    [LogLevel.info]: 'info',
    [LogLevel.debug]: 'debug'
  }[level] as 'error'|'warn'|'info'|'debug'
}
export default function Log() {
  const logs = useAppSelector(
    (state) => state.log.logs,
  );
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const colorScheme = useColorScheme()

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
        renderItem={({item}) => {
          const levelText = getLevelText(item.level) ?? 'unknow'
          const color: string = {
            error: 'red',
            warn: '#faad14',
            info: Colors[colorScheme ?? 'light'].text,
            debug: 'gray',
            unknow: '#faad14',
          }[levelText]
          return (
            <View style={styles.item}>
              <Text style={[styles.level, {color}]}>{levelText}</Text>
              <View style={{flex: 1}}>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={{color: 'gray'}}>{dayjs(item.time).format('MM-DD HH:mm:ss')}</Text>
              </View>
            </View>
          )
        }}
      />
    </View>
  ) : (
    <NoData text={'暂无日志'}/>
  )
}

const styles:Record<string, any> = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  item : {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  level: {
    flexBasis: 42,
    flexShrink: 0,
  },
  message: {
    fontSize: 16,
    marginBottom: 4,
  },
})
