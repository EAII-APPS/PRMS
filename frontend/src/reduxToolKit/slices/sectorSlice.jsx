import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch sector data
export const fetchSectorgData = createAsyncThunk(
  "fetchSectorgData",
  async () => {
    try {
      const sectorData = await axiosInistance.get("/userApp/sector/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return sectorData.data;
    } catch (error) {}
  }
);

//delete
export const deleteSelectedSectorData = createAsyncThunk(
  "deleteSelectedSectorData",
  async (selectedId) => {
    try {
      await axiosInistance.delete(`/userApp/sector/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) {}
  }
);

//edit
export const editSelectedSectorData = createAsyncThunk(
  "editSelectedSectorData",
  async ({ editName, editPhone, editEmail, editSectorId }) => {
    try {
      await axiosInistance.put(
        `/userApp/sector/${editSectorId}/`,
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
      return { editName, editPhone, editEmail, editSectorId };
    } catch (error) {}
  }
);

const sectorSlice = createSlice({
  name: "sector",
  initialState: {
    isLoading: false,
    sectorData: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      //fetch sector data
      .addCase(fetchSectorgData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchSectorgData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sectorData = action.payload;
      })
      .addCase(fetchSectorgData.rejected, (state, action) => {
        state.error = true;
      })

      //delete
      .addCase(deleteSelectedSectorData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedSectorData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sectorData = state.sectorData.filter(
          (items) => items.id !== action.payload
        );
      })
      .addCase(deleteSelectedSectorData.rejected, (state, action) => {
        state.error = true;
      })

      //edit
      .addCase(editSelectedSectorData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editSelectedSectorData.fulfilled, (state, action) => {
        state.isLoading = false;
        const { editName, editPhone, editEmail, editSectorId } = action.payload;
        const targetSectorId = state.sectorData.findIndex(
          (sectorData) => sectorData.id === editSectorId
        );
        if (targetSectorId !== -1) {
          state.sectorData[targetSectorId].name = editName;
          state.sectorData[targetSectorId].phone_no = editPhone;
          state.sectorData[targetSectorId].email = editEmail;
        }
      })
      .addCase(editSelectedSectorData.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default sectorSlice.reducer;
