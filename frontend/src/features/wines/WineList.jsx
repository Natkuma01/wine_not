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
  const { wines, loading, error } = useSelector((state) => state.wines);
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

  useEffect(() => {
    dispatch(fetchWines());
    dispatch(fetchRestaurants());
    dispatch(fetchGrapes());
    dispatch(fetchInventories());
  }, [dispatch]);

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

  // Filter wine type
  const filtered = wines.filter((wine) => {
    const isInRestaurant = wineIdsInInventories.includes(wine.id);
    const matchType = filterType === "All Types of wines" || wine.wine_type === filterType;
    return isInRestaurant && matchType;
  })


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;




  

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <button
          onClick={() => navigate("/restaurants")}
          className="mt-4 flex items-center gap-2"
        >
          <img src={leftArrow} className="w-5 h-5" />
          Back to Restaurants
        </button>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6 px-10">
          <h1 className="text-2xl font-bold">
            {currentRestaurant?.name} Wine List
          </h1>
                  <div className="flex justify-end gap-4">

          <button
            onClick={() => setOpen(true)}
            className="btn btn-secondary hover:text-neutral-500"
          >
            Add Wine
          </button>
          <button 
        className="hover:cursor-pointer hover:underline"
        onClick={handleLogout}>Log out</button>
      </div>
        </div>
<div className="m-8">
  <select 
    className="select select-bordered w-full max-w-xs" 
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
  >
    <option value="All Types of wines">All Types of wines</option>
    {WINE_TYPE_CHOICES.map((choice) => (
      <option key={choice.value} value={choice.value}>
        {choice.label}
      </option>
    ))}
  </select>
</div>
        <div className="overflow-x-auto border-2 border-slate-300 m-8 rounded-lg">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Wine Name</th>
                <th>Producer</th>
                <th>Country</th>
                <th>Year</th>
                
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-8">
                    No wines added yet. Click "Add Wine" to get started.
                  </td>
                </tr>
              ) : (
                filtered.map((wine) => (
                  <tr
                    className="hover:bg-secondary hover:text-neutral-300"
                    key={wine.id}
                  >
                    <td>
                      <Link to={`/inventories/${wine.id}`}>{wine.name}</Link>
                    </td>
                    <td>{wine.producer}</td>
                    <td>{wine.country}</td>
                    <td>{wine.year}</td>
                   
                    <td>
                      <button className="text-right"
                      onClick={(e) => handleDelete(e, wine.id)}>
                        <img
                          src={trashIcon}
                          alt="Delete"
                          className="w-5 h-5 inline-block hover:text-red-500"
                        />
                      </button>
                    
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {open && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Add Wine to {currentRestaurant?.name}
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Wine Name
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter wine name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Producer
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    placeholder="Enter producer"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter country"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Enter year"
                    required
                  />
                </div>

                {/* Select Grapes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Grapes
                  </label>

                  {/* Container for checkbox list */}
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                    {grapes && grapes.length > 0 ? (
                      grapes.map((grape) => {
                        const checked = selectedGrapes.includes(grape.id);
                        return (
                          <label
                            key={grape.id}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              className={
                                "checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                              }
                              onChange={() => toggleGrape(grape.id)}
                            />
                            <span className="text-sm">{grape.name}</span>
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
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Wine Type
                  </label>
                  <select
                    className="select select-bordered w-full"
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

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Wine Image URL
                  </label>
                  <input
                    type="url"
                    className="input input-bordered w-full"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/my-wine.jpg"
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

        {/* Confirmation Modal */}
        {confirmOpen && (
          <div  className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Wine Created Successfully!</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to add this wine to{" "}
                <span className="font-semibold">{currentRestaurant?.name}</span>?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handleConfirmYes}
                  className="btn btn-secondary flex-1"
                >
                  YES
                </button>
                <button
                  onClick={handleConfirmNo}
                  className="btn btn-outline flex-1"
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
