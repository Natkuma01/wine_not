import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRestaurants, updateRestaurant } from "./restaurantSlice";

const emptyRestaurantForm = {
  name: "",
  streetNumber: "",
  streetName: "",
  floorUnit: "",
  postalCode: "",
  city: "",
  state: "",
};

const formatRestaurantAddress = (formData) =>
  [
    formData.streetNumber && formData.streetName
      ? `${formData.streetNumber} ${formData.streetName}`
      : formData.streetName || formData.streetNumber,
    formData.floorUnit,
    formData.city,
    formData.state && formData.postalCode
      ? `${formData.state} ${formData.postalCode}`
      : formData.state || formData.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

function RestaurantEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurantId = parseInt(id, 10);
  const { restaurants, loading, error } = useSelector((state) => state.restaurants);
  const [formData, setFormData] = useState(emptyRestaurantForm);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!restaurants.length) {
      dispatch(fetchRestaurants());
    }
  }, [dispatch, restaurants.length]);

  const restaurant = restaurants.find((item) => item.id === restaurantId);

  useEffect(() => {
    if (!restaurant) return;

    setFormData({
      name: restaurant.name || "",
      streetNumber: restaurant.street_number || "",
      streetName: restaurant.street_name || "",
      floorUnit: restaurant.floor_unit || "",
      postalCode: restaurant.postal_code?.toString() || "",
      city: restaurant.city || "",
      state: restaurant.state || "",
    });
  }, [restaurant]);

  const handleFormChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: field === "state" ? value.toUpperCase().slice(0, 2) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurant || !formData.name.trim()) return;

    setSaving(true);

    try {
      await dispatch(
        updateRestaurant({
          id: restaurant.id,
          updates: {
            name: formData.name.trim(),
            street_number: formData.streetNumber.trim(),
            street_name: formData.streetName.trim(),
            floor_unit: formData.floorUnit.trim(),
            postal_code: formData.postalCode ? parseInt(formData.postalCode, 10) : null,
            city: formData.city.trim(),
            state: formData.state.trim(),
          },
        }),
      ).unwrap();

      navigate("/restaurants");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !restaurant) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <button
          onClick={() => navigate("/restaurants")}
          className="btn btn-sm btn-ghost text-[#8d4062] hover:bg-[#8d4062]/5 transition-all flex items-center gap-1 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Restaurants
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] items-start">
        <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-4 h-fit">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full rounded-xl px-4 py-3 text-left transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#8d4062] text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-[#8d4062]/8"
              }`}
            >
              <span className="block text-sm font-semibold">Edit Restaurant Profile</span>
              <span className={`block text-xs mt-1 ${activeTab === "profile" ? "text-white/80" : "text-gray-500"}`}>
                Name and address details
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("dailySales")}
              className={`w-full rounded-xl px-4 py-3 text-left transition-all cursor-pointer ${
                activeTab === "dailySales"
                  ? "bg-[#8d4062] text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-[#8d4062]/8"
              }`}
            >
              <span className="block text-sm font-semibold">Daily Sales</span>
              <span className={`block text-xs mt-1 ${activeTab === "dailySales" ? "text-white/80" : "text-gray-500"}`}>
                Placeholder for upcoming sales tools
              </span>
            </button>
          </div>
        </aside>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100 bg-gray-50/60">
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">
              Edit <span className="text-[#8d4062]">Restaurant</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Manage restaurant settings and switch between setup sections here.
            </p>
          </div>

          <div className="p-6">
            {activeTab === "profile" ? (
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary text-white cursor-pointer"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/restaurants")}
                      className="btn btn-outline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-5 h-fit">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                    Address Preview
                  </span>
                  <p className="text-base font-semibold text-gray-800">
                    {formData.name || "Restaurant name"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {formatRestaurantAddress(formData) || "No address entered yet."}
                  </p>
                </aside>
              </div>
            ) : (
              <section className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-8">
                <span className="inline-flex rounded-full bg-[#8d4062]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#8d4062]">
                  Coming Soon
                </span>
                <h2 className="text-2xl font-bold text-gray-800 mt-4">Daily Sales</h2>
                <p className="text-sm text-gray-600 mt-3 max-w-2xl">
                  This tab is ready for the daily sales workflow. We can build the sales inputs,
                  history, and reporting here next.
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantEdit;
