import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardStats from "./CardStats";
import LineCharts from "./LineCharts";
import PieChart from "./PieChart";
import Barchart from "./Barchart";
import DashboardTable from "./DashboardTable";
import { Typography } from "@mui/material";
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
        <Card className="shadow-lg rounded-lg bg-white p-4">
          <div className="xl:flex gap-5 md:grid w-full ml-3" style={{ marginRight: "10px" }}>
            <Card className="grid gap-16 justify-center items-center w-full">
              <CardBody style={{ marginBottom: "-50px" }}>
                {user && user.monitoring_id && (
                  <>
                    {sectorDate && (
                      <>
                        <h4 className="text-xl hhh font-bold">{titleSec}</h4>
                        <Countdown sectorDate={sectorDate} divisionDate={null} />
                      </>
                    )}
                    {!sectorDate && (
                      <p className="no-active">No active reminder</p>
                    )}
                  </>

                )}
                {user && !user.monitoring_id && user.sector_id && !user.division_id && (
                  <>
                    {/* {title && <h2 className="text-xl font-bold mb-4">Sector Submission Date:</h2>} */}
                    {titleSec && <h2 className="text-xl hhh font-bold mb-4">{titleSec}</h2>}
                    <Countdown sectorDate={sectorDate} divisionDate={null} />
                    {titleDiv && <h2 className="text-xl hhh font-bold mb-4" style={{ marginTop: "10px", marginBottom: '5px' }}>{titleDiv}</h2>}
                    <Countdown sectorDate={null} divisionDate={divisionDate} />
                    {!sectorDate && !divisionDate && (
                      <p className="no-active">No active reminder</p>
                    )}
                  </>
                )}
                {user && !user.monitoring_id && user.division_id && divisionDate && (
                  <>
                    {titleDiv && <h2 className="text-xl hhh font-bold mb-4">{titleDiv}</h2>}
                    <Countdown sectorDate={null} divisionDate={divisionDate} />
                  </>
                )}
                {user && user.division_id && (
                  <>
                    {!divisionDate && (
                      <p className="no-active">No active reminder</p>
                    )}
                  </>
                )}

              </CardBody>
              <CardFooter className="flex w-full justify-around">
                {user && user.monitoring_id && (
                  <div>
                    <Button onClick={handleOpenCreate} className="bg-light-blue-700 hover:shadow-none shadow-none">
                      Create New
                    </Button>
                    {sectorDate && (
                      <Button onClick={handleOpenDelete} className="bg-red-700 hover:shadow-none shadow-none">
                        Delete
                      </Button>
                    )}
                  </div>
                )}
                {user && user.sector_id && (
                  <div>
                    <Button onClick={handleOpenCreate} className="bg-light-blue-700 hover:shadow-none shadow-none" style={{ marginRight: "5px" }}>
                      Create New
                    </Button>
                    {divisionDate && (
                      <Button onClick={handleOpenDelete} className="bg-red-700 hover:shadow-none shadow-none">
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </CardFooter>
              <Dialog open={openCreate} handler={handleOpenCreate}>
                {/*               <DialogHeader className="flex justify-center items-center">
                        Create New Reminder
                      </DialogHeader> */}
                <DialogBody>
                  <ReminderCard
                    onSave={handleCreate}
                    onClose={handleOpenCreate}
                    user={user}
                  />
                </DialogBody>
              </Dialog>
              <Dialog open={openDelete} handler={handleOpenDelete}>
                <DialogHeader className="flex justify-center items-center">
                  Are you sure you want to delete this reminder?
                </DialogHeader>
                <DialogFooter className="flex gap-3 justify-center items-center">
                  <Button
                    variant="text"
                    size="md"
                    className="hover:bg-light-blue-700 text-white bg-light-blue-700"
                    onClick={handleOpenDelete}
                  >
                    No
                  </Button>
                  <Button variant="text" size="md" color="red" onClick={handleDelete}>
                    Yes
                  </Button>
                </DialogFooter>
              </Dialog>
            </Card>
          </div>
        </Card>
      </div>

      {data ? (
        <div>
          <Typography variant="h5" mb={3}>
            {authInfo.user.role_name} Dashboard
          </Typography>
          <FilterDropdown />
          <CardStats statsData={data.dashboard_cards} />
          <div className="flex">
            <Barchart chartData={data.bar} />
            <PieChart data={data.pie} />
          </div>
          {data.threeYearPerformance.series && (
            <div className="flex">
              <ThreeYearPerformanceChart chartData={data.threeYearPerformance} />
            </div>
          )}
          <DashboardTable data={data.table || []} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Row - Count Cards Skeleton */}
          <div className="grid grid-cols-4 gap-6">
            {/* Placeholder for cards */}
            <div className="h-20 bg-white animate-pulse rounded-md"></div>
            <div className="h-20 bg-white animate-pulse rounded-md"></div>
            <div className="h-20 bg-white animate-pulse rounded-md"></div>
            <div className="h-20 bg-white animate-pulse rounded-md"></div>
          </div>

          {/* Middle - Two Cards Side by Side (Charts or Large Cards) */}
          <div className="flex space-x-6">
            <div className="flex-1 h-60 bg-white animate-pulse rounded-md"></div>
            <div className="flex-1 h-60 bg-white animate-pulse rounded-md"></div>
          </div>

          {/* Bottom - Table Skeleton */}
          <div className="w-full h-64 bg-white animate-pulse rounded-md"></div>
        </div>
      )}


    </>
  );
}

export default Dashboard;
