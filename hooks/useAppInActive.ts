import {AppState, AppStateStatus} from "react-native";
import {useEffect, useState} from "react";

export default function useAppInActive() {
  const [appState, setAppState] = useState(AppState.currentState);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      // 刷新值
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove()
    };
  }, []);

  return appState === 'active'
}
