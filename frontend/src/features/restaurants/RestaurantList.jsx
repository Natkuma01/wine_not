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
  <>
  <Link to="/add_restaurant">
    <button className="btn">
      Add restaurant</button>
  </Link>
  <div className="overflow-x-auto m-30 border-2 border-slate-300 min-h-200 rounded-lg">
    <table className="table">
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
  </>
  );
}

export default RestaurantList;
