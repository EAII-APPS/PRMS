import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Roletable from "./Role/Rolet";
import MailGoal from "./Plan/MailGoal";
import Kpi from "./Plan/Kpi";
import GeneratePlanTable from "./Plan/GeneratePlanTable";
import GenerateReportTable from "./Report/GenerateReportTable";
import SideBar from "./components/SideBar";
import Signin from "./Sign/Signin";
import ForgetPassword from "./Sign/ForgetPassword";
import ErrorPage from "./components/ErrorPage";
import Strategictable from "./Plan/Strategict";
import Table from "./components/Table";
import Dashboard from "./components/Dashboard";
import Monitoring from "./Cluster/Monitoring";
import Division from "./Cluster/Division";
import Sector from "./Cluster/Sector";
import Admin from "./components/Admin";
import Summary from "./Report/Summary";
import KpiDescription from "./Report/KpiDescription";
import Measure from "./Report/Measure";
import MyProfile from "./components/MyProfile";
import Setting from "./components/Setting";
import PlanSummary from "./Plan/PlanSummary";
import SectorTracking from "./tracking/SectorTracking";
import DivisionTracking from "./tracking/DivisionTracking";
import TeamTracking from "./tracking/TeamTracking";
import Kpi3 from "./Plan/Kpi3"
import KpiAll from "./Plan/kpiall"
import MeasureManagement from "./measure/MeasureManagement.jsx";
import Unite from "./measure/unite.jsx";
import ChangePassword from "./components/ChangePassword";
import GenerateFinalReportTable from "./Report/GenerateFinalReportTable";
import GenerateThreeYearTable from "./Plan/GenerateThreeYearTable.jsx";
import ThreeyearReportTable from "./Report/GenerateThreeyearRep.jsx";
const token = localStorage.getItem("access");

const router = createBrowserRouter([
  {
    path: "/ForgetPassword",
    element: <ForgetPassword />,
  },
  {
    path: "/",
    element: <Signin />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Home",
    element: token ? <SideBar /> : <Signin />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: "/Home/Dashboard",
        element: <Dashboard />,
      },
      {
        path: "/Home/ChangePassword",
        element: <ChangePassword />,
      },
      {
        path: "/Home/PlanSummary",
        element: <PlanSummary />,
      },
      {
        path: "/Home/MyProfile",
        element: <MyProfile />,
      },
      {
        path: "/Home/Setting",
        element: <Setting />,
      },
      {
        path: "/Home/Admin",
        element: <Admin />,
      },
      {
        path: "/Home/Role",
        element: <Roletable />,
      },

      {
        path: "/Home/StrategicGoal",
        element: <Strategictable />,
      },
      {
        path: "/Home/MainGoal",
        element: <MailGoal />,
      },
      {
        path: "/Home/KpiAll",
        element: <KpiAll />,
      },
      {
        path: "/Home/Kpi",
        element: <Kpi />,
      },
      {
        path: "/Home/Kpi3",
        element: <Kpi3 />,
      },
      {
        path: "/Home/GeneratePlanTable",
        element: <GeneratePlanTable />,
      },
      {
        path: "/Home/GenerateReportTable",
        element: <GenerateReportTable />,
      },
      {
        path: "/Home/GenerateThreeReportTable",
        element: <ThreeyearReportTable />,
      },
      {
        path: "/Home/GenerateFinalReportTable",
        element: <GenerateFinalReportTable />,
      },
      {
        path: "/Home/GenerateThreeyearTable",
        element: <GenerateThreeYearTable />,
      },
      {
        path: "/Home/User",
        element: <Table />,
      },
      {
        path: "/Home/Monitoring",
        element: <Monitoring />,
      },
      {
        path: "/Home/Sector",
        element: <Sector />,
      },
      {
        path: "/Home/Division",
        element: <Division />,
      },
      {
        path: "/Home/Summary",
        element: <Summary />,
      },
      {
        path: "/Home/KpiDescription",
        element: <KpiDescription />,
      },
      {
        path: "/Home/Measure",
        element: <Measure />,
      },
      {
        path: "/Home/SectorTracking",
        element: <SectorTracking />,
      },
      {
        path: "/Home/DivisionTracking",
        element: <DivisionTracking />,
      },
      {
        path: "/Home/TeamTracking",
        element: <TeamTracking />,
      },
      {
        path: "/Home/MeasureManagement",
        element: <MeasureManagement />,
      },

      {
        path: "/Home/Unite",
        element: <Unite />,
      },
    ],
  },
]);
function App() {
  return (
    <div >
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
