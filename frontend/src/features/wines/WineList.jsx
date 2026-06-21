import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWines, addWine, deleteWine } from "./wineSlice";
import { fetchRestaurants } from "../restaurants/restaurantSlice";
import { fetchInventories, addInventory } from "../inventories/inventorySlice";
import { fetchGrapes } from "./grapeSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import leftArrow from "../../assets/left-arrow.png";
import trashIcon from "../../assets/trash.png";

const WINE_TYPE_CHOICES = [
  { value: "white", label: "White" },
  { value: "red", label: "Red" },
  { value: "sparkling", label: "Sparkling" },
  { value: "orange", label: "Orange" },
  { value: "dessert", label: "Dessert" },
];

function WineList() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wines, count, next, previous, loading, error } = useSelector((state) => state.wines);
  const { restaurants } = useSelector((state) => state.restaurants);
  const { grapes } = useSelector((state) => state.grapes);
  const { inventories } = useSelector((state) => state.inventories);


  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [createdWineId, setCreatedWineId] = useState(null); 

  const [name, setName] = useState("");
  const [producer, setProducer] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [selectedGrapes, setSelectedGrapes] = useState([]);
  const [wineType, setWineType] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [filterType, setFilterType] = useState("All Types of wines");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchGrapes());
    dispatch(fetchInventories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchWines({
      restaurant_id: id,
      wine_type: filterType,
      page: page
    }));
  }, [dispatch, id, filterType, page]);

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setPage(1);
  };

  // display current restaurant's name
  const currentRestaurant = restaurants.find((r) => r.id === parseInt(id));

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/", { replace: true });
  }

  const toggleGrape = (grapeId) => {
    setSelectedGrapes((prev) => {
      if (prev.includes(grapeId)) {
        // remove if already selected
        return prev.filter((id) => id !== grapeId);
      } else {
        // append if not selected
        return [...prev, grapeId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !producer || !country || !year || !wineType) return;

    // Convert grape IDs to grape names for the backend
    const grapeNames = selectedGrapes
      .map((grapeId) => {
        const grape = grapes.find((g) => g.id === grapeId);
        return grape ? grape.name : null;
      })
      .filter((name) => name !== null);

    const newWine = {
      name,
      producer,
      country,
      year: parseInt(year),
      wine_type: wineType,
      grapes: grapeNames,
      imageURL: imageUrl,
    };

    const resultAction = await dispatch(addWine(newWine));

    if (addWine.fulfilled.match(resultAction)) {
      const createdWine = resultAction.payload;
      setCreatedWineId(createdWine.id);
      setOpen(false);
      setConfirmOpen(true);
    }


    setName("");
    setProducer("");
    setCountry("");
    setYear("");
    setWineType("");
    setSelectedGrapes([]);
    setImageUrl("");
    setOpen(false);
  };

  const handleConfirmYes = async () => {
    if (!createdWineId) return;

    const newInventory = {
      wine: createdWineId,
      restaurant: parseInt(id),
      quantity: 0,
      buying_price: 0.00,
      selling_price: 0.00,
      profit_margin: null,
    };

    try {
      await dispatch(addInventory(newInventory)).unwrap();
      await dispatch(fetchInventories());
      setConfirmOpen(false);
      setCreatedWineId(null); 
    } catch (err) {
      console.error("Failed to add inventory for the new wine: ", err);
      alert("Failed to add inventory for the new wine. Please try again.");
    }
  };

  const handleConfirmNo = () => {
    setConfirmOpen(false);
    setCreatedWineId(null);
  }

  // Delete wine
  const handleDelete = (e, wineId) => {
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this wine?")) {
      dispatch(deleteWine(wineId));
    }
  }

  const restaurantInventories = inventories.filter(
    (inv) => inv.restaurant === parseInt(id)
  );

  const wineIdsInInventories = restaurantInventories.map((inv) => inv.wine);

  // Server-filtered wines
  const filtered = wines;


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;




  

  return (
    <>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Navigation & Header Section */}
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

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center px-6 py-6 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          {currentRestaurant?.name} <span className="text-[#8d4062]">Wine List</span>
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="btn btn-sm btn-primary text-white cursor-pointer"
          >
            + Add Wine
          </button>
          <button 
            className="btn btn-sm btn-ghost text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="text-sm font-semibold text-gray-600">Filter by category:</div>
          <select 
            className="select select-bordered w-full max-w-xs focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none bg-white" 
            value={filterType}
            onChange={handleFilterChange}
          >
            <option value="All Types of wines">All Types of wines</option>
            {WINE_TYPE_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Wine Name</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Producer</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                <th className="py-4 px-6 text-right w-16"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-12 bg-white">
                    No wines added yet. Click "Add Wine" to get started.
                  </td>
                </tr>
              ) : (
                filtered.map((wine) => (
                  <tr
                    className="hover:bg-[#8d4062]/5 transition-colors duration-150 cursor-pointer"
                    key={wine.id}
                    onClick={() => navigate(`/inventories/${wine.id}`)}
                  >
                    <td className="py-4 px-6">
                      <span className="text-[#8d4062] hover:text-[#7b3554] font-semibold hover:underline">
                        {wine.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700 font-medium">{wine.producer}</td>
                    <td className="py-4 px-6 text-gray-600">{wine.country}</td>
                    <td className="py-4 px-6 text-gray-600">{wine.year}</td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        onClick={(e) => handleDelete(e, wine.id)}
                        title="Delete Wine"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 border-t border-gray-100 bg-gray-50/75">
          <span className="text-sm text-gray-500 font-medium">
            Showing {wines.length} of {count} wines (Page {page} of {Math.ceil(count / 10) || 1})
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={!previous || loading}
              className="btn btn-xs btn-outline px-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!next || loading}
              className="btn btn-xs btn-outline px-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

        {/* Modal */}
        {open && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/55 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  Add Wine to {currentRestaurant?.name}
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wine Name
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter wine name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Producer
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    placeholder="Enter producer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter country"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Enter year"
                    required
                  />
                </div>

                {/* Select Grapes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grapes
                  </label>

                  {/* Container for checkbox list */}
                  <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-2 border border-gray-100 rounded-lg p-2 bg-gray-50/50">
                    {grapes && grapes.length > 0 ? (
                      [...grapes].sort((a, b) => a.name.localeCompare(b.name)).map((grape) => {
                        const checked = selectedGrapes.includes(grape.id);
                        return (
                          <label
                            key={grape.id}
                            className="flex items-center gap-3 p-1.5 rounded-md hover:bg-white cursor-pointer transition-colors"
                            onClick={() => toggleGrape(grape.id)}
                          >
                            <div
                              style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "4px",
                                border: checked ? "2px solid #8d4062" : "2px solid #ccc",
                                backgroundColor: checked ? "#8d4062" : "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: "all 0.15s ease",
                              }}
                            >
                              {checked && (
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 6l3 3 5-5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{grape.name}</span>
                          </label>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500">
                        No grapes available.
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Click checkboxes to select multiple grapes.
                  </p>
                </div>

                {/* Wine Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wine Type
                  </label>
                  <select
                    className="select select-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none bg-white"
                    value={wineType}
                    onChange={(e) => setWineType(e.target.value)}
                    required
                  >
                    <option value="">Select Wine Type</option>
                    {WINE_TYPE_CHOICES.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wine Image URL
                  </label>
                  <input
                    type="url"
                    className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/my-wine.jpg"
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button type="submit" className="btn btn-primary flex-1 text-white cursor-pointer">
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn btn-outline flex-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/55 backdrop-blur-sm">
            <div
              className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 border border-gray-100 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Wine Created Successfully!</h2>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to add this wine to{" "}
                <span className="font-semibold text-gray-800">{currentRestaurant?.name}</span>?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmYes}
                  className="btn btn-primary flex-1 text-white cursor-pointer"
                >
                  YES
                </button>
                <button
                  onClick={handleConfirmNo}
                  className="btn btn-outline flex-1 cursor-pointer"
                >
                  NO
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default WineList;
