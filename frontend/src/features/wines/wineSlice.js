import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchWines = createAsyncThunk (
    'wines/fetchWines',
    async () => {
        const response = await axios.get('http://localhost:8000/wines/wines/');
        return response.data;
    }
);

export const addWine = createAsyncThunk(
    'wines/addWine',
    async (newWine) => {
        const response = await axios.post(
            'http://localhost:8000/wines/wines',
            newWine,
            {
                headers: {
                'Content-Type': 'application/json',
            },
        }
        );
        return response.data;
    }
)

const wineSlice = createSlice({
    name: 'wines',
    initialState: {
        wines: [],
        loading: false,
        error: null
    },
    reducer: {},
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
            });

    }
});

export default wineSlice.reducer;