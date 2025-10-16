import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "../slices/roleSlice";
import useReducer from "../slices/userSlice";
import tokenRefresherSlice from "../slices/tokenRefresherSlice";
import divisionReducer from "../slices/divisionSlice";
import monitoringReducer from "../slices/monitoringSlice";
import sectorReducer from "../slices/sectorSlice";
import strategicGoalReducer from "../slices/strategicGoalSlice";
import mainGoalReducer from "../slices/mainGoalSlice";
import kpiReducer from "../slices/kpiSlice";
import measureReducer from "../slices/measureSlice";
import kpiDescriptionReducer from "../slices/kpiDescriptionSlice";
import permissionReducer from "../slices/permissionSlice";
import settingReducer from "../slices/settingSlice";
import uniteReducer from "../slices/uniteSlice";
import kpiAllSliceReducer from "../slices/kpiAllSlice";
import kpi3SliceReducer from "../slices/kpi3Slice";

const store = configureStore({
  reducer: {
    role: roleReducer,
    user: useReducer,
    tokenRefresher: tokenRefresherSlice,
    division: divisionReducer,
    kpiall: kpiAllSliceReducer,
    kpi3:kpi3SliceReducer,
    monitoring: monitoringReducer,
    sector: sectorReducer,
    strategicGoal: strategicGoalReducer,
    mainGoal: mainGoalReducer,
    kpi: kpiReducer,
    kpiDescription: kpiDescriptionReducer,
    measure: measureReducer,
    unite: uniteReducer,
    permission: permissionReducer,
    setting: settingReducer,
  },
});

export default store;
