import {createSlice, Dispatch} from '@reduxjs/toolkit';
import {NativeModules} from "react-native";

const {Alist} = NativeModules;

type SliceState = { isRunning: boolean; }

export const serverSlice = createSlice({
  name: 'server',
  initialState: {
    isRunning: false,
  } satisfies SliceState as SliceState,
  reducers: {
    setIsRunning(state, {payload}) {
      state.isRunning = payload;
    },
  },
});

export const {
  setIsRunning,
} = serverSlice.actions;

export function refreshIsRunning() {
  return async (dispatch: Dispatch) => {
    const isRunning = await Alist.isRunning()
    dispatch(setIsRunning(isRunning))
  }
}

export default serverSlice.reducer;
