import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
  xsrfCookieName: "csrf_token",
  xsrfHeaderName: "X-CSRF-Token",
  headers: {
    "Content-Type": "application/json",
  },
});


export default api;
