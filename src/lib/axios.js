// import axios from "axios";

// export const axiosInstance=axios.create({
//     baseURL: import.meta.env.MODE ==="development"
//     ? "http://localhost:4200/api/v1"
//     :"/api/v1",
//     withCredentials:true,

// });



// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
//   withCredentials: true,
// });

// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
//   withCredentials: true,
// });

// import axios from "axios";

// // 🔍 Debug (remove after it works)
// console.log("MODE:", import.meta.env.MODE);
// console.log("API URL:", import.meta.env.VITE_API_URL);

// export const axiosInstance = axios.create({
//   baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
//   withCredentials: true,
// });


// import axios from "axios";

// // Backend API: use env in build, or fallback to Render so requests never hit Vercel
// const apiBase =
//   import.meta.env.VITE_API_URL ||
//   "https://lets-connect-iru9.onrender.com";

// export const axiosInstance = axios.create({
//   baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
//   withCredentials: true,
// });



// src/lib/axios.js
import axios from "axios";

const RENDER_API = "https://lets-connect-iru9.onrender.com";
const apiBase = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL || "http://localhost:4200")
  : RENDER_API;

export const axiosInstance = axios.create({
  baseURL: `${apiBase}/api/v1`,
  withCredentials: true, // fine to leave; header is what matters now
});

// Attach Authorization header if token exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});







// export const axiosInstance = axios.create({
//   baseURL: "/api/v1",
//   withCredentials: true,
// });
// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL 
//     ? `${import.meta.env.VITE_API_URL}/api/v1`
//     : import.meta.env.MODE === "development"
//       ? "http://localhost:4200/api/v1"
//       : "/api/v1",
//   withCredentials: true,
// });