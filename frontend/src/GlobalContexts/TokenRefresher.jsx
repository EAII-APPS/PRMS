import React, { useEffect, useRef } from "react";
import axiosInstance from "../GlobalContexts/Base_url";

const TokenRefresher = () => {
  const timeoutRef = useRef(null);

  const decodeJwtPayload = (token) => {
    try {
      const [, payload] = token.split(".");
      if (!payload) return null;
      const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(padded)
          .split("")
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join("")
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const fetchNewAccessToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) return null;

      const response = await axiosInstance.post("/userApp/token/refresh/", { refresh });
      const { access, refresh: nextRefresh } = response.data || {};
      if (access) localStorage.setItem("access", access);
      if (nextRefresh) localStorage.setItem("refresh", nextRefresh);
      window.dispatchEvent(new Event("auth:tokens"));
      return access || null;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  const scheduleNext = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    const access = localStorage.getItem("access");
    const payload = access ? decodeJwtPayload(access) : null;
    const expMs = payload?.exp ? payload.exp * 1000 : null;
    const now = Date.now();

    // Refresh ~60s before expiry; fallback every 4 minutes.
    const delayMs = expMs ? Math.max(10_000, expMs - now - 60_000) : 240_000;

    timeoutRef.current = window.setTimeout(async () => {
      await fetchNewAccessToken();
      scheduleNext();
    }, delayMs);
  };

  useEffect(() => {
    const onTokenUpdate = () => scheduleNext();
    const onFocus = async () => {
      // If the user is active again, refresh once (if needed) and reschedule.
      await fetchNewAccessToken();
      scheduleNext();
    };
    const onVisibilityChange = async () => {
      if (document.visibilityState !== "visible") return;
      await fetchNewAccessToken();
      scheduleNext();
    };

    window.addEventListener("auth:tokens", onTokenUpdate);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    scheduleNext();

    return () => {
      window.removeEventListener("auth:tokens", onTokenUpdate);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return null;
};
export default TokenRefresher;
