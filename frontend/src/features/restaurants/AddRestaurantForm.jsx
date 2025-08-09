import { useState } from "react"
import { useDispatch } from "react-redux"
import { addRestaurant } from "./restaurantSlice" 

function AddRestaurantForm() {
  const dispatch = useDispatch()

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !address) return

    const newRestaurant = { name, address }

    // Dispatch Redux thunk or make fetch POST directly
    dispatch(addRestaurant(newRestaurant))

    // Reset form
    setName("")
    setAddress("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto my-30 p-4 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-4">Add a Restaurant</h2>

      <div className="mb-4">
        <label className="label">Restaurant Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="label">Address</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Submit
      </button>
    </form>
  )
}

export default AddRestaurantForm
