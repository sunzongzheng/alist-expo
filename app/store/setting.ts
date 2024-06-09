import {createSlice} from '@reduxjs/toolkit';

type SettingState = { backgroundMode: boolean; }

export const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    backgroundMode: false,
  } satisfies SettingState as SettingState,
  reducers: {
    setBackgroundMode(state, {payload}) {
      state.backgroundMode = payload;
    },
  },
});

export const {
  setBackgroundMode,
} = settingSlice.actions;

export default settingSlice.reducer;
