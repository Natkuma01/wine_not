import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../app/api";

const BASE_URL = "/analytics/daily-sales/";

export const fetchDailySales = createAsyncThunk(
  "dailySales/fetchDailySales",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL, {
        params: { restaurant_id: restaurantId },
      });
      return response.data.results ?? response.data;
    } catch (error) {
      return rejectWithValue(error.userMessage || error.message);
    }
  },
);

export const addDailySale = createAsyncThunk(
  "dailySales/addDailySale",
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL, saleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.userMessage || error.message);
    }
  },
);

const dailySalesSlice = createSlice({
  name: "dailySales",
  initialState: {
    sales: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailySales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailySales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchDailySales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addDailySale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDailySale.fulfilled, (state, action) => {
        state.loading = false;
        const incomingSale = action.payload;
        const existingIndex = state.sales.findIndex((sale) => sale.id === incomingSale.id);

        if (existingIndex >= 0) {
          state.sales[existingIndex] = incomingSale;
        } else {
          state.sales.unshift(incomingSale);
        }
      })
      .addCase(addDailySale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default dailySalesSlice.reducer;
