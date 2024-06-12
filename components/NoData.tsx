import React from 'react'
import {Image, View} from "react-native";
import noDataImage from "@/assets/images/无服务.png";
import Text from '@/components/ColorSchemeText'

export default function NoData({text}: {text: string;}) {
  return (
    <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, paddingBottom: 50,}}>
      <Image source={noDataImage} style={{width: 200, height: 200}}/>
      <Text>{text}</Text>
    </View>
  )
}
