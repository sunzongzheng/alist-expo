import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { RootSiblingParent } from 'react-native-root-siblings';

import { useColorScheme } from '@/hooks/useColorScheme';
import {Provider} from "react-redux";
import store from "@/app/store";
import {LogBox} from "react-native";
import {persistStore} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
LogBox.ignoreAllLogs(true);

const persistor = persistStore(store);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      if (error) {
        console.warn(`Error in loading fonts: ${error}`);
      }
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <RootSiblingParent>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="join-group" options={{ headerShown: false }}/>
              <Stack.Screen name="about" options={{ headerShown: false }}/>
            </Stack>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </RootSiblingParent>
  );
}
