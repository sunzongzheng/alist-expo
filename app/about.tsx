import React from 'react'
import {StyleSheet, useColorScheme, View} from "react-native";
import {Colors} from "@/constants/Colors";
import Text from "@/components/ColorSchemeText";

export default function About() {
  const colorScheme = useColorScheme()

  return (
    <View style={styles.centeredView}>
      <View style={[styles.modalView, {backgroundColor: Colors[colorScheme ?? 'light'].background}]}>
        <Text style={styles.modalText}>本应用遵循AGPL3.0开源协议</Text>
        <Text style={styles.modalText}>https://github.com/sunzongzheng/alist-expo</Text>
        <Text style={styles.modalText}>https://github.com/sunzongzheng/alist-ios</Text>
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})
