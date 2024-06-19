import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Image, Text} from "react-native";
import QRCode from 'qrcode-generator';
import {addEventListener} from "@react-native-community/netinfo";
import {useAppSelector} from "@/app/store";
import NoData from "@/components/NoData";

export default function Manage() {
  const isRunning = useAppSelector(state => state.server.isRunning)
  const [imageUrl, setImageUrl] = useState('')
  const [ip, setIP] = useState(null)

  useEffect(() => {
    const typeNumber = 6;
    const errorCorrectionLevel = 'L';
    const qr = QRCode(typeNumber, errorCorrectionLevel);
    qr.addData(`http://${ip}:5244`);
    qr.make();
    setImageUrl(qr.createDataURL())
  }, [ip]);

  useEffect(() => {
    return addEventListener(state => {
      // @ts-ignore
      setIP(state.details?.ipAddress)
    });
  }, []);

  return isRunning ? (
    <View style={styles.centeredView}>
      <View style={[styles.modalView]}>
        {imageUrl ? <Image
          source={{uri: imageUrl}}
          style={styles.image}
        /> : null}
        <Text style={{fontSize: 30, marginTop: -16, marginBottom: 12}}>请使用手机扫码访问管理页</Text>
      </View>
    </View>
  ) : (
    <NoData text={'请先启动服务'}/>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 16,
  },
  image: {
    width: 500,
    height: 500,
  },
  modalText: {
    textAlign: 'center',
  },
})
