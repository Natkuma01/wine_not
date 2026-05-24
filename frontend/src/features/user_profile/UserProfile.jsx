import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../app/api";
import { isSafeText, sanitizeString, isValidEmail } from "../../app/validators";

function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("staffs");
  const [emailInput, setEmailInput] = useState("");
  const [emailUpdateError, setEmailUpdateError] = useState("");
  const [emailUpdateSuccess, setEmailUpdateSuccess] = useState("");
  const [emailUpdating, setEmailUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const response = await api.get("/me/");
        setProfile(response.data);
      setEmailInput(response.data.email || "");
      } catch (err) {
        setFetchError("Unable to load user profile. Please sign in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    const cleanUsername = sanitizeString(newUsername);
    const cleanEmail = newEmail.trim();
    const cleanPassword = newPassword;

    if (!isSafeText(cleanUsername)) {
      setCreateError("Username may not contain invalid characters.");
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setCreateError("Please enter a valid email address.");
      return;
    }
    if (cleanPassword.length < 6) {
      setCreateError("Password must be at least 6 characters long.");
      return;
    }
    if (!["admin", "staffs"].includes(newRole)) {
      setCreateError("Role must be admin or staffs.");
      return;
    }

    try {
      await api.post("/register/", {
        username: cleanUsername,
        email: cleanEmail,
        password: cleanPassword,
        role: newRole,
      });
      setCreateSuccess("User created successfully.");
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("staffs");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setCreateError(
        typeof detail === "string"
          ? detail
          : "Unable to create user. Please check the form and try again."
      );
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setEmailUpdateError("");
    setEmailUpdateSuccess("");

    const cleanEmail = emailInput.trim();
    if (!isValidEmail(cleanEmail)) {
      setEmailUpdateError("Please enter a valid email address.");
      return;
    }

    setEmailUpdating(true);
    try {
      const response = await api.patch("/me/", { email: cleanEmail });
      setProfile(response.data);
      setEmailInput(response.data.email || "");
      setEmailUpdateSuccess("Email added successfully.");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setEmailUpdateError(
        typeof detail === "string"
          ? detail
          : "Failed to update email. Please try again."
      );
    } finally {
      setEmailUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto py-10 px-4 text-center text-red-600">
        <p>{fetchError}</p>
        <button
          type="button"
          className="btn btn-secondary mt-4"
          onClick={() => navigate("/")}
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Profile</h1>
            <p className="text-sm text-slate-500">Manage your account details.</p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/restaurants")}
          >
            Back to restaurants
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Username</p>
            <p className="mt-2 font-semibold text-lg">{profile.username}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
            {profile.email ? (
              <>
                <p className="mt-2 font-semibold text-lg">{profile.email}</p>
                <p className="mt-2 text-xs text-slate-500">Email cannot be changed once set.</p>
              </>
            ) : (
              <form onSubmit={handleEmailUpdate} className="space-y-3">
                {emailUpdateError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {emailUpdateError}
                  </div>
                )}
                {emailUpdateSuccess && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {emailUpdateSuccess}
                  </div>
                )}
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                />
                <button type="submit" className="btn btn-secondary w-full" disabled={emailUpdating}>
                  {emailUpdating ? "Saving..." : "Add email"}
                </button>
              </form>
            )}
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Role</p>
            <p className="mt-2 font-semibold text-lg capitalize">{profile.role}</p>
          </div>
        </div>

        {profile.role === "admin" ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Create New User</h2>
                <p className="text-sm text-slate-500">Admins can add staff and admin accounts here.</p>
              </div>
            </div>

            {createError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {createError}
              </div>
            )}
            {createSuccess && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {createSuccess}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="New user username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new.user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a secure password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Role</label>
                <select
                  className="select select-bordered w-full"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="staffs">Staffs</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button type="submit" className="btn btn-secondary w-full">
                Create user
              </button>
            </form>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-600">You do not have permission to create users.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
