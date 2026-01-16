import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardStats from "./CardStats";
import LineCharts from "./LineCharts";
import PieChart from "./PieChart";
import Barchart from "./Barchart";
import DashboardTable from "./DashboardTable";
import { Typography } from "@material-tailwind/react";
import FilterDropdown from "./FilterDropdown";
import {
  Card,
  Button,
  CardBody,
  CardFooter,
  Select,
  Option,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Countdown from "./Countdown"; // Import the Countdown component
import "./countdown.css"; // Import Countdown component CSS
import ReminderCard from "./ReminderCard";
import KpiGraphs from "./kpiPerformance";
import KpisectorGraph from "./kpiSectorPerformance ";
import instance from "../GlobalContexts/Base_url"
import axiosInstance from "../GlobalContexts/Base_url";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useTranslation } from "react-i18next";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import { fetchKpiData } from "../reduxToolKit/slices/kpiSlice";
import ThreeYearPerformanceChart from "./ThreeYearPerformance";


function Dashboard() {
  const [sectorDate, setSectorDate] = useState(null);
  const [divisionDate, setDivisionDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [titleDiv, setTitleDiv] = useState('');
  const [titleSec, setTitleSec] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch
  const reminderRef = useRef(null);



  useEffect(() => {


    const handleClickOutside = (event) => {


      if (reminderRef.current && !reminderRef.current.contains(event.target)) {


        setIsHidden(true); // Gently hide the reminder


        localStorage.setItem("hideComponent", "true"); // Persist state


      }


    };





    document.addEventListener("mousedown", handleClickOutside);


    return () => document.removeEventListener("mousedown", handleClickOutside);


  }, []);

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



  const fetchLatestSectorReminder = () => {
    fetch(`${instance.defaults.baseURL}userApp/sector_reminders/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          setSectorDate(data[0].submision_dateof_sector);
          setTitleSec(data[0].title);
        } else {
          setSectorDate(null);
          setTitleSec('');
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const fetchLatestDivisionReminder = () => {
    fetch(`${instance.defaults.baseURL}userApp/division_reminders/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          setDivisionDate(data[0].submision_dateof_division);
          setTitleDiv(data[0].title);
        } else {
          setDivisionDate(null);
          setTitleDiv('');
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchLatestSectorReminder();
    fetchLatestDivisionReminder();

    fetch(`${instance.defaults.baseURL}userApp/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, [token, refresh]); // Add refresh as a dependency

  const handleCreate = (title, sectorDate, divisionDate) => {
    const url = (user && user.monitoring_id) ? 'userApp/sector_reminders/' : 'userApp/division_reminders/';
    fetch(instance.defaults.baseURL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        submision_dateof_sector: sectorDate,
        submision_dateof_division: divisionDate
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (user && user.monitoring_id) {
          setTitleSec(title);
          setSectorDate(sectorDate);
        }
        else {
          setTitleDiv(title);
          setDivisionDate(divisionDate);
        }
        setOpenCreate(false);
        setRefresh(!refresh);
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleOpenCreate = () => setOpenCreate(!openCreate);
  const handleOpenDelete = () => setOpenDelete(!openDelete);

  const handleDelete = () => {
    const url = (user && user.monitoring_id) ? 'userApp/sector_reminders/' : 'userApp/division_reminders/';
    fetch(instance.defaults.baseURL + url + 'latest/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    })
      .then(response => {
        if (response.status === 204) {
          if (user && user.monitoring_id) {
            setTitleSec('');
            setSectorDate(null);
          }
          else {
            setTitleDiv('');
            setDivisionDate(null);
          }
          handleOpenDelete();
          setRefresh(!refresh); // Trigger re-fetch
        } else {
          return response.json();
        }
      })
      .then(data => {
        if (data) {
        }
      })
      .catch((error) => console.error('Error:', error));
  };


  const [isHidden, setIsHidden] = useState(localStorage.getItem("hideComponent") === "true");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsHidden(localStorage.getItem("hideComponent") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      <div ref={reminderRef} className={`fixed top-16 right-5 w-[350px] z-50 transition-all duration-500 ${isHidden ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"}`}>
        <Card className="shadow-2xl rounded-2xl bg-white/90 backdrop-blur-md border border-white/20 p-4">
          <div className="flex flex-col gap-4">
            <CardBody className="p-2">
              {user && user.monitoring_id && (
                <>
                  {sectorDate && (
                    <div className="space-y-2">
                      <Typography variant="h6" color="blue-gray" className="font-bold flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        {titleSec}
                      </Typography>
                      <Countdown sectorDate={sectorDate} divisionDate={null} />
                    </div>
                  )}
                  {!sectorDate && (
                    <Typography variant="small" className="text-center py-4 font-bold text-pink-500 bg-pink-50/50 rounded-xl border border-pink-100">
                      {t('MAIN.DASHBOARD_PAGE.NO_ACTIVE_REMINDER')}
                    </Typography>
                  )}
                </>
              )}
              {user && !user.monitoring_id && user.sector_id && !user.division_id && (
                <div className="space-y-4">
                  {titleSec && (
                    <div>
                      <Typography variant="small" className="font-bold uppercase tracking-wider text-blue-gray-400 mb-1">Sector Reminder</Typography>
                      <Typography variant="h6" color="blue-gray" className="font-bold mb-2">{titleSec}</Typography>
                      <Countdown sectorDate={sectorDate} divisionDate={null} />
                    </div>
                  )}
                  {titleDiv && (
                    <div>
                      <Typography variant="small" className="font-bold uppercase tracking-wider text-blue-gray-400 mb-1">Division Reminder</Typography>
                      <Typography variant="h6" color="blue-gray" className="font-bold mb-2">{titleDiv}</Typography>
                      <Countdown sectorDate={null} divisionDate={divisionDate} />
                    </div>
                  )}
                  {!sectorDate && !divisionDate && (
                    <Typography variant="small" className="text-center py-4 font-bold text-pink-500 bg-pink-50/50 rounded-xl">
                      {t('MAIN.DASHBOARD_PAGE.NO_ACTIVE_REMINDER')}
                    </Typography>
                  )}
                </div>
              )}
              {user && !user.monitoring_id && user.division_id && divisionDate && (
                <div className="space-y-4">
                  {titleDiv && <Typography variant="h6" color="blue-gray" className="font-bold mb-2">{titleDiv}</Typography>}
                  <Countdown sectorDate={null} divisionDate={divisionDate} />
                </div>
              )}
            </CardBody>
            <CardFooter className="p-0 flex gap-2 pt-2 border-t border-gray-100">
              {user && (user.monitoring_id || user.sector_id) && (
                <>
                  <Button
                    size="sm"
                    variant="gradient"
                    color="blue"
                    fullWidth
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 normal-case"
                  >
                    {t('MAIN.DASHBOARD_PAGE.CREATE_NEW')}
                  </Button>
                  {(sectorDate || divisionDate) && (
                    <Button
                      size="sm"
                      variant="text"
                      color="red"
                      onClick={handleOpenDelete}
                      className="normal-case"
                    >
                      {t('MAIN.DASHBOARD_PAGE.DELETE')}
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </div>
        </Card>
      </div>

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

      {/* Dialogs */}
      <Dialog open={openCreate} handler={handleOpenCreate} size="sm" className="rounded-2xl">
        <DialogBody className="p-0">
          <ReminderCard onSave={handleCreate} onClose={handleOpenCreate} user={user} />
        </DialogBody>
      </Dialog>

      <Dialog open={openDelete} handler={handleOpenDelete} size="xs" className="rounded-2xl">
        <DialogHeader className="flex flex-col items-center gap-2 pt-8">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </div>
          <Typography variant="h5" color="blue-gray" className="text-center font-bold px-4">
            {t('MAIN.DASHBOARD_PAGE.DELETE_CONFIRMATION')}
          </Typography>
        </DialogHeader>
        <DialogFooter className="flex gap-3 justify-center items-center pb-8 pt-4">
          <Button variant="text" size="md" color="blue-gray" onClick={handleOpenDelete} className="normal-case font-bold">
            {t('MAIN.DASHBOARD_PAGE.NO')}
          </Button>
          <Button variant="gradient" size="md" color="red" onClick={handleDelete} className="normal-case font-bold shadow-red-200">
            {t('MAIN.DASHBOARD_PAGE.YES')}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Dashboard;