// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchInventories } from "./inventorySlice";
// import { fetchRestaurants } from "../restaurants/restaurantSlice";
// import leftArrow from "../../assets/left-arrow.png";
// import { useNavigate } from "react-router-dom";

// function InventoryList() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { inventories, loading, error } = useSelector(
//     (state) => state.inventories,
//   );

//   useEffect(() => {
//     dispatch(fetchInventories());
//     dispatch(fetchRestaurants());
//   }, [dispatch]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <>
//       <div className="container mx-auto py-8 px-4">
//         <button
//           onClick={() => navigate("/")}
//           className="mt-4 flex items-center gap-2"
//         >
//           <img src={leftArrow} className="w-5 h-5" />
//           Back to Restaurants
//         </button>
//       </div>
//     </>
//   );
// }

// export default InventoryList;
