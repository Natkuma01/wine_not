import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchInventories = createAsyncThunk(
  "inventories/fetchInventories",
  async () => {
    const response = await axios.get(
      "http://localhost:8000/inventories/inventories/",
    );
    return response.data;
  },
);

const inventorySlice = createSlice({
  name: "inventories",
  initialState: {
    inventories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload;
      })
      .addCase(fetchInventories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default inventorySlice.reducer;
