import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from './slices/loaderSlice';
import cashbooksReducer from './slices/cashbooksSlice'
import singleCashbookReducer from "./slices/singleCashbookSlice";
import categoriesReducer from "./slices/categoriesSlice";
import PaymentMethodsReducer from "./slices/paymentMethodSlice";
export const Store = configureStore({
  reducer:{
    loader: loaderReducer,
    cashbooks: cashbooksReducer,
    singleCashbook: singleCashbookReducer,
    categories: categoriesReducer,
    PaymentMethods: PaymentMethodsReducer,
  }
})
export type AppDispatch = typeof Store.dispatch
export type RootState = ReturnType<typeof Store.getState>