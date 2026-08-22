import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRestaurants, updateRestaurant } from "./restaurantSlice";
import { fetchInventories } from "../inventories/inventorySlice";
import { addDailySale, fetchDailySales } from "../analytics/dailySalesSlice";

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

const getTodayDate = () => new Date().toISOString().split("T")[0];

const formatWineOptionLabel = (inventory) => {
  const details = [
    inventory.wine_name,
    inventory.producer,
    inventory.year ?? "NV",
  ].filter(Boolean);

  return details.join(" • ");
};

const emptySalesRow = {
  inventory: "",
  quantitySold: "",
};

function RestaurantEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurantId = parseInt(id, 10);
  const { restaurants, loading, error } = useSelector((state) => state.restaurants);
  const {
    inventories,
    loading: inventoriesLoading,
    error: inventoriesError,
  } = useSelector((state) => state.inventories);
  const { error: salesError } = useSelector((state) => state.dailySales);
  const [formData, setFormData] = useState(emptyRestaurantForm);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [dailySalesForm, setDailySalesForm] = useState({
    saleItems: [{ ...emptySalesRow }],
    saleDate: getTodayDate(),
    notes: "",
  });
  const [dailySalesMessage, setDailySalesMessage] = useState("");
  const [dailySalesSaving, setDailySalesSaving] = useState(false);

  useEffect(() => {
    if (!restaurants.length) {
      dispatch(fetchRestaurants());
    }
  }, [dispatch, restaurants.length]);

  useEffect(() => {
    if (!inventories.length) {
      dispatch(fetchInventories());
    }
  }, [dispatch, inventories.length]);

  const restaurant = restaurants.find((item) => item.id === restaurantId);
  const restaurantInventories = inventories.filter(
    (inventory) => inventory.restaurant === restaurantId,
  );
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

  useEffect(() => {
    if (!restaurantId) return;
    dispatch(fetchDailySales(restaurantId));
  }, [dispatch, restaurantId]);

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

  const handleDailySalesFormChange = (field, value) => {
    setDailySalesMessage("");
    setDailySalesForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaleItemChange = (index, field, value) => {
    setDailySalesMessage("");
    setDailySalesForm((current) => ({
      ...current,
      saleItems: current.saleItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addSaleItemRow = () => {
    setDailySalesMessage("");
    setDailySalesForm((current) => ({
      ...current,
      saleItems: [...current.saleItems, { ...emptySalesRow }],
    }));
  };

  const removeSaleItemRow = (index) => {
    setDailySalesMessage("");
    setDailySalesForm((current) => ({
      ...current,
      saleItems:
        current.saleItems.length === 1
          ? [{ ...emptySalesRow }]
          : current.saleItems.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleDailySalesSubmit = async (e) => {
    e.preventDefault();
    const filledSaleItems = dailySalesForm.saleItems.filter(
      (item) => item.inventory && item.quantitySold,
    );

    if (!filledSaleItems.length || !dailySalesForm.saleDate) {
      setDailySalesMessage("Add at least one wine bottle, enter bottles sold, and choose a date.");
      return;
    }

    setDailySalesSaving(true);
    setDailySalesMessage("");

    try {
      await Promise.all(
        filledSaleItems.map((item) =>
          dispatch(
            addDailySale({
              restaurant: restaurantId,
              inventory: parseInt(item.inventory, 10),
              quantity_sold: parseInt(item.quantitySold, 10),
              sale_date: dailySalesForm.saleDate,
              notes: dailySalesForm.notes.trim(),
            }),
          ).unwrap(),
        ),
      );

      setDailySalesForm({
        saleItems: [{ ...emptySalesRow }],
        saleDate: getTodayDate(),
        notes: "",
      });
      setDailySalesMessage("Daily sales saved.");
    } catch (submitError) {
      setDailySalesMessage(submitError || "Unable to save daily sales right now.");
    } finally {
      setDailySalesSaving(false);
    }
  };

  if (loading && !restaurant) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (inventoriesError) return <p>Error: {inventoriesError}</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  const tabConfig = {
    profile: {
      title: "Edit Restaurant Profile",
      subtitle: "Manage restaurant settings and switch between setup sections here.",
    },
    dailySales: {
      title: "Daily Sales",
      subtitle: "Log bottle sales for a selected date.",
    },
  };
  const currentTab = tabConfig[activeTab];

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
                Log daily bottle sales
              </span>
            </button>
          </div>
        </aside>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100 bg-gray-50/60">
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">
              <span className="text-gray-800">{currentTab.title}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {currentTab.subtitle}
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
              <section>
                {restaurantInventories.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
                    Add wine bottles to this restaurant before entering daily sales.
                  </div>
                ) : (
                  <form onSubmit={handleDailySalesSubmit} className="flex flex-col gap-5">
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px] md:items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sale Date
                        </label>
                        <input
                          type="date"
                          className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                          value={dailySalesForm.saleDate}
                          onChange={(e) => handleDailySalesFormChange("saleDate", e.target.value)}
                          disabled={dailySalesSaving}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addSaleItemRow}
                        className="btn btn-outline border-[#8d4062] text-[#8d4062] hover:bg-[#8d4062] hover:text-white cursor-pointer"
                        disabled={dailySalesSaving}
                        aria-label="Add another sold wine bottle"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {dailySalesForm.saleItems.map((item, index) => (
                        <div
                          key={`sale-item-${index}`}
                          className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_52px] md:items-end"
                        >
                          <div>
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Wine Bottle
                              </label>
                            )}
                            <select
                              className="select select-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none bg-white"
                              value={item.inventory}
                              onChange={(e) => handleSaleItemChange(index, "inventory", e.target.value)}
                              disabled={inventoriesLoading || dailySalesSaving}
                            >
                              <option value="">Select a wine bottle</option>
                              {restaurantInventories.map((inventory) => (
                                <option key={inventory.id} value={inventory.id}>
                                  {formatWineOptionLabel(inventory)}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            {index === 0 && (
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bottles Sold
                              </label>
                            )}
                            <input
                              type="number"
                              min="1"
                              className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                              value={item.quantitySold}
                              onChange={(e) => handleSaleItemChange(index, "quantitySold", e.target.value)}
                              placeholder="e.g. 4"
                              disabled={dailySalesSaving}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeSaleItemRow(index)}
                            className="btn btn-ghost text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            disabled={dailySalesSaving}
                            aria-label={`Remove wine bottle row ${index + 1}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full min-h-28 focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                        value={dailySalesForm.notes}
                        onChange={(e) => handleDailySalesFormChange("notes", e.target.value)}
                        placeholder="Optional note about the sale, shift, or special circumstance"
                        disabled={dailySalesSaving}
                      />
                    </div>

                    {(dailySalesMessage || salesError) && (
                      <p className={`text-sm ${salesError ? "text-red-600" : "text-[#8d4062]"}`}>
                        {salesError || dailySalesMessage}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="submit"
                        className="btn btn-primary text-white cursor-pointer"
                        disabled={dailySalesSaving}
                      >
                        {dailySalesSaving ? "Submitting..." : "Submit Daily Sales"}
                      </button>
                    </div>
                  </form>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantEdit;
