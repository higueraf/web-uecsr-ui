import axios from "axios";
import { getToken, clearToken } from "@/utils/storage";
import { useLoadingStore } from "@/store/loadingStore";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let pending = 0;

const start = () => {
  pending++;
  useLoadingStore.getState().startLoading();
};

const stop = () => {
  pending--;
  if (pending <= 0) {
    useLoadingStore.getState().stopLoading();
    pending = 0;
  }
};

apiClient.interceptors.request.use(
  (config) => {
    start();

    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    stop();
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    stop();
    return response;
  },
  (error) => {
    stop();

    if (error?.response?.status === 401) {
      clearToken();
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export { apiClient };
