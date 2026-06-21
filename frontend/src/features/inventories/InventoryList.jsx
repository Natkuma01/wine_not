import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInventory, fetchInventories } from "./inventorySlice";
import { updateWine, fetchWineById } from "../wines/wineSlice";
import { fetchRestaurants } from "../restaurants/restaurantSlice";
import { useParams, useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import leftArrow from "../../assets/left-arrow.png";

function InventoryList() {
  const { wineId } = useParams();
  const navigate = useNavigate();
  const [inventoryDetailFormOpen, setInventoryDetailFormOpen] = useState(false);
  const [wineInformationFormOpen, setWineInformationFormOpen] = useState(false);

  // Inventory Details form state
  const [quantity, setQuantity] = useState();
  const [buyingPrice, setBuyingPrice] = useState();
  const [sellingPrice, setSellingPrice] = useState();
  const [profitMargin, setProfitMargin] = useState();

  // Wine Information form state
  const [producer, setProducer] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [imageUrl, setImageUrl] = useState("");


  const dispatch = useDispatch();

  const {
    inventories,
    loading: inventoryLoading,
    error: inventoryError,
  } = useSelector((state) => state.inventories);

  const {
    selectedWine: wine,
    loading: wineLoading,
    error: wineError,
  } = useSelector((state) => state.wines);

  const {
    restaurants,
    loading: restaurantLoading,
    error: restaurantError,
  } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchInventories());
    dispatch(fetchWineById(parseInt(wineId)));
    dispatch(fetchRestaurants());
  }, [dispatch, wineId]);

  // Pre-fill inventory form when modal opens
  useEffect(() => {
    if (inventoryDetailFormOpen && inventory) {
      setBuyingPrice(inventory.buying_price);
      setSellingPrice(inventory.selling_price);
      setQuantity(inventory.quantity);
      setProfitMargin(inventory.profit_margin || "");
    }
  }, [inventoryDetailFormOpen]);

  // Pre-fill wine form when modal opens
  useEffect(() => {
    if (wineInformationFormOpen && wine) {
      setProducer(wine.producer);
      setCountry(wine.country);
      setYear(wine.year);
      setImageUrl(wine.imageURL || "");
    }
  }, [wineInformationFormOpen]);

  const recalculate = ({ buying, selling, margin, changed }) => {
    const buy = parseFloat(buying);
    const sell = parseFloat(selling);
    const mar = parseFloat(margin);

    if (changed === "selling" && buy > 0 && sell > 0) {
      return {
        buying,
        selling,
        margin: (((sell - buy) / sell) * 100).toFixed(2),
      };
    }

    if (changed === "margin" && buy > 0 && !isNaN(mar)) {
      return {
        buying,
        selling: (buy / (1 - margin / 100)).toFixed(2),
        margin,
      };
    }

    if (changed === "buying" && sell > 0 && buy > 0) {
      return {
        buying,
        selling,
        margin: (((sell - buy) / sell) * 100).toFixed(2),
      };
    }
    return { buying, selling, margin };
  };

  const handleBuyingPriceChange = (value) => {
    const result = recalculate({
      buying: value,
      selling: sellingPrice,
      margin: profitMargin,
      changed: "buying",
    });

    setBuyingPrice(result.buying);
    setSellingPrice(result.selling);
    setProfitMargin(result.margin);
  };

  const handleSellingPriceChange = (value) => {
    const result = recalculate({
      buying: buyingPrice,
      selling: value,
      margin: profitMargin,
      changed: "selling",
    });

    setBuyingPrice(result.buying);
    setSellingPrice(result.selling);
    setProfitMargin(result.margin);
  };

  const handleProfitMarginChange = (value) => {
    const result = recalculate({
      buying: buyingPrice,
      selling: sellingPrice,
      margin: value,
      changed: "margin",
    });

    setBuyingPrice(result.buying);
    setSellingPrice(result.selling);
    setProfitMargin(result.margin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || !buyingPrice || !sellingPrice) return;

    const updateData = {
      id: inventory.id,
      quantity: parseInt(quantity),
      buying_price: parseFloat(buyingPrice),
      selling_price: parseFloat(sellingPrice),
      profit_margin: parseFloat(profitMargin),
    };

    await dispatch(updateInventory(updateData));

    setQuantity("");
    setBuyingPrice("");
    setSellingPrice("");
    setInventoryDetailFormOpen(false);
  };

  const handleWineInfoSubmit = async (e) => {
    e.preventDefault();
    if (!producer || !country || !year) {
      alert("Please  update at least one field.");
      return;
    }

    const updateData = {
      id: parseInt(wineId),
    };

    if (producer) updateData.producer = producer;
    if (country) updateData.country = country;
    if (year) updateData.year = parseInt(year);
    if (imageUrl) updateData.imageURL = imageUrl;

    await dispatch(updateWine(updateData));

    setProducer("");
    setCountry("");
    setYear("");
    setImageUrl();
    setWineInformationFormOpen(false);
  };

  if (inventoryLoading || wineLoading || restaurantLoading) return <p>Loading...</p>;
  if (inventoryError) return <p>Error: {inventoryError}</p>;
  if (wineError) return <p>Error: {wineError}</p>;
  if (restaurantError) return <p>Error: {restaurantError}</p>;

  const inventory = inventories.find((item) => item.wine === parseInt(wineId));
  const restaurant = restaurants.find((r) => r.id === inventory?.restaurant);

  if (!inventory) {
    navigate(`/inventories/add/${wineId}`);
    return null;
  }


  // =================================== CHART CALCULATION ===================================
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const currentRestaurantId = inventory?.restaurant;        // get restaurant ID from inventory

  const restaurantInventories = inventories.filter((item) => item.restaurant === currentRestaurantId);
  
  const totalProfitPercentage = Math.round(restaurantInventories.reduce((sum, item) => sum + (parseFloat(item.profit_margin) || 0), 0));
  console.log(currentRestaurantId)
  console.log(restaurantInventories)
  console.log('All Profit Margins:', restaurantInventories.map(item => item.profit_margin));

  const profitMarginDistribution = restaurantInventories.reduce(
  (acc, item) => {
    const margin = parseFloat(item.profit_margin) || 0;
    
    if (margin >= 0 && margin <= 25) {
      acc['0-25%']++;
    } else if (margin > 25 && margin <= 50) {
      acc['26-50%']++;
    } else if (margin > 50 && margin <= 75) {
      acc['51-75%']++;
    } else if (margin > 75 && margin <= 100) {
      acc['76-100%']++;
    } else if (margin > 100) {
      acc['>100%']++;
    }
    
    return acc;
  },
  { '0-25%': 0, '26-50%': 0, '51-75%': 0, '76-100%': 0, '>100%': 0 }
);

  const chartData = {
    labels: ['0-25%', '26-50%', '51-75%', '76-100%', '>100%'],
    datasets: [
      {
        data: [
          profitMarginDistribution['0-25%'],
          profitMarginDistribution['26-50%'],
          profitMarginDistribution['51-75%'],
          profitMarginDistribution['76-100%'],
          profitMarginDistribution['>100%'],
        ],
        backgroundColor: [
          'rgba(141, 64, 98, 0.8)',   // Primary Wine
          'rgba(107, 39, 55, 0.8)',   // Dark Accent Wine
          'rgba(218, 165, 180, 0.8)',  // Rose Gold
          'rgba(235, 211, 221, 0.8)',  // Light Rose
          'rgba(141, 64, 98, 0.5)',   // Muted Wine
        ],
        borderColor: [
          'rgba(141, 64, 98, 1)',
          'rgba(107, 39, 55, 1)',
          'rgba(218, 165, 180, 1)',
          'rgba(235, 211, 221, 1)',
          'rgba(141, 64, 98, 0.8)',
        ],
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#6b7280',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Number of Wines',
          color: '#374151',
          font: { weight: 'bold' }
        }
      },
      x: {
        ticks: {
          color: '#6b7280',
        },
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Profit Margin Range',
          color: '#374151',
          font: { weight: 'bold' }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return ` ${context.parsed.y} wine(s)`;
          }
        }
      }
    }
  };

  return (
    <>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm btn-ghost text-[#8d4062] hover:bg-[#8d4062]/5 transition-all flex items-center gap-1 cursor-pointer mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Wine List
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          {inventory.wine_name} <span className="text-[#8d4062] font-normal">{wine?.producer || ""}</span>
        </h1>
      </div>

      <div className="container mx-auto px-4 pb-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Image and Details */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Image Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-center items-center">
                <img
                src={(wine?.imageURL) || 'placeholder-wine.png'}
                alt="wine image"
                className="w-44 h-auto object-contain rounded-xl shadow-sm max-h-64"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=60';
                }}
              />
            </div>

            {/* Wine Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="font-bold text-gray-800">Wine Information</h2>
                <button
                  onClick={() => setWineInformationFormOpen(true)}
                  className="btn btn-xs btn-ghost text-[#8d4062] hover:bg-[#8d4062]/5 cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <div className="p-6 flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="font-medium text-gray-400">Producer</span>
                  <span className="font-semibold text-gray-800">{wine?.producer || ""}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="font-medium text-gray-400">Country</span>
                  <span className="font-semibold text-gray-800">{wine?.country || ""}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="font-medium text-gray-400">Year</span>
                  <span className="font-semibold text-gray-800">{wine?.year || ""}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Inventory Details */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="font-bold text-gray-800">Inventory Details</h2>
                <button
                  onClick={() => setInventoryDetailFormOpen(true)}
                  className="btn btn-xs btn-ghost text-[#8d4062] hover:bg-[#8d4062]/5 cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <div className="p-6 flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="font-medium text-gray-400">Quantity</span>
                  <span className="font-semibold text-gray-800 text-base">{inventory.quantity} bottles</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="font-medium text-gray-400">Buying Price</span>
                  <span className="font-semibold text-gray-800">${parseFloat(inventory.buying_price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="font-medium text-gray-400">Selling Price</span>
                  <span className="font-semibold text-gray-800">${parseFloat(inventory.selling_price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="font-medium text-gray-400">Profit Margin</span>
                  <span className="badge badge-success text-white font-semibold">{inventory.profit_margin}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Chart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-gray-800">{restaurant?.name || "Restaurant"} Metrics</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                    <div className="text-xs font-semibold text-gray-400 uppercase">Total Wines</div>
                    <div className="text-2xl font-bold text-gray-800 mt-1">{restaurantInventories.length}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                    <div className="text-xs font-semibold text-gray-400 uppercase">Avg Margin</div>
                    <div className="text-2xl font-bold text-[#8d4062] mt-1">
                      {restaurantInventories.length > 0 ? (totalProfitPercentage / restaurantInventories.length).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>

                <div className="w-full h-64 relative">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Inventory Details Modal */}
      {inventoryDetailFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/55 backdrop-blur-sm"
          onMouseDown={() => setInventoryDetailFormOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 border border-gray-100"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Update Inventory Details</h2>
              <button
                onClick={() => setInventoryDetailFormOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  placeholder={inventory.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  placeholder={inventory.buying_price}
                  value={buyingPrice}
                  onChange={(e) => handleBuyingPriceChange(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  placeholder={inventory.selling_price}
                  value={sellingPrice}
                  onChange={(e) => handleSellingPriceChange(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profit Margin (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  placeholder={inventory.profit_margin}
                  value={profitMargin}
                  onChange={(e) => handleProfitMarginChange(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn btn-primary flex-1 text-white cursor-pointer">
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setInventoryDetailFormOpen(false)}
                  className="btn btn-outline flex-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Wine Information Modal */}
      {wineInformationFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/55 backdrop-blur-sm"
          onClick={() => setWineInformationFormOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Update Wine Information</h2>
              <button
                onClick={() => setWineInformationFormOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleWineInfoSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producer</label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  placeholder={wine?.producer || ""}
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  placeholder={wine?.country || ""}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  placeholder={wine?.year || ""}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wine Image URL</label>
                <input
                  type="url"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  placeholder={wine?.imageURL || wine?.image_url || "https://example.com/image.jpg"}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn btn-primary flex-1 text-white cursor-pointer">
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setWineInformationFormOpen(false)}
                  className="btn btn-outline flex-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
export default InventoryList;
