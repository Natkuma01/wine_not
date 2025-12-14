import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWines } from "../wines/wineSlice";
import { addInventory } from "./inventorySlice";
import { useParams, useNavigate } from "react-router-dom";
import leftArrow from "../../assets/left-arrow.png";

function AddInventory() {
  const { wineId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { wines } = useSelector((state) => state.wines);

  const [quantity, setQuantity] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [profitMargin, setProfitMargin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchWines());
  }, [dispatch]);

  const wine = wines.find((w) => w.id === parseInt(wineId));
  const restaurantId = wine ? wine.restaurant : null;

  // Calculate profit margin when buying or selling price changes
  const calculateProfitMargin = (buyPrice, sellPrice) => {
    const buyingNum = parseFloat(buyPrice);
    const sellingNum = parseFloat(sellPrice);

    if (buyingNum > 0 && sellingNum > 0) {
      const profit = sellingNum - buyingNum;
      const margin = (profit / buyingNum) * 100;
      return margin.toFixed(2);
    }
    return "";
  };

  // Calculate selling price when profit margin changes
  const calculateSellingPrice = (buyPrice, margin) => {
    const buyingNum = parseFloat(buyPrice);
    const marginNum = parseFloat(margin);

    if (buyingNum > 0 && !isNaN(marginNum)) {
      const selling = buyingNum * (1 + marginNum / 100);
      return selling.toFixed(2);
    }
    return "";
  };

  // Handle form field changes with auto-calculation
  const handleBuyingPriceChange = (value) => {
    setBuyingPrice(value);

    if (sellingPrice) {
      const newMargin = calculateProfitMargin(value, sellingPrice);
      setProfitMargin(newMargin);
    } else if (profitMargin) {
      const newSelling = calculateSellingPrice(value, profitMargin);
      setSellingPrice(newSelling);
    }
  };

  const handleSellingPriceChange = (value) => {
    setSellingPrice(value);

    if (buyingPrice) {
      const newMargin = calculateProfitMargin(buyingPrice, value);
      setProfitMargin(newMargin);
    }
  };

  const handleProfitMarginChange = (value) => {
    setProfitMargin(value);

    if (buyingPrice) {
      const newSelling = calculateSellingPrice(buyingPrice, value);
      setSellingPrice(newSelling);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!quantity || !buyingPrice || !sellingPrice) {
      setError("Please fill in all required fields");
      return;
    }

    if (parseFloat(buyingPrice) <= 0) {
      setError("Buying price must be greater than 0");
      return;
    }

    if (parseFloat(sellingPrice) <= 0) {
      setError("Selling price must be greater than 0");
      return;
    }

    if (parseInt(quantity) < 0) {
      setError("Quantity cannot be negative");
      return;
    }

    // Prepare data for backend
    const newInventory = {
      wine: parseInt(wineId),
      restaurant: restaurantId,
      quantity: parseInt(quantity),
      buying_price: parseFloat(buyingPrice),
      selling_price: parseFloat(sellingPrice),
      profit_margin: profitMargin ? parseFloat(profitMargin) : null,
    };

    try {
      await dispatch(addInventory(newInventory)).unwrap();
      // Navigate back to wine list after successful creation
      if (restaurantId) {
        navigate(`/wines/${restaurantId}`);
      } else {
        navigate(-1);
      }
    } catch (err) {
      setError("Failed to create inventory. Please try again.");
      console.error("Error creating inventory:", err);
    }
  };

  const handleBack = () => {
    if (restaurantId) {
      navigate(`/wines/${restaurantId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="container mx-auto py-8 px-4">
        {/* Back button */}
        <button
          className="mt-4 flex items-center gap-2 pb-6"
          onClick={handleBack}
        >
          <img src={leftArrow} className="w-5 h-5" alt="back arrow" />
          Back to Wine List
        </button>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {/* Info Card */}
          <div className="card bg-secondary/60 text-gray-800 shadow-lg mb-6">
            <div className="card-body">
              <div className="flex items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg">
                    No Inventory Record Found
                  </h3>
                  <p className="text-sm mt-1">
                    This wine doesn't have an inventory record yet. Please add
                    inventory details below to start tracking stock levels and
                    pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Inventory Form Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-gray-600 mb-4">
                Add Inventory Details
              </h2>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-error mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Quantity */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">
                      Quantity <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                {/* Buying Price */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">
                      Buying Price ($) <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="Enter buying price"
                    value={buyingPrice}
                    onChange={(e) => handleBuyingPriceChange(e.target.value)}
                    required
                  />
                </div>

                {/* Selling Price */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">
                      Selling Price ($) <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="Enter selling price"
                    value={sellingPrice}
                    onChange={(e) => handleSellingPriceChange(e.target.value)}
                    required
                  />
                </div>

                {/* Profit Margin */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">
                      Profit Margin (%)
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="e.g., 33.50 for 33.5%"
                    value={profitMargin}
                    onChange={(e) => handleProfitMarginChange(e.target.value)}
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      Auto-calculated based on buying and selling price
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="form-control">
                  <button type="submit" className="btn btn-secondary w-full">
                    Create Inventory
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddInventory;
