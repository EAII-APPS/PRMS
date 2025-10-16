import React, { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faPenToSquare,
  faTrash,
  faCalendarDays,
  faHandHoldingHand
} from "@fortawesome/free-solid-svg-icons";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";
import Switch from "../components/Switch";
import axiosInistance from "../GlobalContexts/Base_url";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { fetchKpiAllData, assignKpiAll, editSelectedKpiAll, deleteSelectedKpiAllData } from "../reduxToolKit/slices/kpiAllSlice"
import { Checkbox } from "@material-tailwind/react";
import {
  Card,
  CardHeader,
  Input,
  Button,
  CardBody,
  CardFooter,
  Select,
  MenuItem,
  Option,
  Typography,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { fetchMainGoalData } from "../reduxToolKit/slices/mainGoalSlice";
import { fetchUniteData } from "../reduxToolKit/slices/uniteSlice";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Kpiall() {
  const { t } = useTranslation();
  const token = localStorage.getItem("access");

  const numRegex = /^(0|[1-9]\d*)(\.\d+)?$/;

  const PerfRegex = /^(0|[1-9][0-9]*)(\.[0-9]+)?[a-zA-Z!@#\$%\^\&*\)\(+=._-]*$/;
  const NegativePerfRegex = /^-\d+(\.\d+)?$/;
  const authInfo = useAuth();

  const dispatch = useDispatch();



  const { kpiAllData } = useSelector((state) => state.kpiall);

  useEffect(() => {
    dispatch(fetchKpiAllData());
  }, [dispatch]);

  const [isOpen, setIsOpen] = useState(false);
  const [goalunit, setGoalunit] = useState(null); // State for selected unit
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  //fetch maingoal data

  const { mainGoalData } = useSelector((state) => state.mainGoal);
  // console.log("errr",mainGoalData)

  useEffect(() => {
    dispatch(fetchMainGoalData());
  }, []);

  //add

  const [name, setName] = useState("");

  const [divisionId, setDivisionId] = useState("");
  //fetch division data
  const { divisionData } = useSelector((state) => state.division);
  const { sectorData } = useSelector((state) => state.sector);
  useEffect(() => {
    dispatch(fetchSectorgData());
    dispatch(fetchDivisionData());
  }, []);
  const sectorMapping = sectorData?.reduce((acc, sector) => {
    acc[sector.id] = sector.name;
    return acc;
  }, {});
  const [selectedSector, setSelectedSector] = useState(null);


  const filteredDivisions = divisionData?.filter(
    (item) => item.sector === selectedSector
  );


  const groupedDivisions = divisionData?.reduce((acc, item) => {
    if (!acc[item.sector]) {
      acc[item.sector] = [];
    }
    acc[item.sector].push(item);
    return acc;
  }, {});


  // Filter divisions specific to each KPI item dynamically
  const getFilteredGroupedDivisions = (sectorIds) => {
    return Object.keys(groupedDivisions)
      .filter((sectorId) => sectorIds.includes(Number(sectorId))) // Only include matching sectors
      .reduce((acc, key) => {
        acc[key] = groupedDivisions[key];
        return acc;
      }, {});
  };


  const [main_goal, setMain_goal] = useState("");

  const [goal, setGoal] = useState("");

  const [weight, setWeight] = useState("");
  const [startyear, setstartyear] = useState("");

  const [endyear, setendyear] = useState("");
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear + 1 - 2020 },
    (_, index) => 2013 + index
  );
  const [first_quarter_plan, setFirst_quarter_plan] = useState("");

  const [annual_plan, setAnnual_plan] = useState("");
  const [number_part, setNumber_part] = useState(null);


  const [measure, setMeasure] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [errorEmptyMessage, setErrorEmptyMessage] = useState("");

  const [operations, setOperation] = useState("sum");

  const [open, setOpen] = useState(false);

  const handleNumExtraction = (input) => {
    // Regular expression to match the number part
    const regex = /(\d*\.?\d+)/;
    const match = input.match(regex);
    if (match) {
      const numberPart = parseFloat(match[1]); // Extracts the number part
      return numberPart;
      // console.log(numberPart);
    } else {
      // Handle case where no number is found if needed
      return 0; // Reset or set to default if no number is found
    }
  };

  const handleOpen = () => {
    setOpen(!open);

    setName("");

    // setSectorId("");

    setMain_goal("");

    setErrorEmptyMessage("");
  };

  const handleAddKpi = async (e) => {
    e.preventDefault();

    const measure_id = measure;

    const token = localStorage.getItem("access");

    if (!main_goal) {
      setErrorEmptyMessage("please select Main Goal");
      return;
    }



    if (!name) {
      setErrorEmptyMessage("please enter kpi");
      return;
    }


    try {
      const res = await axiosInistance.post(
        "/planApp/KPI/",
        {
          name,
          main_goal_id: main_goal,
          weight

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchKpiAllData());

      setWeight("");

      setName("");;

      setMain_goal("");

      setOpen(false);

      setErrorMessage("");

      toast.success(`KPI Added successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });
    }     catch (error) {
      setErrorMessage(error.response.status);
      setErrorMessage(error.response.data);
      setErrorMessageWeight(error.response.data.message);
    }
  };

  //delete

  const [openDelete, setOpenDelete] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  const [selectedName, setSelectedName] = useState(null);

  const handleOpenDelete = (selectedId, selectedName) => {
    setSelectedId(selectedId);

    setOpenDelete(!openDelete);

    setSelectedName(selectedName);
  };

  const handleDelete = async () => {
    dispatch(deleteSelectedKpiAllData(selectedId));

    setOpenDelete(false);

    toast.success(`KPI Deleted successfully`, {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  const [openAssign, setOpenAssign] = useState(false);
  const [assignedSectors, setAssignedSectors] = useState([]);
  const [assignedSubcitySectors, setAssignedSubcitySectors] = useState([]);
  const [assignedWoredaSectors, setAssignedWoredaSectors] = useState([]);

  const [SelectedKpiAllId, setSelectedKpiAllId] = useState()
  const [assigned, setAssigned] = useState([]);


  // Handle Checkbox Toggle
  const handleCheckBoxSector = (itemId) => {
    setAssignedSectors((prevAssigned) =>
      prevAssigned.includes(itemId)
        ? prevAssigned.filter((item) => item !== itemId)
        : [...prevAssigned, itemId]
    );
  };
  const handleCheckBoxWoredaSector = (itemId) => {
    setAssignedWoredaSectors((prevAssigned) =>
      prevAssigned.includes(itemId)
        ? prevAssigned.filter((item) => item !== itemId)
        : [...prevAssigned, itemId]
    );
  };
  const handleCheckBoxSubcitySector = (itemId) => {
    setAssignedSubcitySectors((prevAssigned) =>
      prevAssigned.includes(itemId)
        ? prevAssigned.filter((item) => item !== itemId)
        : [...prevAssigned, itemId]
    );
  };


  // console.log(assigned);
  const [selectedKpiItem, setSelectedKpiItem] = useState(null); // Store selected KPI
  const handleCloseAssign = () => {
    setOpenAssign(false); // Properly close the dialog
  };

  const handleOpenAssign = async (item) => {
    try {
      // Fetch latest KPI data to ensure we have the most up-to-date assignments
      const latestKpiData = await dispatch(fetchKpiAllData()).unwrap();

      // Find the latest version of this KPI item
      const updatedKpiItem = latestKpiData.find(kpi => kpi.id === item.id);
      // setSelectedSector(null);

      setSelectedKpiId(item.id);
      setSelectedKpiItem(updatedKpiItem || item); // Fallback to old item if not found
      setAssigned(updatedKpiItem?.division_id || []); // Ensure assigned values are fresh
      setOpenAssign(true);
    } catch (error) {
      console.error("Error fetching latest KPI data:", error);
    }
  };

  // Handle Assign Action
  const handleAssignMainGoal = async (e) => {
    e.preventDefault();

    const payload = {
      kpiId: selectedKpiId, // KPI ID
      divisionIds: assigned, // Array of Division IDs
    };

    try {
      // Dispatch the action with the prepared payload
      dispatch(assignKpiAll(payload));
      toast.success(`KPI Assigned successfully`, {
        autoClose: 2000,
        hideProgressBar: true,

      });
      // Optionally, fetch updated data after the assignment
      dispatch(fetchDivisionData());
      dispatch(fetchKpiAllData());
      // Close the dialog after successful submission
      setOpenAssign(false);


      // dispatch(fetchKpiAllData());
    } catch (error) {
      console.error("Error while assigning KPI:", error);
    }
  };




  // Edit

  const [divisionEditId, setDivisionEditId] = useState("");

  const [subCitySectorEditId, setSubCitySectorEditId] = useState([]);

  const [] = useState("");

  const [] = useState("");

  const [thirdQuarterPlanEdit, setThirdQuarterPlanEdit] = useState("");

  const [fourthQuarterPlanEdit, setFourthQuarterPlanEdit] = useState("");


  const [kpiEdit, setKpiEdit] = useState("");

  const [mainGoalIdEdit, setMainGoalIdEdit] = useState("");

  const [goalEdit, setGoalEdit] = useState("");

  const [measureEdit, setMeasureEdit] = useState("");
  const [annual_planEdit, setAnnual_planEdit] = useState("");
  const [operationsEdit, setOperationEdit] = useState("");

  const [editId, setEditId] = useState("");

  const [openEdit, setOpenEdit] = useState(false);


  const handleOpenEdit = (items) => {
    setOpenEdit(!openEdit);
    setEditId(items.id);
    setMainGoalIdEdit(items.main_goal_id); // Set the correct main goal ID
    setKpiEdit(items.name);
    setWeight(items.weight);
  };

  const handleCheckBoxThree = (itemId) => {
    setAssigned((prevAssigned) => {
      if (prevAssigned.includes(itemId)) {
        return prevAssigned.filter((item) => item !== itemId);
      } else {
        return [...prevAssigned, itemId];
      }
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();

    if (!mainGoalIdEdit) {
      setErrorEmptyMessage("please select Main Goal");
      return;
    }
    if (!kpiEdit) {
      setErrorEmptyMessage("please enter kpi");

      return;
    }
    // if (NegativePerfRegex.test(weight)) {
    //   setErrorEmptyMessage("Invalid goal, goal can't be negative!");

    //   return;
    // }


    dispatch(
      editSelectedKpiAll({
        mainGoalIdEdit,
        kpiEdit,
        // weight,
        editId,
      })
    );

    dispatch(fetchKpiAllData());
    setOpenEdit(false);

    toast.success(`KPI Updated successfully`, {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  // view

  const [showModalView, setShowModalView] = useState(false);

  const handleCloseModalView = () => {
    setShowModalView(false);
  };
  const handleOpenModalView = () => {
    setShowModalView(true);
  };
  const handleModalClickView = (e) => {
    e.stopPropagation();
  };

  //fetch measure

  const [measureData, setMeasureData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInistance.get("/reportApp/measure/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMeasureData(response.data);
      } catch (error) { }
    };

    fetchData();
  }, []);

  //handle performance

  const [selectedKpiId, setSelectedKpiId] = useState(null);


  const [openPerformance, setOpenPerformance] = useState(null);

  const handleOpenPerformance = (items) => {
    setOpenPerformance(!openPerformance);

    setSelectedKpiId(items.id);

    setErrorEmptyMessage("");
  };

  const handleAddPerformance = async () => {
    const token = localStorage.getItem("access");

    if (!PerfRegex.test(firstQuarterPerformance)) {
      setErrorEmptyMessage("Invalid first Quarter Performance");

      return;
    }

    if (!PerfRegex.test(secondQuarterPerformance)) {
      setErrorEmptyMessage("Invalid second Quarter Performance");

      return;
    }

    if (!PerfRegex.test(thirdQuarterPerformance)) {
      setErrorEmptyMessage("Invalid Third Quarter Performance");

      return;
    }

    if (!PerfRegex.test(fourthQuarterPerformance)) {
      setErrorEmptyMessage("Invalid Fourth Quarter Performance");

      return;
    }
    try {
      await axiosInistance.put(
        `/planApp/performance/${selectedKpiId}/`,
        {
          first_quarter_performance: firstQuarterPerformance,
          second_quarter_performance: secondQuarterPerformance,
          third_quarter_performance: thirdQuarterPerformance,
          fourth_quarter_performance: fourthQuarterPerformance,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchKpiAllData());
      setOpenPerformance(false);
    } catch (error) { }
  };

  const [transformedData, setTransformedData] = useState([]);
  const [transformedDataMain, setTransformedDataMain] = useState([]);

  useEffect(() => {
    if (!Array.isArray(kpiAllData)) {
      console.warn("kpiAllData is null or not an array");
      setTransformedData([]);
      return;
    }

    const transformData = (dataArray) => {
      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return [];
      }

      const groupedData = dataArray.reduce((acc, curr) => {
        const {
          maingoal_name,
          main_goal_id,
          weight,
          main_goal,
          division_id,
          sector_id,
          id,
          name,
        } = curr;

        if (!acc[main_goal_id]) {
          acc[main_goal_id] = {
            main_goal,
            main_goal_id,
            sector_id,
            maingoal_name,
            weight,
            id,
            name,
            kpi: [],
          };
        }

        acc[main_goal_id].kpi.push({
          main_goal,
          maingoal_name,
          main_goal_id,
          division_id,
          sector_id,
          weight,
          id,
          name,
        });

        return acc;
      }, {});

      return Object.values(groupedData);
    };

    const transformed = transformData(kpiAllData);
    setTransformedData(transformed);
  }, [kpiAllData]);


  useEffect(() => {
    // Transform the data

    if (Array.isArray(kpiAllData)) {
      const transformData = (dataArray) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          return [];
        }

        const groupedData = dataArray.reduce((acc, curr) => {
          const {
            main_goal,
            main_goal_name,
            weight,
            id,
            sector_id,
            name,
          } = curr;

          if (!acc[main_goal]) {
            acc[main_goal] = {
              main_goal,
              weight,
              sector_id,
              name,
              kpi: [],
            };
          }

          acc[main_goal].kpi.push({
            main_goal,
            weight,
            id,
            name,
          });

          return acc;
        }, {});

        return Object.values(groupedData);
      };


      const transformed = transformData(mainGoalData);

      setTransformedDataMain(transformed);
    }
  }, [mainGoalData]);
  //pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const calculateTotalPages = () => {
      setTotalPages(
        Math.ceil(kpiAllData ? transformedData.length / itemsPerPage : [])
      );
    };
    calculateTotalPages();
  }, [transformedData, itemsPerPage]);

  // Function to handle next page button click
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle previous page button click
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate data for current page
  const [searchTerm, setSearchTerm] = useState("");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageData = kpiAllData
    ? transformedData.slice(indexOfFirstItem, indexOfLastItem)
    : [];
    const filteredData = currentPageData
    ?.map(mainGoalItem => {
      // Filter KPI items based on search term
      const matchingKpis = mainGoalItem.kpi?.filter(kpi =>
        kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) // Matching on KPI name
      );
  
      // Check if the main goal name matches the search term
      const mainGoalMatches = mainGoalItem.maingoal_name.toLowerCase().includes(searchTerm.toLowerCase());
  
      // If either main goal matches or there are matching KPIs, return the item
      if (mainGoalMatches || matchingKpis.length > 0) {
        return {
          ...mainGoalItem,
          kpi: matchingKpis, // Keep only matching KPIs
        };
      }
  
      return null; // If no match, return null
    })
    .filter(Boolean); // Remove any null entries
  
  const currentPageDataMain = mainGoalData
    ? transformedDataMain.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  // console.log("bull arr",currentPageDataMain);

  const [openKpi, setOPenKpi] = useState(-1);
  const handleOPenKpi = (index) => {
    setTimeout(() => setOPenKpi(openKpi === index ? -1 : index), 50);
    // console.log("Selected KPI data:", items);
  };

  return (
    <>
      <ToastContainer />
      {authInfo ? (
        <div className="grid gap-3 items-center">
          <p className="text-base font-bold font-sans">
            {t("MAIN.SIDEBAR.PLAN.KPIALL.TITLE")}
          </p>
          <Card className="rounded-md overflow-auto scrollbar">
            <CardHeader floated={false} shadow={false} className="rounded-none">
              <div className="flex items-center justify-between mt-5 gap-5">
                <div>
                  <div className="w-full">
                  <Input
                    color="blue"
                    size="sm"
                    label={t("MAIN.TABLE.SEARCH")}
                    icon={
                      <MagnifyingGlassIcon className="h-5 w-5 cursor-pointer hover:text-light-blue-700" />
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  {authInfo.user.userPermissions.includes("createKpi") ? (
                    <Button
                      variant="text"
                      size="sm"
                      onClick={handleOpen}
                      className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      {t("MAIN.SIDEBAR.PLAN.KPIALL.ADDBUTTON")}
                    </Button>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-blue-gray-50">
                  <tr>
                    <th scope="col" className="p-2 text-left text-md font-bold text-black tracking-wider">
                      {t("MAIN.TABLE.NO")}
                    </th>
                    <th scope="col" className="p-2 text-left text-md font-bold text-black tracking-wider">
                      {t("MAIN.SIDEBAR.PLAN.MAIN_GOAL.MAIN_GOAL")}
                    </th>
                    <th scope="col" className="p-2 text-center text-md font-bold text-black tracking-wider">
                      {t("MAIN.SIDEBAR.PLAN.KPIALL.KPI")}
                    </th>
                    <th scope="col" className="p-2 text-left text-md font-bold text-black tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredData &&
                    filteredData.map((mainGoalItem, index) => (
                      <React.Fragment key={mainGoalItem.id}>
                        <tr className="bg-white border-b hover:bg-gray-400 cursor-default">
                          {/* Main goal name */}
                          <td className="p-2 text-left text-sm font-normal text-blue-gray-900">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td
                            className="p-2 text-left text-sm font-normal text-blue-gray-900"
                            onClick={() => handleOPenKpi(index)}
                          >
                            <div className="flex gap-2 items-center">
                              {/* Display the main goal name */}
                              {mainGoalItem.maingoal_name}
                              <Tooltip
                                content={`Under this Main Goal There ${mainGoalItem.kpi.length != 0 && mainGoalItem.kpi.length != 1
                                  ? "are"
                                  : "is"
                                  } ${mainGoalItem.kpi.length} Kpi${mainGoalItem.kpi.length != 0 && mainGoalItem.kpi.length != 1 ? "s" : ""}`}
                                animate={{
                                  mount: { scale: 1, y: 0 },
                                  unmount: { scale: 0, y: 25 },
                                }}
                              >
                                <Chip
                                  variant="ghost"
                                  color="green"
                                  size="sm"
                                  value={mainGoalItem.kpi.length}
                                  className="rounded-full text-center normal-case border border-green-700"
                                />
                              </Tooltip>
                            </div>
                          </td>

                          <td className="p-2 text-left text-sm font-normal text-blue-gray-900">
                            {openKpi === index && (
                              <table className="w-full divide-y divide-gray-200">
                                <thead>
                                  <tr>
                                    <th scope="col" className="p-2 text-left text-md font-bold text-black tracking-wider">
                                      {t("MAIN.TABLE.NO")}
                                    </th>
                                    <th scope="col" className="p-2 text-left text-md font-bold text-black tracking-wider">
                                      {t("MAIN.SIDEBAR.PLAN.KPIALL.KPI")}
                                    </th>
                                    <th scope="col" className="p-2 text-left text-md font-bold text-black tracking-wider">
                                      {t("MAIN.TABLE.STATUS")}
                                    </th>
                                    <th scope="col" className="p-2 text-center text-md font-bold text-black tracking-wider">
                                      {t("MAIN.TABLE.ACTION")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {mainGoalItem.kpi &&
                                    mainGoalItem.kpi.map((kpiItem, kpiIndex) => (
                                      <tr key={kpiItem.id} className="bg-white border-b hover:bg-blue-gray-50 cursor-default">
                                        <td className="p-2 text-left text-sm font-normal text-blue-gray-900">
                                          {kpiIndex + 1}
                                        </td>
                                        <td className="p-2 text-left text-sm font-normal text-blue-gray-900">
                                          {kpiItem.name} {/* KPI name */}
                                        </td>

                                        <td className="p-2 text-left text-sm font-normal text-blue-gray-900">
                                          {/* Status */}
                                          <label className="inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="relative w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[-1px] after:start-[-5px] after:bg-red-900 after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-white border border-gray-200 peer-checked:after:bg-green-900"></div>
                                          </label>
                                        </td>
                                        <td className="p-2 text-left text-sm font-normal text-blue-gray-900">
                                          {/* Actions */}
                                          <div className="flex items-center justify-center gap-2">
                                            {authInfo.user.userPermissions.includes(
                                              "createAssignMain"
                                            ) && (
                                                <Tooltip
                                                  content="Assign"
                                                  className=""
                                                  placement="top"
                                                  animate={{
                                                    mount: { scale: 1, y: 0 },
                                                    unmount: { scale: 0, y: 25 },
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    onClick={() =>
                                                      handleOpenAssign(kpiItem)
                                                    }
                                                    icon={faHandHoldingHand}
                                                    color="green"
                                                    className="cursor-pointer"
                                                  />
                                                </Tooltip>
                                              )}
                                            {authInfo.user.userPermissions.includes("updateKpi") && (
                                              <FontAwesomeIcon
                                                color="orange"
                                                onClick={() => handleOpenEdit(kpiItem)}
                                                icon={faPenToSquare}
                                                className="cursor-pointer"
                                              />
                                            )}
                                            {authInfo.user.userPermissions.includes("deleteKpi") && (
                                              <FontAwesomeIcon
                                                color="red"
                                                onClick={() => handleOpenDelete(kpiItem.id, kpiItem.name)}
                                                icon={faTrash}
                                                className="cursor-pointer"
                                              />
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            )}
                          </td>

                          <td onClick={() => handleOPenKpi(index)} className="p-2 text-center text-sm font-normal text-blue-gray-900 cursor-pointer">
                            <ChevronDownIcon
                              strokeWidth={2.5}
                              className={`mx-auto h-4 w-4 transition-transform ${openKpi === index ? "rotate-180" : ""}`}
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                </tbody>
              </table>

            </CardBody>
            <CardFooter className="flex items-center justify-between">
              <div></div>
              <div className="flex gap-2">
                <Button
                  variant="text"
                  size="sm"
                  className="hover:bg-blue-700 font-sans text-sm hover:text-white focus:bg-blue-700 focus:text-white normal-case"
                  disabled={currentPage === 1}
                  onClick={handlePreviousPage}
                >
                  {t("MAIN.TABLE.PREVIOUS")}
                </Button>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-7 h-7  hover:text-light-blue-700"
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <IconButton className="rounded-full bg-blue-700">
                    {currentPage}
                  </IconButton>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-7 h-7 hover:text-light-blue-700"
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Button
                  variant="text"
                  size="sm"
                  className="hover:bg-blue-700 font-sans text-sm hover:text-white focus:bg-blue-700 focus:text-white normal-case"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  {t("MAIN.TABLE.NEXT")}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div></div>
      )}

      {/* add */}
      <Dialog open={open} handler={handleOpen} size="sm">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">{t("MAIN.INPUTFIELD.ADD_KPI")}</div>
          <div className="cursor-pointer mr-5" onClick={handleOpen}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-auto items-center overflow-auto">
          {authInfo.user.userPermissions.includes("createKpi") ? (
            <form
              onSubmit={handleAddKpi}
              className="grid gap-5 items-center w-11/12 mx-auto "
            >

              {/* MAIN_GOAL */}
              <div className="w-full justify-self-center">
                <Select
                  label={t("MAIN.INPUTFIELD.MAIN_GOAL")}
                  color="blue"
                  value={main_goal}
                  onChange={(e) => {
                    setMain_goal(e), setErrorEmptyMessage("");
                  }}
                >
                  {mainGoalData &&
                    mainGoalData.map((items) => (
                      <Option
                        key={items.id}
                        value={items.id}
                        className="focus:text-light-blue-700"
                      >
                        {items.name}
                      </Option>
                    ))}
                </Select>
              </div>
              {/* KPI */}
              <div className="w-full justify-self-center">
                <Input
                  type="text"
                  id="name"
                  required
                  color="blue"
                  label={t("MAIN.INPUTFIELD.KPI")}
                  size="lg"
                  value={name}
                  onChange={(e) => (
                    setName(e.target.value), setErrorEmptyMessage("")
                  )}
                />
              </div>

              {/* <div className="w-full justify-self-center">
                <Input
                  type="text"
                  id="weight"
                  label={t("MAIN.INPUTFIELD.WEIGHT")}
                  required
                  color="blue"
                  size="lg"
                  value={weight}
                  onChange={(e) => (
                    setWeight(e.target.value), setErrorEmptyMessage("")
                  )}
                />
              </div> */}
              <div className="space-x-2 flex justify-self-end mr-5">
                <Button
                  variant="text"
                  color="red"
                  onClick={handleOpen}
                  className="normal-case"
                >
                  <span>{t("MAIN.INPUTFIELD.CANCEL")}</span>
                </Button>
                <Button
                  variant="text"
                  size="sm"
                  className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                  onClick={handleAddKpi}
                >
                  {t("MAIN.INPUTFIELD.ADD_KPI")}
                </Button>
              </div>
            </form>
          ) : (
            <></>
          )}
        </DialogBody>
      </Dialog>
      {/* assign */}
      <Dialog open={openAssign} handler={handleOpenAssign} size="lg">
        <DialogHeader className="flex justify-between items-center mx-5">
          {t("MAIN.INPUTFIELD.ASSIGN")}
          <FontAwesomeIcon
            onClick={handleCloseAssign}
            className="cursor-pointer"
            icon={faXmark}
          />
        </DialogHeader>
        <DialogBody className=" grid grid-rows-3 sm:grid-rows-1 gap-2 h-80  p-6 bg-gray-50 w-auto rounded-lg shadow-md">
          {(authInfo.user.monitoring_id || authInfo.user.is_superadmin) ? (
          <div className="space-y-4">
          {/* Sector Dropdown */}
          <Select
            label="Select Sector"
            onChange={(value) => setSelectedSector(value)}
          >
            {sectorData?.map((sector) => (
              <Option key={sector.id} value={sector.id}>
                {sector.name}
              </Option>
            ))}
          </Select>
    
          {/* Divisions List */}
          <div className="grid grid-cols-3 gap-1">
            {filteredDivisions?.map((items) => (
              <div key={items.id} className="flex items-center gap-2">
                <Checkbox
                  onChange={() => handleCheckBoxThree(items.id)}
                  checked={Array.isArray(assigned) && assigned.includes(items.id)}
                  color="blue"
                />
                <Typography className="font-sans font-bold text-sm">
                  {items.name}
                </Typography>
              </div>
            ))}
          </div>
        </div>
          ) : (
            <div>
              {divisionData &&
                divisionData.map((items) => (
                  <div key={items.id} className="flex items-center gap-2">
                    <Checkbox
                      onChange={() => handleCheckBoxThree(items.id)}
                      checked={Array.isArray(assigned) && assigned.includes(items.id)}
                      color="blue"
                    />
                    <Typography className="font-sans font-bold text-sm">
                      {items.name}
                    </Typography>
                  </div>
                ))}
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleCloseAssign}
            className="mr-1"
          >
            <span> {t("MAIN.INPUTFIELD.CANCEL")}</span>
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={handleAssignMainGoal}
          >
            <span> {t("MAIN.INPUTFIELD.ASSIGN")}</span>
          </Button>
        </DialogFooter>
      </Dialog >
      {/* delete */}
      < Dialog open={openDelete} handler={handleOpenDelete} >
        <DialogHeader className="flex justify-center items-center">
          {t("MAIN.INPUTFIELD.DELETE")}
        </DialogHeader>

        <DialogFooter className="flex gap-3 justify-center items-center">
          <Button
            variant="text"
            size="md"
            className="hover:bg-light-blue-700  text-white bg-light-blue-700"
            onClick={handleOpenDelete}
          >
            {t("MAIN.INPUTFIELD.NO")}
          </Button>
          <Button variant="text" size="md" color="red" onClick={handleDelete}>
            {t("MAIN.INPUTFIELD.YES")}
          </Button>
        </DialogFooter>
      </Dialog >

      {/* Edit */}

      < Dialog open={openEdit} handler={handleOpenEdit} size="sm" >
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5"> {t("MAIN.INPUTFIELD.UPDATE_KPI")}</div>
          <div className="cursor-pointer mr-5" onClick={handleOpenEdit}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-auto items-center overflow-auto">
          {authInfo.user.userPermissions.includes("createAssign") ||
            authInfo.user.userPermissions.includes("createMainactivity") ? (
            <form
              onSubmit={handleEdit}
              className="grid gap-5 items-center w-11/12 mx-auto"
            >

              {/* MAIN_GOAL */}
              <div className="w-full justify-self-center">
                <Select
                  label={t("MAIN.INPUTFIELD.MAIN_GOAL")}
                  color="blue"
                  value={mainGoalIdEdit}
                  onChange={(e) => {
                    setMainGoalIdEdit(e), setErrorEmptyMessage("");
                  }}
                >
                  {mainGoalData &&
                    mainGoalData.map((items) => (
                      <Option
                        key={items.id}
                        value={items.id}
                        className="focus:text-light-blue-700"
                      >
                        {items.name}
                      </Option>
                    ))}
                </Select>
              </div>

              {/* kpi */}
              <div className="w-full justify-self-center">
                <Input
                  type="text"
                  id="name"
                  required
                  color="blue"
                  label={t("MAIN.INPUTFIELD.KPI")}
                  size="lg"
                  value={kpiEdit}
                  onChange={(e) => (
                    setKpiEdit(e.target.value), setErrorEmptyMessage("")
                  )}
                />
              </div>

              {/* <div className="w-full justify-self-center">
                <Input
                  type="text"
                  id="weight"
                  required
                  color="blue"
                  label={t("MAIN.INPUTFIELD.WEIGHT")}
                  size="lg"
                  value={weight}
                  onChange={(e) => (
                    setWeight(e.target.value), setErrorEmptyMessage("")
                  )}
                />
              </div> */}

              <div>
                <p className="text-sm text-red-900">{errorEmptyMessage}</p>
              </div>
              <div></div>

              <div className="space-x-2 flex justify-self-end mr-5">
                <Button
                  variant="text"
                  color="red"
                  onClick={handleOpenEdit}
                  className="normal-case"
                >
                  <span> {t("MAIN.INPUTFIELD.CANCEL")}</span>
                </Button>
                <Button
                  variant="text"
                  size="sm"
                  className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                  onClick={handleEdit}
                >
                  {t("MAIN.INPUTFIELD.UPDATE")}
                </Button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleEdit}
              className="grid gap-5 items-center w-11/12 mx-auto"
            >
              {/* MAIN_GOAL */}
              <div className="w-full justify-self-center">
                <Select
                  label={t("MAIN.INPUTFIELD.MAIN_GOAL")}
                  color="blue"
                  value={mainGoalIdEdit}
                  onChange={(e) => {
                    setMainGoalIdEdit(e), setErrorEmptyMessage("");
                  }}
                >
                  {mainGoalData &&
                    mainGoalData.map((items) => (
                      <Option
                        key={items.id}
                        value={items.id}
                        className="focus:text-light-blue-700"
                      >
                        {items.name}
                      </Option>
                    ))}
                </Select>
              </div>

              {/* kpi */}
              <div className="w-full justify-self-center">
                <Input
                  type="text"
                  id="name"
                  required
                  color="blue"
                  label={t("MAIN.INPUTFIELD.KPI")}
                  size="lg"
                  value={kpiEdit}
                  onChange={(e) => (
                    setKpiEdit(e.target.value), setErrorEmptyMessage("")
                  )}
                />
              </div>

              {/* <div className="w-full justify-self-center">
                <Input
                  type="text"
                  id="weight"
                  required
                  color="blue"
                  label={t("MAIN.INPUTFIELD.WEIGHT")}
                  size="lg"
                  value={weight}
                  onChange={(e) => (
                    setWeight(e.target.value), setErrorEmptyMessage("")
                  )}
                />
              </div> */}

              <div>
                <p className="text-sm text-red-900">{errorEmptyMessage}</p>
              </div>

              <div className="space-x-2 flex justify-self-end mr-5">
                <Button
                  variant="text"
                  color="red"
                  onClick={handleOpenEdit}
                  className="normal-case"
                >
                  <span> {t("MAIN.INPUTFIELD.CANCEL")}</span>
                </Button>
                <Button
                  variant="text"
                  size="sm"
                  className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                  onClick={handleEdit}
                >
                  {t("MAIN.INPUTFIELD.UPDATE")}
                </Button>
              </div>
            </form>
          )}
        </DialogBody>
      </Dialog >

      {/* add performance */}
      < Dialog open={openPerformance} handler={handleOpenPerformance} size="md" >
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">
            {t("MAIN.INPUTFIELD.ADD_PERFORMANCE")}
          </div>
          <div className="cursor-pointer mr-5" onClick={handleOpenPerformance}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>
        <div className="text-xl font-bold text-black ml-20">
          {t("MAIN.TABLE.REPORT_GOAL")}
        </div>

        <DialogBody className="h-[25rem] items-center">
          <form
            onSubmit={handleAddPerformance}
            className="grid  gap-5 items-centerw-full mx-auto"
          >
            <p className="flex justify-center text-red-900 text-sm">
              {errorEmptyMessage}
            </p>

          </form>
        </DialogBody>
      </Dialog >

      {/* view */}
      {
        showModalView && (
          <div
            onClick={() => setShowModalView(false)}
            className="fixed z-20 inset-0 flex justify-center items-center bg-black bg-opacity-25 "
          >
            <Card
              onClick={handleModalClickView}
              className=" w-2/3 h-2/3 bg-white rounded-md"
            >
              <a
                onClick={handleCloseModalView}
                className="text-black text-xl border-0 bg-white place-self-end mr-5 mt-5 cursor-pointer"
              >
                X
              </a>
              <div className="flex justify-center items-center">
                <h1>View</h1>
              </div>
            </Card>
          </div>
        )
      }
    </>
  );
}
export default Kpiall;