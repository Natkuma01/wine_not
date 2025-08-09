import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async () => {
    const response = await axios.get('http://localhost:8000/restaurants/restaurants/');
    return response.data;
  }
);

export const addRestaurant = createAsyncThunk(
  'restaurants/addRestaurant',
  async (newRestaurant) => {
    const response = await axios.post(
      'http://localhost:8000/restaurants/restaurants/',
      newRestaurant,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // new restaurant returned from backend
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState: {
    restaurants: [],
    loading: false,
    error: null
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
      });
  }
});

export default restaurantSlice.reducer;
