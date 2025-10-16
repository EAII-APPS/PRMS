import {
  faCalendarDays,
  faChartColumn,
  faPenToSquare,
  faPlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Select,
  Tooltip,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../GlobalContexts/Auth-Context";
import axiosInistance from "../GlobalContexts/Base_url";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import {
  deleteSelectedKpi3Data,
  editSelectedKpi3,
  fetchKpi3Data,
} from "../reduxToolKit/slices/kpi3Slice";
import { fetchKpiAllData } from "../reduxToolKit/slices/kpiAllSlice";
import { fetchMainGoalData } from "../reduxToolKit/slices/mainGoalSlice";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import {
  fetchUniteData,
} from "../reduxToolKit/slices/uniteSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Kpi3() {
  const { t } = useTranslation();
  const token = localStorage.getItem("access");

  const weightRegex = /^(100|[1-9]?[0-9])$/;

  const numRegex = /^(0|[1-9]\d*)(\.\d+)?$/;

  const PerfRegex = /^(0|[1-9][0-9]*)(\.[0-9]+)?[a-zA-Z!@#\$%\^\&*\)\(+=._-]*$/;
  const NegativePerfRegex = /^-\d+(\.\d+)?$/;
  const authInfo = useAuth();

  const dispatch = useDispatch();

  //fetch kpi data

  const { kpi3Data } = useSelector((state) => state.kpi3);

  useEffect(() => {
    dispatch(fetchKpi3Data());
  }, []);



  //fetch division data
  const { divisionData } = useSelector((state) => state.division);

  useEffect(() => {
    dispatch(fetchDivisionData());
  }, []);

  const { sectorData } = useSelector((state) => state.sector);

  useEffect(() => {
    dispatch(fetchSectorgData());
  }, []);


  //fetch maingoal data

  const { mainGoalData } = useSelector((state) => state.mainGoal);

  useEffect(() => {
    dispatch(fetchMainGoalData());
  }, []);

  //add

  const [name, setName] = useState("");

  const [divisionId, setDivisionId] = useState(null);

  const [sectorId, setsectorId] = useState("");

  const [main_goal_id, setMain_goal_id] = useState("");

  const [initial, setInitial] = useState("");
  const [firstQnum, setFirstQnum] = useState(null);
  const [secondQnum, setSecondQnum] = useState(null);
  const [thirdQnum, setThirdQnum] = useState(null);
  const [fourthQnum, setFourthQnum] = useState(null);
  const [startyear, setstartyear] = useState("");
  const [endyear, setendyear] = useState("");

  const [annual_plan, setAnnual_plan] = useState("");
  const [fiveyear_plan, setfiveyear_plan] = useState("");
  const [number_part, setNumber_part] = useState(null);


  const [initialUnit, setInitialUnit] = useState("");
  const [measure, setMeasure] = useState("");
  const [goalunit, setGoalunit] = useState("");
  const [goalUnitId, setGoalUnitId] = useState("");
  const [weight, setWeight] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [errorMessageWeight, setErrorMessageWeight] = useState("");

  const [errorEmptyMessage, setErrorEmptyMessage] = useState("");

  const [operations, setOperation] = useState("sum");
  const [kpiAll, setKpiAll] = useState(null);
  const [first_quarter_plan, setFirst_quarter_plan] = useState("");
  const [second_quarter_plan, setSecond_quarter_plan] = useState("");
  const [third_quarter_plan, setThird_quarter_plan] = useState("");
  const [firstQuarterUnit, setFirstQuarterUnit] = useState("");
  const [firstQuarterUnitId, setFirstQuarterUnitId] = useState("");
  const [secondQuarterUnit, setSecondQuarterUnit] = useState("");
  const [secondQuarterUnitId, setSecondQuarterUnitId] = useState("");
  const [thirdQuarterUnit, setThirdQuarterUnit] = useState("");
  const [thirdQuarterUnitId, setThirdQuarterUnitId] = useState("");
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [year, setYear] = useState("");
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear + 1 - 2020 },
    (_, index) => 2013 + index
  );
  let { kpiAllData } = useSelector((state) => state.kpiall);

  // Default to an empty array if kpiAllData is null or undefined
  kpiAllData = kpiAllData || [];

  useEffect(() => {
    dispatch(fetchKpiAllData());
  }, [dispatch]);
  const { uniteData } = useSelector((state) => state.unite);

  useEffect(() => {
    dispatch(fetchUniteData());
  }, []);

  const [open, setOpen] = useState(false);

  const handleNumExtraction = (input) => {
    // Regular expression to match the number part
    const regex = /(\d*\.?\d+)/;
    const match = input.match(regex);
    if (match) {
      const numberPart = parseFloat(match[1]); // Extracts the number part
      return numberPart;
    } else {
      // Handle case where no number is found if needed
      return 0; // Reset or set to default if no number is found
    }
  };

  const handleOpen = () => {

    setOpen(!open);

    setKpiAll("");

    setsectorId("");

    setYear("");

    setFirstQnum("");
    setNumber_part("");
    setSecondQnum("");

    setThirdQnum("");

    setFirst_quarter_plan("");

    setFirstQuarterUnit("");

    setFirstQuarterUnitId("");

    setThird_quarter_plan("");
    setThirdQuarterUnit("");
    setThirdQuarterUnitId("");

    setSecond_quarter_plan("");
    setSecondQuarterUnit("");
    setSecondQuarterUnitId("");

    setDivisionId("");

    setInitial("");

    setInitialUnit("");

    setGoalunit("");

    setMeasure("");

    setWeight("");;

    setMain_goal_id("");

    setfiveyear_plan("");

    setMeasure("");

    setOperation("")

    setWeight("");
    setErrorMessage("");

    setErrorMessageWeight("");

    setErrorEmptyMessage("");
  };

  const handleAddKpi = async (e) => {
    e.preventDefault();

    const measure_id = measure;

    const token = localStorage.getItem("access");

    // if (!main_goal_id) {
    //   setErrorEmptyMessage("please select Main Goal");
    //   setErrorMessageWeight("");
    //   return;
    // }
    if (!kpiAll) {
      setErrorEmptyMessage("please enter kpi");
      setErrorMessageWeight("");

      return;
    }
    if (!first_quarter_plan || !second_quarter_plan || !third_quarter_plan) {
      setErrorEmptyMessage("Please enter plan value for all the years");
      setErrorMessageWeight("");

      return;
    }
    if (!measure) {
      setErrorEmptyMessage(
        "Please select measure!"
      );
      setErrorMessageWeight("");

      return;
    }
    if (!firstQuarterUnitId || !secondQuarterUnitId || !thirdQuarterUnitId) {
      setErrorEmptyMessage("Please select unit for all years");
      setErrorMessageWeight("");

      return;
    }



    if (NegativePerfRegex.test(initial)) {
      setErrorEmptyMessage("Invalid initial, initial can't be negative!");
      setErrorMessageWeight("");

      return;
    }

    if (NegativePerfRegex.test(annual_plan)) {
      setErrorEmptyMessage("Invalid initial, initial can't be negative!");
      setErrorMessageWeight("");

      return;
    }

    if (!PerfRegex.test(year)) {
      setErrorEmptyMessage(
        "Please select a starting year!"
      );
      setErrorMessageWeight("");

      return;
    }
    if (
      operations === "sum" &&
      Number(first_quarter_plan) + 
      Number(second_quarter_plan) + 
      Number(third_quarter_plan) !== Number(annual_plan)
    ) {
      setErrorEmptyMessage("Sum of yearly plans must be equal to the total");
      setErrorMessageWeight("");
      return;
    }
    

    if (!PerfRegex.test(!annual_plan || goalUnitId)) {
      setErrorEmptyMessage(
        "Please provide the total sum for all three years along with the corresponding unit!"
      );
      setErrorMessageWeight("");

      return;
    }

    if (!PerfRegex.test(!initial || initialUnit)) {
      setErrorEmptyMessage(
        "Please provide the initial value along with the corresponding unit!"
      );
      setErrorMessageWeight("");

      return;
    }

    const division_id = authInfo?.user?.division_id || divisionId;
    try {
      const res = await axiosInistance.post(
        "/planApp/threeKPI/",
        {
          kpi: Number(kpiAll),
          measure,
          initial,
          initial_unit_id: Number(initialUnit),
          annual: Number(annual_plan),
          annual_unit_id: Number(goalUnitId),
          year_one: year,
          year_one_value: first_quarter_plan,
          year_one_unit: firstQuarterUnitId,
          year_two: year + 1,
          year_two_value: second_quarter_plan,
          year_two_unit: secondQuarterUnitId,
          year_three: year + 2,
          year_three_value: third_quarter_plan,
          year_three_unit: thirdQuarterUnitId,
          division_id: Number(division_id),
          three_year: annual_plan,
          three_year_unit_id: goalUnitId,
          operation: operations
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 201) {
        toast.success(`KPI Added successfully`, {
          autoClose: 2000,
          hideProgressBar: true,
        });
      }

      setOpen(!open);

      dispatch(fetchKpi3Data());

      setDivisionId("");

      setMain_goal_id("");

      setInitial("");

      setGoal("");

      setMeasure("");

      setWeight("");

      setErrorMessage("");

      setErrorMessageWeight("");
      toast.success(`KPI Added successfully`, {

        autoClose: 2000,
        hideProgressBar: true,
      });

    } catch (error) {
      if (error.response) {
        // When response is available (e.g., API returned a 4xx or 5xx error)
        setErrorMessage(`Error ${error.response.status}: ${error.response.data.message || "An error occurred."}`);
        setErrorMessageWeight(error.response.data.message || "");

        // Show the error using toast notification
        toast.error(error.response.data.message || "An error occurred.", {
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage("No response received from the server.");
        setErrorMessageWeight("Please try again later.");

        toast.error("No response received from the server. Please try again later.", {
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        // Something else went wrong in setting up the request
        setErrorMessage("An unexpected error occurred.");
        setErrorMessageWeight(error.message);
      }
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
    dispatch(deleteSelectedKpi3Data(selectedId));

    setOpenDelete(false);

    fetchKpi3Data();

    toast.success(`KPI Deleted successfully`, {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  // Edit

  const [thirdQuarterUnitIdEdit, setThirdQuarterUnitIdEdit] = useState("");

  const [secondQuarterUnitIdEdit, setSecondQuarterUnitIdEdit] = useState("");

  const [firstQuarterUnitIdEdit, setfirstQuarterUnitIdEdit] = useState("");

  const [yearEdit, setYearEdit] = useState("");

  const [divisionEditId, setDivisionEditId] = useState("");

  const [kpiEdit, setKpiEdit] = useState("");

  const [mainGoalIdEdit, setMainGoalIdEdit] = useState("");

  const [initialEdit, setInitialEdit] = useState("");

  const [firstQuarterPlanEdit, setFirstQuarterPlanEdit] = useState("");

  const [secondQuarterPlanEdit, setSecondQuarterPlanEdit] = useState("");

  const [thirdQuarterPlanEdit, setThirdQuarterPlanEdit] = useState("");

  const [fourthQuarterPlanEdit, setFourthQuarterPlanEdit] = useState("");

  const [measureEdit, setMeasureEdit] = useState("");

  const [weightEdit, setWeightEdit] = useState("");

  const [annual_planEdit, setAnnual_planEdit] = useState("");

  const [operationsEdit, setOperationEdit] = useState("");

  const [editId, setEditId] = useState("");

  const [openEdit, setOpenEdit] = useState(false);

  const [firstQuarterUnitEdit, setFirstQuarterUnitEdit] = useState("");

  const [secondQuarterUnitEdit, setSecondQuarterUnitEdit] = useState("");

  const [thirdQuarterUnitEdit, setThirdQuarterUnitEdit] = useState("");

  const [initialUnitEdit, setInitialUnitEdit] = useState("");

  const [goalUnitEdit, setGoalUnitEdit] = useState();

  const handleOpenEdit = (items) => {
    setErrorMessageWeight("");

    setOpenEdit(!openEdit);

    const division = divisionData.find(
      div => String(div.id) === String(items.division_id)
    );
    
    if (division) {
      setsectorId(division.sector); // Set sector_id from divisiondata
    } else {

    }



    setDivisionEditId(items.division_id);
    setKpiEdit(items.kpi);

    setOperationEdit(items.operation);

    setYearEdit(items.year_one);

    setAnnual_planEdit(items.three_year);

    setInitialEdit(items.initial);

    // setWeightEdit(items.weight);
    setGoalUnitEdit(items.year_three_unit);

    setInitialUnitEdit(items.initial_unit_id);

    setFirstQuarterPlanEdit(items.year_one_value);

    setFirstQuarterUnitEdit(items.year_one_unit);

    setSecondQuarterPlanEdit(items.year_two_value);

    setSecondQuarterUnitEdit(items.year_two_unit);

    setThirdQuarterPlanEdit(items.year_three_value);

    setThirdQuarterUnitEdit(items.year_three_unit);


    setMeasureEdit(items.measure);

    setEditId(items.id);

    setErrorMessage("");
    setErrorMessageWeight("");
    setErrorEmptyMessage("");
    setOperationEdit(items.operation);
    const sectorIdFromDivision = divisionData.find(
      (division) => division.division_id === items.division_id
    )?.sector;

    if (sectorIdFromDivision) {
      setsectorId(sectorIdFromDivision);  // Directly set the sectorId
    } else {
      console.warn("Sector ID not found for the selected division");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setErrorEmptyMessage(""); // Clear previous errors
    setErrorMessageWeight("");

    if (!kpiEdit) {
      setErrorEmptyMessage("Please enter KPI");
      return;
    }

    if (!firstQuarterPlanEdit || !secondQuarterPlanEdit || !thirdQuarterPlanEdit) {
      setErrorEmptyMessage("Please enter plan value for all the years");
      return;
    }

    if (!PerfRegex.test(firstQuarterPlanEdit) || !PerfRegex.test(secondQuarterPlanEdit) || !PerfRegex.test(thirdQuarterPlanEdit)) {
      setErrorEmptyMessage("Please enter a valid number for the plans");
      return;
    }

    if (!firstQuarterUnitEdit || !secondQuarterUnitEdit || !thirdQuarterUnitEdit) {
      setErrorEmptyMessage("Please select a unit for all years");
      return;
    }

    if (NegativePerfRegex.test(initialEdit)) {
      setErrorEmptyMessage("Invalid initial, initial can't be negative!");
      return;
    }

    if (!PerfRegex.test(annual_planEdit)) {
      setErrorEmptyMessage("Invalid total sum, please enter a valid number!");
      return;
    }

    if (!measureEdit) {
      setErrorEmptyMessage("Please select a measure!");
      return;
    }

    if (!PerfRegex.test(yearEdit)) {
      setErrorEmptyMessage("Please select a starting year!");
      return;
    }

    if (operationsEdit === "sum" && (firstQuarterPlanEdit + secondQuarterPlanEdit + thirdQuarterPlanEdit) !== annual_planEdit) {
      setErrorEmptyMessage("Sum of yearly plans must be equal to the total");
      setErrorMessageWeight("");

      return;
    }


    try {
      const response = await dispatch(
        editSelectedKpi3({
          editId,
          kpi: kpiEdit,
          measure: measureEdit,
          year_one: yearEdit,
          year_one_value: firstQuarterPlanEdit,
          year_one_unit: firstQuarterUnitEdit,
          year_two: yearEdit + 1,
          year_two_value: secondQuarterPlanEdit,
          year_two_unit: secondQuarterUnitEdit,
          year_three: yearEdit + 2,
          year_three_value: thirdQuarterPlanEdit,
          year_three_unit: thirdQuarterUnitEdit,
          division_id: divisionEditId,
          initial: initialEdit,
          three_year: annual_planEdit,
          initial_unit_id: initialUnitEdit,
          three_year_unit_id: goalUnitEdit,
          operation: operationsEdit,
        })
      ).unwrap(); // Unwrap to catch potential errors

      dispatch(fetchKpi3Data());
      setOpenEdit(false);

      toast.success(`KPI Updated successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
    catch (error) {
      setErrorMessage(error.response.status);
      setErrorMessage(error.response.data);
      setErrorMessageWeight(error.response.data.message);
    }
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

  useEffect(() => {
    // Filter units based on selected measure
    if (uniteData && measure) {
      const filtered = uniteData.filter((unit) => unit.measure_id === measure);
      setFilteredUnits(filtered);
    } else {
      setFilteredUnits([]); // Clear filtered units if measure is not selected
    }
  }, [uniteData, measure]);

  //handle performance

  const [selectedKpiId, setSelectedKpiId] = useState(null);

  const [firstQuarterPerformance, setFirstQuarterPerformance] = useState("");

  const [firstQuarterPerformanceUnit, setFirstQuarterPerformanceUnit] = useState("");


  const [secondQuarterPerformance, setSecondQuarterPerformance] = useState("");

  const [secondQuarterPerformanceUnit, setSecondQuarterPerformanceUnit] = useState("");

  const [thirdQuarterPerformance, setThirdQuarterPerformance] = useState("");

  const [thirdQuarterPerformanceUnit, setThirdQuarterPerformanceUnit] = useState("");
  const [pr1unit, setPr1Unit] = useState();
  const [pr2unit, setPr2Unit] = useState("");
  const [pr3unit, setPr3Unit] = useState("");


  const [firstQuarterGoal, setFirstQuarterGoal] = useState("");

  const [secondQuarterGoal, setSecondQuarterGoal] = useState("");

  const [thirdQuarterGoal, setThirdQuarterGoal] = useState("");

  const [fourthQuarterGoal, setFourthQuarterGoal] = useState("");

  const [openPerformance, setOpenPerformance] = useState(null);

  const handleOpenPerformance = (items) => {
    dispatch(fetchKpi3Data());
    setOpenPerformance(!openPerformance);

    setSelectedKpiId(items.id);

    setMeasure(items.measure);

    setFirstQuarterGoal(items.year_one_value);

    setFirstQuarterUnit(items.year_one_unit)

    setSecondQuarterGoal(items.year_two_value);

    setSecondQuarterUnit(items.year_two_unit);

    setThirdQuarterGoal(items.year_three_value);

    setThirdQuarterUnit(items.year_three_unit);

    setFirstQuarterPerformance(items.year_one_performance)

    setSecondQuarterPerformance(items.year_two_performance);

    setThirdQuarterPerformance(items.year_three_performance);

    setFirstQuarterPerformanceUnit(items.year_one_performance_unit);

    setSecondQuarterPerformanceUnit(items.year_two_performance_unit);

    setThirdQuarterPerformanceUnit(items.year_three_performance_unit);

    setErrorEmptyMessage("");
  };

  const handleAddPerformance = async () => {
    const token = localStorage.getItem("access");



    if (firstQuarterPerformance && !PerfRegex.test(firstQuarterPerformance)) {
      setErrorEmptyMessage("Invalid first Quarter Performance");
      // setErrorMessageWeight("");

      return;
    }

    if (firstQuarterPerformance && !firstQuarterPerformanceUnit) {
      setErrorEmptyMessage("Please select a unit for the First Quarter Performance");
      return;
    }

    if (secondQuarterPerformance && !PerfRegex.test(secondQuarterPerformance)) {
      setErrorEmptyMessage("Invalid Second Quarter Performance");
      return;
    }
    if (secondQuarterPerformance && !secondQuarterPerformanceUnit) {
      setErrorEmptyMessage("Please select a unit for the First Quarter Performance");
      return;
    }

    if (thirdQuarterPerformance && !PerfRegex.test(thirdQuarterPerformance)) {
      setErrorEmptyMessage("Invalid Third Quarter Performance");
      // setErrorMessageWeight("");

      return;
    }
    if (thirdQuarterPerformance && !thirdQuarterPerformanceUnit) {
      setErrorEmptyMessage("Please select a unit for the First Quarter Performance");
      return;
    }

    try {
      await axiosInistance.put(
        `/planApp/three_performance/${selectedKpiId}/`,
        {
          year_one_performance: firstQuarterPerformance,
          year_two_performance: secondQuarterPerformance,
          year_three_performance: thirdQuarterPerformance,
          year_one_performance_unit: firstQuarterPerformanceUnit,
          year_two_performance_unit: secondQuarterPerformanceUnit,
          year_three_performance_unit: thirdQuarterPerformanceUnit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchKpi3Data());
      setOpenPerformance(false);
      setErrorMessageWeight("");
    } catch (error) { }
  };

  const [transformedData, setTransformedData] = useState([]);

  useEffect(() => {
    // Transform the data

    if (Array.isArray(kpi3Data)) {
      const transformData = (dataArray) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          return [];
        }

        const groupedData = dataArray.reduce((acc, curr) => {
          const {
            main_goal_id,
            maingoal_name,
            kpi_name,
            division_id,
            kpi,
            id,
            name,
            year_one,
            initial,
            initial_unit_id,
            three_year,
            three_year_unit_id,
            year_one_value,
            year_one_unit,
            year_two,
            year_two_value,
            year_two_unit,
            year_three,
            year_three_value,
            year_three_unit,
            measure_id,
            year_one_performance,
            year_one_performance_unit,
            year_two_performance,
            year_two_performance_unit,
            year_three_performance,
            year_three_performance_unit,
            measure,
            operation,
            total,
          } = curr;

          if (!acc[maingoal_name]) {
            acc[maingoal_name] = {
              main_goal_id,
              maingoal_name,
              kpi: [],
            };
          }

          acc[maingoal_name].kpi.push({
            maingoal_name,
            kpi,
            kpi_name,
            division_id,
            id,
            name,
            year_one,
            year_one_value,
            year_one_performance,
            year_one_performance_unit,
            year_one_unit,
            year_two,
            year_two_value,
            year_two_unit,
            year_two_performance,
            year_two_performance_unit,
            year_three,
            year_three_value,
            year_three_unit,
            year_three_performance,
            year_three_performance_unit,
            measure_id,
            measure,
            initial,
            operation,
            initial_unit_id,
            three_year,
            three_year_unit_id,
            total:
              (Number(year_one_value) || 0) +
              (Number(year_two_value) || 0) +
              (Number(year_three_value) || 0),
          });

          return acc;
        }, {});

        return Object.values(groupedData);
      };


      const transformed = transformData(kpi3Data);

      setTransformedData(transformed);
    }
  }, [kpi3Data]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const calculateTotalPages = () => {
      setTotalPages(
        Math.ceil(kpi3Data ? transformedData.length / itemsPerPage : [])
      );
    };
    calculateTotalPages();
  }, [transformedData, itemsPerPage]);
  useEffect(() => {
    if (uniteData && measure) {
      const filteredUnits = uniteData.filter((unit) => unit.measure_id === measure);

      if (filteredUnits.length === 1) {
        const selectedUnit = filteredUnits[0];

        // Auto-select when only 1 unit is available
        setFirstQuarterUnit(selectedUnit.name);
        setFirstQuarterUnitId(selectedUnit.id);

        setSecondQuarterUnit(selectedUnit.name);
        setSecondQuarterUnitId(selectedUnit.id);

        setThirdQuarterUnit(selectedUnit.name);
        setThirdQuarterUnitId(selectedUnit.id);

        setGoalunit(selectedUnit.name);
        setGoalUnitId(selectedUnit.id);

        setInitialUnit(selectedUnit.name);
        setInitialUnit(selectedUnit.id);
      } else {
        // Reset selections when multiple or no units are available
        setFirstQuarterUnit("");
        setFirstQuarterUnitId("");

        setSecondQuarterUnit("");
        setSecondQuarterUnitId("");

        setThirdQuarterUnit("");
        setThirdQuarterUnitId("");

        setGoalunit("");
        setGoalUnitId("");

        setInitialUnit("");
        setInitialUnit("");
      }
    }
  }, [uniteData, measure]);
    useEffect(() => {
      const avgKeywords = ["average", "Average", "መቶኛ", "በመቶኛ", "በመቶ"];
    
      if (measure && measureData.length > 0) {
        const selectedMeasure = measureData.find((item) => item.id === measure);
    
        if (selectedMeasure && avgKeywords.includes(selectedMeasure.name.trim())) {
          setOperation("average");
        } else {
          setOperation("sum");
        }
      }
    }, [measure, measureData]);
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
  const currentPageData = kpi3Data
    ? transformedData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

    const filteredData = currentPageData
    ?.map(item => {
      // Filter kpis that match the search term
      const matchingKpis = item.kpi?.filter(kpi =>
        kpi.kpi_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Check if any KPI matches
      const mainGoalMatches = item.maingoal_name.toLowerCase().includes(searchTerm.toLowerCase());
  
      // If the main goal matches or there are matching KPIs, return the item
      if (mainGoalMatches || matchingKpis.length > 0) {
        return {
          ...item,
          kpi: matchingKpis, // Keep only matching KPIs
        };
      }
  
      return null; // If no match, return null
    })
    .filter(Boolean); // Remove any null entries
  
  const [openKpi, setOPenKpi] = useState(-1);
  const handleOPenKpi = (index) => {
    setTimeout(() => setOPenKpi(openKpi === index ? -1 : index), 50);
  };

  return (
    <>
      <ToastContainer />
      {authInfo ? (
        <div className="grid gap-3 items-center">
          <p className="text-base font-bold font-sans">
            {t("MAIN.SIDEBAR.PLAN.KPI3.TITLE")}
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
                      {t("MAIN.SIDEBAR.PLAN.KPI3.ADDBUTTON")}
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
                    <th
                      scope="col"
                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                    >
                      {t("MAIN.TABLE.NO")}
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                    >
                      {t("MAIN.SIDEBAR.PLAN.MAIN_GOAL.MAIN_GOAL")}
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-center text-md font-bold text-black  tracking-wider"
                    >
                      {t("MAIN.SIDEBAR.PLAN.KPI3.KPI")}
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                    ></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredData &&
                    filteredData.map((items, index) => (
                      <React.Fragment key={items.id}>
                        <tr className="bg-white border-b hover:bg-gray-400 cursor-default">
                          <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td
                            className="p-2  text-left text-sm font-normal text-blue-gray-900 "
                            onClick={() => handleOPenKpi(index)}
                          >
                            <div className="flex gap-2 items-center">
                              {items.maingoal_name}
                              <Tooltip
                                content={`Under this Main Goal There ${items.kpi.length != 0 && items.kpi.length != 1
                                  ? "are"
                                  : "is"
                                  } ${items.kpi.length} Kpi${items.kpi.length != 0 && items.kpi.length != 1
                                    ? "s"
                                    : ""
                                  }`}
                                animate={{
                                  mount: { scale: 1, y: 0 },
                                  unmount: { scale: 0, y: 25 },
                                }}
                              >
                                <Chip
                                  variant="ghost"
                                  color="green"
                                  size="sm"
                                  value={items.kpi.length}
                                  className="rounded-full  text-center normal-case  border border-green-700"
                                />
                              </Tooltip>
                            </div>
                          </td>
                          <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                            {openKpi === index && (
                              <table className="w-full divide-y divide-gray-200">
                                <thead>
                                  <tr>
                                    <th
                                      scope="col"
                                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                                    >
                                      {t("MAIN.TABLE.NO")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                                    >
                                      {t("MAIN.TABLE.NAME")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                                    >
                                      {t("MAIN.SIDEBAR.PLAN.KPI3.STARTYEAR")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                                    >
                                      {t("MAIN.SIDEBAR.PLAN.KPI3.ENDYEAR")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                                    >
                                      {t("MAIN.SIDEBAR.PLAN.KPI3.TOTAL")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                                    >
                                      {t("MAIN.TABLE.STATUS")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="p-2 text-center text-md font-bold text-black  tracking-wider"
                                    >
                                      {t("MAIN.TABLE.ACTION")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {items.kpi &&
                                    items.kpi.map((item, index) => (
                                      <tr
                                        key={item.id}
                                        className="bg-white border-b hover:bg-blue-gray-50 cursor-default "
                                      >
                                        <td className=" p-2  text-left text-sm font-normal text-blue-gray-900">
                                          {index + 1}
                                        </td>
                                        <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                          {item.kpi_name}
                                        </td>
                                        <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                          {item.year_one}
                                        </td>
                                        <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                          {item.year_three}
                                        </td>
                                        <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                          {item.total}
                                        </td>
                                        <td className="p-2  text-left text-sm font-normal text-blue-gray-900 ">
                                          <label className="inline-flex items-center cursor-pointer">
                                            <input
                                              type="checkbox"
                                              defaultChecked
                                              className="sr-only peer"
                                            />
                                            <div
                                              className="relative w-9 h-5
                                    rounded-full peer 
                                    peer-checked:after:translate-x-full  after:absolute after:top-[-1px] 
                                    after:start-[-5px] after:bg-red-900  
                                    after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                    bg-white  border border-gray-200  peer-checked:after:bg-green-900"
                                            ></div>
                                          </label>{" "}
                                        </td>
                                        <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                          <div className="flex items-center justify-center gap-2">
                                            <FontAwesomeIcon
                                              className="cursor-pointer"
                                              icon={faChartColumn}
                                              color="blue"
                                              onClick={() =>
                                                handleOpenPerformance(item)
                                              }
                                            />

                                            {authInfo.user.userPermissions.includes(
                                              "updateKpi"
                                            ) ? (
                                              <FontAwesomeIcon
                                                color="orange"
                                                onClick={() =>
                                                  handleOpenEdit(item)
                                                }
                                                icon={faPenToSquare}
                                                className="cursor-pointer"
                                              />
                                            ) : (
                                              <div></div>
                                            )}
                                            {authInfo.user.userPermissions.includes(
                                              "deleteKpi"
                                            ) ? (
                                              <FontAwesomeIcon
                                                color="red"
                                                onClick={() =>
                                                  handleOpenDelete(
                                                    item.id,
                                                    item.name
                                                  )
                                                }
                                                icon={faTrash}
                                                className="cursor-pointer"
                                              />
                                            ) : (
                                              <div></div>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            )}
                          </td>
                          <td
                            onClick={() => handleOPenKpi(index)}
                            className="p-2  text-center text-sm font-normal text-blue-gray-900 cursor-pointer"
                          >
                            {
                              <ChevronDownIcon
                                strokeWidth={2.5}
                                className={`mx-auto h-4 w-4 transition-transform ${openKpi === index ? "rotate-180" : ""
                                  }`}
                              />
                            }
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
      <Dialog open={open} handler={handleOpen} size="lg">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">{t("MAIN.INPUTFIELD.ADD_KPI3")}</div>
          <div className="cursor-pointer mr-5" onClick={handleOpen}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-[31rem] items-center overflow-auto scrollbar">
          {authInfo.user.userPermissions.includes("createAssign") ||
            authInfo.user.userPermissions.includes("createKpi") ? (
            <form
              onSubmit={handleAddKpi}
              className="grid xl:grid-cols-2 sm:grid-cols-1 justify-between gap-8 items-center w-full mx-auto"
            >
              {(authInfo.user.monitoring_id || authInfo.user.is_superadmin) ? (
                // sector
                <div className="w-11/12 justify-self-center">
                  <Select
                    id="sector"
                    label={t("MAIN.INPUTFIELD.SECTOR")}
                    color="blue"
                    value={sectorId}
                    onChange={(e) => {
                      setsectorId(e), setErrorEmptyMessage("");
                    }}
                  >

                    {sectorData &&
                      sectorData.map((items) => (
                        <Option
                          key={items.id}
                          value={items.id.toString()}
                          className="focus:text-light-blue-700"
                        >
                          {items.name}
                        </Option>
                      ))}
                  </Select>
                </div>
              ) : (
                <div></div>
              )}
              {(authInfo.user.sector_id || authInfo.user.is_superadmin || authInfo.user.monitoring_id) ? (
                //  division
                <div className="w-11/12 justify-self-center">
                  <Select
                    id="kpiAll"
                    label={t("MAIN.INPUTFIELD.DIVISION")}
                    color="blue"
                    value={divisionId}
                    onChange={(value) => {
                      setDivisionId(value); // Correctly capture the selected value
                      setTimeout(() => {
                        setErrorEmptyMessage("");
                      }, 0); // Force a re-render or delay state change
                    }}
                  >
                    {/* Filter divisions based on selected sectorId */}
                    {divisionData &&
                      divisionData
                        .filter((division) => division.sector === Number(sectorId))
                        .map((items) => (
                          <Option
                            key={items.id}
                            value={items.id.toString()}
                            className="focus:text-light-blue-700"
                          >
                            {items.name}
                          </Option>
                        ))}
                  </Select>
                </div>

              ) : (
                <div></div>
              )
              }
              {/* kpiAll */}
              <div className="w-11/12 justify-self-center">
                <Select
                  id="kpiAll"
                  label={t("MAIN.INPUTFIELD.KPI")}
                  color="blue"
                  value={kpiAll}

                  onChange={(e) => {
                    setKpiAll(e), setErrorEmptyMessage("");
                  }}
                >
                  {kpiAllData &&
                    kpiAllData.map((items) => (
                      <Option
                        key={items.id}
                        value={items.id.toString()}
                        className="focus:text-light-blue-700"
                      >
                        {items.name}
                      </Option>
                    ))}
                </Select>
              </div>

              {/* year */}
              <div className="w-11/12 flex justify-self-center">
                <Select
                  label={t("MAIN.TABLE.SELECT_START_YEAR")}
                  value={year}
                  color="blue"
                  onChange={(e) => {
                    setYear(e), setErrorEmptyMessage(""), setErrorMessage("");
                  }}
                  arrow={<FontAwesomeIcon color="blue" icon={faCalendarDays} />}
                >
                  {years.map((year) => (
                    <Option
                      className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                      key={year}
                      value={year}
                    >
                      {year}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* measure */}
              <div className="w-11/12  justify-self-center ">
                <Select
                  label={t("MAIN.INPUTFIELD.MEASURE")}
                  color="blue"
                  value={measure}
                  onChange={(e) => {
                    setMeasure(e), setErrorEmptyMessage("");
                  }}
                  menuProps={{
                    className: `max-h-[200px] overflow-auto scrollbar`,
                  }}
                >
                  {Array.isArray(measureData) && measureData.length > 0 ? (
                    measureData.map((items) =>
                      items ? (
                        <Option
                          key={items.id}
                          value={items.id}
                          className="focus:text-light-blue-700"
                        >
                          {items.name}
                        </Option>
                      ) : null // Handle null or undefined items gracefully
                    )
                  ) : (
                    <Option value="" disabled>
                      No measures available
                    </Option>
                  )}
                </Select>

              </div>

              {/* first year */}
              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  color="blue"
                  id="firstQuarter"
                  label={t("MAIN.INPUTFIELD.FIRST_YEAR_PLAN")}
                  size="lg"
                  value={first_quarter_plan}
                  onChange={(e) => {
                    setFirst_quarter_plan(e.target.value);
                    setFirstQnum(handleNumExtraction(e.target.value));
                    setErrorEmptyMessage("");
                  }}
                />
                {number_part > 0 && operations === "sum" ? (
                  <h1 className="ml-2">{number_part - firstQnum}</h1>
                ) : null}
                <select
                  className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                  value={firstQuarterUnit || ""}
                  onChange={(e) => {
                    const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                    if (selectedUnit) {
                      setFirstQuarterUnit(selectedUnit.name); // Set selected unit
                      setFirstQuarterUnitId(selectedUnit.id); // Set unit ID
                    }
                  }}
                >
                  <option value="" disabled>
                    {firstQuarterUnit || "Select Unit"}
                  </option>
                  {uniteData && uniteData.length > 0 ? (
                    uniteData
                      .filter((unit) => unit.measure_id === measure) // Filter units by measure
                      .map((unit) => (
                        <option className="w-fit" key={unit.id} value={unit.name}>
                          {unit.name}
                        </option>
                      ))
                  ) : uniteData ? (
                    <option disabled>No units available</option>
                  ) : (
                    <option disabled>Loading units...</option>
                  )}
                </select>
              </div>

              {/* weight */}
              {/* <div className="w-11/12  justify-self-center">
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

              {/* INITIAL */}
              <div className="w-11/12 justify-self-center">
                <div className="flex items-center">
                  <Input
                    type="text"
                    id="initial"
                    color="blue"
                    label={t("MAIN.INPUTFIELD.INITIAL")}
                    size="lg"
                    value={initial}
                    onChange={(e) => {
                      setInitial(e.target.value);
                      setErrorEmptyMessage("");
                    }}
                  />
                  <select
                    className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                    value={initialUnit || ""}
                    onChange={(e) => {
                      const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                      if (selectedUnit) {
                        setInitialUnit(selectedUnit.id); // Set unit ID
                      }
                    }}
                  >
                    <option value="" disabled>
                      {initialUnit || "Select Unit"}
                    </option>
                    {uniteData && uniteData.length > 0 ? (
                      uniteData
                        .filter((unit) => unit.measure_id === measure) // Filter units by measure
                        .map((unit) => (
                          <option className="w-fit" key={unit.id} value={unit.name}>
                            {unit.name}
                          </option>
                        ))
                    ) : uniteData ? (
                      <option disabled>No units available</option>
                    ) : (
                      <option disabled>Loading units...</option>
                    )}
                  </select>

                </div>
              </div>

              {/* Second Quarter */}
              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  id="secondQuarter"
                  color="blue"
                  label={t("MAIN.INPUTFIELD.SECOND_YEAR_PLAN")}
                  size="lg"
                  value={second_quarter_plan}
                  onChange={(e) => {
                    setSecond_quarter_plan(e.target.value);
                    setSecondQnum(handleNumExtraction(e.target.value));
                    setErrorEmptyMessage("");
                  }}
                />
                {number_part > 0 && secondQnum && operations === "sum" ? (
                  <h1 className="ml-2">
                    {number_part - firstQnum - secondQnum}
                  </h1>
                ) : null}
                <select
                  className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                  value={secondQuarterUnit || ""}
                  onChange={(e) => {
                    const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                    if (selectedUnit) {
                      setSecondQuarterUnit(selectedUnit.name); // Set selected unit
                      setSecondQuarterUnitId(selectedUnit.id); // Set unit ID
                    }
                  }}
                >
                  <option value="" disabled>
                    {secondQuarterUnit || "Select Unit"}
                  </option>
                  {uniteData && uniteData.length > 0 ? (
                    uniteData
                      .filter((unit) => unit.measure_id === measure) // Filter units by measure
                      .map((unit) => (
                        <option className="w-fit" key={unit.id} value={unit.name}>
                          {unit.name}
                        </option>
                      ))
                  ) : uniteData ? (
                    <option disabled>No units available</option>
                  ) : (
                    <option disabled>Loading units...</option>
                  )}
                </select>
              </div>

              {/* GOAL */}
              <div className="w-11/12 flex justify-self-center">

                <Input
                  type="text"
                  color="blue"
                  id="annualplan"
                  label={t("MAIN.INPUTFIELD.TOTAL")}
                  size="lg"
                  onChange={(e) => {
                    setAnnual_plan(e.target.value);
                    setNumber_part(handleNumExtraction(e.target.value));
                    setErrorEmptyMessage("");
                  }}
                />

                <select
                  className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                  value={goalunit || ""}
                  onChange={(e) => {
                    const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                    if (selectedUnit) {
                      setGoalunit(selectedUnit.name); // Set selected unit
                      setGoalUnitId(selectedUnit.id); // Set unit ID
                    }
                  }}
                >
                  <option value="" disabled>
                    {goalunit || "Select Unit"}
                  </option>
                  {uniteData && uniteData.length > 0 ? (
                    uniteData
                      .filter((unit) => unit.measure_id === measure) // Filter units by measure
                      .map((unit) => (
                        <option className="w-fit" key={unit.id} value={unit.name}>
                          {unit.name}
                        </option>
                      ))
                  ) : uniteData ? (
                    <option disabled>No units available</option>
                  ) : (
                    <option disabled>Loading units...</option>
                  )}
                </select>
              </div>

              {/* Third Quarter */}
              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  color="blue"
                  id="thirdQuarter"
                  label={t("MAIN.INPUTFIELD.THIRD_YEAR_PLAN")}
                  size="lg"
                  value={third_quarter_plan}
                  onChange={(e) => {
                    setThird_quarter_plan(e.target.value);
                    setThirdQnum(handleNumExtraction(e.target.value));
                    setErrorEmptyMessage("");
                  }}
                />
                {number_part > 0 && thirdQnum && operations === "sum" ? (
                  <h1 className="ml-2">
                    {number_part - firstQnum - secondQnum - thirdQnum}
                  </h1>
                ) : null}
                <select
                  className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                  value={thirdQuarterUnit || ""}
                  onChange={(e) => {
                    const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                    if (selectedUnit) {
                      setThirdQuarterUnit(selectedUnit.name); // Set selected unit
                      setThirdQuarterUnitId(selectedUnit.id); // Set unit ID
                    }
                  }}
                >
                  <option value="" disabled>
                    {thirdQuarterUnit || "Select Unit"}
                  </option>
                  {uniteData && uniteData.length > 0 ? (
                    uniteData
                      .filter((unit) => unit.measure_id === measure) // Filter units by measure
                      .map((unit) => (
                        <option className="w-fit" key={unit.id} value={unit.name}>
                          {unit.name}
                        </option>
                      ))
                  ) : uniteData ? (
                    <option disabled>No units available</option>
                  ) : (
                    <option disabled>Loading units...</option>
                  )}
                </select>
              </div>

              {/* Operation */}
              <div className="w-11/12 justify-self-center">
                <label htmlFor="operation-select" className="mr-4">Select Operation:</label>
                <select
                  defaultValue={"sum"}
                  id="operation-select"
                  value={operations}
                  onChange={(e) => setOperation(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="sum">Sum</option>
                  <option value="average">Average</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="space-x-2 flex justify-self-center mr-5">
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
              <div className="w-11/12  justify-self-center">
                {errorMessage && errorMessage === 403 && (
                  <h1 className="text-red-900 font-bold ml-3">
                    {errorMessageWeight}
                  </h1>
                )}
                <p className="text-red-500 text-sm">{errorEmptyMessage}</p>
              </div>

            </form>
          ) : (
            <form
              onSubmit={handleAddKpi}
              className="grid xl:grid-cols-2 sm:grid-cols-1 justify-between gap-5 items-center w-full mx-auto"
            >
              <div className="w-11/12 justify-self-center">
                <Select
                  label={t("MAIN.INPUTFIELD.MAIN_GOAL")}
                  color="blue"
                  value={main_goal_id}
                  onChange={(e) => {
                    setMain_goal_id(e), setErrorEmptyMessage("");
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

              <div className="w-11/12  justify-self-center">
                <Input
                  type="text"
                  id="initial"
                  color="blue"
                  label={t("MAIN.INPUTFIELD.INITIAL")}
                  size="lg"
                  value={initial}
                  onChange={(e) => (
                    setInitial(e.target.value), setErrorEmptyMessage("")
                  )}
                />
              </div>

              <div className="w-11/12  justify-self-center">
                <Input
                  type="text"
                  color="blue"
                  id="annualplan"
                  label={t("MAIN.INPUTFIELD.ANNUAL")}
                  size="lg"
                  value={fiveyear_plan}
                  onChange={(e) => {
                    setfiveyear_plan(e.target.value);
                    setNumber_part(handleNumExtraction(e.target.value));
                    setErrorEmptyMessage("");
                  }}
                />
              </div>

              <div className="w-11/12 flex justify-self-center">
                {/* <p className="font-sans font-bold text-black flex justify-center cursor-default">Quarters</p> */}
                <Input
                  type="text"
                  color="blue"
                  id="firstQuarter"
                  label={t("MAIN.INPUTFIELD.FIRST_QUARTER")}
                  size="lg"
                  value={first_quarter_plan}
                  onChange={(e) => (
                    setFirst_quarter_plan(e.target.value),
                    setFirstQnum(handleNumExtraction(e.target.value)),
                    setErrorEmptyMessage("")
                  )}
                />
                {number_part > 0 && operations === "sum" ? (
                  <h1 className="ml-2">{number_part - firstQnum}</h1>
                ) : null}
              </div>

              <div className="w-11/12  justify-self-center">
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

              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  id="secondQuarter"
                  color="blue"
                  label={t("MAIN.INPUTFIELD.SECOND_QUARTER")}
                  size="lg"
                  value={second_quarter_plan}
                  onChange={(e) => (
                    setSecond_quarter_plan(e.target.value),
                    setSecondQnum(handleNumExtraction(e.target.value)),
                    setErrorEmptyMessage("")
                  )}
                />
                {number_part > 0 && secondQnum && operations === "sum" ? (
                  <h1 className="ml-2">{number_part - firstQnum - secondQnum}</h1>
                ) : null}
              </div>

              <div className="w-11/12  justify-self-center">
                <Select
                  label={t("MAIN.INPUTFIELD.MEASURE")}
                  color="blue"
                  value={measure}
                  onChange={(e) => {
                    setMeasure(e), setErrorEmptyMessage("");
                  }}
                  menuProps={{
                    className: `max-h-[200px] overflow-auto scrollbar`,
                  }}
                >
                  {Array.isArray(measureData) &&
                    measureData.map((items) => (
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

              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  color="blue"
                  id="thirdQuarter"
                  label={t("MAIN.INPUTFIELD.THIRD_QUARTER")}
                  size="lg"
                  value={third_quarter_plan}
                  onChange={(e) => (
                    setThird_quarter_plan(e.target.value),
                    setThirdQnum(handleNumExtraction(e.target.value)),
                    setErrorEmptyMessage("")
                  )}
                />
                {number_part > 0 && thirdQnum && operations === "sum" ? (
                  <h1 className="ml-2">{number_part - firstQnum - thirdQnum}</h1>
                ) : null}
              </div>



              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  id="fourthQuarter"
                  color="blue"
                  label={t("MAIN.INPUTFIELD.FOURTH_QUARTER")}
                  size="lg"
                  value={first_quarter_plan}
                  onChange={(e) => (
                    setFirst_quarter_plan(e.target.value),
                    setFourthQnum(handleNumExtraction(e.target.value)),
                    setErrorEmptyMessage("")
                  )}
                />
                {number_part > 0 && fourthQnum && operations === "sum" ? (
                  <h1 className="ml-2">{number_part - firstQnum - thirdQnum - fourthQnum}</h1>
                ) : null}
              </div>
              
              <div className="w-11/12  justify-self-center">
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
              </div>

              <div className="w-11/12  justify-self-center">
                {errorMessage && errorMessage === 403 && (
                  <h1 className="text-red-900 font-bold ml-3">
                    {errorMessageWeight}
                  </h1>
                )}
                <p className="text-red-500 text-sm">{errorEmptyMessage}</p>
              </div>

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
          )}
        </DialogBody>
      </Dialog>

      {/* delete */}
      <Dialog open={openDelete} handler={handleOpenDelete}>
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
      </Dialog>

      {/* Edit */}
      <Dialog open={openEdit} handler={handleOpenEdit} size="lg">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5"> {t("MAIN.INPUTFIELD.UPDATE_KPI")}</div>
          <div className="cursor-pointer mr-5" onClick={handleOpenEdit}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className=" items-center ">
          {authInfo.user.userPermissions.includes("createAssign") ||
            authInfo.user.userPermissions.includes("createMainActivity") ? (
            <form
              onSubmit={handleEdit}
              className="grid grid-cols-2 justify-between gap-5 items-center w-full mx-auto"
            >

              {(authInfo.user.monitoring_id || authInfo.user.is_superadmin || authInfo.user.userPermissions.includes("createAssign")) ? (
                // Sector
                <div className="w-11/12 justify-self-center">
                  <label htmlFor="sectorSelect" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.SECTOR")}
                  </label>
                  <select
                    id="sectorSelect"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={sectorId || ""} // Set the selected sectorId for editing
                    onChange={(e) => {
                      setsectorId(e.target.value); // Update sectorId state on change
                      setErrorEmptyMessage("");
                    }}
                  >
                    <option value="" disabled>
                      {t("MAIN.INPUTFIELD.SELECT_SECTOR")}
                    </option>
                    {sectorData &&
                      sectorData.map((items) => (
                        <option
                          key={items.id}
                          value={items.id.toString()}
                          className="focus:text-light-blue-700"
                        >
                          {items.name}
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <div></div>
              )}

              {(authInfo.user.sector_id || authInfo.user.is_superadmin || authInfo.user.monitoring_id) && (
                <div className="w-11/12 justify-self-center">
                  <label htmlFor="divisionSelect" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.DIVISION")}
                  </label>
                  <select
                    id="divisionSelect"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={divisionEditId || ""} // Set the selected divisionEditId as the value for the dropdown
                    onChange={(e) => setDivisionEditId(e.target.value)} // Update the divisionEditId state on change
                  >
                    <option value="" disabled>
                      {t("MAIN.INPUTFIELD.SELECT_DIVISION")}
                    </option>
                    {divisionData &&
                      divisionData
                        .filter((division) => division.sector === Number(sectorId)) // Filter divisions based on sectorId
                        .map((item) => (
                          <option key={item.id} value={item.id.toString()}>
                            {item.name}
                          </option>
                        ))}
                  </select>
                </div>
              )}

              {/* kpiAll */}
              <div className="w-11/12 justify-self-center">
                <label htmlFor="kpiAll" className="block text-sm font-medium text-gray-700">
                  {t("MAIN.INPUTFIELD.KPI")}
                </label>
                <select
                  id="kpiAll"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={kpiEdit}
                  onChange={(e) => {
                    setKpiEdit(e.target.value);
                    setErrorEmptyMessage("");
                  }}
                >
                  <option value="" disabled>
                    {t("MAIN.INPUTFIELD.SELECT_OPTION")} {/* Placeholder option */}
                  </option>
                  {kpiAllData &&
                    kpiAllData.map((items) => (
                      <option key={items.id} value={items.id.toString()}>
                        {items.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* year */}
              <div className="w-11/12 block justify-self-center">
                <label htmlFor="yearSelect" className="block text-sm font-medium text-gray-700">
                  {t("MAIN.TABLE.SELECT_YEAR")}
                </label>
                <div className="flex w-full">
                  <select
                    id="yearSelect"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={yearEdit || ""}
                    onChange={(e) => {
                      setYearEdit(e.target.value);
                      setErrorEmptyMessage("");
                      setErrorMessage("");
                    }}
                  >
                    <option value="" disabled>
                      {t("MAIN.TABLE.SELECT_YEAR")}
                    </option>
                    {years.map((year) => (
                      <option
                        className="whitespace-nowrap text-left text-md font-medium text-black"
                        key={year}
                        value={year}
                      >
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* measure */}
              <div className="w-11/12 justify-self-center">
                <label htmlFor="measureSelect" className="block text-sm font-medium text-gray-700">
                  {t("MAIN.INPUTFIELD.MEASURE")}
                </label>
                <select
                  id="measureSelect"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md max-h-[200px] overflow-auto scrollbar"
                  value={measureEdit}
                  onChange={(e) => {
                    setMeasureEdit(e.target.value);
                    setErrorEmptyMessage("");
                  }}
                >
                  {Array.isArray(measureData) && measureData.length > 0 ? (
                    measureData.map((items) =>
                      items ? (
                        <option key={items.id} value={items.id}>
                          {items.name}
                        </option>
                      ) : null // Handle null or undefined items gracefully
                    )
                  ) : (
                    <option value="" disabled>
                      {t("MAIN.INPUTFIELD.NO_MEASURES")} {/* Translatable "No measures available" text */}
                    </option>
                  )}
                </select>
              </div>

              {/* First Quarter */}
              <div className="w-11/12 flex justify-self-center">
                {/* Input for First Quarter Plan */}
                <div className="w-[60%]">
                  <label htmlFor="firstQuarterInput" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.FIRST_YEAR_PLAN")}
                  </label>
                  <input
                    type="text"
                    id="firstQuarterInput"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={firstQuarterPlanEdit}
                    onChange={(e) => {
                      setFirstQuarterPlanEdit(e.target.value);
                      setFirstQnum(handleNumExtraction(e.target.value));
                      setErrorEmptyMessage("");
                    }}
                  />
                </div>

                {/* Difference Display */}
                {number_part > 0 && operationsEdit === "sum" && (
                  <h1 className="ml-2 self-center text-gray-700">{number_part - firstQnum}</h1>
                )}

                {/* Dropdown for Unit Selection */}
                <div className="w-[40%] ml-4">
                  <label htmlFor="firstQuarterUnit" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.UNIT")}
                  </label>
                  <select
                    id="firstyearunit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={
                      uniteData.find((unit) => unit.id === firstQuarterUnitEdit)?.symbol || ""
                    }
                    onChange={(e) => {
                      const selectedSymbol = e.target.value; // Get the selected symbol
                      setFirstQuarterUnitEdit(selectedSymbol); // Update the selected symbol
                      // Find the corresponding unit ID based on the selected symbol
                      const selectedUnit = uniteData.find((unit) => unit.symbol === selectedSymbol);
                      if (selectedUnit) {
                        setFirstQuarterUnitEdit(selectedUnit.id); // Set the corresponding unit ID
                      }
                    }}
                  >
                    {uniteData && uniteData.length > 0 ? (
                      uniteData
                        .filter((unit) => unit.measure_id === measureEdit) // Filter units by measure
                        .map((unit) => (
                          <option className="w-fit" key={unit.id} value={unit.name}>
                            {unit.name}
                          </option>
                        ))
                    ) : uniteData ? (
                      <option disabled>No units available</option>
                    ) : (
                      <option disabled>Loading units...</option>
                    )}
                  </select>

                </div>
              </div>

              {/* INITIAL */}
              <div className="w-11/12 flex justify-self-center">
                {/* Input for INITIAL Plan */}
                <div className="w-[60%]">
                  <label htmlFor="firstQuarterInput" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.INITIAL")}
                  </label>
                  <input
                    type="text"
                    id="initialplanedit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={initialEdit}
                    onChange={(e) => {
                      setInitialEdit(e.target.value);
                      setErrorEmptyMessage("");
                    }}
                  />
                </div>

                {/* Dropdown for Unit Selection */}
                <div className="w-[40%] ml-4">
                  <label htmlFor="firstQuarterUnit" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.UNIT")}
                  </label>
                  <select
                    id="initialunit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={
                      uniteData.find((unit) => unit.id === initialUnitEdit)?.symbol || "bambararigaro"
                    }
                    onChange={(e) => {
                      const selectedSymbol = e.target.value; // Get the selected symbol
                      setInitialUnitEdit(selectedSymbol); // Update the selected symbol
                      // Find the corresponding unit ID based on the selected symbol
                      const selectedUnit = uniteData.find((unit) => unit.symbol === selectedSymbol);
                      if (selectedUnit) {
                        setInitialUnitEdit(selectedUnit.id); // Set the corresponding unit ID
                      }
                    }}
                  >
                    {uniteData && uniteData.length > 0 ? (
                      uniteData
                        .filter((unit) => unit.measure_id === measureEdit) // Filter units by measure
                        .map((unit) => (
                          <option className="w-fit" key={unit.id} value={unit.name}>
                            {unit.name}
                          </option>
                        ))
                    ) : uniteData ? (
                      <option disabled>No units available</option>
                    ) : (
                      <option disabled>Loading units...</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Second Quarter */}
              <div className="w-11/12 flex justify-self-center">
                <div className="w-[60%]">
                  <label htmlFor="firstQuarterInput" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.SECOND_YEAR_PLAN")}
                  </label>
                  <input
                    type="text"
                    id="firstQuarterInput"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={secondQuarterPlanEdit}
                    onChange={(e) => {
                      setSecondQuarterPlanEdit(e.target.value);
                      setSecondQnum(handleNumExtraction(e.target.value));
                      setErrorEmptyMessage("");
                    }}

                  />
                </div>
                {number_part > 0 && secondQnum && operationsEdit === "sum" ? (
                  <h1 className="ml-2">
                    {number_part - firstQnum - secondQnum}
                  </h1>
                ) : null}
                <div className="w-[40%] ml-4">
                  <label htmlFor="firstQuarterUnit" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.UNIT")}
                  </label>
                  <select
                    id="secondyearunit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={
                      uniteData.find((unit) => unit.id === secondQuarterUnitEdit)?.symbol || ""
                    }
                    onChange={(e) => {
                      const selectedSymbol = e.target.value; // Get the selected symbol
                      setSecondQuarterUnitEdit(selectedSymbol); // Update the selected symbol
                      // Find the corresponding unit ID based on the selected symbol
                      const selectedUnit = uniteData.find((unit) => unit.symbol === selectedSymbol);
                      if (selectedUnit) {
                        setSecondQuarterUnitEdit(selectedUnit.id); // Set the corresponding unit ID
                      }
                    }}
                  >
                    {uniteData && uniteData.length > 0 ? (
                      uniteData
                        .filter((unit) => unit.measure_id === measureEdit) // Filter units by measure
                        .map((unit) => (
                          <option className="w-fit" key={unit.id} value={unit.name}>
                            {unit.name}
                          </option>
                        ))
                    ) : uniteData ? (
                      <option disabled>No units available</option>
                    ) : (
                      <option disabled>Loading units...</option>
                    )}
                  </select>
                </div>
              </div>

              {/* GOAL */}
              <div className="w-11/12 flex justify-self-center">
                <div className="w-[60%]">
                  <label htmlFor="totalInput" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.TOTAL")}
                  </label>
                  <input
                    type="text"
                    id="goaledit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={annual_planEdit}
                    onChange={(e) => {
                      setAnnual_planEdit(e.target.value);
                      setNumber_part(handleNumExtraction(e.target.value));
                      setErrorEmptyMessage("");
                    }}

                  />
                </div>
                {number_part > 0 && secondQnum && operations === "sum" ? (
                  <h1 className="ml-2">
                    {number_part - firstQnum - secondQnum}
                  </h1>
                ) : null}
                <div className="w-[40%] ml-4">
                  <label htmlFor="goalunitedit" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.UNIT")}
                  </label>
                  <select
                    id="goalunitedit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={
                      uniteData.find((unit) => unit.id === goalUnitEdit)?.symbol || ""
                    }
                    onChange={(e) => {
                      const selectedSymbol = e.target.value; // Get the selected symbol
                      setGoalUnitEdit(selectedSymbol); // Update the selected symbol
                      // Find the corresponding unit ID based on the selected symbol
                      const selectedUnit = uniteData.find((unit) => unit.symbol === selectedSymbol);
                      if (selectedUnit) {
                        setGoalUnitEdit(selectedUnit.id); // Set the corresponding unit ID
                      }
                    }}
                  >
                    {uniteData && uniteData.length > 0 ? (
                      uniteData
                        .filter((unit) => unit.measure_id === measureEdit) // Filter units by measure
                        .map((unit) => (
                          <option className="w-fit" key={unit.id} value={unit.name}>
                            {unit.name}
                          </option>
                        ))
                    ) : uniteData ? (
                      <option disabled>No units available</option>
                    ) : (
                      <option disabled>Loading units...</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Third Quarter */}
              <div className="w-11/12 flex justify-self-center">
                <div className="w-[60%]">
                  <label htmlFor="thirdQuarterinput" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.THIRD_YEAR_PLAN")}
                  </label>
                  <input
                    type="text"
                    id="thirdQuarterinput"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={thirdQuarterPlanEdit}
                    onChange={(e) => {
                      setThirdQuarterPlanEdit(e.target.value);
                      setThirdQnum(handleNumExtraction(e.target.value));
                      setErrorEmptyMessage("");
                    }}
                  />
                </div>
                {number_part > 0 && thirdQnum && operationsEdit === "sum" ? (
                  <h1 className="ml-2">
                    {number_part - firstQnum - secondQnum - thirdQnum}
                  </h1>
                ) : null}
                <div className="w-[40%] ml-4">
                  <label htmlFor="thirdQuarterUnit" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.UNIT")}
                  </label>
                  <select
                    id="thirdyearunit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={
                      uniteData.find((unit) => unit.id === thirdQuarterUnitEdit)?.symbol || ""
                    }
                    onChange={(e) => {
                      const selectedSymbol = e.target.value; // Get the selected symbol
                      setThirdQuarterUnitEdit(selectedSymbol); // Update the selected symbol
                      // Find the corresponding unit ID based on the selected symbol
                      const selectedUnit = uniteData.find((unit) => unit.symbol === selectedSymbol);
                      if (selectedUnit) {
                        setThirdQuarterUnitEdit(selectedUnit.id); // Set the corresponding unit ID
                      }
                    }}
                  >
                    {uniteData && uniteData.length > 0 ? (
                      uniteData
                        .filter((unit) => unit.measure_id === measureEdit) // Filter units by measure
                        .map((unit) => (
                          <option className="w-fit" key={unit.id} value={unit.name}>
                            {unit.name}
                          </option>
                        ))
                    ) : uniteData ? (
                      <option disabled>No units available</option>
                    ) : (
                      <option disabled>Loading units...</option>
                    )}
                  </select>

                </div>
              </div>

              {/* Operation */}
              <div className="w-11/12 justify-self-center">
                <label htmlFor="operation-select" className="mr-4">Select Operation:</label>
                <select
                  id="operation-select"
                  value={operationsEdit}
                  onChange={(e) => setOperationEdit(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="sum">Sum</option>
                  <option value="average">Average</option>
                </select>
              </div>

              <div className="space-x-2 flex justify-self-center mr-5">
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

              <div className="w-11/12  justify-self-center">
                {errorMessage && errorMessage === 403 && (
                  <h1 className="text-red-900 font-bold ml-3">
                    {errorMessageWeight}
                  </h1>
                )}
                <p className="text-red-500 text-sm">{errorEmptyMessage}</p>
              </div>

            </form>
          ) : (
            <form
              onSubmit={handleEdit}
              className="grid grid-cols-2 justify-between gap-5 items-center w-full mx-auto"
            >
              {/* kpiAll */}
              <div className="w-11/12 justify-self-center">
                <label htmlFor="kpiAll" className="block text-sm font-medium text-gray-700">
                  {t("MAIN.INPUTFIELD.KPI")}
                </label>
                <select
                  id="kpiAll"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={kpiEdit}
                  onChange={(e) => {
                    setKpiEdit(e.target.value);
                    setErrorEmptyMessage("");
                  }}
                >
                  <option value="" disabled>
                    {t("MAIN.INPUTFIELD.SELECT_OPTION")} {/* Placeholder option */}
                  </option>
                  {kpiAllData &&
                    kpiAllData.map((items) => (
                      <option key={items.id} value={items.id.toString()}>
                        {items.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* year */}
              <div className="w-11/12 block justify-self-center">
                <label htmlFor="yearSelect" className="block text-sm font-medium text-gray-700">
                  {t("MAIN.TABLE.SELECT_YEAR")}
                </label>
                <div className="flex w-full">
                  <select
                    id="yearSelect"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={yearEdit || ""}
                    onChange={(e) => {
                      setYearEdit(e.target.value);
                      setErrorEmptyMessage("");
                      setErrorMessage("");
                    }}
                  >
                    <option value="" disabled>
                      {t("MAIN.TABLE.SELECT_YEAR")}
                    </option>
                    {years.map((year) => (
                      <option
                        className="whitespace-nowrap text-left text-md font-medium text-black"
                        key={year}
                        value={year}
                      >
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* measure */}
              <div className="w-11/12 justify-self-center">
                <label htmlFor="measureSelect" className="block text-sm font-medium text-gray-700">
                  {t("MAIN.INPUTFIELD.MEASURE")}
                </label>
                <select
                  id="measureSelect"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md max-h-[200px] overflow-auto scrollbar"
                  value={measureEdit}
                  onChange={(e) => {
                    setMeasureEdit(e.target.value);
                    setErrorEmptyMessage("");
                  }}
                >
                  {Array.isArray(measureData) && measureData.length > 0 ? (
                    measureData.map((items) =>
                      items ? (
                        <option key={items.id} value={items.id}>
                          {items.name}
                        </option>
                      ) : null // Handle null or undefined items gracefully
                    )
                  ) : (
                    <option value="" disabled>
                      {t("MAIN.INPUTFIELD.NO_MEASURES")} {/* Translatable "No measures available" text */}
                    </option>
                  )}
                </select>
              </div>

              {/* First Quarter */}
              <div className="w-11/12 flex justify-self-center">
                {/* Input for First Quarter Plan */}
                <div className="w-[60%]">
                  <label htmlFor="firstQuarterInput" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.FIRST_QUARTER")}
                  </label>
                  <input
                    type="text"
                    id="firstQuarterInput"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={firstQuarterPlanEdit}
                    onChange={(e) => {
                      setFirstQuarterPlanEdit(e.target.value);
                      setFirstQnum(handleNumExtraction(e.target.value));
                      setErrorEmptyMessage("");
                    }}
                  />
                </div>

                {/* Difference Display */}
                {number_part > 0 && operations === "sum" && (
                  <h1 className="ml-2 self-center text-gray-700">{number_part - firstQnum}</h1>
                )}

                {/* Dropdown for Unit Selection */}
                <div className="w-[40%] ml-4">
                  <label htmlFor="firstQuarterUnit" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.UNIT")}
                  </label>
                  <select
                    id="firstyearunit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={
                      uniteData.find((unit) => unit.id === firstQuarterUnitEdit)?.symbol || ""
                    }
                    onChange={(e) => {
                      const selectedSymbol = e.target.value; // Get the selected symbol
                      setFirstQuarterUnitEdit(selectedSymbol); // Update the selected symbol
                      // Find the corresponding unit ID based on the selected symbol
                      const selectedUnit = uniteData.find((unit) => unit.symbol === selectedSymbol);
                      if (selectedUnit) {
                        setFirstQuarterUnitEdit(selectedUnit.id); // Set the corresponding unit ID
                      }
                    }}
                  >
                    {uniteData.map((unit) => (
                      <option key={unit.id} value={unit.symbol}>
                        {unit.symbol}
                      </option>
                    ))}
                  </select>

                </div>
              </div>

              {/* INITIAL */}
              <div className="w-11/12 flex justify-self-center">
                {/* Input for INITIAL Plan */}
                <div className="w-[60%]">
                  <label htmlFor="firstQuarterInput" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.INITIAL")}
                  </label>
                  <input
                    type="text"
                    id="initialplanedit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={initialEdit}
                    onChange={(e) => {
                      setInitialEdit(e.target.value);
                      setErrorEmptyMessage("");
                    }}
                  />
                </div>

                {/* Dropdown for Unit Selection */}
                <div className="w-[40%] ml-4">
                  <label htmlFor="firstQuarterUnit" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.UNIT")}
                  </label>
                  <select
                    id="initialunit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={
                      uniteData.find((unit) => unit.id === initialUnitEdit)?.symbol || ""
                    }
                    onChange={(e) => {
                      const selectedSymbol = e.target.value; // Get the selected symbol
                      setInitialUnitEdit(selectedSymbol); // Update the selected symbol
                      // Find the corresponding unit ID based on the selected symbol
                      const selectedUnit = uniteData.find((unit) => unit.symbol === selectedSymbol);
                      if (selectedUnit) {
                        setInitialUnitEdit(selectedUnit.id); // Set the corresponding unit ID
                      }
                    }}
                  >
                    {uniteData.map((unit) => (
                      <option key={unit.id} value={unit.symbol}>
                        {unit.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Second Quarter */}
              <div className="w-11/12 flex justify-self-center">
                <div className="w-[60%]">
                  <label htmlFor="firstQuarterInput" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.SECOND_YEAR_PLAN")}
                  </label>
                  <input
                    type="text"
                    id="firstQuarterInput"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={secondQuarterPlanEdit}
                    onChange={(e) => {
                      setSecondQuarterPlanEdit(e.target.value);
                      setSecondQnum(handleNumExtraction(e.target.value));
                      setErrorEmptyMessage("");
                    }}

                  />
                </div>
                {number_part > 0 && secondQnum && operations === "sum" ? (
                  <h1 className="ml-2">
                    {number_part - firstQnum - secondQnum}
                  </h1>
                ) : null}
                <div className="w-[40%] ml-4">
                  <label htmlFor="firstQuarterUnit" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.UNIT")}
                  </label>
                  <select
                    id="secondyearunit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={
                      uniteData.find((unit) => unit.id === secondQuarterUnitEdit)?.symbol || ""
                    }
                    onChange={(e) => {
                      const selectedSymbol = e.target.value; // Get the selected symbol
                      setSecondQuarterUnitEdit(selectedSymbol); // Update the selected symbol
                      // Find the corresponding unit ID based on the selected symbol
                      const selectedUnit = uniteData.find((unit) => unit.symbol === selectedSymbol);
                      if (selectedUnit) {
                        setSecondQuarterUnitEdit(selectedUnit.id); // Set the corresponding unit ID
                      }
                    }}
                  >
                    {uniteData.map((unit) => (
                      <option key={unit.id} value={unit.symbol}>
                        {unit.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* GOAL */}
              <div className="w-11/12 flex justify-self-center">
                <div className="w-[60%]">
                  <label htmlFor="totalInput" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.TOTAL")}
                  </label>
                  <input
                    type="text"
                    id="goaledit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={annual_planEdit}
                    onChange={(e) => {
                      setAnnual_planEdit(e.target.value);
                      setNumber_part(handleNumExtraction(e.target.value));
                      setErrorEmptyMessage("");
                    }}

                  />
                </div>
                {number_part > 0 && secondQnum && operations === "sum" ? (
                  <h1 className="ml-2">
                    {number_part - firstQnum - secondQnum}
                  </h1>
                ) : null}
                <div className="w-[40%] ml-4">
                  <label htmlFor="goalunitedit" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.UNIT")}
                  </label>
                  <select
                    id="goalunitedit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={
                      uniteData.find((unit) => unit.id === goalUnitEdit)?.symbol || ""
                    }
                    onChange={(e) => {
                      const selectedSymbol = e.target.value; // Get the selected symbol
                      setGoalUnitEdit(selectedSymbol); // Update the selected symbol
                      // Find the corresponding unit ID based on the selected symbol
                      const selectedUnit = uniteData.find((unit) => unit.symbol === selectedSymbol);
                      if (selectedUnit) {
                        setGoalUnitEdit(selectedUnit.id); // Set the corresponding unit ID
                      }
                    }}
                  >
                    {uniteData.map((unit) => (
                      <option key={unit.id} value={unit.symbol}>
                        {unit.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Third Quarter */}
              <div className="w-11/12 flex justify-self-center">
                <div className="w-[60%]">
                  <label htmlFor="thirdQuarterinput" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.THIRD_YEAR_PLAN")}
                  </label>
                  <input
                    type="text"
                    id="thirdQuarterinput"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={thirdQuarterPlanEdit}
                    onChange={(e) => {
                      setThirdQuarterPlanEdit(e.target.value);
                      setThirdQnum(handleNumExtraction(e.target.value));
                      setErrorEmptyMessage("");
                    }}
                  />
                </div>
                {number_part > 0 && thirdQnum && operations === "sum" ? (
                  <h1 className="ml-2">
                    {number_part - firstQnum - secondQnum - thirdQnum}
                  </h1>
                ) : null}
                <div className="w-[40%] ml-4">
                  <label htmlFor="thirdQuarterUnit" className="block text-sm font-medium text-gray-700">
                    {t("MAIN.INPUTFIELD.UNIT")}
                  </label>
                  <select
                    id="thirdyearunit"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={
                      uniteData.find((unit) => unit.id === thirdQuarterUnitEdit)?.symbol || ""
                    }
                    onChange={(e) => {
                      const selectedSymbol = e.target.value; // Get the selected symbol
                      setThirdQuarterUnitEdit(selectedSymbol); // Update the selected symbol
                      // Find the corresponding unit ID based on the selected symbol
                      const selectedUnit = uniteData.find((unit) => unit.symbol === selectedSymbol);
                      if (selectedUnit) {
                        setThirdQuarterUnitEdit(selectedUnit.id); // Set the corresponding unit ID
                      }
                    }}
                  >
                    {uniteData.map((unit) => (
                      <option key={unit.id} value={unit.symbol}>
                        {unit.symbol}
                      </option>
                    ))}
                  </select>

                </div>
              </div>

              {/* Operation */}
              <div className="w-11/12 justify-self-center">
                <label htmlFor="operation-select" className="mr-4">Select Operation:</label>
                <select
                  defaultValue={"Increasing"}
                  id="operation-select"
                  value={operations}
                  onChange={(e) => setOperation(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="sum">Sum</option>
                  <option value="average">Average</option>
                </select>
              </div>

              <div className="space-x-2 flex justify-self-center mr-5">
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

              <div className="w-11/12  justify-self-center">
                {errorMessage && errorMessage === 403 && (
                  <h1 className="text-red-900 font-bold ml-3">
                    {errorMessageWeight}
                  </h1>
                )}
                <p className="text-red-500 text-sm">{errorEmptyMessage}</p>
              </div>
            </form>
          )}
        </DialogBody>
      </Dialog>

      {/* add performance */}
      <Dialog open={openPerformance} handler={handleOpenPerformance} size="md">
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

        <DialogBody className="h-[18rem] items-center">
          <form
            onSubmit={handleAddPerformance}
            className="grid  gap-5 items-centerw-full mx-auto"
          >
            <div className="w-11/12 flex items-center gap-5  justify-self-center">
              <Button className="rounded-full text-sm font-bold cursor-default w-2/6 bg-blue-700">
                {firstQuarterGoal}
                {(() => {
                  const unitSymbol = uniteData.find((unit) => unit.id === firstQuarterUnitId)?.symbol;
                  return unitSymbol ? ` ${unitSymbol}` : ""; // Show brackets only if unitSymbol exists
                })()}

              </Button>
              <Input
                type="text"
                color="blue"
                id="thirdQuarter"
                label={t("MAIN.INPUTFIELD.FIRST_QUARTER_PERFORMANCE")}
                size="lg"
                value={firstQuarterPerformance || ""}
                onChange={(e) => {
                  setFirstQuarterPerformance(e.target.value),
                    setErrorEmptyMessage("");
                }}
              />
              <select
                className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                value={
                  uniteData.find((unit) => unit.id === firstQuarterPerformanceUnit)?.name || ""
                }
                onChange={(e) => {
                  const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                  if (selectedUnit) {
                    setFirstQuarterPerformanceUnit(selectedUnit.id); // Store unit ID
                  }
                }}
              >
                <option value="" disabled>
                  {firstQuarterPerformanceUnit
                    ? uniteData.find((unit) => unit.id === firstQuarterPerformanceUnit)?.name
                    : "Select Unit"}
                </option>
                {uniteData && uniteData.length > 0 ? (
                  uniteData
                    .filter((unit) => unit.measure_id === measure)
                    .map((unit) => (
                      <option key={unit.id} value={unit.name}>
                        {unit.name}
                      </option>
                    ))
                ) : uniteData ? (
                  <option disabled>No units available</option>
                ) : (
                  <option disabled>Loading units...</option>
                )}
              </select>

            </div>
            <div className="w-11/12 flex items-center gap-5  justify-self-center">
              <Button className="rounded-full text-sm font-bold cursor-default w-2/6 bg-blue-700">

{secondQuarterGoal}
                {(() => {
                  const unitSymbol = uniteData.find((unit) => unit.id === secondQuarterUnitId)?.symbol;
                  return unitSymbol ? `  ${unitSymbol}` : ""; // Show brackets only if unitSymbol exists
                })()}
              </Button>

              <Input
                type="text"
                id="name"
                color="blue"
                label={t("MAIN.INPUTFIELD.SECOND_QUARTER_PERFORMANCE")}
                size="lg"
                value={secondQuarterPerformance || ""}
                onChange={(e) => {
                  setSecondQuarterPerformance(e.target.value),
                    setErrorEmptyMessage("");
                }}
              />
              <select
                className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                value={
                  uniteData.find((unit) => unit.id === secondQuarterPerformanceUnit)?.name || ""
                }
                onChange={(e) => {
                  const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                  if (selectedUnit) {
                    setSecondQuarterPerformanceUnit(selectedUnit.id); // Set unit ID
                  }
                }}
              >
                <option value="" disabled>
                  {secondQuarterPerformanceUnit
                    ? uniteData.find((unit) => unit.id === secondQuarterPerformanceUnit)?.name
                    : "Select Unit"}
                </option>
                {uniteData && uniteData.length > 0 ? (
                  uniteData
                    .filter((unit) => unit.measure_id === measure) // Filter units by measure
                    .map((unit) => (
                      <option className="w-fit" key={unit.id} value={unit.name}>
                        {unit.name}
                      </option>
                    ))
                ) : uniteData ? (
                  <option disabled>No units available</option>
                ) : (
                  <option disabled>Loading units...</option>
                )}
              </select>
            </div>
            <div className="w-11/12 flex items-center gap-5  justify-self-center">
              <Button className="rounded-full text-sm font-bold cursor-default w-2/6 bg-blue-700">

                  {thirdQuarterGoal}
                {(() => {
                  const unitSymbol = uniteData.find((unit) => unit.id === thirdQuarterUnitId)?.symbol;
                  return unitSymbol ? ` ${unitSymbol}` : ""; // Show brackets only if unitSymbol exists
                })()}
              </Button>{" "}
              <Input
                type="text"
                id="fourthQuarter"
                color="blue"
                label={t("MAIN.INPUTFIELD.THIRD_QUARTER_PERFORMANCE")}
                size="lg"
                value={thirdQuarterPerformance || ""}
                onChange={(e) => {
                  setThirdQuarterPerformance(e.target.value),
                    setErrorEmptyMessage("");
                }}
              />
              <select
                className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                value={
                  uniteData.find((unit) => unit.id === thirdQuarterPerformanceUnit)?.name || ""
                }
                onChange={(e) => {
                  const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                  if (selectedUnit) {
                    setThirdQuarterPerformanceUnit(selectedUnit.id); // Set unit ID
                  }
                }}
              >
                <option value="" disabled>
                  {thirdQuarterPerformanceUnit || "Select Unit"}
                </option>
                {uniteData && uniteData.length > 0 ? (
                  uniteData
                    .filter((unit) => unit.measure_id === measure) // Filter units by measure
                    .map((unit) => (
                      <option className="w-fit" key={unit.id} value={unit.name}>
                        {unit.name}
                      </option>
                    ))
                ) : uniteData ? (
                  <option disabled>No units available</option>
                ) : (
                  <option disabled>Loading units...</option>
                )}
              </select>
            </div>

            <p className="flex justify-center text-red-900 text-sm">
              {errorEmptyMessage}
            </p>

            <div className="space-x-2 flex justify-self-end mr-5">
              <Button
                variant="text"
                color="red"
                onClick={handleOpenPerformance}
                className="normal-case"
              >
                <span> {t("MAIN.INPUTFIELD.CANCEL")}</span>
              </Button>
              <Button
                variant="text"
                size="sm"
                className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                onClick={handleAddPerformance}
              >
                {t("MAIN.INPUTFIELD.ADD_PERFORMANCE")}
              </Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>

      {/* view */}
      {showModalView && (
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
      )}
    </>
  );
}
export default Kpi3;
