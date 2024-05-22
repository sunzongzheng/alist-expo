import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export enum LogLevel {
  error = 2,
  warn = 3,
  info = 4,
  debug = 5,
}
export interface LogItem {
  level: LogLevel;
  message: string;
  time: number;
}

type SliceState = { logs: LogItem[] }

export const logSlice = createSlice({
  name: 'log',
  initialState: {
    logs: [],
  } satisfies SliceState as SliceState,
  reducers: {
    appendLog(state, {payload}) {
      state.logs = [payload, ...state.logs];
    },
    clearLogs(state) {
      state.logs = [];
    },
  },
});

export const {
  appendLog,
  clearLogs,
} = logSlice.actions;

export default logSlice.reducer;
