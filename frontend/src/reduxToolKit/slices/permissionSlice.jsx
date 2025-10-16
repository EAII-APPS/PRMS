import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.1);

export const fetchPermissionData = createAsyncThunk(
  "fetchPermissionData",
  async () => {
    try {
      const permissionData = await axiosInstance.get("/roleApp/permissions/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return permissionData.data;
    } catch (error) {}
  }
);

const permissionSlice = createSlice({
  name: "permission",
  initialState: {
    isLoading: false,
    permissionData: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissionData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchPermissionData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permissionData = action.payload;
      })
      .addCase(fetchPermissionData.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default permissionSlice.reducer;
