import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInventory, fetchInventories } from "./inventorySlice";
import { useParams, useNavigate } from "react-router-dom";
import leftArrow from "../../assets/left-arrow.png";

function InStock() {
  const { wineId } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState();
  const [buyingPrice, setBuyingPrice] = useState();
  const [sellingPrice, setSellingPrice] = useState();
  const dispatch = useDispatch();
  const { inventories, loading, error } = useSelector(
    (state) => state.inventories,
  );

  

  useEffect(() => {
    dispatch(fetchInventories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || !buyingPrice || !sellingPrice) return;
  
    const updateData = {
      id: inventory.id,
      quantity: parseInt(quantity),
      buying_price: parseFloat(buyingPrice),
      selling_price: parseFloat(sellingPrice)
    };
    
    dispatch(updateInventory(updateData));

    setQuantity("");
    setBuyingPrice("");
    setSellingPrice("");
    setOpen(false);
  }



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error:</p>;

  const inventory = inventories.find((item) => item.wine === parseInt(wineId));

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
              <button onClick={() => setOpen(true)} className="justify-end">
                Edit
              </button>
            </div>
          </div>

          {/* Wine Information Card */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Wine Information</h2>
              <p>Producer: {inventory.producer}</p>
              <p>Country: {inventory.country}</p>
              <p>Year: {inventory.year}</p>
            </div>
          </div>
        </div>

        {/* Modal */}
        {open && (
          <fieldset
            className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 z-50 fixed insert-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between">
                <legend className="fieldset-legend">Update Inventory</legend>
                <button onClick={() => setOpen(false)}> &times; </button>
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
