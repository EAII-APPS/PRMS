import React, { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faPenToSquare,
  faCalendarDays,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";
import axiosInistance from "../GlobalContexts/Base_url";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  deleteSelectedUniteData,
  editSelectedUnite,
  fetchUniteData,
} from "../reduxToolKit/slices/uniteSlice";
import {
  deleteSelectedKpiData,
  editSelectedKpi,
  fetchKpiData,
} from "../reduxToolKit/slices/kpiSlice";
import {
  Card,
  CardHeader,
  Input,
  Button,
  CardBody,
  CardFooter,
  Typography,
  Select,
  Checkbox,
  Option,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { fetchKpiAllData } from "../reduxToolKit/slices/kpiAllSlice";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Kpi() {
  const { t } = useTranslation();
  const token = localStorage.getItem("access");

  const weightRegex = /^(100|[1-9]?[0-9])$/;

  const numRegex = /^(0|[1-9]\d*)(\.\d+)?$/;

  const PerfRegex = /^(0|[1-9][0-9]*)(\.[0-9]+)?[a-zA-Z!@#\$%\^\&*\)\(+=._-]*$/;
  const NegativePerfRegex = /^-\d+(\.\d+)?$/;
  const authInfo = useAuth();
  const dispatch = useDispatch();

  //fetch kpi data

  const [ kpiData ,setkpiData] = useState(null);
  const { divisionData } = useSelector((state) => state.division);
  const { sectorData } = useSelector((state) => state.sector);

const currentYear = new Date().getFullYear();

const currentYearGC = new Date().getFullYear(); 
const currentMonthGC = new Date().getMonth() + 1; 
const ethiopianYear = currentYearGC - 7 - (currentMonthGC < 9 ? 1 : 0);
const years = Array.from({ length: ethiopianYear - 2013 + 2 }, (_, index) => 2013 + index);

  const [selectedYear, setSelectedYear] = useState(ethiopianYear);

  const [selectedSector, setSelectedSector] = useState(null);

  const [selectedDivision, setSelectedDivision] = useState(null);

  useEffect(() => {
    dispatch(fetchDivisionData());
    dispatch(fetchSectorgData());
  }, []);

  const fetchkpiData = async () => {
    try {
      const kpiData = await axiosInistance.get("/planApp/annualKPI", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          year: selectedYear,
          sector: selectedSector,
          division: selectedDivision,
        },
      });
       setkpiData(kpiData.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchkpiData();
  }, [selectedYear]);

  const handleclear = async () => {
    const clearall = async () => {
      setSelectedDivision(null);
      setSelectedSector(null);
      setSelectedYear(ethiopianYear);
      window.location.reload();
      fetchkpiData();

    }
    await clearall();
  }
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e));
    // Do something with the selected year
  };
  let { kpiAllData } = useSelector((state) => state.kpiall);

  // Default to an empty array if kpiAllData is null or undefined
  kpiAllData = kpiAllData || [];

  useEffect(() => {
    dispatch(fetchKpiAllData());
  }, [dispatch]);
  //add
  const [openKpi, setOPenKpi] = useState(-1);

  const [name, setName] = useState("");

  const [divisionId, setDivisionId] = useState("");

  const [main_goal_id, setMain_goal_id] = useState("");

  const [initial, setInitial] = useState("");

  const [first_quarter_plan, setFirst_quarter_plan] = useState("");

  const [annual_plan, setAnnual_plan] = useState("");
  const [number_part, setNumber_part] = useState(null);
  const [firstQnum, setFirstQnum] = useState(null);
  const [secondQnum, setSecondQnum] = useState(null);
  const [thirdQnum, setThirdQnum] = useState(null);
  const [fourthQnum, setFourthQnum] = useState(null);
  const [kpiAll, setKpiAll] = useState(null);
  const [isIncremental, setIsIncremental] = useState(false);

  const [second_quarter_plan, setSecond_quarter_plan] = useState("");

  const [third_quarter_plan, setThird_quarter_plan] = useState("");

  const [fourth_quarter_plan, setFourth_quarter_plan] = useState("");

  const [measure, setMeasure] = useState("");
  const [goalunit, setGoalunit] = useState("");
  const [goalUnitId, setGoalUnitId] = useState("");
  const [weight, setWeight] = useState("");
  const [firstQuarterUnit, setFirstQuarterUnit] = useState("");
  const [firstQuarterUnitId, setFirstQuarterUnitId] = useState("");
  const [secondQuarterUnit, setSecondQuarterUnit] = useState("");
  const [secondQuarterUnitId, setSecondQuarterUnitId] = useState("");
  const [thirdQuarterUnit, setThirdQuarterUnit] = useState("");
  const [thirdQuarterUnitId, setThirdQuarterUnitId] = useState("");
  const [forthQuarterUnit, setForthQuarterUnit] = useState("");
  const [forthQuarterUnitId, setForthQuarterUnitId] = useState("")
  const [initialUnit, setInitialUnit] = useState("");
  const [initialUnitId, setInitialUnitId] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageWeight, setErrorMessageWeight] = useState("");
  const [errorEmptyMessage, setErrorEmptyMessage] = useState("");
  const [operations, setOperation] = useState("sum");
  const [open, setOpen] = useState(false);
  const firstQuarterDropdownRef = useRef(null);
  const secondQuarterDropdownRef = useRef(null);
  const thirdQuarterDropdownRef = useRef(null);
  const fourthQuarterDropdownRef = useRef(null);
  const initialDropdownRef = useRef(null);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [sectorId, setsectorId] = useState(null);
  const [year, setYear] = useState("");
  // Edit

  const [openEdit, setOpenEdit] = useState(false);
  const [kpiEdit, setKpiEdit] = useState("");
  const [kpieditname, setkpieditname] = useState("");


  const [mainGoalIdEdit, setMainGoalIdEdit] = useState("");

  const [initialEdit, setInitialEdit] = useState("");

  const [firstQuarterPlanEdit, setFirstQuarterPlanEdit] = useState("");

  const [secondQuarterPlanEdit, setSecondQuarterPlanEdit] = useState("");

  const [thirdQuarterPlanEdit, setThirdQuarterPlanEdit] = useState("");

  const [fourthQuarterPlanEdit, setFourthQuarterPlanEdit] = useState("");

  const [firstQuarterPlanUnitEdit, setFirstQuarterPlanUnitEdit] = useState("");

  const [secondQuarterPlanUnitEdit, setSecondQuarterPlanUnitEdit] = useState("");

  const [thirdQuarterPlanUnitEdit, setThirdQuarterPlanUnitEdit] = useState("");

  const [fourthQuarterPlanUnitEdit, setFourthQuarterPlanUnitEdit] = useState("");

  const [annualPlanUnitEdit, setAnnualPlanUnitEdit] = useState("");

  const [initialUnitEdit, setInitialUnitEdit] = useState("");

  const [yearEdit, setYearEdit] = useState("");

  const [measureEdit, setMeasureEdit] = useState("");

  const [weightEdit, setWeightEdit] = useState("");
  const [annual_planEdit, setAnnual_planEdit] = useState("");
  const [operationsEdit, setOperationEdit] = useState("");
  const [isIncrementalEdit, setIsIncrementalEdit] = useState(false);


  const [editId, setEditId] = useState("");

  const [showModalView, setShowModalView] = useState(false);

  const [selectedKpiId, setSelectedKpiId] = useState(null);
  // performance

  const [openPerformance, setOpenPerformance] = useState(null);

  const [firstQuarterPerformance, setFirstQuarterPerformance] = useState("");

  const [secondQuarterPerformance, setSecondQuarterPerformance] = useState("");

  const [thirdQuarterPerformance, setThirdQuarterPerformance] = useState("");

  const [fourthQuarterPerformance, setFourthQuarterPerformance] = useState("");

  const [pr1unit, setPr1Unit] = useState();
  const [pr2unit, setPr2Unit] = useState("");
  const [pr3unit, setPr3Unit] = useState("");
  const [pr4unit, setPr4Unit] = useState("");

  const [firstQuarterGoal, setFirstQuarterGoal] = useState("");

  const [secondQuarterGoal, setSecondQuarterGoal] = useState("");

  const [thirdQuarterGoal, setThirdQuarterGoal] = useState("");

  const [fourthQuarterGoal, setFourthQuarterGoal] = useState("");
  const [measureData, setMeasureData] = useState({});
  const [transformedData, setTransformedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageData = kpiData
    ? transformedData.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  
    const filteredData = currentPageData
    ?.map(item => {
      // Filter KPIs that match the search term
      const matchingKpis = item.kpi?.filter(kpi =>
        kpi.kpi_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      // Keep the item if at least one kpi matched
      if (matchingKpis.length > 0) {
        return {
          ...item,
          kpi: matchingKpis, // Only include matching KPIs
        };
      }
  
      return null; // Discard items with no matching KPIs
    })
    .filter(Boolean); // Remove nulls
  
  const { uniteData } = useSelector((state) => state.unite);

  useEffect(() => {
    dispatch(fetchUniteData());
  }, []);
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

    setName("");

    setKpiAll("");

    setFirstQuarterUnitId("");

    setFirstQuarterUnit("");

    setSecondQuarterUnitId("");

    setSecondQuarterUnit("");

    setThirdQuarterUnitId("");

    setThirdQuarterUnit("");

    setForthQuarterUnitId("");

    setForthQuarterUnit("");

    setFirstQuarterUnitId("");

    setSecondQuarterUnit("");
    setSecondQuarterUnitId("");

    setThirdQuarterUnit("");
    setThirdQuarterUnitId("");

    setForthQuarterUnit("");
    setForthQuarterUnitId("");

    setGoalunit("");
    setGoalUnitId("");

    setInitialUnit("");
    setInitialUnitId("");

    setInitial("");

    setInitialUnit("");

    setWeight("");

    setYear("");

    setMeasure("");

    setDivisionId("");

    setMain_goal_id("");

    setInitial("");
    setIsIncrementalEdit(false);
    if (authInfo.user.sector_id) {
      setsectorId(Number(authInfo.user.sector_id));
    } else {
      setsectorId("");
    }

    setFirst_quarter_plan("");

    setAnnual_plan("");

    setSecond_quarter_plan("");

    setThird_quarter_plan("");

    setFourth_quarter_plan("");

    setMeasure("");

    setGoalUnitId("");

    setWeight("");

    setErrorMessageWeight("");

    setErrorEmptyMessage("");
  };
  useEffect(() => {
    if (authInfo.user.division_id) {
      setDivisionId(Number(authInfo.user.division_id));
    }
  }, [authInfo.user.division_id]);
  const handleAddKpi = async (e) => {
    e.preventDefault();


    const measure_id = measure;

    const token = localStorage.getItem("access");


    if (!weight) {
      setErrorEmptyMessage("please enter weight");
      setErrorMessageWeight("");

      return;
    }
    if (NegativePerfRegex.test(initial)) {
      setErrorEmptyMessage("Invalid initial, initial can't be negative!");
      setErrorMessageWeight("");

      return;
    }

    if (!initialUnit) {
      setErrorEmptyMessage("please select initial unit");
      setErrorMessageWeight("");

      return;
    }
    if (!weightRegex.test(weight)) {
      setErrorEmptyMessage(
        "Invalid Weight, Weight can't exceed 100 and can't be negative!"
      );
      setErrorMessageWeight("");

      return;
    }

    if (!PerfRegex.test(first_quarter_plan)) {
      setErrorEmptyMessage(
        "Invalid first Quarter Goal , first Quarter Goal can't be negative!"
      );
      setErrorMessageWeight("");

      return;
    }
    if (!firstQuarterUnitId) {
      setErrorEmptyMessage(
        "Please select first quarter unit!"
      );
      setErrorMessageWeight("");
      return;
    }
    if (!secondQuarterUnitId) {
      setErrorEmptyMessage(
        "Please select second quarter unit!"
      );
      setErrorMessageWeight("");
      return;
    }
    if (!thirdQuarterUnitId) {
      setErrorEmptyMessage(
        "Please select third quarter unit!"
      );
      setErrorMessageWeight("");
      return;
    }
    if (!forthQuarterUnitId) {
      setErrorEmptyMessage(
        "Please select fourth quarter unit!"
      );
      setErrorMessageWeight("");
      return;
    }
    if (!PerfRegex.test(annual_plan)) {
      setErrorEmptyMessage(
        "Invalid Annual Goal , Annual Goal can't be negative!"
      );
      setErrorMessageWeight("");

      return;
    }
    if (!goalUnitId) {
      setErrorEmptyMessage(
        "Please select annual plan unit!"
      );
      setErrorMessageWeight("");
      return;
    }

    if (!PerfRegex.test(second_quarter_plan)) {
      setErrorEmptyMessage(
        "Invalid second Quarter Goal , second Quarter Goal can't be negative!"
      );
      setErrorMessageWeight("");

      return;
    }

    if (!PerfRegex.test(third_quarter_plan)) {
      setErrorEmptyMessage(
        "Invalid third Quarter Goal , third Quarter Goal can't be negative!"
      );
      setErrorMessageWeight("");

      return;
    }

    if (!PerfRegex.test(fourth_quarter_plan)) {
      setErrorEmptyMessage(
        "Invalid fourth Quarter Goal , fourth Quarter Goal can't be negative!"
      );
      setErrorMessageWeight("");

      return;
    }



    try {
      const payload = {
        kpi: kpiAll,
        main_goal_id,
        initial,
        initial_unit_id: Number(initialUnitId),
        annual: Number(annual_plan),
        annual_unit_id: Number(goalUnitId),
        year,
        pl1: Number(first_quarter_plan),
        pl2: Number(second_quarter_plan),
        pl3: Number(third_quarter_plan),
        pl4: Number(fourth_quarter_plan),
        pl1_unit_id: Number(firstQuarterUnitId),
        pl2_unit_id: Number(secondQuarterUnitId),
        pl3_unit_id: Number(thirdQuarterUnitId),
        pl4_unit_id: Number(forthQuarterUnitId),
        measure,
        weight,
        sector_id: authInfo.user.sector_id,
        operation: operations,
        incremental: isIncremental,
      };

      if (divisionId != null) {
        payload.division_id = Number(divisionId);
      } else {
        payload.division_id = authInfo.user.division_id;
      }

      const res = await axiosInistance.post("/planApp/annualKPI/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchkpiData();
      setName("");
      setDivisionId("");
      setMain_goal_id("");
      setInitial("");
      setFirst_quarter_plan("");
      setSecond_quarter_plan("");
      setThird_quarter_plan("");
      setFourth_quarter_plan("");
      setMeasure("");
      setWeight("");
      setOpen(false);
      setErrorMessage("");
      setErrorMessageWeight("");
      setIsIncremental(false);

      toast.success(`KPI Added successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });

    } catch (error) {
      setErrorMessage(error.response.status);
      setErrorMessage(error.response.data);
      setErrorMessageWeight(error.response.data.message);
    }

  };

  //delete

  const handleOpenDelete = (selectedId, selectedName) => {
    setSelectedId(selectedId);

    setOpenDelete(!openDelete);

  };

  const handleDelete = async () => {
    dispatch(deleteSelectedKpiData(selectedId));

    setOpenDelete(false);

    toast.success(`KPI Deleted successfully`, {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  // Edit
  const [sectoredit, setsectoredit] = useState(null);
  const [divisionedit, setdivisionedit] = useState(null);

  const handleOpenEdit = (items) => {
    setOpenEdit(!openEdit);

    setKpiEdit(items.kpi);
    const division = divisionData.find(
      div => String(div.id) === String(items.division_id)
    );

    if (division) {
      setsectoredit(division.sector); // Set sector_id from divisiondata
    } else {

    }



    setdivisionedit(items.division_id);


    setkpieditname(items.kpi_name);

    setAnnual_planEdit(items.annual);

    setAnnualPlanUnitEdit(items.annual_unit_id);

    setInitialEdit(items.initial);

    setInitialUnitEdit(items.initial_unit_id);

    setFirstQuarterPlanEdit(items.pl1);

    setFirstQuarterPlanUnitEdit(items.pl1_unit_id);


    setSecondQuarterPlanEdit(items.pl2);

    setSecondQuarterPlanUnitEdit(items.pl2_unit_id);

    setThirdQuarterPlanEdit(items.pl3);

    setThirdQuarterPlanUnitEdit(items.pl3_unit_id);

    setFourthQuarterPlanEdit(items.pl4);

    setFourthQuarterPlanUnitEdit(items.pl4_unit_id);

    setYearEdit(items.year);

    setMeasureEdit(items.measure);

    setWeightEdit(items.weight);

    setEditId(items.id);

    setOperationEdit(items.operation);
    setIsIncrementalEdit(items.incremental);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!weightEdit) {
      setErrorEmptyMessage("Please enter weight");
      setErrorMessageWeight("");
      return;
    }

    if (NegativePerfRegex.test(initialEdit)) {
      setErrorEmptyMessage("Invalid initial, initial can't be negative!");
      setErrorMessageWeight("");
      return;
    }

    if (!initialUnitEdit) {
      setErrorEmptyMessage("Please select initial unit");
      setErrorMessageWeight("");
      return;
    }

    if (!weightRegex.test(weightEdit)) {
      setErrorEmptyMessage("Invalid Weight, Weight can't exceed 100 and can't be negative!");
      setErrorMessageWeight("");
      return;
    }

    if (!PerfRegex.test(firstQuarterPlanEdit)) {
      setErrorEmptyMessage("Invalid first Quarter Goal, first Quarter Goal can't be negative!");
      setErrorMessageWeight("");
      return;
    }

    if (!firstQuarterPlanUnitEdit) {
      setErrorEmptyMessage("Please select first quarter unit!");
      setErrorMessageWeight("");
      return;
    }

    if (!secondQuarterPlanUnitEdit) {
      setErrorEmptyMessage("Please select second quarter unit!");
      setErrorMessageWeight("");
      return;
    }

    if (!thirdQuarterPlanUnitEdit) {
      setErrorEmptyMessage("Please select third quarter unit!");
      setErrorMessageWeight("");
      return;
    }

    if (!fourthQuarterPlanUnitEdit) {
      setErrorEmptyMessage("Please select fourth quarter unit!");
      setErrorMessageWeight("");
      return;
    }

    if (!PerfRegex.test(annual_planEdit)) {
      setErrorEmptyMessage("Invalid Annual Goal, Annual Goal can't be negative!");
      setErrorMessageWeight("");
      return;
    }

    if (!annualPlanUnitEdit) {
      setErrorEmptyMessage("Please select annual plan unit!");
      setErrorMessageWeight("");
      return;
    }

    if (!PerfRegex.test(secondQuarterPlanEdit)) {
      setErrorEmptyMessage("Invalid second Quarter Goal, second Quarter Goal can't be negative!");
      setErrorMessageWeight("");
      return;
    }

    if (!PerfRegex.test(thirdQuarterPlanEdit)) {
      setErrorEmptyMessage("Invalid third Quarter Goal, third Quarter Goal can't be negative!");
      setErrorMessageWeight("");
      return;
    }

    if (!PerfRegex.test(fourthQuarterPlanEdit)) {
      setErrorEmptyMessage("Invalid fourth Quarter Goal, fourth Quarter Goal can't be negative!");
      setErrorMessageWeight("");
      return;
    }

    try {
      await axiosInistance.put(
        `/planApp/annualKPI/${editId}/`,
        {
          kpi: kpiEdit,
          initial: initialEdit,
          initial_unit_id: initialUnitEdit,
          annual: annual_planEdit,
          annual_unit_id: annualPlanUnitEdit,
          year: yearEdit,
          pl1: Number(firstQuarterPlanEdit),
          pl2: Number(secondQuarterPlanEdit),
          pl3: Number(thirdQuarterPlanEdit),
          pl4: Number(fourthQuarterPlanEdit),
          pl1_unit_id: firstQuarterPlanUnitEdit,
          pl2_unit_id: secondQuarterPlanUnitEdit,
          pl3_unit_id: thirdQuarterPlanUnitEdit,
          pl4_unit_id: fourthQuarterPlanUnitEdit,
          measure: measureEdit,
          weight: weightEdit,
          operation: operationsEdit,
          incremental: isIncrementalEdit,
          division_id: divisionedit != null ? Number(divisionedit) : authInfo.user.division_id, // ✅ Corrected
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(fetchKpiData());


      setMainGoalIdEdit("");

      setAnnual_planEdit("");

      setInitialEdit("");

      setFirstQuarterPlanEdit("");

      setSecondQuarterPlanEdit("");

      setThirdQuarterPlanEdit("");

      setFourthQuarterPlanEdit("");

      setMeasureEdit("");

      setWeightEdit("");

      setEditId("");
      setOperationEdit("");
      setIsIncrementalEdit(false);
      setOpenEdit(false);
      setErrorMessage("");
      toast.success(`KPI Updated successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      setErrorMessage(error.response.status);

      setErrorMessageWeight(error.response.data.message);
    }
  };
  const handleDivisionChange = (event) => {
    const { value, checked } = event.target;
    setDivisionIds((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };
  // view

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

  const handleOpenPerformance = (items) => {
    dispatch(fetchkpiData);
    setOpenPerformance(!openPerformance);
    console.log("items", items);
    setSelectedKpiId(items.id);

    setPr1Unit(items.pr1_unit_id);

    setPr2Unit(items.pr2_unit_id);

    setPr3Unit(items.pr3_unit_id);

    setPr4Unit(items.pr4_unit_id);

    setMeasure(items.measure);

    setFirstQuarterGoal(items.pl1);

    setSecondQuarterGoal(items.pl2);

    setThirdQuarterGoal(items.pl3);

    setFourthQuarterGoal(items.pl4);

    setFirstQuarterUnit(Number(items.pl1_unit_id));

    console.log("aaaaa", items.pl1_unit_id);

    setSecondQuarterUnit(items.pl2_unit_id);

    setThirdQuarterUnit(items.pl3_unit_id);

    setForthQuarterUnit(items.pl4_unit_id);

    setFirstQuarterPerformance(items.pr1);

    setSecondQuarterPerformance(items.pr2);

    setThirdQuarterPerformance(items.pr3);

    setFourthQuarterPerformance(items.pr4);

    setErrorEmptyMessage("");
  };

  const handleAddPerformance = async () => {
    const token = localStorage.getItem("access");

    try {
      await axiosInistance.put(
        `/planApp/performance/${selectedKpiId}/`,
        {
          pr1: firstQuarterPerformance,
          pr2: secondQuarterPerformance,
          pr3: thirdQuarterPerformance,
          pr4: fourthQuarterPerformance,
          pr1_unit_id: pr1unit,
          pr2_unit_id: pr2unit,
          pr3_unit_id: pr3unit,
          pr4_unit_id: pr4unit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchKpiData());
      setOpenPerformance(false);
      setErrorMessageWeight("");
    } catch (error) { }
  };


  useEffect(() => {
    // Transform the data

    if (Array.isArray(kpiData)) {
      const transformData = (dataArray, authInfo) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          return [];
        }

        const groupedData = dataArray.reduce((acc, curr) => {
          const {
            main_goal_id,
            division_id,
            maingoal_name,
            id,
            weight,
            initial,
            kpi,
            kpi_name,
            initial_unit_id,
            annual,
            annual_unit_id,
            year,
            pl1,
            pl2,
            pl3,
            pl4,
            pl1_unit_id,
            pl2_unit_id,
            pl3_unit_id,
            pl4_unit_id,
            pr1,
            pr1_unit_id,
            pr2,
            pr2_unit_id,
            pr3,
            pr3_unit_id,
            pr4,
            pr4_unit_id,
            measure,
            operation: operations,
            incremental: isIncremental
          } = curr;

          if (!acc[kpi]) {
            acc[kpi] = {
              main_goal_id,
              maingoal_name,
              kpi_name,
              kpi: [],
            };
          }

          acc[kpi].kpi.push({
            id,
            kpi,
            kpi_name,
            initial,
            initial_unit_id,
            annual,
            annual_unit_id,
            year,
            pl1,
            pl2,
            pl3,
            pl4,
            pl1_unit_id,
            pl2_unit_id,
            pl3_unit_id,
            pl4_unit_id,
            pr1,
            pr1_unit_id,
            pr2,
            pr2_unit_id,
            pr3,
            pr3_unit_id,
            pr4,
            pr4_unit_id,
            measure,
            weight,
            division_id,
            sector_id: authInfo?.user?.sector_id || null, // Prevents errors if authInfo is missing
            operation: operations,
            incremental:isIncremental,
          });

          return acc;
        }, {});

        return Object.values(groupedData);
      };


      const transformed = transformData(kpiData);

      setTransformedData(transformed);
    }
  }, [kpiData]);

  //pagination

  useEffect(() => {
    const calculateTotalPages = () => {
      setTotalPages(
        Math.ceil(kpiData ? transformedData.length / itemsPerPage : [])
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

  const handleOPenKpi = (index) => {
    setTimeout(() => setOPenKpi(openKpi === index ? -1 : index), 50);
  };
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

        setForthQuarterUnit(selectedUnit.name);
        setForthQuarterUnitId(selectedUnit.id);

        setGoalunit(selectedUnit.name);
        setGoalUnitId(selectedUnit.id);

        setInitialUnit(selectedUnit.name);
        setInitialUnitId(selectedUnit.id);
      } else {
        // Reset selections when multiple or no units are available
        setFirstQuarterUnit("");
        setFirstQuarterUnitId("");

        setSecondQuarterUnit("");
        setSecondQuarterUnitId("");

        setThirdQuarterUnit("");
        setThirdQuarterUnitId("");

        setForthQuarterUnit("");
        setForthQuarterUnitId("");

        setGoalunit("");
        setGoalUnitId("");

        setInitialUnit("");
        setInitialUnitId("");
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
  
  

  return (
    <>
            <Card className="rounded-md">
              <div className="ml-6 mt-5"></div>
              <CardBody className="xl:flex md:grid items-center xl:gap-10 sm:gap-5">
                <div className="grid gap-2">
                  <h1 className="whitespace-nowrap text-left text-md font-bold text-black">
                    {t("MAIN.TABLE.YEAR")}
                  </h1>
                  <Select
                    label={t("MAIN.TABLE.SELECT_YEAR")}
                    value={selectedYear}
                    onChange={handleYearChange}
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
                {authInfo.user.userPermissions.includes("createAssign") && (
                  <div className="grid gap-2">
                    <h1 className="whitespace-nowrap text-left text-md font-bold text-black">
                      {t("MAIN.TABLE.SECTOR")}
                    </h1>
                    <Select
                      label={t("MAIN.TABLE.SELECT_SECTOR")}
                      // value={selectedSector}
                      onChange={(e) => setSelectedSector(e)}
                    >
                      {sectorData
                        ? sectorData.map((sector) => (
                            <Option
                              key={sector.id}
                              className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                              value={sector.id}
                            >
                              {sector.name}
                            </Option>
                          ))
                        : []}
                    </Select>
                  </div>
                )}
                {(authInfo.user.userPermissions.includes("createAssign") ||
                  authInfo.user.userPermissions.includes("createMainActivity")) && (
                  <div className="grid gap-2">
                    <h1 className="whitespace-nowrap text-left text-md font-bold text-black">
                      {t("MAIN.TABLE.DIVISION")}
                    </h1>
                    <Select
                      label={t("MAIN.TABLE.SELECT_DIVISION")}
                      onChange={(e) => setSelectedDivision(e)}
                    >
                      {divisionData
                        ? divisionData.map((division) => (
                            <Option
                              key={division.id}
                              value={division.id}
                              className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                            >
                              {division.name}
                            </Option>
                          ))
                        : []}
                    </Select>
                  </div>
                )}
              </CardBody>
              <div className="flex justify-end gap-2 mb-5 mr-12">
                <Button
                  variant="text"
                  size="md"
                  className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case text-left text-sm font-bold"
                  onClick={() => fetchkpiData()}
                >
                  {t("MAIN.TABLE.FILTER")}
                </Button>
                <Button
                variant="text"
                size="sm"
                className="flex items-center justify-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case text-xs md:text-sm font-bold"
                onClick={() => handleclear()}
              >
                {t("MAIN.TABLE.CLEAR")}
              </Button>
              </div>
            </Card>
      <ToastContainer />
      {authInfo ? (
        <div className="grid gap-3 items-center">
          <p className="text-base font-bold font-sans">
            {t("MAIN.SIDEBAR.PLAN.KPI.TITLE")}
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
                      {t("MAIN.SIDEBAR.PLAN.KPI.ADDBUTTON")}
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
                      {t("MAIN.SIDEBAR.PLAN.KPIALL.KPI")}
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-center text-md font-bold text-black  tracking-wider"
                    >
                      {t("MAIN.SIDEBAR.PLAN.KPI.KPI")}
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                    ><div></div></th>
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
                              {items.kpi_name}
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
                                      {t("MAIN.TABLE.YEAR")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                                    >
                                      {t("MAIN.TABLE.INITIAL")}
                                    </th>
                                    <th
                                      scope="col"
                                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                                    >
                                      {t("MAIN.TABLE.WEIGHT")}
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
                                        key={`${item.id}-${index}`}
                                        className="bg-white border-b hover:bg-blue-gray-50 cursor-default "
                                      >
                                        <td className=" p-2  text-left text-sm font-normal text-blue-gray-900">
                                          {index + 1}
                                        </td>

                                        <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                          {item.year}
                                        </td>
                                        <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                          {item.initial}
                                        </td>
                                        <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                          {item.weight}
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
          <div className="text-xl ml-5">{t("MAIN.INPUTFIELD.ADD_KPI")}</div>
          <div className="cursor-pointer mr-5" onClick={handleOpen}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-[28rem] items-center overflow-auto scrollbar">
          {authInfo.user.userPermissions.includes("createAssign") ||
            authInfo.user.userPermissions.includes("createKpi") ? (
            <form
              onSubmit={handleAddKpi}
              className="grid xl:grid-cols-2 sm:grid-cols-1 justify-between gap-5 items-center w-full mx-auto"
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

              {/* year */}
              <div className="w-11/12 flex justify-self-center">
                <Select
                  label={t("MAIN.TABLE.SELECT_YEAR")}
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


              {/* first quarter */}
              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  color="blue"
                  id="firstQuarter"
                  label={t("MAIN.INPUTFIELD.FIRST_QUARTER")}
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
                      .filter((unit) => unit.measure_id === measure)
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

              {/* ANNUAL */}
              <div className="w-11/12 flex justify-self-center">

                <Input
                  type="text"
                  color="blue"
                  id="annualplan"
                  label={t("MAIN.INPUTFIELD.ANNUAL")}
                  size="lg"
                  onChange={(e) => {
                    setAnnual_plan(e.target.value);
                    setNumber_part(handleNumExtraction(e.target.value));
                    setErrorEmptyMessage("");
                  }}
                />

                <select
                  className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                  value={goalUnitId || ""}
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
                      .filter((unit) => unit.measure_id === measure)
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
              {/* Second Quarter */}
              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  id="secondQuarter"
                  color="blue"
                  label={t("MAIN.INPUTFIELD.SECOND_QUARTER")}
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
                        setInitialUnit(selectedUnit.name); // Set selected unit
                        setInitialUnitId(selectedUnit.id); // Set unit ID
                      }
                    }}
                  >
                    <option value="" disabled>
                      {initialUnit || "Select Unit"}
                    </option>
                    {uniteData && uniteData.length > 0 ? (
                      uniteData
                        .filter((unit) => unit.measure_id === measure)
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
                <Input
                  type="text"
                  color="blue"
                  id="thirdQuarter"
                  label={t("MAIN.INPUTFIELD.THIRD_QUARTER")}
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
                      .filter((unit) => unit.measure_id === measure)
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

              {/* WEIGHT */}
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

              {/* FOURTH_QUARTER */}
              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  id="fourthQuarter"
                  color="blue"
                  label={t("MAIN.INPUTFIELD.FOURTH_QUARTER")}
                  size="lg"
                  value={fourth_quarter_plan}
                  onChange={(e) => (
                    setFourth_quarter_plan(e.target.value),
                    setFourthQnum(handleNumExtraction(e.target.value)),
                    setErrorEmptyMessage("")
                  )}
                />
                {number_part > 0 && fourthQnum && operations === "sum" ? (
                  <h1 className="ml-2">
                    {number_part - firstQnum - secondQnum - thirdQnum - fourthQnum}
                  </h1>
                ) : null}

                <select
                  className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                  value={forthQuarterUnit || ""}
                  onChange={(e) => {
                    const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                    if (selectedUnit) {
                      setForthQuarterUnit(selectedUnit.name); // Set selected unit
                      setForthQuarterUnitId(selectedUnit.id); // Set unit ID
                    }
                  }}
                >
                  <option value="" disabled>
                    {forthQuarterUnit || "Select Unit"}
                  </option>
                  {uniteData && uniteData.length > 0 ? (
                    uniteData
                      .filter((unit) => unit.measure_id === measure)
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


              <div></div>
              {/* type */}
              <div className="w-11/12 justify-self-center">
                <label htmlFor="operation-select" className="mr-4">
                  Select Type:
                </label>
                <select
                  id="operation-select"
                  value={operations}
                  onChange={(e) => setOperation(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="sum">Sum</option>
                  <option value="average">Average</option>
                </select>
                <label htmlFor="operation-select" className="mx-4">
                  Incremental :
                </label>
                <input
                  type="checkbox"
                  checked={isIncremental}
                  onChange={(e) => setIsIncremental(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>



              {/* <div className="w-11/12  justify-self-center">
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
              </div> */}

              <div className="w-11/12  justify-self-center">
                {errorMessage && errorMessage === 403 && (
                  <h1 className="text-red-900 font-bold ml-3">
                    {errorMessageWeight}
                  </h1>
                )}
                <p className="text-red-500 text-sm">{errorEmptyMessage}</p>
              </div>
              <div></div>

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
                  className="flex items-center gap-1 hover:bg-blue-700 bg-blue-900 text-white focus:bg-blue-700 normal-case"
                  onClick={handleAddKpi}
                >
                  {t("MAIN.INPUTFIELD.ADD_KPI")}
                </Button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleAddKpi}
              className="grid xl:grid-cols-2 sm:grid-cols-1 justify-between gap-5 items-center w-full mx-auto"
            >
              {/* kpi5 */}
              <div className="w-11/12 justify-self-center">
                <Select
                  id="kpi5"
                  label={t("MAIN.INPUTFIELD.KPI")}
                  color="blue"
                  value={Kpi}

                  onChange={(e) => {
                    setKpi(e), setErrorEmptyMessage("");
                  }}
                >
                  {kpiData &&
                    kpiData.map((items) => (
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
                  value={annual_plan}
                  onChange={(e) => {
                    setAnnual_plan(e.target.value);
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

              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  id="fourthQuarter"
                  color="blue"
                  label={t("MAIN.INPUTFIELD.FOURTH_QUARTER")}
                  size="lg"
                  value={fourth_quarter_plan}
                  onChange={(e) => (
                    setFourth_quarter_plan(e.target.value),
                    setFourthQnum(handleNumExtraction(e.target.value)),
                    setErrorEmptyMessage("")
                  )}
                />
                {number_part > 0 && fourthQnum && operations === "sum" ? (
                  <h1 className="ml-2">{number_part - firstQnum - thirdQnum - fourthQnum}</h1>
                ) : null}
              </div>
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

        <DialogBody className="h-[28rem] items-center overflow-auto scrollbar">
          {authInfo.user.userPermissions.includes("createAssign") ||
            authInfo.user.userPermissions.includes("updateKpi") ? (
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
                    value={sectoredit || ""} // Set the selected sectorId for editing
                    onChange={(e) => {
                      setsectoredit(e.target.value); // Update sectorId state on change
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
                    value={divisionedit || ""} // Set the selected divisionEditId as the value for the dropdown
                    onChange={(e) => setdivisionedit(e.target.value)} // Update the divisionEditId state on change
                  >
                    <option value="" disabled>
                      {t("MAIN.INPUTFIELD.SELECT_DIVISION")}
                    </option>
                    {divisionData &&
                      divisionData
                        .filter((division) => division.sector === Number(sectoredit)) // Filter divisions based on sectorId
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
                <select
                  id="kpiAll"
                  label={t("MAIN.INPUTFIELD.KPI")}
                  color="blue"
                  className="w-full h-8 rounded-lg bg-white border-solid border-separate border-gray-500 border-spacing-10  border-2 "
                  value={kpiEdit || ""} // Ensure it falls back to an empty string if `kpiEdit` is null/undefined
                  onChange={(e) => {
                    setKpiEdit(e.target.value); // Update the value correctly
                    setErrorEmptyMessage(""); // Clear any error messages
                  }}
                  menuProps={{
                    className: `max-h-[200px] overflow-auto scrollbar`,
                  }}
                >
                  {kpiAllData && kpiAllData.length > 0 ? (
                    kpiAllData.map((item) =>
                      item ? (
                        <option
                          key={item.id}
                          value={item.id.toString()} // Ensure value matches the format of `kpiEdit`
                          className="focus:text-light-blue-700"
                        >
                          {item.name}
                        </option>
                      ) : null
                    )
                  ) : (
                    <option disabled>No KPI available</option>
                  )}
                </select>
              </div>


              {/* measure */}
              <div className="w-11/12  justify-self-center ">
                <Select
                  label={t("MAIN.INPUTFIELD.MEASURE")}
                  color="blue"
                  value={measureEdit}
                  onChange={(e) => {
                    setMeasureEdit(e), setErrorEmptyMessage("");
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

              {/* year */}
              <div className="w-11/12 flex justify-self-center">
                <Select
                  label={t("MAIN.TABLE.SELECT_YEAR")}
                  value={yearEdit}
                  color="blue"
                  onChange={(e) => {
                    setYearEdit(e), setErrorEmptyMessage(""), setErrorMessage("");
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


              {/* first quarter */}
              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  color="blue"
                  id="firstQuarter"
                  label={t("MAIN.INPUTFIELD.FIRST_QUARTER")}
                  size="lg"
                  value={firstQuarterPlanEdit}
                  onChange={(e) => {
                    setFirstQuarterPlanEdit(e.target.value);
                    setFirstQnum(handleNumExtraction(e.target.value));
                    setErrorEmptyMessage("");
                  }}
                />
                {number_part > 0 && operations === "sum" ? (
                  <h1 className="ml-2">{number_part - firstQnum}</h1>
                ) : null}
                <select
                  className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                  value={firstQuarterPlanUnitEdit || ""}
                  onChange={(e) => {
                    const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                    if (selectedUnit) {
                      setFirstQuarterPlanUnitEdit(selectedUnit.id); // Set unit ID
                    }
                  }}
                >
                  <option value={firstQuarterPlanUnitEdit} disabled>
                    {firstQuarterPlanUnitEdit
                      ? uniteData.find((unit) => unit.id === firstQuarterPlanUnitEdit)?.name || "Select Unit"
                      : "Select Unit"}
                  </option>
                  {uniteData && uniteData.length > 0 ? (
                    uniteData
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


              {/* ANNUAL */}
              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  color="blue"
                  id="annualplan"
                  label={t("MAIN.INPUTFIELD.ANNUAL")}
                  value={annual_planEdit}
                  size="lg"
                  onChange={(e) => {
                    setAnnual_planEdit(e.target.value);
                    setNumber_part(handleNumExtraction(e.target.value));
                    setErrorEmptyMessage("");
                  }}
                />
                <select
                  className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                  value={annualPlanUnitEdit || ""}
                  onChange={(e) => {
                    const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                    if (selectedUnit) {
                      setAnnualPlanUnitEdit(selectedUnit.id); // Set unit ID
                    }
                  }}
                >
                  <option value={annualPlanUnitEdit} disabled>
                    {annualPlanUnitEdit
                      ? uniteData.find((unit) => unit.id === annualPlanUnitEdit)?.name || "Select Unit"
                      : "Select Unit"}
                  </option>
                  {uniteData && uniteData.length > 0 ? (
                    uniteData
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

              {/* Second Quarter */}
              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  id="secondQuarter"
                  color="blue"
                  label={t("MAIN.INPUTFIELD.SECOND_QUARTER")}
                  size="lg"
                  value={secondQuarterPlanEdit}
                  onChange={(e) => {
                    setSecondQuarterPlanEdit(e.target.value);
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
                  value={secondQuarterPlanUnitEdit || ""}
                  onChange={(e) => {
                    const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                    if (selectedUnit) {
                      setSecondQuarterPlanUnitEdit(selectedUnit.id); // Set unit ID
                    }
                  }}
                >
                  <option value={secondQuarterPlanUnitEdit} disabled>
                    {secondQuarterPlanUnitEdit
                      ? uniteData.find((unit) => unit.id === secondQuarterPlanUnitEdit)?.name || "Select Unit"
                      : "Select Unit"}
                  </option>
                  {uniteData && uniteData.length > 0 ? (
                    uniteData
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

              {/* INITIAL */}
              <div className="w-11/12 justify-self-center">
                <div className="flex items-center">
                  <Input
                    type="text"
                    id="initial"
                    color="blue"
                    label={t("MAIN.INPUTFIELD.INITIAL")}
                    size="lg"
                    value={initialEdit}
                    onChange={(e) => {
                      setInitialEdit(e.target.value);
                      setErrorEmptyMessage("");
                    }}
                  />
                  <select
                    className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                    value={initialUnitEdit || ""}
                    onChange={(e) => {
                      const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                      if (selectedUnit) {
                        // setInitialUnitEdit(selectedUnit.name); // Set selected unit name
                        setInitialUnitEdit(selectedUnit.id); // Set unit ID
                      }
                    }}
                  >
                    <option value={initialUnitEdit} disabled>
                      {initialUnitEdit
                        ? uniteData.find((unit) => unit.id === initialUnitEdit)?.name || "Select Unit"
                        : "Select Unit"}
                    </option>
                    {uniteData && uniteData.length > 0 ? (
                      uniteData
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
                <Input
                  type="text"
                  color="blue"
                  id="thirdQuarter"
                  label={t("MAIN.INPUTFIELD.THIRD_QUARTER")}
                  size="lg"
                  value={thirdQuarterPlanEdit}
                  onChange={(e) => {
                    setThirdQuarterPlanEdit(e.target.value);
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
                  value={thirdQuarterPlanUnitEdit || ""}
                  onChange={(e) => {
                    const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                    if (selectedUnit) {
                      setThirdQuarterPlanUnitEdit(selectedUnit.id); // Set unit ID
                    }
                  }}
                >
                  <option value={thirdQuarterPlanUnitEdit} disabled>
                    {thirdQuarterPlanUnitEdit
                      ? uniteData.find((unit) => unit.id === thirdQuarterPlanUnitEdit)?.name || "Select Unit"
                      : "Select Unit"}
                  </option>
                  {uniteData && uniteData.length > 0 ? (
                    uniteData
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

              {/* WEIGHT */}
              <div className="w-11/12  justify-self-center">
                <Input
                  type="text"
                  id="weight"
                  label={t("MAIN.INPUTFIELD.WEIGHT")}
                  required
                  color="blue"
                  size="lg"
                  value={weightEdit}
                  onChange={(e) => (
                    setWeightEdit(e.target.value), setErrorEmptyMessage("")
                  )}
                />
              </div>

              {/* FOURTH_QUARTER */}
              <div className="w-11/12 flex justify-self-center">
                <Input
                  type="text"
                  id="fourthQuarter"
                  color="blue"
                  label={t("MAIN.INPUTFIELD.FOURTH_QUARTER")}
                  size="lg"
                  value={fourthQuarterPlanEdit}
                  onChange={(e) => (
                    setFourthQuarterPlanEdit(e.target.value),
                    setFourthQnum(handleNumExtraction(e.target.value)),
                    setErrorEmptyMessage("")
                  )}
                />
                {number_part > 0 && fourthQnum && operations === "sum" ? (
                  <h1 className="ml-2">
                    {number_part - firstQnum - secondQnum - thirdQnum - fourthQnum}
                  </h1>
                ) : null}

                <select
                  className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                  value={fourthQuarterPlanUnitEdit || ""}
                  onChange={(e) => {
                    const selectedUnit = uniteData.find((unit) => unit.id === Number(e.target.value));
                    if (selectedUnit) {
                      setFourthQuarterPlanUnitEdit(selectedUnit.id); // Use ID for value
                      setFirstQuarterUnitId(selectedUnit.id);
                    }
                  }}
                >
                  {/* Placeholder option */}
                  <option value="" disabled>
                    {fourthQuarterPlanUnitEdit
                      ? uniteData.find((unit) => unit.id === fourthQuarterPlanUnitEdit)?.name || "Select Unit"
                      : "Select Unit"}
                  </option>

                  {/* Render available unit options */}
                  {uniteData && uniteData.length > 0 ? (
                    uniteData
                      .map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name}
                        </option>
                      ))
                  ) : (
                    <option disabled>No units available</option>
                  )}
                </select>
              </div>


              <div></div>
              {/* type */}
              <div className="w-11/12 justify-self-center">
                <label htmlFor="operation-select" className="mr-4">
                  Select Operation:
                </label>
                <select
                  defaultValue={"sum"}
                  id="operation-select"
                  value={operationsEdit}
                  onChange={(e) => setOperationEdit(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="sum">Sum</option>
                  <option value="average">Average</option>
                </select>
                <label htmlFor="operation-select" className="mx-4">
                  Incremental :
                </label>
                <input
                  type="checkbox"
                  checked={isIncrementalEdit}
                  onChange={(e) => setIsIncrementalEdit(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>



              {/* <div className="w-11/12  justify-self-center">
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
              </div> */}

              <div className="w-11/12  justify-self-center">
                {errorMessage && errorMessage === 403 && (
                  <h1 className="text-red-900 font-bold ml-3">
                    {errorMessageWeight}
                  </h1>
                )}
                <p className="text-red-500 text-sm">{errorEmptyMessage}</p>
              </div>
              <div></div>

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
                  className="flex items-center gap-1 hover:bg-blue-700 bg-blue-900 text-white focus:bg-blue-700 normal-case"
                  onClick={handleEdit}
                >
                  {t("MAIN.INPUTFIELD.ADD_KPI")}
                </Button>
              </div>
            </form>
          ) : (<div></div>)}
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

        <DialogBody className="h-[25rem] items-center">
          <form
            onSubmit={handleAddPerformance}
            className="grid  gap-5 items-centerw-full mx-auto"
          >
            <div className="w-11/12 flex items-center gap-5  justify-self-center">
              <Button className="rounded-full text-sm font-bold cursor-default w-2/6 bg-blue-700">
                {firstQuarterGoal} {" " }{uniteData.find((unit) => unit.id === firstQuarterUnitId)?.symbol || ""}

              </Button>
              <Input
                type="text"
                color="blue"
                id="thirdQuarter"
                label={t("MAIN.INPUTFIELD.FIRST_QUARTER_PERFORMANCE")}
                size="lg"
                value={firstQuarterPerformance}
                onChange={(e) => {
                  setFirstQuarterPerformance(e.target.value),
                    setErrorEmptyMessage("");
                }}
              />
              <select
                className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                value={pr1unit || ""}
                onChange={(e) => {
                  const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                  if (selectedUnit) {
                    setPr1Unit(selectedUnit.id); // Set unit ID
                  }
                }}
              >
                <option value="" disabled>
                  {pr1unit || "Select Unit"}
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
                {secondQuarterGoal}{" "}{uniteData.find((unit) => unit.id === secondQuarterUnitId)?.symbol || ""}
              </Button>
              <Input
                type="text"
                id="name"
                color="blue"
                label={t("MAIN.INPUTFIELD.SECOND_QUARTER_PERFORMANCE")}
                size="lg"
                value={secondQuarterPerformance}
                onChange={(e) => {
                  setSecondQuarterPerformance(e.target.value),
                    setErrorEmptyMessage("");
                }}
              />
              <select
                className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                value={pr2unit || ""}
                onChange={(e) => {
                  const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                  if (selectedUnit) {
                    setPr2Unit(selectedUnit.id); // Set unit ID
                  }
                }}
              >
                <option value="" disabled>
                  {pr2unit || "Select Unit"}
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
                {thirdQuarterGoal}{" "}{uniteData.find((unit) => unit.id === thirdQuarterUnitId)?.symbol || ""}
              </Button>{" "}
              <Input
                type="text"
                id="fourthQuarter"
                color="blue"
                label={t("MAIN.INPUTFIELD.THIRD_QUARTER_PERFORMANCE")}
                size="lg"
                value={thirdQuarterPerformance}
                onChange={(e) => {
                  setThirdQuarterPerformance(e.target.value),
                    setErrorEmptyMessage("");
                }}
              />
              <select
                className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                value={pr3unit || ""}
                onChange={(e) => {
                  const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                  if (selectedUnit) {
                    setPr3Unit(selectedUnit.id); // Set unit ID
                  }
                }}
              >
                <option value="" disabled>
                  {pr3unit || "Select Unit"}
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
              <Button className="rounded-full cursor-default w-2/6 text-sm font-bold bg-blue-700">
                {fourthQuarterGoal} { " "}{uniteData.find((unit) => unit.id === forthQuarterUnitId)?.symbol || ""}
              </Button>{" "}
              <Input
                type="text"
                id="initial"
                color="blue"
                label={t("MAIN.INPUTFIELD.FOURTH_QUARTER_PERFORMANCE")}
                size="lg"
                value={fourthQuarterPerformance}
                onChange={(e) => {
                  setFourthQuarterPerformance(e.target.value),
                    setErrorEmptyMessage("");
                }}
              />
              <select
                className="w-[40%] rounded-lg ml-4 p-3 bg-gray-100 text-sm font-medium text-gray-900 dark:text-white"
                value={pr4unit || ""}
                onChange={(e) => {
                  const selectedUnit = uniteData.find((unit) => unit.name === e.target.value);
                  if (selectedUnit) {
                    setPr4Unit(selectedUnit.id); // Set unit ID
                  }
                }}
              >
                <option value="" disabled>
                  {pr4unit || "Select Unit"}
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
export default Kpi;
