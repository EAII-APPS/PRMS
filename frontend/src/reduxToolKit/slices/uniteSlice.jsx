import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch unit data
export const fetchUniteData = createAsyncThunk("fetchUniteData", async () => {
  try {
    const uniteData = await axiosInistance.get("reportApp/units/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return uniteData.data;
  } catch (error) {}
});

//delete unite measure
export const deleteSelectedUniteData = createAsyncThunk(
  "deleteSelectedUniteData",
  async (selectedId) => {
    try {
      await axiosInistance.delete(`reportApp/units/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) {}
  }
);

//edit unite
export const editSelectedUnite = createAsyncThunk(
  "editSelectedUnite",
  async ({
    editnuite,
    editmeasure,
    editsymbol,
    editconversionfactor,
    editisBaseUnit,
    selectedEditId,
  }) => {
    try {
      await axiosInistance.put(
        `reportApp/units/${selectedEditId}/`,
        {
          name: editnuite,
          measure_id: editmeasure,
          symbol: editsymbol,
          conversionFactor: editconversionfactor,
          isBaseUnit: editisBaseUnit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        editnuite,
        editmeasure,
        editsymbol,
        editconversionfactor,
        editisBaseUnit,
        selectedEditId,
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to edit unit");
    }
  }
);

const uniteSlice = createSlice({
    name: "unite",
    initialState: {
      isLoading: false,
      uniteData: [],
      error: null,
    },
    extraReducers: (builder) => {
      builder
        // Fetch Unite Data
        .addCase(fetchUniteData.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchUniteData.fulfilled, (state, action) => {
          state.isLoading = false;
          state.uniteData = action.payload;
        })
        .addCase(fetchUniteData.rejected, (state, action) => {
          state.error = action.error.message;
          state.isLoading = false;
        })
  
        // Edit Unite Data
        .addCase(editSelectedUnite.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(editSelectedUnite.fulfilled, (state, action) => {
          state.isLoading = false;
          const {
            editnuite,
            editmeasure,
            editsymbol,
            editconversionfactor,
            editisBaseUnit,
            selectedEditId,
          } = action.payload;
  
          const targetUniteIndex = state.uniteData?.findIndex(
            (uniteData) => uniteData.id === selectedEditId
          );
  
          if (targetUniteIndex !== -1) {
            const updatedUnite = {
              ...state.uniteData[targetUniteIndex],
              name: editnuite,
              measure_id: editmeasure,
              symbol: editsymbol,
              conversionFactor: editconversionfactor,
              isBaseUnit: editisBaseUnit,
            };
  
            state.uniteData[targetUniteIndex] = updatedUnite;
          } else {
            console.error("Unit not found during edit.");
          }
        })
        .addCase(editSelectedUnite.rejected, (state, action) => {
          state.error = action.error.message;
          state.isLoading = false;
        })
  
        // Delete Unite Data
        .addCase(deleteSelectedUniteData.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteSelectedUniteData.fulfilled, (state, action) => {
          state.isLoading = false;
          state.uniteData = state.uniteData.filter(
            (item) => item.id !== action.payload
          );
        })
        .addCase(deleteSelectedUniteData.rejected, (state, action) => {
          state.error = action.error.message;
          state.isLoading = false;
        });
    },
  });
  
  export default uniteSlice.reducer;
  