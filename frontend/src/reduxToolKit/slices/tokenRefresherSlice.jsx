import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

export const fetchTokenRefresher = createAsyncThunk(
  "fetchTokenRefresher",
  async () => {
    try {
      const tokenRefresher = await axiosInstance.post(
        "/userApp/token/refresh/",
        {
          refresh,
        }
      );
      const { access } = tokenRefresher.data;

      localStorage.removeItem("access");
      localStorage.setItem("access", access);
      return tokenRefresher.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
);

const tokenRefresherSlice = createSlice({
  name: "tokenRefresher",
  initialState: {
    isLoading: false,
    userProfile: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenRefresher.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchTokenRefresher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tokenRefresher = action.payload;
      })
      .addCase(fetchTokenRefresher.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default tokenRefresherSlice.reducer;
