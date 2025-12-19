import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch main goal
export const fetchMainGoalData = createAsyncThunk(
  "fetchMainGoalData",
  async () => {
    try {
      const mainGoalData = await axiosInistance.get("/planApp/mainGoals/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return mainGoalData.data;
    } catch (error) {}
  }
);

//delete selected main gaol
export const deleteSelectedMainGoalData = createAsyncThunk(
  "deleteSelectedMainGoalData",
  async (selectedId) => {
    try {
      await axiosInistance.delete(`/planApp/maingoal/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) {}
  }
);
//assign main gaol
export const assignMainGoal = createAsyncThunk(
  "assignMainGoal",
  async ({ selectedMainGoalId, assigned }, { rejectWithValue }) => {
    try {
      const res = await axiosInistance.put(
        `/planApp/assignMainGoal/`,
        {
          main_goal_id: selectedMainGoalId,
          sector_id: assigned,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { selectedMainGoalId, assigned };
    } catch (error) {
      // Extract and handle the error message
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

//edit main gaol
export const editSelectedMainGoal = createAsyncThunk(
  "editSelectedMainGoal",
  async ({ editName, editStrategicGoalId, editWeight,editexpectedoutcome, editId }) => {
    try {
      await axiosInistance.put(
        `/planApp/updateMainGoal/${editId}/`,
        {
          name: editName,
          strategic_goal_id: editStrategicGoalId,
          weight: editWeight,
          expected_outcome:editexpectedoutcome,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { editName, editStrategicGoalId, editWeight,editexpectedoutcome, editId };
    } catch (error) {}
  }
);

const mainGoalSlice = createSlice({
  name: "mainGoal",
  initialState: {
    isLoading: false,
    mainGoalData: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      //fetch data
      .addCase(fetchMainGoalData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchMainGoalData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mainGoalData = action.payload;
      })
      .addCase(fetchMainGoalData.rejected, (state, action) => {
        state.error = true;
      })

      //edit
      .addCase(editSelectedMainGoal.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editSelectedMainGoal.fulfilled, (state, action) => {
        state.isLoading = false;

        const { editName, editStrategicGoalId, editWeight, editId } =
          action.payload;

        const targetDivisionId = state.mainGoalData.findIndex(
          (mainGoalData) => mainGoalData.id === editId
        );

        if (targetDivisionId !== -1) {
          state.mainGoalData[targetDivisionId].name = editName;

          state.mainGoalData[targetDivisionId].strategic_goal_id =
            editStrategicGoalId;

          state.mainGoalData[targetDivisionId].weight = editWeight;
        }
      })

      .addCase(editSelectedMainGoal.rejected, (state, action) => {
        state.error = true;
      })

      //delete
      .addCase(deleteSelectedMainGoalData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedMainGoalData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mainGoalData = state.mainGoalData.filter(
          (items) => items.id !== action.payload
        );
      })
      .addCase(deleteSelectedMainGoalData.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default mainGoalSlice.reducer;
