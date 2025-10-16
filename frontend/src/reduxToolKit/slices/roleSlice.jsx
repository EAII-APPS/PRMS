import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.1);

//fetch role data
export const fetchRoleData = createAsyncThunk("fetchRoleData", async () => {
  try {
    const roleData = await axiosInstance.get("/roleApp/roles/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return roleData.data;
  } catch (error) {}
});

//delete role
export const deleteSelectedRoleData = createAsyncThunk(
  "deleteSelectedRoleData",
  async (selectedId) => {
    try {
      await axiosInstance.delete(`/roleApp/roles/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) {}
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState: {
    isLoading: false,
    roleData: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      //fetch role data
      .addCase(fetchRoleData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchRoleData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleData = action.payload;
      })
      .addCase(fetchRoleData.rejected, (state, action) => {
        state.error = true;
      })

      //delete role data
      .addCase(deleteSelectedRoleData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedRoleData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleData = state.roleData.filter(
          (role) => role.id !== action.payload
        );
      })
      .addCase(deleteSelectedRoleData.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default roleSlice.reducer;
