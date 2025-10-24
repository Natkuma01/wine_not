import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addWine } from "./wineSlice";
import axios from "axios";

const WINE_TYPE_CHOICES = [
  { value: "white", label: "White" },
  { value: "red", label: "Red" },
  { value: "sparkling", label: "Sparkling" },
  { value: "orange", label: "Orange" },
  { value: "dessert", label: "Dessert" },
];

function AddWineForm() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [producer, setProducer] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");

  const [wineType, setWineType] = useState("");

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/restaurants/restaurants/",
        );
        setRestaurants(response.data);
      } catch (error) {
        console.log("Failed to load restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !producer || !country || !year || !wineType) return;

    const newWine = {
      name,
      producer,
      country,
      year: parseInt(year),
      wine_type: wineType,
      restaurant: parseInt(restaurantId),
    };

    dispatch(addWine(newWine));

    setName("");
    setProducer("");
    setCountry("");
    setYear("");
    setWineType("");
    setRestaurantId("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto my-30 p-4 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-4">Add a Wine</h2>

      <div className="mb-4">
        <label className="label">Wine Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="label">Producer</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={producer}
          onChange={(e) => setProducer(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="label">Country</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="label">Year</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label">Wine Type</label>
        <select
          className="select select-bordered w-full mb-4"
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
        <label className="label">Restaurant</label>
        <select
          className="select select-bordered w-full mb-4"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          required
        >
          <option value="">Select Restaurant</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Submit
      </button>
    </form>
  );
}
export default AddWineForm;
