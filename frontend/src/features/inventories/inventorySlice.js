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
    {headers: {"Content-Type": "application/json",},},
  );
  return response.data;
},);

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
      });
  },
});

export default inventorySlice.reducer;
