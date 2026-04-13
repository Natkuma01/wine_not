import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRestaurant, fetchRestaurants, deleteRestaurant } from "./restaurantSlice";
import { useNavigate } from "react-router-dom";
import trashIcon from "../../assets/trash.png";
import { QRCodeSVG } from "qrcode.react";

function RestaurantList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants, loading, error } = useSelector(
    (state) => state.restaurants,
  );
  const [open, setOpen] = useState(false);
  const [qrRestaurant, setQrRestaurant] = useState(null);
  const [name, setName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [floorUnit, setFloorUnit] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);
  
console.log("DEBUG: restaurants state value:", restaurants);
  console.log("DEBUG: is it an array?", Array.isArray(restaurants));
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    const newRestaurant = {
      name,
      street_number: streetNumber,
      street_name: streetName,
      floor_unit: floorUnit,
      postal_code: postalCode ? parseInt(postalCode) : null,
      city,
      state,
    };
    dispatch(addRestaurant(newRestaurant));

    setName("");
    setStreetNumber("");
    setStreetName("");
    setFloorUnit("");
    setPostalCode("");
    setCity("");
    setState("");
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/", { replace: true });
  }

  const handleDelete = (e, restaurantId) => {
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      dispatch(deleteRestaurant(restaurantId));
    }
  };

  const handleGenerateWineList = (e, restaurant) => {
    e.stopPropagation();
    setQrRestaurant(restaurant);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-wrap gap-y-2 justify-between items-center px-2 sm:px-10">
        <h1 className="text-2xl font-bold">Wine Inventory Tracker</h1>
        <div className="flex justify-end gap-4">
        <button
          onClick={() => setOpen(true)}
          className="btn btn-secondary hover:text-neutral-500"
        >
          Add restaurant
        </button>
        <button 
        className="hover:cursor-pointer hover:underline"
        onClick={handleLogout}>Log out</button>
      </div>
      </div>

      <div className="overflow-x-auto mx-2 my-4 sm:m-8 border-2 border-slate-300 rounded-lg">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Restaurant Name</th>
              <th>Address</th>
              <th className="text-center text-xs sm:text-sm whitespace-nowrap">Generate wine list</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(restaurants) && restaurants.length > 0 ? (
restaurants.map((restaurant, index) => (
              <tr
                className="hover:bg-secondary hover:text-neutral-300 cursor-pointer"
                key={restaurant.id}
                onClick={() => navigate(`/restaurants/wines/${restaurant.id}`)}
              >
                <td>{index + 1}</td>
                <td>{restaurant.name}</td>
                <td>{[
                  restaurant.street_number && restaurant.street_name
                    ? `${restaurant.street_number} ${restaurant.street_name}`
                    : restaurant.street_name || restaurant.street_number,
                  restaurant.floor_unit,
                  restaurant.city,
                  restaurant.state && restaurant.postal_code
                    ? `${restaurant.state} ${restaurant.postal_code}`
                    : restaurant.state || restaurant.postal_code,
                ].filter(Boolean).join(", ")}</td>
                <td className="text-center">
                  <button
                    onClick={(e) => handleGenerateWineList(e, restaurant)}
                    className="hover:text-blue-500"
                    title="Generate wine list"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75V16.5zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                    </svg>
                  </button>
                </td>
                <td className="text-right">
                  <button
                    onClick={(e) => handleDelete(e, restaurant.id)}
                    className="hover:text-red-500"    // this hover effect does not work
                  >
                    <img
                      src={trashIcon}
                      alt="Delete"
                      className="w-5 h-5 inline-block"
                    />
                  </button>
                </td>
              </tr>
            ))

) : (
    <tr>
      <td colSpan="5" className="text-center py-10 text-gray-500">
        {loading ? "Loading restaurants..." : "No restaurants found or invalid data received."}
      </td>
    </tr>
  )

}
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
                  Street Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  placeholder="e.g. Madison Avenue"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Number
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={streetNumber}
                  onChange={(e) => setStreetNumber(e.target.value)}
                  placeholder="e.g. 247"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Floor / Unit
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={floorUnit}
                  onChange={(e) => setFloorUnit(e.target.value)}
                  placeholder="e.g. Suite 3A"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Postal Code
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 10016"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. New York"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  State
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                  placeholder="e.g. NY"
                  maxLength={2}
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-secondary flex-1">
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

      {/* QR code modal */}
      {qrRestaurant && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setQrRestaurant(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-bold text-lg mb-1">{qrRestaurant.name}</p>
            <p className="text-sm text-gray-500 mb-4">Scan to view wine list</p>
            <QRCodeSVG
              value={`${window.location.origin}/wine-menu/${qrRestaurant.id}`}
              size={200}
            />
            <p className="text-xs text-gray-400 mt-2">{`${window.location.origin}/wine-menu/${qrRestaurant.id}`}</p>
            <button
              onClick={() => setQrRestaurant(null)}
              className="btn btn-secondary mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default RestaurantList;
