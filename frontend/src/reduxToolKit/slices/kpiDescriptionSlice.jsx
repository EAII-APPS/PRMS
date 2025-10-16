import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch kpi description
export const fetchKpiDescriptionData = createAsyncThunk(
  "fetchKpiDescriptionData",
  async () => {
    try {
      const kpiDescriptionData = await axiosInistance.get(
        "/reportApp/kpidescription/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return kpiDescriptionData.data;
    } catch (error) {}
  }
);

//delete selected measure
export const deleteSelectedKpiDescriptionData = createAsyncThunk(
  "deleteSelectedKpiDescriptionData",
  async (selectedId) => {
    try {
      await axiosInistance.delete(`/reportApp/kpidescription/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) {}
  }
);

//edit measure
export const editSelectedKpiDescriptionData = createAsyncThunk(
  "editSelectedKpiDescriptionData",
  async ({ editmeasure, edittype, selectedEditId }) => {
    try {
      await axiosInistance.put(
        `/reportApp/kpidescription/${selectedEditId}/`,
        {
          name: editmeasure,
          type: edittype,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { editmeasure, edittype, selectedEditId };
    } catch (error) {}
  }
);

const kpiDescriptionSlice = createSlice({
  name: "kpiDescription",
  initialState: {
    isLoading: false,
    kpiDescriptionData: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder

      //fetch
      .addCase(fetchKpiDescriptionData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchKpiDescriptionData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpiDescriptionData = action.payload;
      })
      .addCase(fetchKpiDescriptionData.rejected, (state, action) => {
        state.error = true;
      })

      //edit
      .addCase(editSelectedKpiDescriptionData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editSelectedKpiDescriptionData.fulfilled, (state, action) => {
        state.isLoading = false;

        const { editmeasure, edittype, selectedEditId } = action.payload;
        const targetMeasureIndex = state.measureData.findIndex(
          (measureData) => measureData.id === selectedEditId
        );
        if (targetMeasureIndex !== -1) {
          state.measureData[targetMeasureIndex].name = editmeasure;
          state.measureData[targetMeasureIndex].type = edittype;
        }
      })
      .addCase(editSelectedKpiDescriptionData.rejected, (state, action) => {
        state.error = true;
      })

      //delete
      .addCase(deleteSelectedKpiDescriptionData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedKpiDescriptionData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpiDescriptionData = state.kpiDescriptionData.filter(
          (items) => items.id !== action.payload
        );
      })
      .addCase(deleteSelectedKpiDescriptionData.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default kpiDescriptionSlice.reducer;
