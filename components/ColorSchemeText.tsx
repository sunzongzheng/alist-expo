import React from 'react'
import {TextProps, Text, useColorScheme, StyleSheet} from "react-native";
import {Colors} from "@/constants/Colors";

export default function ColorSchemeText(props: TextProps) {
  const colorScheme = useColorScheme()
  const color = Colors[colorScheme ?? 'light'].text

  return (
    <Text {...props} style={StyleSheet.flatten([{color}, props.style])}/>
  )
}
