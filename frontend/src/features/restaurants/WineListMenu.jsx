import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { QRCodeSVG } from "qrcode.react";
import { fetchInventories } from "../inventories/inventorySlice";
import { fetchRestaurants } from "./restaurantSlice";

const WINE_TYPES = ["white", "red", "sparkling", "orange", "dessert"];

function WineSection({ type, wines }) {
  if (wines.length === 0) return null;

  const heading = `${type.toUpperCase()} WINE`;

  return (
    <section style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ textAlign: "center", letterSpacing: "0.15em", marginBottom: "0.5rem", color: "#8d4062", fontSize: "clamp(0.7rem, 2vw, 1rem)", fontWeight: "bold" }}>
        {heading}
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Wine", "Producer", "Country", "Year", "Price"].map((col) => (
              <th key={col} style={{ borderBottom: "1px solid #8d4062", padding: "4px 8px", textAlign: "center", color: "#8d4062", fontSize: "clamp(0.55rem, 1.5vw, 0.85rem)", fontWeight: "semibold" }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {wines.map((wine) => (
            <tr key={wine.inventoryId}>
              <td style={{ padding: "4px 8px", textAlign: "center", color: "#3d3d3d", fontSize: "clamp(0.5rem, 1.3vw, 0.8rem)" }}>{wine.name}</td>
              <td style={{ padding: "4px 8px", textAlign: "center", color: "#3d3d3d", fontSize: "clamp(0.5rem, 1.3vw, 0.8rem)" }}>{wine.producer}</td>
              <td style={{ padding: "4px 8px", textAlign: "center", color: "#3d3d3d", fontSize: "clamp(0.5rem, 1.3vw, 0.8rem)" }}>{wine.country}</td>
              <td style={{ padding: "4px 8px", textAlign: "center", color: "#3d3d3d", fontSize: "clamp(0.5rem, 1.3vw, 0.8rem)" }}>{wine.year ?? "NV"}</td>
              <td style={{ padding: "4px 8px", textAlign: "center", color: "#3d3d3d", fontSize: "clamp(0.5rem, 1.3vw, 0.8rem)", fontWeight: "600" }}>${wine.selling_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function WineListMenu() {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const [showQR, setShowQR] = useState(false);

  const { inventories, loading: invLoading } = useSelector((state) => state.inventories);
  const { restaurants, loading: restLoading } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchInventories());
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const loading = invLoading || restLoading;

  const parsedRestaurantId = parseInt(restaurantId, 10);
  const restaurant = restaurants.find((r) => r.id === parsedRestaurantId);

  // Map inventories for this restaurant directly from serializers
  const menuItems = inventories
    .filter((inv) => inv.restaurant === parsedRestaurantId)
    .map((inv) => ({
      inventoryId: inv.id,
      name: inv.wine_name,
      producer: inv.producer,
      country: inv.country,
      year: inv.year,
      wine_type: inv.wine_type,
      selling_price: inv.selling_price,
    }))
    .filter((item) => item.wine_type);

  const pageUrl = window.location.href;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading wine list...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fdfbfd 0%, #f6f0f3 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "2rem 1rem",
      fontFamily: "'Outfit', 'Inter', sans-serif"
    }}>

      {/* Container Card */}
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        boxShadow: "0 10px 30px rgba(141, 64, 98, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)",
        border: "1px solid rgba(141, 64, 98, 0.08)",
        width: "100%",
        maxWidth: "600px",
        padding: "2.5rem 2rem",
        position: "relative",
        marginTop: "1.5rem"
      }}>

        {/* QR code icon — top-right corner */}
        <button
          onClick={() => setShowQR(true)}
          title="Show QR code"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "rgba(141, 64, 98, 0.05)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            outline: "none"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8d4062" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            <rect x="5" y="5" width="3" height="3" fill="#8d4062" /><rect x="16" y="5" width="3" height="3" fill="#8d4062" /><rect x="5" y="16" width="3" height="3" fill="#8d4062" />
            <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3" />
          </svg>
        </button>

        {/* Decorative Header Accent */}
        <div style={{
          width: "40px",
          height: "4px",
          backgroundColor: "#8d4062",
          borderRadius: "2px",
          margin: "0 auto 1.5rem"
        }}></div>

        <header style={{ marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            letterSpacing: "0.08em",
            color: "#8d4062",
            fontWeight: "800",
            textAlign: "center",
            margin: 0
          }}>
            {restaurant?.name ?? "Wine List"}
          </h1>
          <p style={{
            fontSize: "0.8rem",
            color: "#8c8c8c",
            textAlign: "center",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginTop: "0.25rem"
          }}>
            Wine Menu
          </p>
        </header>

        {WINE_TYPES.map((type) => (
          <WineSection
            key={type}
            type={type}
            wines={menuItems.filter((w) => w.wine_type === type)}
          />
        ))}

        {menuItems.length === 0 && (
          <p style={{
            color: "#8d4062",
            fontSize: "0.9rem",
            fontStyle: "italic",
            textAlign: "center",
            padding: "2rem 0"
          }}>
            No wines in the menu yet.
          </p>
        )}
      </div>

      {/* Soft Footer */}
      <footer style={{
        marginTop: "2rem",
        fontSize: "0.75rem",
        color: "#a0a0a0",
        letterSpacing: "0.05em"
      }}>
        Powered by Wine Inventory Tracker
      </footer>

      {/* QR code modal */}
      {showQR && (
        <div
          onClick={() => setShowQR(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "2rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              maxWidth: "280px",
              width: "100%"
            }}
          >
            <p style={{ marginBottom: "1rem", fontWeight: "bold", color: "#8d4062", letterSpacing: "0.1em" }}>
              Scan to view wine list
            </p>
            <div style={{ display: "flex", justifyContent: "center", background: "#fcfcfc", padding: "10px", borderRadius: "12px", border: "1px solid #f0f0f0" }}>
              <QRCodeSVG value={pageUrl} size={180} />
            </div>
            <p style={{ marginTop: "0.75rem", fontSize: "0.7rem", color: "#888", wordBreak: "break-all", opacity: 0.8 }}>
              {pageUrl}
            </p>
            <button
              onClick={() => setShowQR(false)}
              style={{ marginTop: "1.5rem", padding: "8px 20px", background: "#8d4062", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", width: "100%" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
