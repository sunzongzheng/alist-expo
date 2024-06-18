import React from 'react'
import {TextProps, Text, useColorScheme, StyleSheet} from "react-native";
import {Colors} from "@/constants/Colors";
import {useTextStyles} from "@/hooks/useTextStyles";

export default function ColorSchemeText(props: TextProps) {
  const colorScheme = useColorScheme()
  const textStyles = useTextStyles();
  const color = Colors[colorScheme ?? 'light'].text
  const fontSize = textStyles.default.fontSize

  return (
    <Text {...props} style={StyleSheet.flatten([{color, fontSize}, props.style])}/>
  )
}
