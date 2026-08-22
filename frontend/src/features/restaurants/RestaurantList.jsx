import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRestaurant, fetchRestaurants, deleteRestaurant } from "./restaurantSlice";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const emptyRestaurantForm = {
  name: "",
  streetNumber: "",
  streetName: "",
  floorUnit: "",
  postalCode: "",
  city: "",
  state: "",
};

const formatRestaurantAddress = (restaurant) =>
  [
    restaurant.street_number && restaurant.street_name
      ? `${restaurant.street_number} ${restaurant.street_name}`
      : restaurant.street_name || restaurant.street_number,
    restaurant.floor_unit,
    restaurant.city,
    restaurant.state && restaurant.postal_code
      ? `${restaurant.state} ${restaurant.postal_code}`
      : restaurant.state || restaurant.postal_code,
  ]
    .filter(Boolean)
    .join(", ");

function RestaurantList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants, loading, error } = useSelector(
    (state) => state.restaurants,
  );
  const [open, setOpen] = useState(false);
  const [qrRestaurant, setQrRestaurant] = useState(null);
  const [formData, setFormData] = useState(emptyRestaurantForm);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);
  const closeAddRestaurantModal = () => {
    setOpen(false);
    setFormData(emptyRestaurantForm);
  };

  const handleFormChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: field === "state" ? value.toUpperCase().slice(0, 2) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const restaurantPayload = {
      name: formData.name.trim(),
      street_number: formData.streetNumber.trim(),
      street_name: formData.streetName.trim(),
      floor_unit: formData.floorUnit.trim(),
      postal_code: formData.postalCode ? parseInt(formData.postalCode, 10) : null,
      city: formData.city.trim(),
      state: formData.state.trim(),
    };

    await dispatch(addRestaurant(restaurantPayload)).unwrap();
    closeAddRestaurantModal();
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

  const handleEditRestaurant = (e, restaurantId) => {
    e.stopPropagation();
    navigate(`/restaurants/edit/${restaurantId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center px-4 py-6 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          Wine <span className="text-[#8d4062]">Inventory</span> Tracker
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate("/analytics")}
            className="btn btn-sm btn-outline btn-primary transition-all cursor-pointer"
          >
            Analytics
          </button>
          <button
            onClick={() => setOpen(true)}
            className="btn btn-sm btn-primary text-white transition-all cursor-pointer"
          >
            + Add Restaurant
          </button>
          <button
            className="btn btn-sm btn-ghost text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">#</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Restaurant Name</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                <th className="py-4 px-6 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16"></th>
                <th className="py-4 px-6 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Wine List Menu</th>
                <th className="py-4 px-6 text-right w-16"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {Array.isArray(restaurants) && restaurants.length > 0 ? (
                restaurants.map((restaurant, index) => (
                  <tr
                    className="hover:bg-[#8d4062]/5 cursor-pointer transition-colors duration-150"
                    key={restaurant.id}
                    onClick={() => navigate(`/restaurants/wines/${restaurant.id}`)}
                  >
                    <td className="py-4 px-6 font-medium text-gray-400">{index + 1}</td>
                    <td className="py-4 px-6 font-semibold text-gray-800">{restaurant.name}</td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {formatRestaurantAddress(restaurant) || "No address added"}
                    </td>
                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleEditRestaurant(e, restaurant.id)}
                        className="p-1 rounded-md text-gray-400 hover:text-[#8d4062] hover:bg-[#8d4062]/10 transition-all cursor-pointer"
                        title="Edit restaurant"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931ZM16.862 4.487 19.5 7.125" />
                        </svg>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => handleGenerateWineList(e, restaurant)}
                          className="btn btn-xs btn-outline btn-primary cursor-pointer"
                          title="Generate QR code"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75V16.5zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                          </svg>
                          QR Code
                        </button>
                        <span className="text-gray-200">|</span>
                        <button
                          onClick={() => navigate(`/wine-menu/${restaurant.id}`)}
                          className="text-xs text-[#8d4062] hover:text-[#7b3554] font-semibold hover:underline cursor-pointer"
                        >
                          View Menu
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleDelete(e, restaurant.id)}
                        className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        title="Delete Restaurant"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 bg-white">
                    {loading ? "Loading restaurants..." : "No restaurants found or invalid data received."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/55 backdrop-blur-sm"
          onClick={closeAddRestaurantModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Add a Restaurant</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add a new restaurant and its address details.
                </p>
              </div>
              <button
                onClick={closeAddRestaurantModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="Enter restaurant name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  value={formData.streetName}
                  onChange={(e) => handleFormChange("streetName", e.target.value)}
                  placeholder="e.g. Madison Avenue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                    value={formData.streetNumber}
                    onChange={(e) => handleFormChange("streetNumber", e.target.value)}
                    placeholder="e.g. 247"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor / Unit
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                    value={formData.floorUnit}
                    onChange={(e) => handleFormChange("floorUnit", e.target.value)}
                    placeholder="e.g. Suite 3A"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                    value={formData.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    placeholder="e.g. New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                    value={formData.state}
                    onChange={(e) => handleFormChange("state", e.target.value)}
                    placeholder="NY"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  value={formData.postalCode}
                  onChange={(e) => handleFormChange("postalCode", e.target.value)}
                  placeholder="e.g. 10016"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn btn-primary flex-1 text-white cursor-pointer">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={closeAddRestaurantModal}
                  className="btn btn-outline flex-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {qrRestaurant && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/55 backdrop-blur-sm"
          onClick={() => setQrRestaurant(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-full mx-4 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-bold text-xl text-gray-800 mb-1">{qrRestaurant.name}</p>
            <p className="text-sm text-gray-500 mb-6">Scan to view wine list</p>
            <div className="flex justify-center bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
              <QRCodeSVG
                value={`${window.location.origin}/wine-menu/${qrRestaurant.id}`}
                size={200}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 truncate max-w-full px-2" title={`${window.location.origin}/wine-menu/${qrRestaurant.id}`}>
              {`${window.location.origin}/wine-menu/${qrRestaurant.id}`}
            </p>
            <button
              onClick={() => setQrRestaurant(null)}
              className="btn btn-primary mt-6 w-full text-white cursor-pointer"
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
