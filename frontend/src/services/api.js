import axios from "axios";

// 🌐 Automatically switch between your live Render backend and your local setup
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

export default API;