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
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  const lineData = stats
    ? {
        labels: stats.by_day.map((d) => d.date),
        datasets: [
          {
            label: "Visits",
            data: stats.by_day.map((d) => d.count),
            borderColor: "#7c3aed",
            backgroundColor: "rgba(124, 58, 237, 0.15)",
            fill: true,
            tension: 0.3,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate("/restaurants")}
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Site Analytics</h1>
        </div>

        {loading && <p className="text-center py-10">Loading…</p>}
        {error && <p className="text-center text-error py-10">{error}</p>}

        {stats && (
          <>
            {/* Total visitors */}
            <div className="card bg-base-100 shadow p-8 text-center mb-8">
              <div className="text-6xl font-bold text-primary">{stats.total}</div>
              <div className="text-base text-base-content/60 mt-2">Total visitors</div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="card bg-base-100 shadow p-5 text-center">
                <div className="text-3xl font-bold text-primary">{stats.today}</div>
                <div className="text-sm text-base-content/60 mt-1">Visits today</div>
              </div>
              <div className="card bg-base-100 shadow p-5 text-center">
                <div className="text-3xl font-bold text-primary">
                  {stats.unique_sessions_30d}
                </div>
                <div className="text-sm text-base-content/60 mt-1">
                  Unique sessions (30d)
                </div>
              </div>
            </div>

            {/* Line chart */}
            <div className="card bg-base-100 shadow p-5">
              <h2 className="font-semibold mb-4">Visits per day (last 30 days)</h2>
              {lineData.labels.length > 0 ? (
                <Line data={lineData} options={chartOptions} />
              ) : (
                <p className="text-base-content/50 text-sm">No data yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
