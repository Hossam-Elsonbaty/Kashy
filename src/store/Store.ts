import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from './slices/loaderSlice';
import cashbooksReducer from './slices/cashbooksSlice'
import singleCashbookReducer from "./slices/singleCashbookSlice";
export const Store = configureStore({
  reducer:{
    loader: loaderReducer,
    cashbooks: cashbooksReducer,
    singleCashbook: singleCashbookReducer,
  }
})
export type AppDispatch = typeof Store.dispatch
export type RootState = ReturnType<typeof Store.getState>