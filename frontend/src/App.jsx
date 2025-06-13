import RestaurantList from "./features/restaurants/restaurantList";
import WineList from "./features/wines/WineList";
import AddRestaurantForm from "./features/restaurants/AddRestaurantForm";
import { Route, Routes } from 'react-router-dom';
import InStock from "./features/inventories/InStock";
import AddWineForm from "./features/wines/AddWineForm";



function App() {

  return (
  <>
 
    <Routes>
      <Route path="/" element={<RestaurantList />} />
      <Route path="wines/:id" element={<WineList />} />
      <Route path="inventories/:wineId" element={<InStock />} />
      <Route path="/add_restaurant" element={<AddRestaurantForm />} />
      <Route path="/add_wine" element={<AddWineForm />} />

    </Routes>     
  </>
  )
}

export default App;
