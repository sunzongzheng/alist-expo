import {
  StyleSheet,
  View,
  NativeModules, useColorScheme,
} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {useCallback, useEffect, useState} from "react";
import {FontAwesome} from "@expo/vector-icons";
import {useAppDispatch, useAppSelector} from "@/app/store";
import {setBackgroundMode} from "@/app/store/setting";
import ColorSchemeCard from "@/components/ColorSchemeCard";
import Text from '@/components/ColorSchemeText'
import {useTextStyles} from "@/hooks/useTextStyles";
import CardItem from '@/components/CardItem.tv'
import {router} from "expo-router";
import {useScale} from "@/hooks/useScale";

const {AppInfo} = NativeModules;

export default function Setting() {
  const [version, setVersion] = useState('1.0')
  const backgroundMode = useAppSelector(state => state.setting.backgroundMode)
  const dispatch = useAppDispatch()
  const textStyles = useTextStyles();
  const colorScheme = useColorScheme()
  const scale = useScale()

  const getAppVersion = useCallback(async () => {
    try {
      const version = await AppInfo.getAppVersion();
      setVersion(version)
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAppVersion()
  }, [getAppVersion]);

  return (
    <View style={styles.container}>
      <Text style={[styles.cardTitle, {fontSize: textStyles.default.fontSize}]}>通用</Text>
      <ColorSchemeCard>
        <CardItem
          style={[styles.cardItem, styles.cardItemLarge]}
          onPress={() => dispatch(setBackgroundMode(!backgroundMode))}
          childrenNodes={(focused) => {
            const color = focused ? colorScheme === 'dark' ? '#bbb' : '#999' : 'gray'
            return (
              <>
                <View>
                  <Text style={styles.itemTitle}>后台运行</Text>
                  <Text
                    style={[styles.itemDescription, {fontSize: 14 * scale, color}]}>开启后服务常驻后台，息屏也可访问服务</Text>
                </View>
                <Text>{backgroundMode ? '点击关闭' : '点击开启'}</Text>
              </>
            )
          }}
        />
      </ColorSchemeCard>
      <Text style={[styles.cardTitle, {fontSize: textStyles.default.fontSize}, styles.cardMarginTop]}>版本信息</Text>
      <ColorSchemeCard>
        <View style={styles.cardItem}>
          <Text style={styles.itemTitle}>App版本</Text>
          <Text>{version}</Text>
        </View>
        <View style={[styles.cardItem]}>
          <Text style={styles.itemTitle}>AList版本</Text>
          <Text>3.35.0</Text>
        </View>
      </ColorSchemeCard>
      <Text style={[styles.cardTitle, {fontSize: textStyles.default.fontSize}, styles.cardMarginTop]}>关于</Text>
      <ColorSchemeCard>
        <CardItem onPress={() => router.push('/about')}>
          <Text style={styles.itemTitle}>关于</Text>
          <Ionicons
            name={'chevron-forward-outline'}
            color={'#D1D1D6'}
            containerStyle={{alignSelf: 'center'}}
            size={36}
          />
        </CardItem>
        <CardItem onPress={() => router.push('/join-group')}>
          <Text style={styles.itemTitle}>加入交流群</Text>
          <FontAwesome name="telegram" size={36} color="#24a1de"/>
        </CardItem>
      </ColorSchemeCard>
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
  cardTitle: {
    color: 'gray',
    textAlign: 'left',
    marginBottom: 12,
    paddingLeft: 14,
  },
  cardItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
  },
  cardItemLarge: {
    height: 130,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  itemTitle: {},
  itemDescription: {
    marginTop: 12,
  }
});
