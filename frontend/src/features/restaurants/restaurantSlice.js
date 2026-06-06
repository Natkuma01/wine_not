import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

const BASE_URL = "/restaurants/restaurants/";

export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchRestaurants",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL);
      return response.data.results ?? response.data;
    } catch (error) {
      return rejectWithValue(error.userMessage || error.message);
    }
  },
);

export const addRestaurant = createAsyncThunk(
  "restaurants/addRestaurant",
  async (newRestaurant, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL, newRestaurant);
      return response.data; // new restaurant returned from backend
    } catch (error) {
      return rejectWithValue(error.userMessage || error.message);
    }
  },
);

export const deleteRestaurant = createAsyncThunk(
  "restaurants/deleteRestaurant",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${BASE_URL}${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.userMessage || error.message);
    }
  }
);

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState: {
    restaurants: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // handle addRestaurant
      .addCase(addRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants.push(action.payload); // add to list
      })
      .addCase(addRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // delete
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.restaurants = state.restaurants.filter(
          (restaurant) => restaurant.id !== action.payload
        );
      });
  },
});

export default restaurantSlice.reducer;
