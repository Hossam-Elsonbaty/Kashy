import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../instance";

export const PaymentMethodsAction = createAsyncThunk(
  "getAllPaymentMethods",
  async () => {
    const res = await instance.get(`/api/PaymentMethod`);
    return res.data.items;
  }
);

const PaymentMethodsSlice = createSlice({
  name: "PaymentMethods",
  initialState: {
    currentPaymentMethods: [], 
    status: "idle", 
    error: null as string | null,  
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(PaymentMethodsAction.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(PaymentMethodsAction.fulfilled, (state, action) => {
      state.currentPaymentMethods = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(PaymentMethodsAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    });
  },
});
export default PaymentMethodsSlice.reducer;
