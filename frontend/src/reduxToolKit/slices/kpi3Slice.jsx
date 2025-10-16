import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch kpi
export const fetchKpi3Data = createAsyncThunk("fetchKpi3Data", async () => {
  try {
    const kpi3Data = await axiosInistance.get("/planApp/threeKPI", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return kpi3Data.data;
  } catch (error) { }
});

//delete selected kpi
export const deleteSelectedKpi3Data = createAsyncThunk(
  "deleteSelectedKpi3Data",
  async (selectedId) => {
    try {
      await axiosInistance.delete(`/planApp/threeKPI/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) { }
  }
);

//edit kpi
export const editSelectedKpi3 = createAsyncThunk(
  "editSelectedKpi3",

  async ({
    editId,
    kpi,
    measure,
    year_one,
    year_one_value,
    year_one_unit,
    year_two,
    year_two_value,
    year_two_unit,
    year_three,
    year_three_value,
    year_three_unit,
    initial,
    initial_unit_id,
    three_year,
    three_year_unit_id,
    division_id,
    operation
  }) => {
    try {

      await axiosInistance.put(
        `/planApp/threeKPI/${editId}/`,
        {
          kpi,
          measure,
          year_one,
          year_one_value,
          year_one_unit,
          year_two,
          year_two_value,
          year_two_unit,
          year_three,
          year_three_value,
          year_three_unit,
          division_id,
          initial,
          initial_unit_id,
          three_year,
          three_year_unit_id,
          operation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {

        kpi,
          measure,
          year_one,
          year_one_value,
          year_one_unit,
          year_two,
          year_two_value,
          year_two_unit,
          year_three,
          year_three_value,
          year_three_unit,
          division_id,
          initial,
          initial_unit_id,
          three_year,
          three_year_unit_id,
          operation
      };
    } catch (error) {
      console.error("Error edit data:", error);
      return { error };
    }
  }
);
export const assignThreeKpi = createAsyncThunk(
  "assignKpi3",
  async ({ selectedKpiId, assigned }) => {
    try {
      const res = await axiosInistance.put(
        `/planApp/assignkpi3/`,
        {
          kpi: selectedKpiId,
          division_id: assigned,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { selectedKpiId, assigned };
    } catch (error) { }
  }
);
const kpi3Slice = createSlice({
  name: "kpi3",
  initialState: {
    isLoading: false,
    kpi3Data: [],
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpi3Data.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchKpi3Data.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpi3Data = action.payload;
      })
      .addCase(fetchKpi3Data.rejected, (state, action) => {
        state.error = true;
      })

      //edit
      .addCase(editSelectedKpi3.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editSelectedKpi3.fulfilled, (state, action) => {
        state.isLoading = false;

        const {
          divisionEditId,
          mainGoalIdEdit,
          kpiEdit,
          initialEdit,
          annual_planEdit,
          firstQuarterPlanEdit,
          secondQuarterPlanEdit,
          thirdQuarterPlanEdit,
          fourthQuarterPlanEdit,
          measureEdit,
          weightEdit,
          editId,
          operationsEdit,
        } = action.payload;

        const targetDivisionId = state.kpi3Data.findIndex(
          (kpi3Data) => kpi3Data.id === editId
        );
        if (targetDivisionId !== -1) {
          state.kpi3Data[targetDivisionId].division_id = divisionEditId;

          state.kpi3Data[targetDivisionId].name = kpiEdit;

          state.kpi3Data[targetDivisionId].main_goal_id = mainGoalIdEdit;

          state.kpi3Data[targetDivisionId].annual_plan = annual_planEdit;

          state.kpi3Data[targetDivisionId].first_quarter_plan =
            firstQuarterPlanEdit;

          state.kpi3Data[targetDivisionId].second_quarter_plan =
            secondQuarterPlanEdit;

          state.kpi3Data[targetDivisionId].third_quarter_plan =
            thirdQuarterPlanEdit;

          state.kpi3Data[targetDivisionId].fourth_quarter_plan =
            fourthQuarterPlanEdit;

          state.kpi3Data[targetDivisionId].weight = weightEdit;

          state.kpi3Data[targetDivisionId].measure_id = measureEdit;

          state.kpi3Data[targetDivisionId].initial = initialEdit;
        }
      })
      .addCase(editSelectedKpi3.rejected, (state, action) => {
        state.error = true;
      })

      //delete
      .addCase(deleteSelectedKpi3Data.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedKpi3Data.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpi3Data = state.kpi3Data.filter(
          (items) => items.id !== action.payload
        );
      })
      .addCase(deleteSelectedKpi3Data.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default kpi3Slice.reducer;
