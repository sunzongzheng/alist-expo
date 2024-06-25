import {
  StyleSheet,
  View,
  Switch,
  TouchableOpacity,
  Modal,
  Linking, TouchableWithoutFeedback, NativeModules, useColorScheme
} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {useCallback, useEffect, useState} from "react";
import {FontAwesome} from "@expo/vector-icons";
import {useAppDispatch, useAppSelector} from "@/app/store";
import {setAutoRun, setBackgroundMode} from "@/app/store/setting";
import ColorSchemeCard from "@/components/ColorSchemeCard";
import Text from '@/components/ColorSchemeText'
import {Colors} from "@/constants/Colors";

const { AppInfo, NotificationManager } = NativeModules;

export default function Setting() {
  const [modalVisible, setModalVisible] = useState(false);
  const [version, setVersion] = useState('1.0')
  const backgroundMode = useAppSelector(state => state.setting.backgroundMode)
  const autoRun = useAppSelector(state => state.setting.autoRun)
  const dispatch = useAppDispatch()
  const colorScheme = useColorScheme()

  const showAbout = useCallback(() => {
    setModalVisible(true)
  }, [setModalVisible])

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
      <Text style={styles.cardTitle}>通用</Text>
      <ColorSchemeCard>
        <View style={[styles.cardItem, styles.cardItemLarge]}>
          <View>
            <Text style={styles.itemTitle}>后台运行</Text>
            <Text style={styles.itemDescription}>开启后服务常驻后台，息屏也可访问服务</Text>
          </View>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => {
              dispatch(setBackgroundMode(value))
            }}
            value={backgroundMode}
          />
        </View>
        <View style={[styles.cardItem, styles.cardItemLarge]}>
          <View>
            <Text style={styles.itemTitle}>自动运行</Text>
            <Text style={styles.itemDescription}>App冷启动时自动启动服务</Text>
          </View>
          <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => {
                if (value) {
                  NotificationManager.requestAuthorization()
                }
                dispatch(setAutoRun(value))
              }}
              value={autoRun}
          />
        </View>
      </ColorSchemeCard>
      <Text style={[styles.cardTitle, styles.cardMarginTop]}>版本信息</Text>
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
      <Text style={[styles.cardTitle, styles.cardMarginTop]}>关于</Text>
      <ColorSchemeCard>
        <TouchableOpacity onPress={showAbout}>
          <View style={styles.cardItem}>
              <Text style={styles.itemTitle}>关于</Text>
              <Ionicons
                name={'chevron-forward-outline'}
                color={'#D1D1D6'}
                containerStyle={{ alignSelf: 'center' }}
                size={16}
              />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://t.me/+euPFHEllnjRhYThl')}>
          <View style={styles.cardItem}>
            <Text style={styles.itemTitle}>加入交流群</Text>
            <FontAwesome name="telegram" size={24} color="#24a1de" />
          </View>
        </TouchableOpacity>
      </ColorSchemeCard>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, {backgroundColor: Colors[colorScheme ?? 'light'].background}]}>
              <Text style={styles.modalText}>本应用遵循AGPL3.0开源协议</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/sunzongzheng/alist-expo')}>
                <Text style={styles.modalText}>alist-expo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/sunzongzheng/alist-ios')}>
                <Text style={styles.modalText}>alist-ios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 12,
    paddingLeft: 14,
  },
  cardItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  cardItemLarge: {
    height: 65,
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
  itemTitle: {
    fontSize: 15,
  },
  itemDescription: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  }
});
