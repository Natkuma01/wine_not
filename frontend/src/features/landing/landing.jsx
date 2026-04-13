import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Landing() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/restaurants", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    try {
      const response = await axios.post(`${BASE_URL}/api/token/`, {
        username: username,
        password: password,
      });

      const data = response.data;
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      navigate("/restaurants");
    } catch (err) {
      if (err.response) {
        setError("Invalid username or password");
      } else if (err.request) {
        setError("Unable to connect to the server. Make sure backend is running.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    try {
      const response = await axios.post(`${BASE_URL}/api/register/`, {
        username: username.trim(),
        password: password,
      });

      if (response.status === 201) {
        setSuccess("Account created successfully! You can now log in.");
        setTimeout(() => {
          setShowCreateAccount(false);
          setUsername("");
          setPassword("");
          setSuccess("");
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(
          typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : "Registration failed. Please try again."
        );
      } else if (err.response?.status === 400) {
        setError("Invalid input. Check username and password.");
      } else if (err.request) {
        setError("Unable to connect to the server. Make sure backend is running.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username) {
      setError("Please enter your username");
      return;
    }

    setSuccess("Password reset instructions have been sent to your email.");
    setTimeout(() => {
      setShowForgotPassword(false);
      setUsername("");
      setSuccess("");
    }, 3000);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ backgroundColor: "#F7F0E6" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ backgroundColor: "#C8A882" }}
      />
      <div
        className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ backgroundColor: "#A87C5A" }}
      />

      {/* Decorative wine emoji accents */}
      <span className="absolute left-8 top-1/2 -translate-y-1/2 text-8xl opacity-20 select-none pointer-events-none hidden lg:block">
        🍷
      </span>
      <span className="absolute right-12 bottom-16 text-6xl opacity-20 select-none pointer-events-none hidden lg:block">
        🍇
      </span>
      <span className="absolute right-24 top-1/3 text-5xl opacity-15 select-none pointer-events-none hidden lg:block">
        🍾
      </span>

      {/* Title */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-5xl font-semibold tracking-tight mb-2">
          <span style={{ color: "#6B2737" }} className="font-bold">
            Wine Inventory
          </span>{" "}
          <span style={{ color: "#3D3D3D" }} className="font-normal">
            Tracking
          </span>
        </h1>
        <p className="text-lg" style={{ color: "#888" }}>
          Manage your wine collection with ease.
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full bg-white rounded-2xl shadow-lg px-10 py-[68px] z-10"
        style={{ maxWidth: "416px", boxShadow: "0 8px 32px rgba(107,39,55,0.10)" }}
      >
        {/* Login Form */}
        {!showCreateAccount && !showForgotPassword && (
          <>
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                {success}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-lg border px-5 py-[27px] text-base outline-none focus:ring-2 transition"
                style={{
                  borderColor: "#E0D4C8",
                  backgroundColor: "#FDFAF7",
                  color: "#3D3D3D",
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-lg border px-5 py-[27px] text-base outline-none focus:ring-2 transition"
                style={{
                  borderColor: "#E0D4C8",
                  backgroundColor: "#FDFAF7",
                  color: "#3D3D3D",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full rounded-lg py-[27px] text-base font-semibold text-white transition hover:opacity-90 active:opacity-80"
                style={{ backgroundColor: "#8d4162" }}
              >
                Login
              </button>
            </form>

            <div className="mt-5 flex flex-col gap-2 text-center">
              <button
                type="button"
                className="text-sm font-medium transition hover:opacity-80"
                style={{ color: "#6B2737" }}
                onClick={() => {
                  setShowCreateAccount(true);
                  setError("");
                  setSuccess("");
                }}
              >
                Create Account
              </button>
              <button
                type="button"
                className="text-xs transition hover:opacity-80"
                style={{ color: "#AAA" }}
                onClick={() => {
                  setShowForgotPassword(true);
                  setError("");
                  setSuccess("");
                }}
              >
                Forgot Password?
              </button>
            </div>
          </>
        )}

        {/* Create Account Form */}
        {showCreateAccount && (
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold" style={{ color: "#3D3D3D" }}>
                Create Account
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                onClick={() => {
                  setShowCreateAccount(false);
                  setError("");
                  setSuccess("");
                  setUsername("");
                  setPassword("");
                }}
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                {success}
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Username"
                className="w-full rounded-lg border px-5 py-[27px] text-base outline-none focus:ring-2 transition"
                style={{ borderColor: "#E0D4C8", backgroundColor: "#FDFAF7", color: "#3D3D3D" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password (min. 6 characters)"
                className="w-full rounded-lg border px-5 py-[27px] text-base outline-none focus:ring-2 transition"
                style={{ borderColor: "#E0D4C8", backgroundColor: "#FDFAF7", color: "#3D3D3D" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="submit"
                className="w-full rounded-lg py-[27px] text-base font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "#8d4162" }}
              >
                Create Account
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm transition hover:opacity-80"
                style={{ color: "#6B2737" }}
                onClick={() => {
                  setShowCreateAccount(false);
                  setError("");
                  setSuccess("");
                }}
              >
                Back to Sign In
              </button>
            </div>
          </>
        )}

        {/* Forgot Password Form */}
        {showForgotPassword && (
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold" style={{ color: "#3D3D3D" }}>
                Forgot Password
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError("");
                  setSuccess("");
                  setUsername("");
                }}
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                {success}
              </div>
            )}

            <p className="text-sm mb-4" style={{ color: "#888" }}>
              Enter your username and we'll send you reset instructions.
            </p>

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Username"
                className="w-full rounded-lg border px-5 py-[27px] text-base outline-none focus:ring-2 transition"
                style={{ borderColor: "#E0D4C8", backgroundColor: "#FDFAF7", color: "#3D3D3D" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full rounded-lg py-[27px] text-base font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "#8d4162" }}
              >
                Send Reset Instructions
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm transition hover:opacity-80"
                style={{ color: "#6B2737" }}
                onClick={() => {
                  setShowForgotPassword(false);
                  setError("");
                  setSuccess("");
                }}
              >
                Back to Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Landing;
