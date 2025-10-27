import RestaurantList from "./features/restaurants/RestaurantList";
import WineList from "./features/wines/WineList";
import { Route, Routes } from "react-router-dom";
import InStock from "./features/inventories/InStock";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RestaurantList />} />
        <Route path="wines/:id" element={<WineList />} />
        <Route path="inventories/:wineId" element={<InStock />} />
      </Routes>
    </>
  );
}

export default App;
