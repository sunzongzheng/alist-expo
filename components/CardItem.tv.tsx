import React, {ReactNode, useState} from 'react'
import {Pressable, PressableProps, StyleSheet, useColorScheme, View, ViewProps} from "react-native";

type Props = ViewProps & {
  onPress: PressableProps['onPress'];
  childrenNodes?: (focused: Boolean) => ReactNode | undefined;
}
export default function TVCardItem(props: Props) {
  const [focused, setFocused] = useState(false);
  const colorScheme = useColorScheme()

  return (
    <Pressable
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={props.onPress}
    >
      {() => (
        <View
          {...props}
          style={StyleSheet.flatten([
            focused ? {
              backgroundColor: colorScheme === 'dark' ? 'gray' : '#ddd',
            } : null,
            styles.cardItem,
            props.style
          ])}
        >
          {props.children || props.childrenNodes?.(focused)}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cardItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
})
