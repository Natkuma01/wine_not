import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    // TODO: Implement actual login API call
    // For now, just navigate to restaurant list
    // Example:
    // try {
    //   const response = await axios.post("http://localhost:8000/auth/login/", {
    //     username,
    //     password,
    //   });
    //   // Store token, navigate, etc.
    //   navigate("/");
    // } catch (err) {
    //   setError("Invalid username or password");
    // }

    // Temporary: Navigate to restaurant list
    navigate("/");
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

    // TODO: Implement actual create account API call
    // Example:
    // try {
    //   const response = await axios.post("http://localhost:8000/auth/register/", {
    //     username,
    //     password,
    //   });
    //   setSuccess("Account created successfully! You can now log in.");
    //   setShowCreateAccount(false);
    //   setUsername("");
    //   setPassword("");
    // } catch (err) {
    //   setError(err.response?.data?.message || "Failed to create account. Username may already exist.");
    // }

    // Temporary: Show success message
    setSuccess("Account created successfully! You can now log in.");
    setTimeout(() => {
      setShowCreateAccount(false);
      setUsername("");
      setPassword("");
      setSuccess("");
    }, 2000);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username) {
      setError("Please enter your username");
      return;
    }

    // TODO: Implement actual forgot password API call
    // Example:
    // try {
    //   await axios.post("http://localhost:8000/auth/forgot-password/", {
    //     username,
    //   });
    //   setSuccess("Password reset instructions have been sent to your email.");
    //   setTimeout(() => {
    //     setShowForgotPassword(false);
    //     setUsername("");
    //   }, 3000);
    // } catch (err) {
    //   setError("Username not found or error occurred");
    // }

    // Temporary: Show success message
    setSuccess("Password reset instructions have been sent to your email.");
    setTimeout(() => {
      setShowForgotPassword(false);
      setUsername("");
      setSuccess("");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2">
            Wine Inventory Tracker
          </h1>
          <p className="text-base-content/70">
            Manage your wine inventory with ease
          </p>
        </div>

        {/* Main Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            {/* Login Form */}
            {!showCreateAccount && !showForgotPassword && (
              <>
                <h2 className="card-title text-2xl mb-4 justify-center text-gray-600">
                  Sign In
                </h2>
                
                {error && (
                  <div className="alert alert-error mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-medium">Username</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      className="input input-bordered w-full"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-medium">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="input input-bordered w-full"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control mb-6">
                    <button
                      type="submit"
                      className="btn btn-secondary w-full"
                    >
                      Sign In
                    </button>
                  </div>
                </form>

                <div className="divider">OR</div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="btn btn-outline w-full"
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
                    className="btn btn-ghost text-sm"
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title text-2xl">Create Account</h2>
                  <button
                    className="btn btn-sm btn-ghost"
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
                  <div className="alert alert-error mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleCreateAccount}>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-medium">Username</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Choose a username"
                      className="input input-bordered w-full"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-medium">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Choose a password (min. 6 characters)"
                      className="input input-bordered w-full"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="form-control mb-4">
                    <button type="submit" className="btn btn-primary w-full">
                      Create Account
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-link text-sm"
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title text-2xl">Forgot Password</h2>
                  <button
                    className="btn btn-sm btn-ghost"
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
                  <div className="alert alert-error mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{success}</span>
                  </div>
                )}

                <p className="text-sm text-base-content/70 mb-4">
                  Enter your username and we'll send you instructions to reset
                  your password.
                </p>

                <form onSubmit={handleForgotPassword}>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-medium">Username</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      className="input input-bordered w-full"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control mb-4">
                    <button type="submit" className="btn btn-primary w-full">
                      Send Reset Instructions
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-link text-sm"
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

        {/* Footer */}
        <p className="text-center text-sm text-base-content/60 mt-6">
          © 2025 Wine Inventory Tracker. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Landing;
