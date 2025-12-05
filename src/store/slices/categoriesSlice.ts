import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../instance";
import type { Category, CreateCategoryPayload } from "../../models/category";

// Fetch all categories
export const fetchCategoriesAction = createAsyncThunk(
  "categories/fetchAll",
  async () => {
    const res = await instance.get(`/api/category`);
    // API returns { items: [...], totalCount: ... }
    return res.data.items || res.data;
  }
);

// Create a new category
export const createCategoryAction = createAsyncThunk(
  "categories/create",
  async (payload: CreateCategoryPayload) => {
    const res = await instance.post(`/api/category`, payload);
    return res.data;
  }
);

// Update a category
export const updateCategoryAction = createAsyncThunk(
  "categories/update",
  async ({ id, name, description, type, parentId }: { id: string; name: string; description?: string; type: number; parentId?: string }) => {
    const res = await instance.put(`/api/category/${id}`, { id, name, description, type, parentId });
    return res.data;
  }
);

// Delete a category
export const deleteCategoryAction = createAsyncThunk(
  "categories/delete",
  async (id: string) => {
    await instance.delete(`/api/category/${id}`);
    return id;
  }
);

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategoriesAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      // Create category
      .addCase(createCategoryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategoryAction.fulfilled, (state, action) => {
        state.loading = false;
        // Depending on backend, action.payload might be the new category or just an ID/success message.
        // Assuming it returns the created category object.
        // Also assuming the list refresh might be needed or we push to state.
        state.categories.push(action.payload);
      })
      .addCase(createCategoryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create category";
      })
      // Update category
      .addCase(updateCategoryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategoryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update category";
      })
      // Delete category
      .addCase(deleteCategoryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategoryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload
        );
      })
      .addCase(deleteCategoryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete category";
      });
  },
});

export default categoriesSlice.reducer;
