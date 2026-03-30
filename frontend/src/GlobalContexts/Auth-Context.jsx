import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "./Base_url";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setAuthInfo(null);
        return;
      }
      try {
        const response = await axiosInstance.get("userApp/users/my_profile");
        if (cancelled) return;
        setAuthInfo({ user: response.data, access: token });
      } catch (e) {
        if (cancelled) return;
        setError({ error: { message: "server is not responding" } });
      }
    };

    const onTokens = () => fetchProfile();

    window.addEventListener("auth:tokens", onTokens);
    fetchProfile();

    return () => {
      cancelled = true;
      window.removeEventListener("auth:tokens", onTokens);
    };
  }, []);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
