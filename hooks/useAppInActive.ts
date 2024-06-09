import {AppState, AppStateStatus} from "react-native";
import {useEffect, useState} from "react";

export default function useAppInActive() {
  const [inActive, setInActive] = useState(true);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      console.log('App切到前台了');
      setInActive(true);
    } else if (nextAppState === 'background') {
      console.log('App切到后台了');
      setInActive(false);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove()
    };
  }, []);

  return inActive
}
