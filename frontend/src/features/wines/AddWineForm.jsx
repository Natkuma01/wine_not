import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { addWine } from "./wineSlice"

function AddWineForm() {
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [producer, setProducer] = useState("")
    const [country, setCountry] = useState("")
    const [year, setYear] = useState("")
    
    const [wineTypes, setWineTypes] = useState([])
    const [wineTypeId, setWineTypeId] = useState("")


    useEffect(() => {
    fetch("http://127.0.0.1:8000/wines/wine_type/")
    .then(res => {
        if (!res.ok) { // Check if the response was successful (status code 2xx)
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => setWineTypes(data))
    .then((err) => console.error("Failed to load wine type", err))
    
  }, []);
  
    const handleSubmit = async (e) => {
        e.preventDefault()

    if (!name || !producer || !country || !year || !wineTypeId) return

    const newWine = { name, producer, country, year: parseInt(year), wine_type: parseInt(wineTypeId) }
    
    dispatch(addWine(newWine))

    setName("")
    setProducer("")
    setCountry("")
    setYear("")
    setWineTypeId("")

    }

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
        <select className="select select-bordered w-full mb-4" value={wineTypeId} onChange={(e) => setWineTypeId(e.target.value)} required>
        <option value="">Select Wine Type</option>
        {wineTypes.map(wt => <option key={wt.id} value={wt.id}>{wt.type}</option>)}
      </select>
        </div>

      <button type="submit" className="btn btn-primary w-full">
        Submit
      </button>
    </form>
  )
        
    

}
export default AddWineForm;