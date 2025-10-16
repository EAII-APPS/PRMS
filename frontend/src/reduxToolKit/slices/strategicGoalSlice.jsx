import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch strategic gaol
export const fetchStrategicGoalData = createAsyncThunk(
  "fetchStrategicGoalData",
  async () => {
    try {
      const strategicGoalData = await axiosInistance.get(
        "/planApp/strategicGoals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return strategicGoalData.data;
    } catch (error) {
      // return error;
    }
  }
);

//delete selected strategic gaol
export const deleteSelectedStrategicGoalData = createAsyncThunk(
  "deleteSelectedStrategicGoalData",
  async (selectedId) => {
    try {
      await axiosInistance.delete(
        `/planApp/strategicGoals/${selectedId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return selectedId;
    } catch (error) {}
  }
);

//edit strategic gaol
export const editSelectedStrategicGoal = createAsyncThunk(
  "editSelectedStrategicGoal",
  async ({ nameEdit, yearEdit, weightEdit, editId }) => {
    try {
      await axiosInistance.put(
        `/planApp/strategicGoals/${editId}/`,
        {
          name: nameEdit,
          year: yearEdit,
          weight: weightEdit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { nameEdit, yearEdit, weightEdit, editId };
    } catch (error) {
      throw new Error(error.response.data.message);
      
    }
  }
);

//assign strategic gaol
export const assignStrategicGoal = createAsyncThunk(
  "assignStrategicGoal",
  async ({ selectedStrategicGoalId, assigned }) => {
    try {
      const res = await axiosInistance.put(
        `/planApp/assignGoal/`,
        {
          strategic_goal_id: selectedStrategicGoalId,
          sector_id: assigned,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { selectedStrategicGoalId, assigned };
    } catch (error) {}
  }
);

const strategicGoalSlice = createSlice({
  name: "strategicGoal",
  initialState: {
    isLoading: false,
    strategicGoalData: null,
    error: false,
    errorMessageSlice: null,
  },
  extraReducers: (builder) => {
    builder

      //fetch
      .addCase(fetchStrategicGoalData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchStrategicGoalData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessageSlice = false;
        state.strategicGoalData = action.payload;
      })
      .addCase(fetchStrategicGoalData.rejected, (state, action) => {
        state.error = true;
      })

      //edit strategic goal
      .addCase(editSelectedStrategicGoal.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessageSlice = false;
        state.error = false;
      })
      .addCase(editSelectedStrategicGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessageSlice = false;
        state.error = false;

        const { nameEdit, yearEdit, weightEdit, editId } = action.payload;

        const targetDivisionId = state.strategicGoalData.findIndex(
          (strategicGoalData) => strategicGoalData.id === editId
        );

        if (targetDivisionId !== -1) {
          state.strategicGoalData[targetDivisionId].name = nameEdit;

          state.strategicGoalData[targetDivisionId].year = yearEdit;

          state.strategicGoalData[targetDivisionId].weight = weightEdit;
        }
      })
      .addCase(editSelectedStrategicGoal.rejected, (state, action) => {
        state.error = true;
        state.errorMessageSlice = action.error.message;
      })

      //delete
      .addCase(deleteSelectedStrategicGoalData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedStrategicGoalData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessageSlice = false;
        state.strategicGoalData = state.strategicGoalData.filter(
          (items) => items.id !== action.payload
        );
      })
      .addCase(deleteSelectedStrategicGoalData.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default strategicGoalSlice.reducer;
