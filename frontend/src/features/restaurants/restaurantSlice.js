import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/restaurants/restaurants/"

export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchRestaurants",
  async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },
);

export const addRestaurant = createAsyncThunk(
  "restaurants/addRestaurant",
  async (newRestaurant) => {
    const response = await axios.post(
      BASE_URL, newRestaurant,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data; // new restaurant returned from backend
  },
);

export const deleteRestaurant = createAsyncThunk(
  "restaurants/deleteRestaurant",
  async (id) => {
    await axios.delete(`${BASE_URL}${id}/`);
    return id;
  }
)

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
        state.error = action.error.message;
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
        state.error = action.error.message;
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
