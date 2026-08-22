import axios from "axios";

const rawApiBase = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");
const API_BASE = rawApiBase.endsWith("/api")
  ? rawApiBase
  : `${rawApiBase}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});
function getApiErrorMessage(error) {
  if (error.response) {
    const { data } = error.response;
    if (typeof data === "string") {
      return data;
    }
    if (data) {
      if (typeof data.message === "string") return data.message;
      if (typeof data.detail === "string") return data.detail;
      if (Array.isArray(data.non_field_errors)) return data.non_field_errors.join(" ");
      if (typeof data.error === "string") return data.error;
    }
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred.";
}
// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear tokens and send user to landing (e.g. token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/";
    }
    error.userMessage = getApiErrorMessage(error);
    return Promise.reject(error);
  }
);

export { getApiErrorMessage };
export default api;
