import {createSlice} from '@reduxjs/toolkit';

type SettingState = { backgroundMode: boolean; videoPlayer: VideoPlayer; }

export enum VideoPlayer {
  Default = 'default',
  VLC = 'vlc',
  Infuse = 'infuse',
  Fileball = 'fileball',
  VidHub = 'vidhub',
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    backgroundMode: false,
    videoPlayer: VideoPlayer.Default,
  } satisfies SettingState as SettingState,
  reducers: {
    setBackgroundMode(state, {payload}) {
      state.backgroundMode = payload;
    },
    setVideoPlayer(state, {payload}) {
      state.videoPlayer = payload;
    },
  },
});

export const {
  setBackgroundMode,
  setVideoPlayer,
} = settingSlice.actions;

export default settingSlice.reducer;
