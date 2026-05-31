import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import api from "../../app/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/analytics/stats/")
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load site analytics."))
      .finally(() => setLoading(false));
  }, []);

  const lineData = stats
    ? {
        labels: stats.by_day.map((d) => d.date),
        datasets: [
          {
            label: "Visits",
            data: stats.by_day.map((d) => d.count),
            borderColor: "#8d4062",
            backgroundColor: "rgba(141, 64, 98, 0.12)",
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: "#8d4062",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 1.5,
            pointHoverRadius: 6,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { precision: 0, color: "#6b7280" }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280" }
      }
    },
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate("/restaurants")}
              className="btn btn-sm btn-ghost text-[#8d4062] hover:bg-[#8d4062]/5 transition-all flex items-center gap-1 cursor-pointer mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Restaurants
            </button>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Site Analytics</h1>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-sm font-medium">Loading analytics...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-2xl py-12 px-6 font-semibold my-6">
            {error}
          </div>
        )}

        {stats && (
          <div className="flex flex-col gap-6">
            {/* 3-column stats cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card 1: Total */}
              <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 text-center">
                <div className="text-4xl font-extrabold text-gray-800">{stats.total}</div>
                <div className="text-xs font-semibold text-gray-400 uppercase mt-2">Total Visitors</div>
              </div>

              {/* Card 2: Today */}
              <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 text-center">
                <div className="text-4xl font-extrabold text-[#8d4062]">{stats.today}</div>
                <div className="text-xs font-semibold text-[#8d4062]/80 uppercase mt-2">Visits Today</div>
              </div>

              {/* Card 3: 30d sessions */}
              <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 text-center">
                <div className="text-4xl font-extrabold text-gray-800">
                  {stats.unique_sessions_30d}
                </div>
                <div className="text-xs font-semibold text-gray-400 uppercase mt-2">
                  Unique Sessions (30d)
                </div>
              </div>
            </div>

            {/* Line chart */}
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Visits per day (last 30 days)</h2>
              {lineData && lineData.labels.length > 0 ? (
                <div className="h-80 w-full relative">
                  <Line data={lineData} options={chartOptions} />
                </div>
              ) : (
                <div className="text-gray-400 text-sm py-16 text-center">No visit data recorded yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
