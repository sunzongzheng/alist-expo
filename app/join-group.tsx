import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Image, Text} from "react-native";
import QRCode from 'qrcode-generator';

export default function JoinGroup() {
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const typeNumber = 10;
    const errorCorrectionLevel = 'L';
    const qr = QRCode(typeNumber, errorCorrectionLevel);
    qr.addData('https://t.me/+euPFHEllnjRhYThl');
    qr.make();
    setImageUrl(qr.createDataURL())
  }, []);

  return (
    <View style={styles.centeredView}>
      <View style={[styles.modalView]}>
        {imageUrl ? <Image
          source={{uri: imageUrl}}
          style={styles.image}
        /> : null}
        <Text style={{fontSize: 30, marginTop: -16, marginBottom: 12}}>请扫码打开加群链接</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
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
