import axios from "axios";
import router from "../router";
const axiosInstance = axios.create({
  baseURL: (localStorage.getItem('BASE_URL') || process.env.VUE_APP_BASE_URL || "http://192.168.1.10:1000/"),
  timeout: 60000,
  withCredentials: true,
  credentials: 'include',
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response || {};
  },
  async function (error) {
    const statusCode = (error.response || {}).status || -1;
    if (statusCode == 502 || statusCode == 405 || statusCode == 403 || statusCode == 401 || statusCode <= 0) {
      localStorage.removeItem("session");
      router.push({ name: "login" });
    return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
