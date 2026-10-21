import axios from "axios";
import { handleChangeLoader } from "./store/slices/loaderSlice.js";
import { Store } from "./store/Store.js";
declare module "axios" {
  interface AxiosRequestConfig { skipGlobalLoader?: boolean }
}


const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://kashly.runasp.net",
  // timeout:3000,
  // params:{
  //   limit:20
  // }
})

instance.interceptors.request.use((config)=>{
  if (!config.skipGlobalLoader) Store.dispatch(handleChangeLoader(true));
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config
},(error)=>{
    if (!error?.config?.skipGlobalLoader) Store.dispatch(handleChangeLoader(false));
    const status = error?.response?.status;
    if (status === 400) {
      console.error("Bad Request:", error.response.data?.message || error.message);
    } else if (status === 401) {
      console.warn("Unauthorized — redirecting to login.");
      window.location.href = "/login";
    } else if (status === 403) {
      console.warn("Forbidden — you don’t have access.");
    } else if (status === 404) {
      console.warn("Not Found:", error.response.data?.message || "Resource not found.");
    } else if (status >= 500) {
      console.error("Server error:", error.response.data?.message || "Internal Server Error");
    } else {
      console.error("Unhandled error:", error.message);
    }
    return Promise.reject(error);
  }
)
instance.interceptors.response.use((config)=>{
  if (!config.config.skipGlobalLoader) Store.dispatch(handleChangeLoader(false));
  return config
},(error)=>{
    if (!error?.config?.skipGlobalLoader) Store.dispatch(handleChangeLoader(false));
    const status = error?.response?.status;
    if (status === 400) {
      console.error("Bad Request:", error.response.data?.message || error.message);
    } else if (status === 401) {
      console.warn("Unauthorized — redirecting to login.");
      window.location.href = "/login";
    } else if (status === 403) {
      console.warn("Forbidden — you don’t have access.");
    } else if (status === 404) {
      console.warn("Not Found:", error.response.data?.message || "Resource not found.");
    } else if (status >= 500) {
      console.error("Server error:", error.response.data?.message || "Internal Server Error");
    } else {
      console.error("Unhandled error:", error.message);
    }
    return Promise.reject(error);
  }
)
export default instance
