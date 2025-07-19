import axios from "axios";

// Create an axios instance with token from localStorage
const apiTestBankWithToken = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000', // fallback if not set
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include token
apiTestBankWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiTestBankWithToken;

// Add a response interceptor to handle 401 Unauthorized
apiTestBankWithToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
