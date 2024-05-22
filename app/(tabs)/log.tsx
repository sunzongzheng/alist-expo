import React, {useLayoutEffect} from 'react'
import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import {useDispatch} from 'react-redux';
import dayjs from 'dayjs'
import Ionicons from "@expo/vector-icons/Ionicons";
import {useNavigation} from "expo-router";
import {clearLogs, LogLevel} from "@/app/store/log";
import noDataImage from "@/assets/images/无服务.png";
import {useAppSelector} from "@/app/store";


const getLevelText = (level: LogLevel) => {
  return {
    [LogLevel.error]: 'error',
    [LogLevel.warn]: 'warn',
    [LogLevel.info]: 'info',
    [LogLevel.debug]: 'debug'
  }[level]
}
export default function Log() {
  const logs = useAppSelector(
    (state) => state.log.logs,
  );
  const navigation = useNavigation()
  const dispatch = useDispatch()

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
          const levelText = getLevelText(item.level)
          return (
            <View style={styles.item}>
              <Text style={[styles.level, styles[levelText] || 'unknow']}>{levelText}</Text>
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
    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, paddingBottom: 50,}}>
      <Image source={noDataImage} style={{width: 200, height: 200}}/>
      <Text>暂无日志</Text>
    </View>
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
  error: {
    color: 'red'
  },
  warn: {
    color: '#faad14'
  },
  info: {
    color: 'rgba(0, 0, 0, 0.88)'
  },
  debug: {
    color: 'gray'
  },
  unknow: {
    color: '#faad14'
  }
})
