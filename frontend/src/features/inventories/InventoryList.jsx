import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInventory, fetchInventories } from "./inventorySlice";
import { updateWine, fetchWines } from "../wines/wineSlice";
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
    wines,
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
    dispatch(fetchWines());
    dispatch(fetchRestaurants());
  }, [dispatch]);

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
    await dispatch(fetchInventories());

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
    await dispatch(fetchInventories());

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
  const wine = wines.find((w) => w.id === parseInt(wineId));
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
        'rgba(255, 99, 132, 0.6)',   // Red
        'rgba(255, 206, 86, 0.6)',   // Yellow
        'rgba(75, 192, 192, 0.6)',   // Teal
        'rgba(54, 162, 235, 0.6)',   // Blue
        'rgba(153, 102, 255, 0.6)',  // Purple
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
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
      },
      title: {
        display: true,
        text: 'Number of Wines'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Profit Margin Range'
      }
    }
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.parsed.y} wine(s)`;
        }
      }
    }
  }
};

  
  
 


  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <button
          className="mt-4 flex items-center gap-2 pb-6"
          onClick={() => navigate(-1)}
        >
          <img src={leftArrow} className="w-5 h-5" /> Back to Wine List
        </button>
        <h1 className="text-2xl font-bold">
          {inventory.wine_name} {inventory.producer}
        </h1>
      </div>

      <div className="mx-15 flex gap-4 items-start justify-center">
        {/* image */}
        <div className="flex-none">
          <img
            src={wine.imageURL}
            alt="wine image"
            className="w-40 h-auto rounded-md"
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {/* Inventory Details Card */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Inventory Details</h2>
              <p>Quantity: {inventory.quantity}</p>
              <p>Buying Price: ${inventory.buying_price}</p>
              <p>Selling Price: ${inventory.selling_price}</p>
              <p>Profit Margin Percentage: {inventory.profit_margin}%</p>
            </div>
            <div className="card-actions justify-end m-8">
              <button
                onClick={() => setInventoryDetailFormOpen(true)}
                className="justify-end"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Wine Information Card */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Wine Information</h2>
              <p>Producer: {wine.producer}</p>
              <p>Country: {wine.country}</p>
              <p>Year: {wine.year}</p>

              <div className="card-actions justify-end m-2">
                <button
                  onClick={() => setWineInformationFormOpen(true)}
                  className="justify-end"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Update Inventory Details Form */}
        {inventoryDetailFormOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onMouseDown={() => setInventoryDetailFormOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Update Inventory Detail</h2>
                <button
                  onClick={() => setInventoryDetailFormOpen(false)}
                  className="text-2xl"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <label className="label">Quantity</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={inventory.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <label className="label">Buying Price</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={inventory.buying_price}
                  value={buyingPrice}
                  onChange={(e) => handleBuyingPriceChange(e.target.value)}
                />
                <label className="label">Selling Price</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder={inventory.selling_price}
                  value={sellingPrice}
                  onChange={(e) => handleSellingPriceChange(e.target.value)}
                />
                <label className="label">Profit margin (%)</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder={inventory.profit_margin}
                  value={profitMargin}
                  onChange={(e) => handleProfitMarginChange(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary mt-4 w-full">
                  Update
                </button>
              </form>
            </div>
          </div>
        )}
        {/* END OF - Update Inventory Details Form */}

        {/* Update Wine Information Form */}
        {wineInformationFormOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setWineInformationFormOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Update Wine Information</h2>
                <button
                  onClick={() => setWineInformationFormOpen(false)}
                  className="text-2xl"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleWineInfoSubmit}>
                <label className="label">Producer</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={wine.producer}
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                />
                <label className="label">Country</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={wine.country}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <label className="label">Year</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder={wine.year}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
                <label className="label">Wine Image URL</label>
                <input
                  type="url"
                  className="input input-bordered w-full"
                  placeholder={
                    wine.image_url || "https://example.com/image.jpg"
                  }
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary mt-4 w-full">
                  Update
                </button>
              </form>
            </div>
          </div>
        )}
        {/* END OF - Update Wine Information Form */}

        <div className="flex-1">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">{restaurant?.name || "Restaurant"} Profit Margin Chart</h2>
              <p>Total Profit Margin Percentage: {totalProfitPercentage}%</p>
              <p>Total Wines: {restaurantInventories.length}</p>
<p>Average Profit Margin: {restaurantInventories.length > 0 ? (totalProfitPercentage / restaurantInventories.length).toFixed(2) : 0}%</p>

<div className="w-full h-80 relative">
  <Bar data={chartData} options={chartOptions} />
</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default InventoryList;
