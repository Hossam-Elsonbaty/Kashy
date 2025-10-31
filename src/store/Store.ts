import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from './slices/loaderSlice';
import cashbooksReducer from './slices/cashbooksSlice'
export const Store = configureStore({
  reducer:{
    loader: loaderReducer,
    cashbooks: cashbooksReducer
  }
})
export type AppDispatch = typeof Store.dispatch
export type RootState = ReturnType<typeof Store.getState>