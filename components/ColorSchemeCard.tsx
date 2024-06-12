import React from 'react'
import {View, useColorScheme, StyleSheet, ViewProps} from "react-native";
import {Colors} from "@/constants/Colors";

export default function ColorSchemeCard(props: ViewProps) {
  const colorScheme = useColorScheme()
  const backgroundColor = Colors[colorScheme ?? 'light'].cardBackgroundColor

  return (
    <View {...props} style={StyleSheet.flatten([styles.card, {backgroundColor}, props.style])}/>
  )
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderRadius: 10,
    position: 'relative',
  },
})
