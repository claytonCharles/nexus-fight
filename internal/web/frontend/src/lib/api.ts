import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const csrfToken = document.cookie
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("csrf_token="));

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken.split("=").slice(1).join("=");
    }
  }

  return config;
});

export default api;
