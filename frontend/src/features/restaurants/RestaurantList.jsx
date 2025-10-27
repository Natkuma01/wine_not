import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRestaurant, fetchRestaurants } from "./restaurantSlice";
import { useNavigate } from "react-router-dom";

function RestaurantList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants, loading, error } = useSelector(
    (state) => state.restaurants,
  );
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address) return;

    const newRestaurant = { name, address };
    dispatch(addRestaurant(newRestaurant));

    setName("");
    setAddress("");
    setOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center px-10">
        <h1 className="text-2xl font-bold">Wine Inventory Tracker</h1>
        <button
          onClick={() => setOpen(true)}
          className="btn btn-secondary hover:text-neutral-500"
        >
          Add restaurant
        </button>
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
              <tr
                className="hover:bg-secondary hover:text-neutral-300 cursor-pointer"
                key={restaurant.id}
                onClick={() => navigate(`wines/${restaurant.id}`)}
              >
                <td>{index + 1}</td>
                <td>{restaurant.name}</td>
                <td>{restaurant.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add a Restaurant</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-500 text-2xl"
              >
                &times;{" "}
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Restaruant Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter restaurant name"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantList;
