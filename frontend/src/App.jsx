import RestaurantList from "./features/restaurants/RestaurantList";
import WineList from "./features/wines/WineList";
import { Route, Routes } from "react-router-dom";
import InventoryList from "./features/inventories/InventoryList";
import AddInventory from "./features/inventories/AddInventory";
import Landing from "./landing";

function App() {
  return (
    <>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<RestaurantList />} />
        <Route path="wines/:id" element={<WineList />} />
        <Route path="inventories/:wineId" element={<InventoryList />} />
        <Route path="inventories/add/:wineId" element={<AddInventory />} />
      </Routes>
    </>
  );
}

export default App;
