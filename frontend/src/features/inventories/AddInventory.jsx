import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWineById } from "../wines/wineSlice";
import { addInventory } from "./inventorySlice";
import { useParams, useNavigate } from "react-router-dom";
import leftArrow from "../../assets/left-arrow.png";

function AddInventory() {
  const { wineId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedWine: wine } = useSelector((state) => state.wines);

  const [quantity, setQuantity] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [profitMargin, setProfitMargin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchWineById(parseInt(wineId)));
  }, [dispatch, wineId]);
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
    <div className="min-h-screen pb-12">
      <div className="container mx-auto py-6 px-4 max-w-2xl">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="btn btn-sm btn-ghost text-[#8d4062] hover:bg-[#8d4062]/5 transition-all flex items-center gap-1 cursor-pointer mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Wine List
        </button>

        {/* Info Card */}
        <div className="bg-[#8d4062]/10 border border-[#8d4062]/20 text-[#8d4062] rounded-2xl p-5 shadow-sm mb-6 flex items-start gap-3">
          <div className="mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-base">No Inventory Record Found</h3>
            <p className="text-sm mt-1 text-[#8d4062]/90">
              This wine doesn't have an inventory record yet. Please add
              inventory details below to start tracking stock levels and pricing.
            </p>
          </div>
        </div>

        {/* Add Inventory Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800">
              Add Inventory Details
            </h2>
          </div>
          <div className="p-6">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-5 w-5"
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
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              {/* Buying Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buying Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  placeholder="Enter buying price"
                  value={buyingPrice}
                  onChange={(e) => handleBuyingPriceChange(e.target.value)}
                  required
                />
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none"
                  placeholder="Enter selling price"
                  value={sellingPrice}
                  onChange={(e) => handleSellingPriceChange(e.target.value)}
                  required
                />
              </div>

              {/* Profit Margin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profit Margin (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered w-full focus:border-[#8d4062] focus:ring-2 focus:ring-[#8d4062]/20 transition-all outline-none bg-white"
                  placeholder="e.g., 33.50 for 33.5%"
                  value={profitMargin}
                  onChange={(e) => handleProfitMarginChange(e.target.value)}
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  Auto-calculated based on buying and selling price
                </span>
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button type="submit" className="btn btn-primary w-full text-white cursor-pointer">
                  Create Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddInventory;
