import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventories } from './inventorySlice';

function InventoryList() {
  const dispatch = useDispatch();
  const { inventories, loading, error } = useSelector((state) => state.inventories);

  useEffect(() => {
    dispatch(fetchInventories());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
  
    </>
  );
}

export default InventoryList;