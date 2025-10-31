import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name:'loaderSlice',
  initialState: {
    isLoading :false
  },
  reducers:{
    handleChangeLoader: (state, action) => {
      state.isLoading= action.payload;
    }
  }
})
export const { handleChangeLoader } = loaderSlice.actions;
export default loaderSlice.reducer;   