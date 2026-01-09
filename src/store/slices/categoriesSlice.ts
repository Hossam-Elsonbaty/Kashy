import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../instance";

export const categoriesAction = createAsyncThunk(
  "getAllCategories",
  async () => {
    const res = await instance.get(`/api/Category`);
    return res.data.items;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    currentCategories: [], 
    status: "idle", 
    error: null as string | null,  
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(categoriesAction.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(categoriesAction.fulfilled, (state, action) => {
      state.currentCategories = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(categoriesAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    });
  },
});
export default categoriesSlice.reducer;
