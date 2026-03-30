import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardStats from "./CardStats";
import LineCharts from "./LineCharts";
import PieChart from "./PieChart";
import Barchart from "./Barchart";
import DashboardTable from "./DashboardTable";
import { Typography } from "@material-tailwind/react";
import FilterDropdown from "./FilterDropdown";
import KpiGraphs from "./kpiPerformance";
import KpisectorGraph from "./kpiSectorPerformance ";
import axiosInstance from "../GlobalContexts/Base_url";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useTranslation } from "react-i18next";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import { fetchKpiData } from "../reduxToolKit/slices/kpiSlice";
import ThreeYearPerformanceChart from "./ThreeYearPerformance";


function Dashboard() {
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("access");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const currentYearGC = new Date().getFullYear();
  const currentMonthGC = new Date().getMonth() + 1;
  const ethiopianYear = currentYearGC - 7 - (currentMonthGC < 9 ? 1 : 0);
  const years = Array.from({ length: ethiopianYear - 2013 + 2 }, (_, index) => 2013 + index);
  // Retrieve filters from localStorage or set defaults
  const savedFilters = JSON.parse(localStorage.getItem("filters")) || {};

  const [selectedYear, setSelectedYear] = useState(savedFilters.year || ethiopianYear);
  const [selectedSector, setSelectedSector] = useState(savedFilters.sector || null);
  const [selectedDivision, setSelectedDivision] = useState(savedFilters.division || null);
  const [selectedKPI, setSelectedKPI] = useState(savedFilters.kpi || null);
  console.log("change is being recognised:", selectedSector, selectedDivision, selectedYear, selectedKPI);

  const [data, setData] = useState(() => {
    // Try loading from localStorage initially
    const saved = localStorage.getItem("dashboardData");
    return saved ? JSON.parse(saved) : "";
  });
  console.log(data);
  const authInfo = useAuth();
  const yearData = Array.from(


    { length: currentYear - 2020 },


    (_, index) => 2013 + index + 1


  );


  useEffect(() => {


    dispatch(fetchSectorgData());


  }, []);





  const { kpiData } = useSelector((state) => state.kpi);

  useEffect(() => {


    dispatch(fetchKpiData());
  }, []);
  useEffect(() => {
    const handleStorageChange = () => {
      const savedFilters = JSON.parse(localStorage.getItem("filters")) || {};
      setSelectedYear(savedFilters.year || ethiopianYear);
      setSelectedSector(savedFilters.sector || null);
      setSelectedDivision(savedFilters.division || null);
      setSelectedKPI(savedFilters.kpi || null);
    };

    // **Also check for updates in the same tab**
    const interval = setInterval(() => {
      handleStorageChange();
    }, 1000); // Check every 1 second

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 2️⃣ **Trigger API request whenever filters change**







  const handleFilter = async () => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/planApp/dashboard/", {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            sector: selectedSector,
            division: selectedDivision,
            year: selectedYear,
            kpi: selectedKPI
          },
        });
        const resdata = response.data;

        // Update state and localStorage
        setData(resdata);
        localStorage.setItem("dashboardData", JSON.stringify(resdata));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    // If no cached data, fetch immediately
    if (!data) {
      await fetchData();
    } else {
      // Fetch new data in background after 3 seconds
      setTimeout(() => {
        fetchData();
      }, 1000);
    }
  };
  useEffect(() => {
    handleFilter();
  }, [selectedSector, selectedDivision, selectedYear, selectedKPI]);

  return (
    <>
      <div className="p-4 md:p-6 space-y-8 bg-gray-50/30 min-h-screen">
        {data ? (
          <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
              <div>
                <Typography variant="h3" color="blue-gray" className="font-extrabold tracking-tight">
                  {t('MAIN.TITLE')} Dashboard
                </Typography>
                <Typography color="gray" className="font-medium mt-1 opacity-70">
                  {t('MAIN.WELCOME')} <span className="text-blue-600 font-bold">{authInfo.user.role_name}</span> {t('MAIN.HERE')}
                </Typography>
              </div>
              <FilterDropdown />
            </div>

            {/* Stats Cards Section */}
            <section>
              <CardStats statsData={data.dashboard_cards} />
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={(data.bar && data.pie && data.pie.length > 0) ? "lg:col-span-2" : "lg:col-span-3"}>
                <Barchart chartData={data.bar} />
              </div>
              <div className={(data.bar && data.pie && data.pie.length > 0) ? "lg:col-span-1" : "lg:col-span-3"}>
                <PieChart data={data.pie} />
              </div>
            </section>

            {/* Performance Over Time / Three Year Section */}
            {data.threeYearPerformance.series && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <ThreeYearPerformanceChart chartData={data.threeYearPerformance} />
              </section>
            )}

            {/* Data Table Section */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <DashboardTable data={data.table || []} />
            </section>
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div className="h-20 w-1/3 bg-gray-100 animate-pulse rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
              <div className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
              <div className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
              <div className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-2/3 h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
              <div className="lg:w-1/3 h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
            </div>
            <div className="h-96 bg-gray-100 animate-pulse rounded-2xl" />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
