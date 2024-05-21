import {createSlice} from '@reduxjs/toolkit';

export const logSlice = createSlice({
  name: 'log',
  initialState: {
    logs: [],
  },
  reducers: {
    setLogs(state, {payload}) {
      state.logs = payload;
    },
    appendLog(state, {payload}) {
      state.logs = [payload, ...state.logs];
    },
    clearLogs(state) {
      state.logs = [];
    },
  },
});

export const {
  setLogs,
  appendLog,
  clearLogs,
} = logSlice.actions;

export default logSlice.reducer;
