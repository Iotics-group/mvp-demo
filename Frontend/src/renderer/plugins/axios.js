import axios from "axios";
import router from "../router";
import { sessionCreate, sessionParse } from "../events/crypto";
const axiosInstance = axios.create({
  baseURL: (localStorage.getItem('BASE_URL') || process.env.VUE_APP_BASE_URL || "http://192.168.1.10:1000/"),
  timeout: 600000,
  withCredentials: true,
  credentials: 'include',
});
axiosInstance.interceptors.request.use(
  (config) => {
    if(localStorage.getItem('session')){
      config.headers["session"] = sessionCreate(sessionParse(localStorage.getItem('session'),'123456789mnhgdfvdxasfgm'),'123456789mnhgdfvdxasfgm')
    }
    return config
  },

  (error) => {
      return Promise.resolve(error)
  }
)

axiosInstance.interceptors.response.use(
  function (response) {
    return response || {};
  },
  async function (error) {
    const statusCode = (error.response || {}).status || -1;
    if (statusCode == 502 || statusCode == 405 || statusCode == 403 || statusCode == 401 || statusCode == 0 || statusCode == -1) {
      localStorage.removeItem("session");
      router.push({ name: "login" });
    return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
