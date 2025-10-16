import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);
const currentYear = new Date().getFullYear();

const currentYearGC = new Date().getFullYear(); 
const currentMonthGC = new Date().getMonth() + 1; 
const ethiopianYear = currentYearGC - 7 - (currentMonthGC < 9 ? 1 : 0);


//fetch kpi
export const fetchKpiData = createAsyncThunk("fetchKpiData", async () => {
  try {
    const kpiData = await axiosInistance.get("/planApp/annualKPI", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        year: ethiopianYear,
      },
    });
    return kpiData.data;
  } catch (error) {}
});

//delete selected kpi
export const deleteSelectedKpiData = createAsyncThunk(
  "deleteSelectedKpiData",
  async (selectedId) => {
    try {
      await axiosInistance.delete(`/planApp/annualKPI/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) {}
  }
);

//edit kpi
export const editSelectedKpi = createAsyncThunk(
  "editSelectedKpi",
  async ({
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
  }) => {
    try {
      await axiosInistance.put(
        `/planApp/annualKPI/${editId}/`,
        {
          division_id: divisionEditId,
          name: kpiEdit,
          main_goal_id: mainGoalIdEdit,
          initial: initialEdit,
          annual_plan: annual_planEdit,
          first_quarter_plan: firstQuarterPlanEdit,
          second_quarter_plan: secondQuarterPlanEdit,
          third_quarter_plan: thirdQuarterPlanEdit,
          fourth_quarter_plan: fourthQuarterPlanEdit,
          measure_id: measureEdit,
          weight: weightEdit,
          operation : operationsEdit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        mainGoalIdEdit,
        divisionEditId,
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
      };
    } catch (error) {
      console.error("Error edit data:", error);
      return {error};
    }
  }
);
export const assignAnnualKpi = createAsyncThunk(
  "assignKpi",
  async ({ selectedKpiId, assigned }) => {
    try {
      const res = await axiosInistance.put(
        `/planApp/assignkpis/`,
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
    } catch (error) {}
  }
);
const kpiSlice = createSlice({
  name: "kpi",
  initialState: {
    isLoading: false,
    kpiData: [],
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpiData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchKpiData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpiData = action.payload;
      })
      .addCase(fetchKpiData.rejected, (state, action) => {
        state.error = true;
      })

      //edit
      .addCase(editSelectedKpi.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editSelectedKpi.fulfilled, (state, action) => {
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

        const targetDivisionId = state.kpiData.findIndex(
          (kpiData) => kpiData.id === editId
        );
        if (targetDivisionId !== -1) {
          state.kpiData[targetDivisionId].division_id = divisionEditId;

          state.kpiData[targetDivisionId].name = kpiEdit;

          state.kpiData[targetDivisionId].main_goal_id = mainGoalIdEdit;

          state.kpiData[targetDivisionId].annual_plan = annual_planEdit;

          state.kpiData[targetDivisionId].first_quarter_plan =
            firstQuarterPlanEdit;

          state.kpiData[targetDivisionId].second_quarter_plan =
            secondQuarterPlanEdit;

          state.kpiData[targetDivisionId].third_quarter_plan =
            thirdQuarterPlanEdit;

          state.kpiData[targetDivisionId].fourth_quarter_plan =
            fourthQuarterPlanEdit;

          state.kpiData[targetDivisionId].weight = weightEdit;

          state.kpiData[targetDivisionId].measure_id = measureEdit;

          state.kpiData[targetDivisionId].initial = initialEdit;
        }
      })
      .addCase(editSelectedKpi.rejected, (state, action) => {
        state.error = true;
      })

      //delete
      .addCase(deleteSelectedKpiData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedKpiData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpiData = state.kpiData.filter(
          (items) => items.id !== action.payload
        );
      })
      .addCase(deleteSelectedKpiData.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default kpiSlice.reducer;
