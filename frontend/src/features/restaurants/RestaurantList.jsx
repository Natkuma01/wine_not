import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRestaurant, fetchRestaurants, deleteRestaurant } from "./restaurantSlice";
import { useNavigate } from "react-router-dom";
import api from "../../app/api";
import trashIcon from "../../assets/trash.png";
import { QRCodeSVG } from "qrcode.react";
import {
  isSafeText,
  isPositiveInteger,
  isNonNegativeInteger,
  sanitizeString,
  sanitizeStateAbbreviation,
} from "../../app/validators";

function RestaurantList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants, loading, error } = useSelector(
    (state) => state.restaurants,
  );
  const [open, setOpen] = useState(false);
  const [qrRestaurant, setQrRestaurant] = useState(null);
  const [profileRole, setProfileRole] = useState(null);
  const [name, setName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [floorUnit, setFloorUnit] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [formError, setFormError] = useState("");
  //const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/me/");
        setProfileRole(response.data.role);
      } catch {
        setProfileRole("staffs");
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const cleanName = sanitizeString(name);
    const cleanStreetName = sanitizeString(streetName);
    const cleanFloorUnit = sanitizeString(floorUnit);
    const cleanCity = sanitizeString(city);
    const cleanState = sanitizeStateAbbreviation(state);
    const cleanPostalCode = String(postalCode).trim();
    const cleanStreetNumber = String(streetNumber).trim();

    if (!isSafeText(cleanName)) {
      setFormError("Restaurant name is required and may not contain invalid characters.");
      return;
    }

    if (cleanPostalCode && !isPositiveInteger(cleanPostalCode)) {
      setFormError("Postal code must be a positive integer.");
      return;
    }

    if (cleanStreetNumber && !isNonNegativeInteger(cleanStreetNumber)) {
      setFormError("Street number must be an integer.");
      return;
    }

    const newRestaurant = {
      name: cleanName,
      street_number: cleanStreetNumber ? parseInt(cleanStreetNumber) : null,
      street_name: cleanStreetName || null,
      floor_unit: cleanFloorUnit || null,
      postal_code: cleanPostalCode ? parseInt(cleanPostalCode) : null,
      city: cleanCity || null,
      state: cleanState || null,
    };

    try {
      await dispatch(addRestaurant(newRestaurant)).unwrap();
      setName("");
      setStreetNumber("");
      setStreetName("");
      setFloorUnit("");
      setPostalCode("");
      setCity("");
      setState("");
      setOpen(false);
    } catch {
      setFormError("Failed to create restaurant. Please check the data and try again.");
    }
  };

  const handleProfileClick = () => {
    navigate("/user_profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/", { replace: true });
  };

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

  const isAdmin = profileRole === "admin";
  const tableColumnCount = isAdmin ? 5 : 4;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-wrap gap-y-2 justify-between items-center px-2 sm:px-10">
        <h1 className="text-2xl font-bold">Wine Inventory Tracker</h1>
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleLogout}
              className="btn btn-secondary hover:text-neutral-500"
            >
              Home
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => navigate("/analytics")}
                  className="btn btn-secondary hover:text-neutral-500"
                >
                  Visited
                </button>
                <button
                  onClick={() => setOpen(true)}
                  className="btn btn-secondary hover:text-neutral-500"
                >
                  Add restaurant
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary hover:text-neutral-500"
            >
              Log out
            </button>
          </div>

          <button
            type="button"
            onClick={handleProfileClick}
            className="btn btn-ghost btn-circle h-15 w-15 rounded-full border-5 border-slate-300 bg-base-100 text-[#8d4162] hover:bg-slate-200"
            aria-label="View user profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
            </svg>
          </button>
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
              {isAdmin && <th></th>}
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
                {isAdmin && (
                  <td className="text-right">
                    <button
                      onClick={(e) => handleDelete(e, restaurant.id)}
                      className="hover:text-red-500"
                    >
                      <img
                        src={trashIcon}
                        alt="Delete"
                        className="w-5 h-5 inline-block"
                      />
                    </button>
                  </td>
                )}
              </tr>
            ))

) : (
    <tr>
      <td colSpan={tableColumnCount} className="text-center py-10 text-gray-500">
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
          className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
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
            {formError && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Restaruant Name <span className="text-red-500">*</span>
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
                  onChange={(e) => setState(sanitizeStateAbbreviation(e.target.value))}
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
