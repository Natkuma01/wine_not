import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from './restaurantSlice';
import { Link } from 'react-router-dom';

function RestaurantList() {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center px-10">
        <h1 className="text-2xl font-bold">Wine Inventory Tracker</h1>
        <Link to="/add_restaurant">
    <button className="btn btn-secondary hover:text-neutral-500">
      Add restaurant</button>
  </Link>
      </div>

  <div className="overflow-hidden m-8 border-2 border-slate-300 rounded-lg">
    <table className="table w-full">
      <thead>
        <tr>
          <th></th>
          <th>Restaurant Name</th>
          <th>Address</th>
        </tr>
      </thead>

      <tbody>
        {restaurants.map((restaurant, index) => (
          <tr className="hover:bg-secondary hover:text-neutral-300" key={restaurant.id}>
            <td>{index + 1}</td>
            <td>
              <Link to={`wines/${restaurant.id}`}>
                {restaurant.name}
              </Link>
            </td>
            <td>{restaurant.address}</td>
          </tr>
      ))}
      </tbody>

    </table>
  </div>
  </div>
  );
}

export default RestaurantList;
