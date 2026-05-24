import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

const BASE_URL = "/inventories/inventories/";

export const fetchInventories = createAsyncThunk(
  "inventories/fetchInventories",
  async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },
);

export const addInventory = createAsyncThunk(
  "inventories/inventories",
  async (newInventory) => {
    const response = await api.post(BASE_URL, newInventory);
    return response.data;
  },
);

export const updateInventory = createAsyncThunk(
  "inventories/updateInventory",
  async ({ id, ...updateData }) => {
    // Pull `id` out for the URL; remaining fields become the PATCH body
    // so the server never receives `id` as an updatable column.
    const response = await api.patch(`${BASE_URL}${id}/`, updateData);
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
        // Replace the existing inventory in-place (preserves list order)
        // rather than refetching or appending a duplicate. The guard
        // protects against a successful update for an item that was
        // already removed locally (e.g. concurrent delete).
        const index = state.inventories.findIndex(
          (inv) => inv.id === action.payload.id,
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
