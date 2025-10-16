import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch kpi
export const fetchKpiAllData = createAsyncThunk("fetchKpiAllData", async () => {
  try {
    const kpiAllData = await axiosInistance.get("/planApp/KPI/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return kpiAllData.data;
  } catch (error) {}
});
export const assignKpiAll = createAsyncThunk(
  "assignKpiAll",
  async ({ kpiId , divisionIds  }) => {
    try {
      const res = await axiosInistance.put(
        `/planApp/assignkpis/`,
        {
          // ${SelectedKpi5Id}/
          
          kpi: kpiId,
          division_id: divisionIds,
          
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
//delete selected kpi
export const deleteSelectedKpiAllData = createAsyncThunk(
  "deleteSelectedKpiAllData",
  async (selectedId) => {
    try {
      await axiosInistance.delete(`/planApp/KPI/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) {}
  }
);

//edit kpi
export const editSelectedKpiAll = createAsyncThunk(
  "editSelectedKpiAll",
  async ({
    divisionEditId,
    mainGoalIdEdit,
    kpiEdit,
    initialEdit,
    annual_planEdit,
    measureEdit,
    weightEdit,
    editId,
    operationsEdit,
  }) => {
    try {
      await axiosInistance.put(
        `/planApp/KPI/${editId}/`,
        {
          division: divisionEditId,
          name: kpiEdit,
          main_goal: mainGoalIdEdit,
          initial: initialEdit,
          annual_plan: annual_planEdit,
          measure: measureEdit,
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
        measureEdit,
        weightEdit,
        editId,
        operationsEdit,
      };
    } catch (error) {
      console.error("Error edit data:", error);
    }
  }
);

const kpiAllSlice = createSlice({
  name: "kpiAll",
  initialState: {
    isLoading: false,
    kpiAllData: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpiAllData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchKpiAllData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpiAllData = action.payload;
      })
      .addCase(fetchKpiAllData.rejected, (state, action) => {
        state.error = true;
      })

      //edit
      .addCase(editSelectedKpiAll.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editSelectedKpiAll.fulfilled, (state, action) => {
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

        const targetDivisionId = state.kpiAllData.findIndex(
          (kpiAllData) => kpiAllData.id === editId
        );
        if (targetDivisionId !== -1) {
          state.kpiAllData[targetDivisionId].division = divisionEditId;

          state.kpiAllData[targetDivisionId].name = kpiEdit;

          state.kpiAllData[targetDivisionId].main_goal = mainGoalIdEdit;

          state.kpiAllData[targetDivisionId].annual_plan = annual_planEdit;

          state.kpiAllData[targetDivisionId].first_quarter_plan =
            firstQuarterPlanEdit;

          state.kpiAllData[targetDivisionId].second_quarter_plan =
            secondQuarterPlanEdit;

          state.kpiAllData[targetDivisionId].third_quarter_plan =
            thirdQuarterPlanEdit;

          state.kpiAllData[targetDivisionId].fourth_quarter_plan =
            fourthQuarterPlanEdit;

          state.kpiAllData[targetDivisionId].weight = weightEdit;

          state.kpiAllData[targetDivisionId].measure = measureEdit;

          state.kpiAllData[targetDivisionId].initial = initialEdit;
        }
      })
      .addCase(editSelectedKpiAll.rejected, (state, action) => {
        state.error = true;
      })

      //delete
      .addCase(deleteSelectedKpiAllData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedKpiAllData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpiAllData = state.kpiAllData.filter(
          (items) => items.id !== action.payload
        );
      })
      .addCase(deleteSelectedKpiAllData.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default kpiAllSlice.reducer;