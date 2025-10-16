import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch monitoring data
export const fetchMonitoringData = createAsyncThunk(
  "fetchMonitoringData",
  async () => {
    try {
      const monitoringData = await axiosInistance.get("/userApp/monitoring/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return monitoringData.data;
    } catch (error) {}
  }
);

//delete monitoring
export const deleteSelectedMonitoringData = createAsyncThunk(
  "deleteSelectedMonitoringData",
  async (selectedId) => {
    try {
      await axiosInistance.delete(`/userApp/monitoring/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) {}
  }
);

//edit monioring data
export const editSelectedMonitoringData = createAsyncThunk(
  "editSelectedMonitoringData",
  async ({ editName, editPhone, editEmail, editMonitoringId }) => {
    try {
      await axiosInistance.put(
        `/userApp/monitoring/${editMonitoringId}/`,
        {
          name: editName,
          phone_no: editPhone,
          email: editEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        editName,
        editPhone,
        editEmail,
        editMonitoringId,
      };
    } catch (error) {
      console.error("Error while editing data:", error);
    }
  }
);

const monitoringSlice = createSlice({
  name: "monitoring",
  initialState: {
    isLoading: false,
    monitoringData: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      //fetch monitoring data
      .addCase(fetchMonitoringData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchMonitoringData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.monitoringData = action.payload;
      })
      .addCase(fetchMonitoringData.rejected, (state, action) => {
        state.error = true;
      })

      //delete monitoring data
      .addCase(deleteSelectedMonitoringData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedMonitoringData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.monitoringData = state.monitoringData.filter(
          (items) => items.id !== action.payload
        );
      })
      .addCase(deleteSelectedMonitoringData.rejected, (state, action) => {
        state.error = true;
      })

      //edit selected monitoring data
      .addCase(editSelectedMonitoringData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editSelectedMonitoringData.fulfilled, (state, action) => {
        state.isLoading = false;
        const { editName, editPhone, editEmail, editMonitoringId } =
          action.payload;
        const targetMonitoringId = state.monitoringData.findIndex(
          (monitoringData) => monitoringData.id === editMonitoringId
        );
        if (targetMonitoringId !== -1) {
          state.monitoringData[targetMonitoringId].name = editName;
          state.monitoringData[targetMonitoringId].phone_no = editPhone;
          state.monitoringData[targetMonitoringId].email = editEmail;
        }
      })

      .addCase(editSelectedMonitoringData.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default monitoringSlice.reducer;
