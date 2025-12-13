import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInventory, fetchInventories } from "./inventorySlice";
import { updateWine, fetchWines } from "../wines/wineSlice";
import { useParams, useNavigate } from "react-router-dom";
import leftArrow from "../../assets/left-arrow.png";

function InStock() {
  const { wineId } = useParams();
  const navigate = useNavigate();
  const [inventoryDetailFormOpen, setInventoryDetailFormOpen] = useState(false);
  const [wineInformationFormOpen, setWineInformationFormOpen] = useState(false);

  // Inventory Details form state
  const [quantity, setQuantity] = useState();
  const [buyingPrice, setBuyingPrice] = useState();
  const [sellingPrice, setSellingPrice] = useState();

  // Wine Information form state
  const [ producer, setProducer] = useState("");
  const [ country, setCountry] = useState("");
  const [ year, setYear] = useState("");

  const dispatch = useDispatch();

  const { inventories, loading: inventoryLoading, error: inventoryError } = useSelector(
    (state) => state.inventories,
  );

  const { wines, loading: wineLoading, error: wineError } = useSelector(
    (state) => state.wines,
  );
    

  

  useEffect(() => {
    dispatch(fetchInventories());
    dispatch(fetchWines());
  }, [dispatch]);

  useEffect(() => {
    if (wineInformationFormOpen && wines) {
      setProducer(wine.producer);
      setCountry(wine.country);
      setYear(wine.year);
    }
  }, [wineInformationFormOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || !buyingPrice || !sellingPrice) return;
  
    const updateData = {
      id: inventory.id,
      quantity: parseInt(quantity),
      buying_price: parseFloat(buyingPrice),
      selling_price: parseFloat(sellingPrice)
    };
    
    await dispatch(updateInventory(updateData));

    setQuantity("");
    setBuyingPrice("");
    setSellingPrice("");
    setInventoryDetailFormOpen(false);
  }


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

    await dispatch(updateWine(updateData));
    await dispatch(fetchInventories());  

    setProducer("");
    setCountry("");
    setYear("");
    setWineInformationFormOpen(false);
  } 


  if (inventoryLoading || wineLoading) return <p>Loading...</p>;
  if (inventoryError) return <p>Error: {inventoryError}</p>;
  if (wineError) return <p>Error: {wineError}</p>;

  const inventory = inventories.find((item) => item.wine === parseInt(wineId));
  const wine = wines.find((w) => w.id === parseInt(wineId));

  if (!inventory) return <p> No inventory found for this wine.</p>;

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
            src={inventory.image}
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
            </div>
            <div className="card-actions justify-end m-8">
              <button onClick={() => setInventoryDetailFormOpen(true)} className="justify-end">
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
              <button onClick={() => setWineInformationFormOpen(true)} className="justify-end">
                Edit
              </button>
            </div>
            </div>
          </div>
        </div>

        {/* Update Inventory Details Form */}
        {inventoryDetailFormOpen && (
          <fieldset
            className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 z-50 fixed insert-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setInventoryDetailFormOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between">
                <legend className="fieldset-legend">Update Inventory</legend>
                <button onClick={() => setInventoryDetailFormOpen(false)}> &times; </button>
              </div>
              <form onSubmit={handleSubmit}>
              <label className="label">Quantity</label>
              <input type="number" className="input" placeholder={inventory.quantity} value={quantity} onChange={(e)=> setQuantity(e.target.value)} />
              <label className="label">buying price</label>
              <input
                type="number"
                className="input"
                placeholder={inventory.buying_price}
                value={buyingPrice}
                onChange={(e)=> setBuyingPrice(e.target.value)}
              />
              <label className="label">selling price</label>
              <input
                type="number"
                className="input"
                placeholder={inventory.selling_price}
                value = {sellingPrice}
                onChange={(e)=> setSellingPrice(e.target.value)}
              />
              <button type="submit" className="btn btn-neutral mt-4">Update</button></form>
            </div>
          </fieldset>
        )}
        {/* END OF - Update Inventory Details Form */}


          {/* Update Wine Information Form */}
{wineInformationFormOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setWineInformationFormOpen(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Update Wine Information</h2>
                <button onClick={() => setWineInformationFormOpen(false)} className="text-2xl">&times;</button>
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
                <button type="submit" className="btn btn-primary mt-4 w-full">Update</button>
              </form>
            </div>
          </div>
        )}
          {/* END OF - Update Wine Information Form */}

        <div className="flex-1">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Chart</h2>
              {/* Chart content will go here */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default InStock;
