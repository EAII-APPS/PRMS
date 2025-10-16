import React, { useEffect, useState } from "react";
import axiosInstance from "../GlobalContexts/Base_url";

const TokenRefresher = () => {
  const refresh = localStorage.getItem("refresh");

  const fetchNewAccessToken = async () => {
    try {
      const response = await axiosInstance.post("/userApp/token/refresh/", {
        refresh,
      });
      const { access } = response.data;
      localStorage.removeItem("access");

      localStorage.setItem("access", access);
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };
  useEffect(() => {
    fetchNewAccessToken();

    const intervalId = setInterval(fetchNewAccessToken, 900000);

    return () => clearInterval(intervalId);
  }, []);
};
export default TokenRefresher;
