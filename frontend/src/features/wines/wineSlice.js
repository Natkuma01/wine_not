import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/wines/wines/"

export const fetchWines = createAsyncThunk("wines/fetchWines", async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
});

export const addWine = createAsyncThunk("wines/addWine", async (newWine) => {
  const response = await axios.post(BASE_URL, newWine,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
});

export const updateWine = createAsyncThunk(
  "wines/updateWine",
  async ({ id, ...updateData }) => {
    const response = await axios.patch(
      `${BASE_URL}${id}/`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  },
);

export const deleteWine = createAsyncThunk(
  "wines/deleteWine",
  async (id) => {
    await axios.delete(`${BASE_URL}${id}/`);
    return id;
  }
)

const wineSlice = createSlice({
  name: "wines",
  initialState: {
    wines: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWines.fulfilled, (state, action) => {
        state.loading = false;
        state.wines = action.payload;
      })
      .addCase(fetchWines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // handle addWine
      .addCase(addWine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWine.fulfilled, (state, action) => {
        state.loading = false;
        state.wines.push(action.payload);
      })
      .addCase(addWine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // handle the updateWine
      .addCase(updateWine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWine.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.wines.findIndex(
          (wine) => wine.id === action.payload.id,
        );
        if (index !== -1) {
          state.wines[index] = action.payload;
        }
      })
      .addCase(updateWine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // delete
      .addCase(deleteWine.fulfilled, (state, action) => {
        state.wines = state.wines.filter(
          (wine) => wine.id !== action.payload
        );
      });
  },
});

export default wineSlice.reducer;
