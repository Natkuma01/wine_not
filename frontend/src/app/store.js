import { configureStore } from "@reduxjs/toolkit";
import restaurantsReducer from "../features/restaurants/restaurantSlice";
import winesReducer from "../features/wines/wineSlice";
import inventoriesReducer from "../features/inventories/inventorySlice";
import grapReducer from "../features/wines/grapeSlice";

export const store = configureStore({
  reducer: {
    restaurants: restaurantsReducer,
    wines: winesReducer,
    inventories: inventoriesReducer,
    grapes: grapReducer,
  },
});
