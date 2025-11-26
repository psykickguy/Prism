import axios from "axios";

// Use Vite env lookup (import.meta.env). NOT process.env
const API_BASE = import.meta.env.VITE_API_BASE || ""; // empty string -> same origin

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach token centrally (if you use auth)
api.interceptors.request.use((cfg) => {
  try {
    const token = localStorage.getItem("token"); // adjust if you use another store
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return cfg;
});

// Response interceptor: central error handling (optional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // You can handle global errors here (401 refresh, logging)
    return Promise.reject(err);
  }
);

export default api;
