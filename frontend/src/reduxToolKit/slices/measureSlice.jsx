import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch measure data
export const fetchMeasureData = createAsyncThunk(
  "fetchMeasureData",
  async () => {
    try {
      const measureData = await axiosInistance.get("reportApp/measure/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return measureData.data;
      
    } catch (error) {}
  }
);

//delete selected measure
export const deleteSelectedMeasureData = createAsyncThunk(
  "deleteSelectedMeasureData",
  async (selectedId) => {
    try {
      await axiosInistance.delete(`reportApp/measure/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) {}
  }
);

//edit measure
export const editSelectedMeasure = createAsyncThunk(
  "editSelectedMeasure",
  async ({ editmeasure, selectedEditId }) => {
    try {
      await axiosInistance.put(
        `reportApp/measure/${selectedEditId}/`,
        {
          name: editmeasure,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { editmeasure, selectedEditId };
    } catch (error) {}
  }
);

const measureSlice = createSlice({
  name: "measure",
  initialState: {
    isLoading: false,
    measureData: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder

      //fetch
      .addCase(fetchMeasureData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchMeasureData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.measureData = action.payload;
      })
      .addCase(fetchMeasureData.rejected, (state, action) => {
        state.error = true;
      })

      //edit
      .addCase(editSelectedMeasure.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editSelectedMeasure.fulfilled, (state, action) => {
        state.isLoading = false;

        const { editmeasure, selectedEditId } = action.payload;
        const targetMeasureIndex = state.measureData.findIndex(
          (measureData) => measureData.id === selectedEditId
        );
        if (targetMeasureIndex !== -1) {
          state.measureData[targetMeasureIndex].name = editmeasure;
        }
      })
      .addCase(editSelectedMeasure.rejected, (state, action) => {
        state.error = true;
      })

      //delete
      .addCase(deleteSelectedMeasureData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedMeasureData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.measureData = state.measureData.filter(
          (items) => items.id !== action.payload
        );
      })
      .addCase(deleteSelectedMeasureData.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default measureSlice.reducer;
