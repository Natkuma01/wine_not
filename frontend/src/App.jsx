import RestaurantList from "./features/restaurants/RestaurantList";
import WineList from "./features/wines/WineList";
import { Route, Routes } from "react-router-dom";
import InStock from "./features/inventories/InStock";
import Landing from "./landing";

function App() {
  return (
    <>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<RestaurantList />} />
        <Route path="wines/:id" element={<WineList />} />
        <Route path="inventories/:wineId" element={<InStock />} />
      </Routes>
    </>
  );
}

export default App;
