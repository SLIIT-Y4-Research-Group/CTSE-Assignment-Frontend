import axios from "axios";
import { getToken, isTokenExpired, clearToken } from "../auth/token.js";

const api = axios.create({
  baseURL: "http://event-system-alb-1954530717.ap-south-1.elb.amazonaws.com",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  }
);

export const apiGet = (url, config) => api.get(url, config);
export const apiPost = (url, data, config) => api.post(url, data, config);
export const apiPatch = (url, data, config) => api.patch(url, data, config);
export const apiDelete = (url, config) => api.delete(url, config);

export const ensureValidToken = () => {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired(token)) {
    clearToken();
    return false;
  }
  return true;
};

export default api;