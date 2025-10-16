import { useCallback } from "react";
import { useAuth } from "../../GlobalContexts/Auth-Context";
import axiosInstance from "../../GlobalContexts/Base_url";

const useApi = () => {
  const authInfo = useAuth();

  const get = useCallback(
    async (url) => {
      try {
        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${authInfo?.access}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    [authInfo]
  );

  const post = useCallback(
    async (url, data) => {
      try {
        const response = await axiosInstance.post(url, data, {
          headers: {
            Authorization: `Bearer ${authInfo?.access}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error posting data:", error);
        throw error;
      }
    },
    [authInfo]
  );

  const put = useCallback(
    async (url, data) => {
      try {
        const response = await axiosInstance.put(url, data, {
          headers: {
            Authorization: `Bearer ${authInfo?.access}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error updating data:", error);
        throw error;
      }
    },
    [authInfo]
  );

  const del = useCallback(
    async (url) => {
      try {
        const response = await axiosInstance.delete(url, {
          headers: {
            Authorization: `Bearer ${authInfo?.access}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting data:", error);
        throw error;
      }
    },
    [authInfo]
  );

  const getUserId = useCallback(() => {
    try {
      return authInfo.user.id;
    } catch (error) {
      console.error("Error fetching user ID from authInfo:", error);
      throw error;
    }
  }, [authInfo]);

  return { get, post, put, del, getUserId };
};

export default useApi;
