import {configureStore} from '@reduxjs/toolkit';
import log from './log';
import {TypedUseSelectorHook, useSelector} from "react-redux";

const store =  configureStore({
  reducer: {
    log
  },
});

export type RootState = ReturnType<typeof store.getState>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
