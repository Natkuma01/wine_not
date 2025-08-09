import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInventories } from './inventorySlice'
import { useParams, useNavigate } from 'react-router-dom'

function InStock() {
    const { wineId } = useParams()
    const dispatch = useDispatch()
    const { inventories, loading, error } = useSelector((state) => state.inventories)
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchInventories())
    }, [dispatch])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error:</p>

    const inventory = inventories.find((item) => item.wine === parseInt(wineId))

    if (!inventory) return <p> No inventory found for this wine.</p>

    return(
       <>
        <button className="btn" onClick={() => navigate(-1)}>Back</button>
       <div className="flex flex-row m-30 rounded-md p-4 gap-20">
         <div>
            <img src={inventory.image} alt="wine image" className="w-40 h-auto rounded-md" />
         </div>
         <div className="flex flex-col justify-center">
            <p>Name: {inventory.wine_name}</p><br />
            <p>Producer: {inventory.producer}</p><br />
            <p>Country: {inventory.country}</p><br />
            <p>Year: {inventory.year}</p><br />
            <p>Quantity In Stock: {inventory.quantity} Bottles</p><br />
            <p>Buying Price: ${inventory.buying_price}</p><br />
            <p>Selling Price: ${inventory.selling_price}</p>
         </div>
       </div>
       
    </>
    )

}
export default InStock;