import {combineReducers, configureStore} from '@reduxjs/toolkit';
import log from './log';

// combineReducers合并reducer
const reducers = combineReducers({
  log
});

export default configureStore({
  reducer: {
    log
  },
});
