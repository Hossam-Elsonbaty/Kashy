import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../instance";

export const cashbooksAction = createAsyncThunk("cashbooks/getAllCashbooks", async()=>{
  const res = await instance.get(`/api/cashbook`);
  return res.data.items;
})

const cashbooksSlice = createSlice({
  name:"cashbooks",
  initialState:{cashbooks:[]},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(cashbooksAction.fulfilled, (state, action) => {
      state.cashbooks = action.payload;
    })
  },
})
export default cashbooksSlice.reducer;