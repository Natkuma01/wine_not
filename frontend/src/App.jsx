import { useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import RestaurantList from "./features/restaurants/RestaurantList";
import WineList from "./features/wines/WineList";
import InventoryList from "./features/inventories/InventoryList";
import AddInventory from "./features/inventories/AddInventory";
import Landing from "../src/features/landing/landing";
import WineListMenu from "./features/restaurants/WineListMenu";
import AnalyticsDashboard from "./features/analytics/AnalyticsDashboard";
import { trackVisit } from "./app/trackVisit";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/" replace />
  }
  return children
}

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    trackVisit(location.pathname);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <>
      <PageTracker />
      <Routes>
         {/* Public Route */}
        <Route path="/" element={<Landing />} />
        <Route path="/wine-menu/:restaurantId" element={<WineListMenu />} />

        {/* Private Routes */}
        <Route path="/restaurants" element={<ProtectedRoute> <RestaurantList /> </ProtectedRoute>} />
        <Route path="/restaurants/wines/:id" element={<ProtectedRoute> <WineList /> </ProtectedRoute>} />
        <Route path="inventories/:wineId" element={<ProtectedRoute> <InventoryList /> </ProtectedRoute>} />
        <Route path="inventories/add/:wineId" element={<ProtectedRoute> <AddInventory /> </ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute> <AnalyticsDashboard /> </ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
