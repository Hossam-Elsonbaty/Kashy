// singleCashbookSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../instance";

export const getCashbookById = createAsyncThunk(
  "cashbooks/getCashbookById",
  async (id: string) => {
    const res = await instance.get(`/api/cashbook/${id}`);
    return res.data; 
  }
);

const singleCashbookSlice = createSlice({
  name: "singleCashbook",
  initialState: {
    currentCashbook: null, 
    status: "idle", 
    error: null as string | null,  
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCashbookById.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getCashbookById.fulfilled, (state, action) => {
      state.currentCashbook = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(getCashbookById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    });
  },
});

export default singleCashbookSlice.reducer;
