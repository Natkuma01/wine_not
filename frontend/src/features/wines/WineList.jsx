import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWines } from './wineSlice'
import { useParams, Link } from 'react-router-dom'


function WineList() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { wines, loading, error } = useSelector((state) => state.wines);

    useEffect(() => {
        dispatch(fetchWines());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Filter wines by restaurant ID - convert to integer
    const filtered = wines.filter((wine) => wine.restaurant === parseInt(id));


    return (
        <>
          <Link to="/add_wine">
    <button className="btn">
      Add Wine</button>
  </Link>
    <div className="overflow-x-auto border-2 border-slate-300 min-h-200 m-30 rounded-lg">
      <table className="table">
        <thead>
            <tr>
                <th>Wine Name</th>
                <th>Producer</th>
                <th>Country</th>
                <th>Year</th>
            </tr>
        </thead>

        <tbody>
          {filtered.map((wine) => (
            <tr key={wine.id}>
              <td>
                <Link to={`/inventories/${wine.id}`}>
                {wine.name}
                </Link>
              </td>
              <td>{wine.producer}</td>
              <td>{wine.country}</td>
              <td>{wine.year}</td>
            </tr>
          )
        
          )}
        </tbody>

      </table>
    </div>
    </>
    );
}
export default WineList;
