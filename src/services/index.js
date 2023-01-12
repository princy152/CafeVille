import axios from "axios";

let URL = "http://43.204.6.247:5000/api"; // Live API URL
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  URL = "http://localhost:5000/api"; // Development URL
  //  URL = 'http://43.204.6.247:5000/api';  // Live API URL
}

const Axios = () => {
  const AxiosInstance = axios.create({
    baseURL: URL,
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-auth-token": JSON.parse(localStorage.getItem("userToken")),
    },
  });
  AxiosInstance.interceptors.request.use(
    function (config) {
      config.headers["x-auth-token"] = JSON.parse(
        localStorage.getItem("userToken")
      );
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  AxiosInstance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        window.location.href = "http://localhost:3000/";
      }

      return Promise.reject(error);
    }
  );

  return AxiosInstance;
};

export default Axios();
