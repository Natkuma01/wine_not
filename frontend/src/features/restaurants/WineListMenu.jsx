import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { QRCodeSVG } from "qrcode.react";
import { fetchInventories } from "../inventories/inventorySlice";
import { fetchWines } from "../wines/wineSlice";
import { fetchRestaurants } from "./restaurantSlice";

const WINE_TYPES = ["white", "red", "sparkling", "orange", "dessert"];

function WineSection({ type, wines }) {
  if (wines.length === 0) return null;

  const heading = `${type.toUpperCase()} WINE`;

  return (
    <section style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ textAlign: "center", letterSpacing: "0.15em", marginBottom: "0.5rem", color: "#5a1a1a", fontSize: "clamp(0.7rem, 2vw, 1rem)" }}>
        {heading}
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Wine", "Producer", "Country", "Year", "Price"].map((col) => (
              <th key={col} style={{ borderBottom: "1px solid #5a1a1a", padding: "4px 8px", textAlign: "center", color: "#5a1a1a", fontSize: "clamp(0.55rem, 1.5vw, 0.85rem)" }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {wines.map((wine) => (
            <tr key={wine.inventoryId}>
              <td style={{ padding: "4px 8px", textAlign: "center", color: "#3b1010", fontSize: "clamp(0.5rem, 1.3vw, 0.8rem)" }}>{wine.name}</td>
              <td style={{ padding: "4px 8px", textAlign: "center", color: "#3b1010", fontSize: "clamp(0.5rem, 1.3vw, 0.8rem)" }}>{wine.producer}</td>
              <td style={{ padding: "4px 8px", textAlign: "center", color: "#3b1010", fontSize: "clamp(0.5rem, 1.3vw, 0.8rem)" }}>{wine.country}</td>
              <td style={{ padding: "4px 8px", textAlign: "center", color: "#3b1010", fontSize: "clamp(0.5rem, 1.3vw, 0.8rem)" }}>{wine.year ?? "NV"}</td>
              <td style={{ padding: "4px 8px", textAlign: "center", color: "#3b1010", fontSize: "clamp(0.5rem, 1.3vw, 0.8rem)" }}>${wine.selling_price}</td>
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
  const { wines, loading: wineLoading } = useSelector((state) => state.wines);
  const { restaurants, loading: restLoading } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchInventories());
    dispatch(fetchWines());
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const loading = invLoading || wineLoading || restLoading;

  const restaurant = restaurants.find((r) => r.id === parseInt(restaurantId));

  // Join inventories for this restaurant with their wine details
  const menuItems = inventories
    .filter((inv) => inv.restaurant === parseInt(restaurantId))
    .map((inv) => {
      const wine = wines.find((w) => w.id === inv.wine);
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
    <div style={{ position: "relative", width: "100%" }}>

      {/* Background image scales naturally with the viewport width */}
      <img
        src="/wine-list-bg.png"
        alt=""
        style={{ display: "block", width: "100%", height: "auto" }}
      />

      {/* QR code icon — top-right corner */}
      <button
        onClick={() => setShowQR(true)}
        title="Show QR code"
        style={{
          position: "absolute",
          top: "1%",
          right: "1%",
          background: "rgba(255,255,255,0.75)",
          border: "1px solid #5a1a1a",
          borderRadius: "8px",
          padding: "6px",
          cursor: "pointer",
          lineHeight: 0,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          <rect x="5" y="5" width="3" height="3" fill="#5a1a1a" /><rect x="16" y="5" width="3" height="3" fill="#5a1a1a" /><rect x="5" y="16" width="3" height="3" fill="#5a1a1a" />
          <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3" />
        </svg>
      </button>

      {/* Content overlay */}
      <div
        style={{
          position: "absolute",
          top: "27%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "52%",
          textAlign: "center",
        }}
      >
        <header style={{ marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.8rem)", letterSpacing: "0.2em", color: "#5a1a1a" }}>
            {restaurant?.name ?? "Wine List"}
          </h1>
        </header>

        {WINE_TYPES.map((type) => (
          <WineSection
            key={type}
            type={type}
            wines={menuItems.filter((w) => w.wine_type === type)}
          />
        ))}

        {menuItems.length === 0 && (
          <p style={{ color: "#5a1a1a", fontSize: "clamp(0.6rem, 1.5vw, 0.9rem)" }}>
            No wines in the menu yet.
          </p>
        )}
      </div>

      {/* QR code modal */}
      {showQR && (
        <div
          onClick={() => setShowQR(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            }}
          >
            <p style={{ marginBottom: "1rem", fontWeight: "bold", color: "#5a1a1a", letterSpacing: "0.1em" }}>
              Scan to view wine list
            </p>
            <QRCodeSVG value={pageUrl} size={200} />
            <p style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#888", wordBreak: "break-all", maxWidth: "200px" }}>
              {pageUrl}
            </p>
            <button
              onClick={() => setShowQR(false)}
              style={{ marginTop: "1rem", padding: "6px 20px", background: "#5a1a1a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
