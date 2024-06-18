import * as React from 'react';
import {View, StyleSheet, TVFocusGuideView} from 'react-native';
import {
  useNavigationBuilder,
  TabRouter,
  TabActions, createNavigatorFactory,
} from '@react-navigation/native';
import TabBar from "./TabBar";
import {useCallback, useState} from "react";

function TabNavigator({
                        initialRouteName,
                        children,
                        screenOptions,
                        tabBarStyle,
                        contentStyle,
                      }: any) {
  const {state, navigation, descriptors, NavigationContent} =
    useNavigationBuilder(TabRouter, {
      children,
      screenOptions,
      initialRouteName,
    });

  const [selectedItem, setSelectedItem] = useState(0);

  const onSelectItem = useCallback(
    ({index}: any) => {
      setSelectedItem(index);
      const isFocused = state.index === index;
      const route = state.routes[index]
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      // @ts-ignore
      if (!isFocused && !event.defaultPrevented) {
        navigation.dispatch({
          ...TabActions.jumpTo(route.name, route.params),
          target: state.key,
        });
      }
    },
    [setSelectedItem, state.routes],
  );

  return (
    <NavigationContent>
      <TVFocusGuideView style={[{flexDirection: 'row'}, tabBarStyle]} autoFocus={true}>
        <TabBar
          items={state.routes.map(route => descriptors[route.key].options.title ?? route.name)}
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
          style={styles.tabBar}
        />
      </TVFocusGuideView>
      <View style={[{flex: 1}, contentStyle]}>
        {state.routes.map((route, i) => {
          return (
            <View
              key={route.key}
              style={[
                StyleSheet.absoluteFill,
                {display: i === state.index ? 'flex' : 'none'},
              ]}
            >
              {descriptors[route.key].render()}
            </View>
          );
        })}
      </View>
    </NavigationContent>
  );
}

export const createMyNavigator = createNavigatorFactory(TabNavigator);

export default createMyNavigator();

const styles = StyleSheet.create({
  tabBar: {
    width: '100%',
    height: 80,
    marginTop: 30,
    marginBottom: 10,
  },
});
