// grapeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchGrapes = createAsyncThunk("grapes/fetchGrapes", async () => {
  const response = await axios.get("http://localhost:8000/wines/grapes/");
  return response.data;
});

const grapeSlice = createSlice({
  name: "grapes",
  initialState: {
    grapes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGrapes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrapes.fulfilled, (state, action) => {
        state.loading = false;
        state.grapes = action.payload;
      })
      .addCase(fetchGrapes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default grapeSlice.reducer;
