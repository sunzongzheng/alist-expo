import {configureStore} from '@reduxjs/toolkit';
import log from './log';
import server from './server';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const store =  configureStore({
  reducer: {
    log,
    server,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export default store
