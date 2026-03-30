import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

function setTokens({ access, refresh }) {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
  window.dispatchEvent(new Event("auth:tokens"));
}

let isRefreshing = false;
let refreshWaiters = [];

function enqueueRefreshWaiter(waiter) {
  refreshWaiters.push(waiter);
}

function resolveRefreshWaiters(error, accessToken) {
  const waiters = refreshWaiters;
  refreshWaiters = [];
  for (const waiter of waiters) waiter(error, accessToken);
}

instance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;
    const refresh = localStorage.getItem("refresh");

    if (!originalRequest || !refresh) return Promise.reject(error);
    if (status !== 401) return Promise.reject(error);
    if (typeof originalRequest.url === "string" && originalRequest.url.includes("/userApp/token/refresh/")) {
      return Promise.reject(error);
    }
    if (originalRequest._retry) return Promise.reject(error);

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        enqueueRefreshWaiter((waiterError, accessToken) => {
          if (waiterError || !accessToken) return reject(waiterError || error);
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          resolve(instance(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const response = await refreshClient.post("/userApp/token/refresh/", { refresh });
      const { access, refresh: nextRefresh } = response.data || {};

      if (!access) throw new Error("Token refresh did not return access token");
      setTokens({ access, refresh: nextRefresh });
      resolveRefreshWaiters(null, access);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${access}`;
      return instance(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      resolveRefreshWaiters(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
