import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MARGIN_BUCKETS = ["0-25%", "26-50%", "51-75%", "76-100%", ">100%"];

const BUCKET_COLORS = {
  bg: [
    "rgba(255, 99, 132, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(153, 102, 255, 0.6)",
  ],
  border: [
    "rgba(255, 99, 132, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(153, 102, 255, 1)",
  ],
};

const bucketFor = (margin) => {
  if (margin > 100) return ">100%";
  if (margin > 75) return "76-100%";
  if (margin > 50) return "51-75%";
  if (margin > 25) return "26-50%";
  if (margin >= 0) return "0-25%";
  return null;
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 },
      title: { display: true, text: "Number of Wines" },
    },
    x: {
      title: { display: true, text: "Profit Margin Range" },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y} wine(s)`,
      },
    },
  },
};

function RestaurantProfitChart({ restaurantId }) {
  const { inventories } = useSelector((state) => state.inventories);
  const { restaurants } = useSelector((state) => state.restaurants);

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const restaurantInventories = inventories.filter(
    (item) => item.restaurant === restaurantId
  );

  const totalProfitPercentage = Math.round(
    restaurantInventories.reduce(
      (sum, item) => sum + (parseFloat(item.profit_margin) || 0),
      0
    )
  );

  const averageProfitMargin =
    restaurantInventories.length > 0
      ? (totalProfitPercentage / restaurantInventories.length).toFixed(2)
      : 0;

  const distribution = restaurantInventories.reduce(
    (acc, item) => {
      const bucket = bucketFor(parseFloat(item.profit_margin) || 0);
      if (bucket) acc[bucket]++;
      return acc;
    },
    { "0-25%": 0, "26-50%": 0, "51-75%": 0, "76-100%": 0, ">100%": 0 }
  );

  const chartData = {
    labels: MARGIN_BUCKETS,
    datasets: [
      {
        data: MARGIN_BUCKETS.map((b) => distribution[b]),
        backgroundColor: BUCKET_COLORS.bg,
        borderColor: BUCKET_COLORS.border,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex-1">
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">
            {restaurant?.name || "Restaurant"} Profit Margin Chart
          </h2>
          <p>Total Profit Margin Percentage: {totalProfitPercentage}%</p>
          <p>Total Wines: {restaurantInventories.length}</p>
          <p>Average Profit Margin: {averageProfitMargin}%</p>

          <div className="w-full h-80 relative">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantProfitChart;
