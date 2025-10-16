import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch division data
export const fetchDivisionData = createAsyncThunk(
  "fetchDivisionData",
  async () => {
    try {
      const divisionData = await axiosInistance.get("/userApp/division/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return divisionData.data;
    } catch (error) {
    }
  }
);

//delete
export const deleteSelectedDivisionData = createAsyncThunk(
  "deleteSelectedDivisionData",
  async (selectedId) => {
    try {
      await axiosInistance.delete(`/userApp/division/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) {
    }
  }
);

//edit
export const editSelectedDivisionData = createAsyncThunk(
  "editSelectedDivisionData",
  async ({ editName, editSector, editPhone, editEmail, editDivisionId }) => {
    try {
      await axiosInistance.put(
        `/userApp/division/${editDivisionId}/`,
        {
          name: editName,
          phone_no: editPhone,
          email: editEmail,
          sector: editSector,
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
        editSector,
        editDivisionId,
      };
    } catch (error) {
      console.error("Error while deleting data:", error);
    }
  }
);

const divisionSlice = createSlice({
  name: "division",
  initialState: {
    isLoading: false,
    divisionData: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      //fetch
      .addCase(fetchDivisionData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchDivisionData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.divisionData = action.payload;
      })
      .addCase(fetchDivisionData.rejected, (state, action) => {
        state.error = true;
      })

      //delete
      .addCase(deleteSelectedDivisionData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedDivisionData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.divisionData = state.divisionData.filter(
          (items) => items.id !== action.payload
        );
      })
      .addCase(deleteSelectedDivisionData.rejected, (state, action) => {
        state.error = true;
      })

      //edit
      .addCase(editSelectedDivisionData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editSelectedDivisionData.fulfilled, (state, action) => {
        state.isLoading = false;
        const { editName, editPhone, editEmail, editSector, editDivisionId } =
          action.payload;
        const targetDivisionId = state.divisionData.findIndex(
          (divisionData) => divisionData.id === editDivisionId
        );
        if (targetDivisionId !== -1) {
          state.divisionData[targetDivisionId].sector = editSector;
          state.divisionData[targetDivisionId].name = editName;
          state.divisionData[targetDivisionId].phone_no = editPhone;
          state.divisionData[targetDivisionId].email = editEmail;
        }
      })
      .addCase(editSelectedDivisionData.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default divisionSlice.reducer;
