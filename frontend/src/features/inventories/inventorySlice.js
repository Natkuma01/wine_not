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

export const addInventory = createAsyncThunk(
  "inventories/inventories",
  async (newInventory) => {
    const response = await axios.post(
      "http://localhost:8000/inventories/inventories/",
      newInventory,
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  },
);

export const updateInventory = createAsyncThunk(
  "inventories/updateInventory",
  async ({ id, ...updateData }) => {
    const response = await axios.patch(
      `http://localhost:8000/inventories/inventories/${id}/`,
      updateData,
      { headers: { "Content-Type": "application/json" } },
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
      })

      .addCase(addInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories.push(action.payload);
      })
      .addCase(addInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.inventories.findIndex(
          (inv) => inv.id === action.payload.id
        );
        if (index !== -1) {
          state.inventories[index] = action.payload;
        }
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default inventorySlice.reducer;
