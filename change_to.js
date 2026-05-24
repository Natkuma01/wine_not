// Index look up - O(1)
const targetRestaurantId = useMemo(() => {
  return restaurantId ? parseInt(restaurantId, 10) : null;
}, [restaurantId]);


// 2. wine array --> hash map, look up O(1)
const wineByIdMap = useMemo(() => {
  const map = new Map();
  wines.forEach((wine) => {
    if (wine?.id) {
      map.set(wine.id, wine);
    }
  });
  return map;
}, [wines]);

// 3. Perform the optimized data join layer time complexity from O(I * W) -> O(I + W)
// I -  inventory records(200)    W - total wine(1000)
// construct hash map --> O(W)  filer and map --> O(I)
const menuItems = useMemo(() => {
  if (!targetRestaurantId) return [];

  // Filter inventories for this specific restaurant using our cached ID
  return inventories
    .filter((inv) => inv.restaurant === targetRestaurantId)
    .map((inv) => {
      // Algorithmic Improvement: O(1) constant-time hash lookup
      const wine = wineByIdMap.get(inv.wine);

      // Return the unified relational object data shape
      return {
        inventoryId: inv.id,
        name: inv.wine_name || wine?.name,
        producer: wine?.producer,
        country: wine?.country,
        year: wine?.year,
        wine_type: wine?.wine_type,
        selling_price: inv.selling_price,
      };
    })
    .filter((item) => item.wine_type); // Keep only items with valid classifications
}, [inventories, targetRestaurantId, wineByIdMap]);






// ================================
const groupedWinesByType = useMemo(() => {
  // Initialize empty buckets for each wine type: { white: [], red: [], ... }
  const buckets = Object.fromEntries(WINE_TYPES.map((type) => [type, []]));

  // Single pass loop: Walk through the menu items exactly once
  for (const item of menuItems) {
    if (buckets[item.wine_type]) {
      buckets[item.wine_type].push(item); // Drop the item into its matching bucket
    }
  }

  return buckets;
}, [menuItems]);



{WINE_TYPES.map((type) => (
  <WineSection
    key={type}
    type={type}
    wines={groupedWinesByType[type]} // Instantly grabs the pre-built bucket in O(1) time
  />