import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "./Base_url";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState(null);
  const [error, setError] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("access"));

  const handleStorageChange = () => {
    setToken(localStorage.getItem("access"));
  };

  useEffect(() => {
    handleStorageChange();
  }, []);

  useEffect(() => {
    handleStorageChange();
    if (token) {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get("userApp/users/my_profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;

          setAuthInfo({
            user: data,
            access: token,
          });
        } catch (error) {
          setError({
            error: { message: "server is not responding" },
          });
        }
      };

      fetchData();
    }
  }, []);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
