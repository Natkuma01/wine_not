import RestaurantList from "./features/restaurants/RestaurantList";
import WineList from "./features/wines/WineList";
import { Route, Routes, Navigate } from "react-router-dom";
import InventoryList from "./features/inventories/InventoryList";
import AddInventory from "./features/inventories/AddInventory";
import Landing from "../src/features/landing/landing";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/landing" replace />
  }
  return children
}

function App() {
  return (
    <>
      <Routes>
         {/* Public Route */}
        <Route path="/landing" element={<Landing />} />

        {/* Private Routes */}
        <Route path="/" element={<ProtectedRoute> <RestaurantList /> </ProtectedRoute>} />
        <Route path="wines/:id" element={<ProtectedRoute> <WineList /> </ProtectedRoute>} />
        <Route path="inventories/:wineId" element={<ProtectedRoute> <InventoryList /> </ProtectedRoute>} />
        <Route path="inventories/add/:wineId" element={<ProtectedRoute> <AddInventory /> </ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
