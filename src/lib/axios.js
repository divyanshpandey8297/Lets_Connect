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


import axios from "axios";

// export const axiosInstance = axios.create({
  // baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
//   withCredentials: true,
// });


export const axiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});
// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL 
//     ? `${import.meta.env.VITE_API_URL}/api/v1`
//     : import.meta.env.MODE === "development"
//       ? "http://localhost:4200/api/v1"
//       : "/api/v1",
//   withCredentials: true,
// });