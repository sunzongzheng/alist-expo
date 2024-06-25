import {createSlice} from '@reduxjs/toolkit';

type SettingState = { backgroundMode: boolean; autoRun: boolean; }

export const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    backgroundMode: false,
    autoRun: false,
  } satisfies SettingState as SettingState,
  reducers: {
    setBackgroundMode(state, {payload}) {
      state.backgroundMode = payload;
    },
    setAutoRun(state, {payload}) {
      state.autoRun = payload;
    },
  },
});

export const {
  setBackgroundMode,
  setAutoRun,
} = settingSlice.actions;

export default settingSlice.reducer;
