import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faChevronDown,
  faChevronUp,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../GlobalContexts/Base_url";
import * as freeSolidSvgIcons from "@fortawesome/free-solid-svg-icons";
import { fetchMonitoringData } from "../reduxToolKit/slices/monitoringSlice";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  Typography,
  Select,
  Option,
  CardFooter,
  IconButton,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogBody,
} from "@material-tailwind/react";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useTranslation } from "react-i18next";

const TABLE_HEAD = ["MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.NO", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.TITLE", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.YEAR", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.QUARTER", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.OWNER", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.ACTION"];

function Summary() {
  const dispatch = useDispatch();
  const authInfo = useAuth();
  const [tableRows, setTableRows] = useState([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  const currentYear = new Date().getFullYear();
  const currentYearGC = new Date().getFullYear(); 
const currentMonthGC = new Date().getMonth() + 1; 
const ethiopianYear = currentYearGC - 7 - (currentMonthGC < 9 ? 1 : 0);
const years = Array.from({ length: ethiopianYear - 2013 + 2 }, (_, index) => 2013 + index);
  // const years = Array.from(
  //   { length: currentYear + 3 - 2020 },
  //   (_, index) => 2013 + index
  // );

 //fetch monitoring data

 const { monitoringData } = useSelector((state) => state.monitoring);

 useEffect(() => {
   dispatch(fetchMonitoringData());
 }, []);

 //fetch sector data

 const { sectorData } = useSelector((state) => state.sector);
 useEffect(() => {
   dispatch(fetchSectorgData());
 }, []);

 //fetch sector data

 const { divisionData } = useSelector((state) => state.division);

 useEffect(() => {
   dispatch(fetchDivisionData());
 }, []);

  useEffect(() => {
    const calculateTotalPages = () => {
      setTotalPages(
        Math.ceil(tableRows ? tableRows.length / itemsPerPage : [])
      );
    };
    calculateTotalPages();
  }, [tableRows, itemsPerPage]);

  // Function to handle next page button click
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      if (!step1State.year) {
        setErrorEmptyMessage("Please enter year.");
        setErrorMessageWeight("");
        return; // Stop execution if validation fails
      }

      if (!step1State.quarter) {
        setErrorEmptyMessage("Please enter quarter.");
        setErrorMessageWeight("");
        return; // Stop execution if validation fails
      }
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle previous page button click
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Group the rows by year, quarter, and user type
const groupedRows = tableRows.reduce((acc, row) => {
  const userType =
    row.monitoring_id
      ? monitoringData?.find((data) => data.id === row.monitoring_id)?.name || "No Permission"
      : row.sector_id
      ? sectorData?.find((data) => data.id === row.sector_id)?.name || "No Permission"
      : row.division_id
      ? divisionData?.find((data) => data.id === row.division_id)?.name || "No Permission"
      : "";

  const groupKey = `${row.year}-${row.quarter}-${userType}`;
  if (!acc[groupKey]) {
    acc[groupKey] = { rows: [], year: row.year, quarter: row.quarter, userType };
  }
  acc[groupKey].rows.push(row);
  return acc;
}, {});

// Convert grouped rows to an array for rendering
const groupedData = Object.values(groupedRows);

  // Calculate data for current page
  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentPageData = tableRows
    ? tableRows.slice(indexOfFirstItem, indexOfLastItem)
    : [];

    const [selectedYear, setSelectedYear] = useState(ethiopianYear);
    const handleYearChange = (e) => {
      setSelectedYear(parseInt(e));
      // Do something with the selected year
    };
    const [selectedQuarter, setSelectedQuarter] = useState(null);

    const [selectedSector, setSelectedSector] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(null);
    
  const [errorMessage, setErrorMessage] = useState("");

  const [errorMessageWeight, setErrorMessageWeight] = useState("");

  const [errorEmptyMessage, setErrorEmptyMessage] = useState("");


  const token = localStorage.getItem("access");
  const [loading, setLoading] = useState(false);
  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/reportApp/summary/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          year: selectedYear,
          sector: selectedSector,
          division: selectedDivision,
          quarter: selectedQuarter,
        },
      });
      setTableRows(response.data); // Assuming response.data is an array of objects
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchTableData();
    }
  }, [token, selectedYear, selectedSector, selectedDivision, selectedQuarter]); 


  const { t } = useTranslation();
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);

  const [open, setOpen] = useState(false);

  const [file2, setFile2] = useState([]);
  const [file3, setFile3] = useState([]);
  const [file4, setFile4] = useState([]);
  const [file5, setFile5] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [step1State, setStep1State] = useState({
    multiple_files: [],
    // other state properties
  });
  const [step2Title, setstep2Title] = useState("");
  const [step3Title, setstep3Title] = useState("");
  const [step4Title, setstep4Title] = useState("");
  const [step5Title, setstep5Title] = useState("");

  const [Step2Legend, setStep2Legend] = useState(
    "ተቋማዊ የማስፈጸም አቅም",
    "ተቋማዊ የማስፈጸም አቅም"
  );
  const [Step3Legend, setStep3Legend] = useState(
    "በአፈፃፀም ሂደት ያጋጣሙ ተግዳሮቶችና የተወሰዱ የመፍትሔ እርምጃዎች",
    "በአፈፃፀም ሂደት ያጋጣሙ ተግዳሮቶችና የተወሰዱ የመፍትሔ እርምጃዎች"
  );
  const [Step4Legend, setStep4Legend] = useState(
    "ማጠቃለያ",
    "ማጠቃለያ"
  );
  const [Step5Legend, setStep5Legend] = useState(
    "በቁልፍ የውጤት አመላካቾች (በKPI ላይ የተመስረተ የልማት ዕቅድ አፈፃፀም ትንተና",
    "በቁልፍ የውጤት አመላካቾች (በKPI ላይ የተመስረተ የልማት ዕቅድ አፈፃፀም ትንተና"
  );

  const [showModalSummary, setShowModalSummary] = useState(false);
  const [accordion0, setAccordion0] = useState([]);
  const [accordion2, setAccordion2] = useState([]);
  const [accordion3, setAccordion3] = useState([]);
  const [accordion4, setAccordion4] = useState([]);
  const [accordion5, setAccordion5] = useState([]);
  const [accordione, setAccordione] = useState([]);
  const [accordions, setAccordions] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: "",
    title: "",
    year: "",
    quarter: "",
    type: "",
    description: "",

    summary_subtitle: [],
    // Add other fields here as per your data structure
  });
  const handleAccordionChangee = (key, field, value) => {
    setModalData((prevData) => ({
      ...prevData,
      summary_subtitle: prevData.summary_subtitle.map((accordion) =>
        accordion.key === key ? { ...accordion, [field]: value } : accordion
      ),
    }));
  };
  const handleFileSelect = (event) => {
    const files = event.target.files;
    setSelectedFiles(files); // Update state with selected files
  };
  const addAccordione = () => {
    setModalData((prevData) => ({
      ...prevData,
      summary_subtitle: [
        ...prevData.summary_subtitle,
        {
          key: prevData.summary_subtitle.length,
          // key: accordions.length + 1,
          title: `Sub title #${accordions.length + 1}`,
          content: "",
          file: [],
          isOpen: false,
        },
      ],
    }));
  };

  const deleteAccordione = (key) => {
    setModalData((prevData) => ({
      ...prevData,
      summary_subtitle: prevData.summary_subtitle.filter(
        (accordion) => accordion.key !== key
      ),
    }));
  };

  const toggleAccordione = (key) => {
    setModalData((prevData) => ({
      ...prevData,
      summary_subtitle: prevData.summary_subtitle.map((accordion) =>
        accordion.key === key
          ? { ...accordion, isOpen: !accordion.isOpen }
          : accordion
      ),
    }));
  };
  const handleEdit = async (id) => {
    try {
      const response = await axiosInstance.get(`reportApp/summary/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;

      // Populate the modal with the fetched data
      setModalData({
        id: data.id,
        title: data.title,
        year: data.year,
        quarter: data.quarter,
        type: data.type,
        description: data.description || "",
        photos: data.photos,
        summary_subtitle: data.summary_subtitle.map((sub, index) => ({
          key: index,
          title: sub.subtitle,
          content: sub.description,
          isOpen: false,
        })),
        // Add other fields here as per your data structure
      });

      // Open the modal
      setEditModal(true);
    } catch (error) {
      console.error("Error fetching data for edit:", error);
    }
  };

  const handleOpenModal = (userId) => {
    handleOpenModalSummary();
    setSelectedEditId(userId);
  };
  const handleCloseModalSummary = () => {
    setShowModalSummary(false);
  };

  const handleCloseeditModal = () => {
    setEditModal(false);
  };
  const handleOpenModalSummary = () => {
    setAccordion0([]);
    setAccordione([]);
    setAccordions([]);
    setAccordion2([]);
    setAccordion3([]);
    setAccordion4([]);
    setStep2Legend("ተቋማዊ የማስፈጸም አቅም");
    setStep3Legend("በአፈፃፀም ሂደት ያጋጣሙ ተግዳሮቶችና የተወሰዱ የመፍትሔ እርምጃዎች");
    setStep4Legend("ማጠቃለያ");
    setStep1State("");
    setstep2Title("");
    setstep3Title("");
    setstep4Title("");
    setstep5Title("");
    setShowModalSummary(true);
    setErrorMessageWeight("");
    setCurrentPage(1);
    setErrorEmptyMessage("");
  };

  const goToNextPage = () => {
    if (currentPage === 4) {
      // Replace totalSteps with your actual total steps count
      handleSubmit();
      handleCloseModalSummary();
    }
    else {
      if (!step1State.year) {
        setErrorEmptyMessage("Please enter year.");
        setErrorMessageWeight("");
        return; // Stop execution if validation fails
      }

      if (!step1State.quarter) {
        setErrorEmptyMessage("Please enter quarter.");
        setErrorMessageWeight("");
        return; // Stop execution if validation fails
      }
      handleSubmit();
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  const addAccordion0 = () => {
    const newAccordion = {
      key: accordion0.length + 1,
      title: `Sub title #${accordion0.length + 1}`,
      content: "",
      file: [],
      isOpen: false,
    };
    setAccordion0([...accordion0, newAccordion]);
  };
  const addAccordion = () => {
    const newAccordion = {
      key: accordions.length + 1,
      title: `Sub title #${accordions.length + 1}`,
      isOpen: false,
      file: [],
      content: "",
    };
    setAccordions([...accordions, newAccordion]);
  };

  const addAccordion3 = () => {
    const newAccordion = {
      key: accordion3.length + 1,
      title: `Sub title #${accordion3.length + 1}`,
      content: "",
      file: [],
      isOpen: false,
    };
    setAccordion3([...accordion3, newAccordion]);
  };
  const addAccordion4 = () => {
    const newAccordion = {
      key: accordion4.length + 1,
      title: `Sub title #${accordion4.length + 1}`,
      content: "",
      file: [],
      isOpen: false,
    };
    setAccordion4([...accordion4, newAccordion]);
  };
  const addAccordion5 = () => {
    const newAccordion = {
      key: accordion5.length + 1,
      title: `Sub title #${accordion5.length + 1}`,
      content: "",
      file: [],
      isOpen: false,
    };
    setAccordion5([...accordion5, newAccordion]);
  };
  const toggleAccordion = (accordionKey) => {
    setAccordions((prevAccordions) =>
      prevAccordions.map((accord) => ({
        ...accord,
        isOpen: accord.key === accordionKey ? !accord.isOpen : false,
      }))
    );
  };
  const toggleAccordion5 = (accordionKey) => {
    setAccordion5((prevAccordions) =>
      prevAccordions.map((accord) => ({
        ...accord,
        isOpen: accord.key === accordionKey ? !accord.isOpen : false,
      }))
    );
  };
  const toggleAccordion4 = (accordionKey) => {
    setAccordion4((prevAccordions) =>
      prevAccordions.map((accord) => ({
        ...accord,
        isOpen: accord.key === accordionKey ? !accord.isOpen : false,
      }))
    );
  };
  const toggleAccordion3 = (accordionKey) => {
    setAccordion3((prevAccordions) =>
      prevAccordions.map((accord) => ({
        ...accord,
        isOpen: accord.key === accordionKey ? !accord.isOpen : false,
      }))
    );
  };
  const toggleAccordion0 = (accordionKey) => {
    setAccordion0((prevAccordions) =>
      prevAccordions.map((accord) => ({
        ...accord,
        isOpen: accord.key === accordionKey ? !accord.isOpen : false,
      }))
    );
  };

  const deleteAccordion = (accordionKey) => {
    const updatedAccordions = accordions.filter(
      (accord) => accord.key !== accordionKey
    );
    setAccordions(updatedAccordions);
  };
  const deleteAccordion5 = (accordionKey) => {
    const updatedAccordions = accordion5.filter(
      (accord) => accord.key !== accordionKey
    );
    setAccordion5(updatedAccordions);
  };
  const deleteAccordion4 = (accordionKey) => {
    const updatedAccordions = accordion4.filter(
      (accord) => accord.key !== accordionKey
    );
    setAccordion4(updatedAccordions);
  };
  const deleteAccordion3 = (accordionKey) => {
    const updatedAccordions = accordion3.filter(
      (accord) => accord.key !== accordionKey
    );
    setAccordion3(updatedAccordions);
  };
  const deleteAccordion0 = (accordionKey) => {
    const updatedAccordions = accordion0.filter(
      (accord) => accord.key !== accordionKey
    );
    setAccordion0(updatedAccordions);
  };

  const handleTitleChange = (accordionKey, event) => {
    const newTitle = event.target.value;
    setAccordions((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey ? { ...accord, title: newTitle } : accord
      )
    );
  };
  const handleTitleChange5 = (accordionKey, event) => {
    const newTitle = event.target.value;
    setAccordion5((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey ? { ...accord, title: newTitle } : accord
      )
    );
  };
  const handleTitleChange3 = (accordionKey, event) => {
    const newTitle = event.target.value;
    setAccordion3((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey ? { ...accord, title: newTitle } : accord
      )
    );
  };
  const handleTitleChange0 = (accordionKey, event) => {
    const newTitle = event.target.value;
    setAccordion0((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey ? { ...accord, title: newTitle } : accord
      )
    );
  };
  const handleContentChange2 = (key, event) => {
    const newContent = event.target.value;
    setAccordions(
      accordions.map((accordion) =>
        accordion.key === key
          ? { ...accordion, content: newContent }
          : accordion
      )
    );
  };
  const handleContentChange3 = (key, event) => {
    const newContent = event.target.value;
    setAccordion3(
      accordion3.map((accordion) =>
        accordion.key === key
          ? { ...accordion, content: newContent }
          : accordion
      )
    );
  };

  const handleContentChange4 = (accordionKey, event) => {
    const newTitle = event.target.value;
    setAccordion4((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey ? { ...accord, title: newTitle } : accord
      )
    );
  };
  const handleContentChange5 = (accordionKey, event) => {
    const newTitle = event.target.value;
    setAccordion5((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey ? { ...accord, title: newTitle } : accord
      )
    );
  };
  const handleContentChange0 = (accordionKey, event) => {
    const newTitle = event.target.value;
    setAccordion0((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey ? { ...accord, title: newTitle } : accord
      )
    );
  };
  const handleSubContentChange4 = (accordionKey, event) => {
    const newContent = event.target.value;
    setAccordion4((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey
          ? { ...accord, content: newContent }
          : accord
      )
    );
  };
  const handleSubContentChange5 = (accordionKey, event) => {
    const newContent = event.target.value;
    setAccordion5((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey
          ? { ...accord, content: newContent }
          : accord
      )
    );
  };
  const handleSubContentChange0 = (accordionKey, event) => {
    const newContent = event.target.value;
    setAccordion0((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey
          ? { ...accord, content: newContent }
          : accord
      )
    );
  };

  const handleStep1Change = (e) => {
    const { id, value } = e.target;
    setStep1State((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  const handleFileChange0 = (e) => {
    const files = Array.from(e.target.files);
    setStep1State((prevState) => ({
      ...prevState,
      multiple_files: files,
    }));
  };
  const handleFileChange00 = (key, files) => {
    setAccordion0(
      accordion0.map((accordion) =>
        accordion.key === key ? { ...accordion, file: files } : accordion
      )
    );
  };
  const handleFileChange = (key, files) => {
    setAccordions(
      accordions.map((accordion) =>
        accordion.key === key ? { ...accordion, file: files } : accordion
      )
    );
  };

  const handleFileChange3 = (key, files) => {
    setAccordion3(
      accordion3.map((accordion) =>
        accordion.key === key ? { ...accordion, file: files } : accordion
      )
    );
  };
  const handleFileChange4 = (key, files) => {
    setAccordion4(
      accordion4.map((accordion) =>
        accordion.key === key ? { ...accordion, file: files } : accordion
      )
    );
  };
  const handleFileChange5 = (key, files) => {
    setAccordion5(
      accordion5.map((accordion) =>
        accordion.key === key ? { ...accordion, file: files } : accordion
      )
    );
  };
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }


    try {


      let formData = new FormData();

      // Common data for all steps
      formData.append("year", step1State.year);
      formData.append("quarter", step1State.quarter);

      if (currentPage === 1) {
        // Step 1 data
        formData.append("type", "መግቢያ");
        formData.append("title", "መግቢያ");
        formData.append("description", step1State.Introduction);

        // Append photos for step 1 (if any)
        if (Array.isArray(step1State.multiple_files)) {
          step1State.multiple_files.forEach((file) => {
            formData.append("photos", file);
          });
        }
        accordion0.forEach((accordion, index) => {
          formData.append(`subtitle[${index}]subtitle`, accordion.title);
          formData.append(`subtitle[${index}]description`, accordion.content);
          // Append each photo for the current accordion item
          if (accordion.file && accordion.file instanceof FileList) {
            Array.from(accordion.file).forEach((photo, photoIndex) => {
              formData.append(`subtitle[${index}]photos[${photoIndex}]`, photo);
            });
          }
        });

      } else if (currentPage >= 2 && currentPage <= 4) {
        // Step 2, 3, and 4 data
        const stepsData = {
          2: {
            type: "ተቋማዊ የማስፈጸም አቅም፣ የሀብት አጠቃቀም እና የአገልግሎት አሰጣጥ አሰራር ማጎልበት ስራዎችን በተመለከተ",
            title: Step2Legend,
            description: step2Title,
            files: file2,
            accordions: accordions,
          },
          3: {
            type: "በአፈፃፀም ሂደት ያጋጣሙ ተግዳሮቶችና የተወሰዱ የመፍትሔ እርምጃዎች",
            title: Step3Legend,
            description: step3Title,
            files: file3,
            accordions: accordion3,
          },
          4: {
            type: "ማጠቃለያ",
            title: Step4Legend,
            description: step4Title,
            files: file4,
            accordions: accordion4,
          },

        };

        const stepData = stepsData[currentPage];
        formData.append("type", stepData.type);
        formData.append("title", stepData.title);
        formData.append("description", stepData.description);
        // Ensure files is treated as a FileList and iterate over it
        if (stepData.files instanceof FileList) {
          Array.from(stepData.files).forEach((file, index) => {
            formData.append(`photos[${index}]`, file);
          });
        }
        // Append subtitles with photos for the current step
        stepData.accordions.forEach((accordion, index) => {
          formData.append(`subtitle[${index}]subtitle`, accordion.title);
          formData.append(`subtitle[${index}]description`, accordion.content);

          if (accordion.file instanceof FileList) {
            Array.from(accordion.file).forEach((photo, photoIndex) => {
              formData.append(`subtitle[${index}]photos[${photoIndex}]`, photo);
            });
          }
        });
      }

      // Debugging: Log all formData entries
      for (let [key, value] of formData.entries()) {
      }

      const response = await axiosInstance.post(
        "/reportApp/summary/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTableRows((prevRows) => [
        ...prevRows,
        {
          id: response.data.id, // Assuming the response includes the new item's ID
          title: response.data.title,
          year: response.data.year,
          quarter: response.data.quarter,
          // Add any other relevant fields here
        },
      ]);
      if (currentPage < steps.length) {
        setCurrentPage(currentPage + 1);
      } else {
      }
    }

    catch (error) {

      console.error(
        "Error sending data:",
        error.response ? error.response.data : error.message
      );
    }
  };



  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append("type", modalData.type);
    formData.append("title", modalData.title);
    formData.append("year", modalData.year);
    formData.append("quarter", modalData.quarter);
    formData.append("description", modalData.description);

    // Filter out deleted subtitles
    const updatedSubtitles = modalData.summary_subtitle.filter(
      (subtitle) => !subtitle.deleted
    );

    updatedSubtitles.forEach((subtitle, index) => {
      formData.append(`summary_subtitle[${index}]subtitle`, subtitle.title);
      formData.append(`summary_subtitle[${index}]description`, subtitle.content);

      // Append files for this subtitle
      if (subtitle.files && subtitle.files.length > 0) {
        subtitle.files.forEach((file, fileIndex) => {
          formData.append(`summary_subtitle[${index}]photos[${fileIndex}]`, file);
        });
      }
    });

    // Append selected files (assuming 'selectedFiles' contains files for the main section)
    selectedFiles.forEach((file, index) => {
      formData.append(`photos[${index}]`, file);
    });

    try {
      const response = await axiosInstance.put(
        `/reportApp/summary/${modalData.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEditModal(false);
      // fetchTableData(); // Example function to fetch updated data after successful edit
    } catch (error) {
      console.error("Error updating data:", error);
      // Handle error, e.g., show error message to the user
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/reportApp/summary/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        // Assuming status 204 means successful deletion (No Content)
        setTableRows(tableRows.filter((row) => row.id !== id));
      } else {
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      // Log detailed error information
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };
  const steps = [
    {
      title: "መግቢያ",
      content: (
        <div className="mt-10">
          <div className="mb-10 justify-end">
            <div className=" w-full inline-block">
              <label htmlFor="year" className="text-blue-600 mr-5">
                For the year of
              </label>
              <select
                id="year"
                className="outline-none inline focus:outline-none p-2 bg-white rounded-3xlbg-gray-50 border border-blue-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleStep1Change}
                defaultValue={step1State.year}
                required
              >
                <option value="">Select a year</option> {/* Placeholder option */}
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <label
                htmlFor="quarter"
                className="ml-8 mr-8 mb-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <span className="text-blue-600">Quarter</span>
              </label>
              <select
                id="quarter"
                className="outline-none inline focus:outline-none p-2 bg-white rounded-3xlbg-gray-50 border border-blue-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleStep1Change}
                defaultValue={step1State}
              >
                <option value=""> Select a Quarter</option>
                <option value="first">First Quarter</option>
                <option value="second">Second Quarter</option>
                <option value="third">Third Quarter</option>
                <option value="fourth">Fourth Quarter</option>
                <option value="six">Six month</option>
                <option value="nine">Nine month</option>
                <option value="year">Annual</option>
              </select>
              <div className="w-11/12  justify-self-center">
                {errorMessage && errorMessage === 403 && (
                  <h1 className="text-red-900 font-bold ml-3">
                    {errorMessageWeight}
                  </h1>
                )}
                <p className="text-red-500 text-sm">{errorEmptyMessage}</p>
              </div>
              <textarea
                id="Introduction"
                rows="4"
                className=" mt-3 block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48"
                placeholder="Write your text here..."
                onChange={handleStep1Change}
              ></textarea>

              <div class="flex  items-center justify-center mt-7">
                <input
                  onChange={handleFileChange0}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="multiple_files"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>
              {accordion0.map((accordion) => (
                <div key={accordion.key} className="mt-5 border rounded-md p-2">
                  <div className="cursor-pointer flex justify-between items-center">
                    <input
                      type="text"
                      className="border-none bg-transparent flex-1"
                      value={accordion.title}
                      onChange={(value) =>
                        handleContentChange0(accordion.key, value)
                      }
                    />

                    <button
                      className="text-red-500 ml-2"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteAccordion0(accordion.key);
                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <FontAwesomeIcon
                      icon={accordion.isOpen ? faChevronUp : faChevronDown}
                      className="ml-2"
                      onClick={() => toggleAccordion0(accordion.key)}
                    />
                  </div>
                  {accordion.isOpen && (
                    <div className="mt-2 pl-5">
                      <textarea
                        rows="4"
                        className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48"
                        placeholder="Write your text here..."
                        value={accordion.content}
                        onChange={(value) =>
                          handleSubContentChange0(accordion.key, value)
                        }
                      />
                      <div className="flex items-center justify-center mt-7">
                        <input
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          id={`multiple_files4_${accordion.key}`}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) =>
                            handleFileChange00(accordion.key, e.target.files)
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button
                className="mt-5 text-blue-500 "
                type="button"
                onClick={addAccordion0}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span className="ml-2">Add Sub Title</span>
              </button>

            </div>
          </div>
        </div>
      ),
    },
    {
      title: "ተቋማዊ የማስፈጸም አቅም",
      content: (
        <div>
          <textarea
            className="block static mx-auto  w-96 justify-center inset-x-10 top-0  resize-none mt-10 mb-5 text-center border"
            value={Step2Legend}
            onChange={(e) => setStep2Legend(e.target.value)}
          >
            {Step2Legend}
          </textarea>
          <textarea
            id="step2maintext"
            rows="4"
            className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48"
            placeholder="Write your text here..."
            value={step2Title}
            onChange={(e) => setstep2Title(e.target.value)}
          />
          <div className="flex items-center justify-center mt-7">
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="multiple_files"
              onChange={(e) => setFile2(e.target.files)} // Update state with selected files
              type="file"
              accept="image/*"
              multiple
            />
          </div>
          {accordions.map((accordion) => (
            <div key={accordion.key} className="mt-5 border rounded-md p-2">
              <div className="cursor-pointer flex justify-between items-center">
                <input
                  type="text"
                  className="border-none bg-transparent flex-1"
                  value={accordion.title}
                  onChange={(event) => handleTitleChange(accordion.key, event)}
                />
                <button
                  className="text-red-500 ml-2"
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteAccordion(accordion.key);
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <FontAwesomeIcon
                  icon={accordion.isOpen ? faChevronUp : faChevronDown}
                  className="ml-2"
                  onClick={() => toggleAccordion(accordion.key)}
                />
              </div>
              {accordion.isOpen && (
                <div className="mt-2 pl-5">
                  <textarea
                    rows="4"
                    className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48"
                    placeholder="Write your text here..."
                    value={accordion.content}
                    onChange={(value) =>
                      handleContentChange2(accordion.key, value)
                    }
                  />
                  <div className="flex items-center justify-center mt-7">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor="multiple_files"
                    >
                      Upload multiple files
                    </label>
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id={`multiple_files_${accordion.key}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleFileChange(accordion.key, e.target.files)
                      }
                    />{" "}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            className="mt-5 text-blue-500 "
            type="button"
            onClick={addAccordion}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-2">Add Sub Title</span>
          </button>
        </div>
      ),
    },
    {
      title: "ተግዳሮቶችና የመፍትሔዎች",
      content: (
        <div>
          <textarea
            className="block static mx-auto  w-96 justify-center inset-x-10 top-0  resize-none mt-10 mb-5 text-center border"
            value={Step3Legend}
            onChange={(e) => setStep3Legend(e.target.value)}
          >
            {Step3Legend}
          </textarea>
          <textarea
            id="step3maintext"
            rows="4"
            className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48"
            placeholder="Write your text here..."
            value={step3Title}
            onChange={(e) => setstep3Title(e.target.value)}
          />
          <div className="flex items-center justify-center mt-7">
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="multiple_files"
              onChange={(e) => setFile3(e.target.files)}
              type="file"
              accept="image/*"
              multiple
            />
          </div>
          {accordion3.map((accordion) => (
            <div key={accordion.key} className="mt-5 border rounded-md p-2">
              <div className="cursor-pointer flex justify-between items-center">
                <input
                  type="text"
                  className="border-none bg-transparent flex-1"
                  value={accordion.title}
                  onChange={(event) => handleTitleChange3(accordion.key, event)}
                />
                <button
                  className="text-red-500 ml-2"
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteAccordion3(accordion.key);
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <FontAwesomeIcon
                  icon={accordion.isOpen ? faChevronUp : faChevronDown}
                  className="ml-2"
                  onClick={() => toggleAccordion3(accordion.key)}
                />
              </div>
              {accordion.isOpen && (
                <div className="mt-2 pl-5">
                  <textarea
                    rows="4"
                    className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48"
                    placeholder="Write your text here..."
                    value={accordion.content}
                    onChange={(value) =>
                      handleContentChange3(accordion.key, value)
                    }
                  />
                  <div className="flex items-center justify-center mt-7">
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id={`multiple_files3_${accordion.key}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleFileChange3(accordion.key, e.target.files)
                      }
                    />{" "}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            className="mt-5 text-blue-500 "
            type="button"
            onClick={addAccordion3}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-2">Add Sub Title</span>
          </button>
        </div>
      ),
    },

    {
      title: "ማጠቃለያ",
      content: (
        <div>
          <textarea
            className="block static mx-auto  w-96 justify-center inset-x-10 top-0  resize-none mt-10 mb-5 text-center border"
            value={Step4Legend}
            onChange={(e) => setStep4Legend(e.target.value)}
          >
            {Step4Legend}
          </textarea>
          <textarea
            id="step4maintext"
            rows="4"
            className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48"
            placeholder="Write your text here..."
            value={step4Title}
            onChange={(e) => setstep4Title(e.target.value)}
          />
          <div className="flex items-center justify-center mt-7">
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              onChange={(e) => setFile4(e.target.files)}
              type="file"
              accept="image/*"
              multiple
            />
          </div>
          {accordion4.map((accordion) => (
            <div key={accordion.key} className="mt-5 border rounded-md p-2">
              <div className="cursor-pointer flex justify-between items-center">
                <input
                  type="text"
                  className="border-none bg-transparent flex-1"
                  value={accordion.title}
                  onChange={(value) =>
                    handleContentChange4(accordion.key, value)
                  }
                />

                <button
                  className="text-red-500 ml-2"
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteAccordion4(accordion.key);
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <FontAwesomeIcon
                  icon={accordion.isOpen ? faChevronUp : faChevronDown}
                  className="ml-2"
                  onClick={() => toggleAccordion4(accordion.key)}
                />
              </div>
              {accordion.isOpen && (
                <div className="mt-2 pl-5">
                  <textarea
                    rows="4"
                    className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48"
                    placeholder="Write your text here..."
                    value={accordion.content}
                    onChange={(value) =>
                      handleSubContentChange4(accordion.key, value)
                    }
                  />
                  <div className="flex items-center justify-center mt-7">
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id={`multiple_files4_${accordion.key}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleFileChange4(accordion.key, e.target.files)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            className="mt-5 text-blue-500 "
            type="button"
            onClick={addAccordion4}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-2">Add Sub Title</span>
          </button>
        </div>
      ),
    },

  ];
const quarterLabels = {
  12: "Annual",
  1: "First Quarter",
  2: "Second Quarter",
  3: "Third Quarter",
  4: "Fourth Quarter",
  6: "Six Month",
  9: "Nine Month",
};
  return (
    <>
      <p className="text-base font-bold font-sans ">{t("MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.SUMMARY")}</p>
      <Card className="w-full  rounded-md shadow-md">
  <div className="ml-6 mt-5"></div>
  <CardBody className="grid gap-5 md:gap-8 lg:gap-10 md:grid-cols-2 xl:grid-cols-4 items-center">
    <div className="grid gap-2">
      <h1 className="whitespace-nowrap text-left text-sm md:text-md font-bold text-black">
        {t("MAIN.TABLE.YEAR")}
      </h1>
      <Select
        label={t("MAIN.TABLE.SELECT_YEAR")}
        value={selectedYear}
        onChange={handleYearChange}
      >
        {years.map((year) => (
          <Option
            className="focus:text-light-blue-700 whitespace-nowrap text-left text-sm md:text-md font-medium text-black"
            key={year}
            value={year}
          >
            {year}
          </Option>
        ))}
      </Select>
    </div>
    <div className="grid gap-2">
      <h1 className="whitespace-nowrap text-left text-sm md:text-md font-bold text-black">
        {t("MAIN.TABLE.QUARTER")}
      </h1>
      <Select
        label={t("MAIN.TABLE.SELECT_QUARTER")}
        value={selectedQuarter}
        onChange={(e) => setSelectedQuarter(e)}
      >
        {[
          { value: "12", label: t("MAIN.TABLE.ANNUAL") },
          { value: "1", label: t("MAIN.TABLE.FIRST_QUARTER") },
          { value: "2", label: t("MAIN.TABLE.SECOND_QUARTER") },
          { value: "3", label: t("MAIN.TABLE.THIRD_QUARTER") },
          { value: "4", label: t("MAIN.TABLE.FOURTH_QUARTER") },
          { value: "6", label: t("MAIN.TABLE.SIX_MONTH") },
          { value: "9", label: t("MAIN.TABLE.NINE_MONTH") },
        ].map((option) => (
          <Option
            key={option.value}
            value={option.value}
            className="focus:text-light-blue-700 whitespace-nowrap text-left text-sm md:text-md font-medium text-black"
          >
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
    {authInfo.user.userPermissions.includes("createAssign") && (
      <div className="grid gap-2">
        <h1 className="whitespace-nowrap text-left text-sm md:text-md font-bold text-black">
          {t("MAIN.TABLE.SECTOR")}
        </h1>
        <Select
          label={t("MAIN.TABLE.SELECT_SECTOR")}
          onChange={(e) => setSelectedSector(e)}
        >
          {sectorData
            ? sectorData.map((sector) => (
                <Option
                  key={sector.id}
                  className="focus:text-light-blue-700 whitespace-nowrap text-left text-sm md:text-md font-medium text-black"
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
        <h1 className="whitespace-nowrap text-left text-sm md:text-md font-bold text-black">
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
                  className="focus:text-light-blue-700 whitespace-nowrap text-left text-sm md:text-md font-medium text-black"
                >
                  {division.name}
                </Option>
              ))
            : []}
        </Select>
      </div>
    )}
  </CardBody>
  <div className="flex flex-col md:flex-row justify-end gap-3 mb-5 mx-6">
  <Button
  variant="text"
  size="md"
  className={`flex items-center justify-center gap-2 text-white focus:bg-blue-700 normal-case text-sm md:text-md font-bold ${
    loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-700"
  }`}
  onClick={!loading ? fetchTableData : null} // Disable click if loading
>
      {t("MAIN.TABLE.FILTER")}
    </Button>
    <Button
      variant="text"
      size="md"
      className="flex items-center justify-center gap-2 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case text-sm md:text-md font-bold"
      onClick={() => handleclear()}
    >
      {t("MAIN.TABLE.CLEAR")}
    </Button>
  </div>
</Card>
      <Card className="w-fill h-min mt-5 rounded-md ">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
            <div className="w-full sm:w-72">{/* Input for search */}</div>
            <div className="flex shrink-0 flex-wrap gap-2 sm:flex-row">
              <Button
                variant="text"
                size="sm"
                className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                onClick={handleOpenModalSummary}
              >
                <FontAwesomeIcon icon={faPlus} />
                {t("MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.ADD_SUMMARY")}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <div className="overflow-x-auto h-full">

          <table className="w-full table-auto text-left border-b-2">
    <thead>
      <tr>
        {TABLE_HEAD.map((head) => (
          <th
            key={head}
            className="border-b-2 text-center border-blue-gray-100 bg-blue-gray-50 p-2 sm:p-4"
          >
            <Typography
              variant="small"
              color="blue-gray"
              className="font-sans font-bold leading-none opacity-70 text-xs sm:text-sm"
            >
              {t(head)}
            </Typography>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {groupedData.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {/* Group Header Row */}
          <tr>
            <td
              colSpan={6}
              className="bg-blue-gray-100 text-center font-bold text-sm p-2"
            >
              
              {t("MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.YEAR")}: {group.year}, {t("MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.QUARTER")}: {group.quarter}, {t("MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.OWNER")}: {group.userType}
            </td>
          </tr>
          {/* Render Rows in Group */}
          {group.rows.map(({ id, title, year, quarter }, index) => {
            const displayNo = index + 1;
            const isLast = index === group.rows.length - 1;
            const classes = isLast
              ? "p-2 text-center"
              : "p-2 text-center border-b-2 border-blue-gray-50";

            return (
              <tr key={id}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {displayNo}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {title}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {year}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                     {quarterLabels[quarter] || quarter}
                  </Typography>
                </td>
                <td className={classes}>
                  {group.userType}
                </td>
                <td className={classes}>
                  <div className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon
                      color="orange"
                      onClick={() => handleEdit(id)}
                      icon={freeSolidSvgIcons.faPenToSquare}
                      className="cursor-pointer text-xs sm:text-sm"
                    />
                    <FontAwesomeIcon
                      color="red"
                      onClick={() => handleDelete(id)}
                      icon={freeSolidSvgIcons.faTrash}
                      className="cursor-pointer text-xs sm:text-sm"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </React.Fragment>
      ))}
    </tbody>
  </table>

          </div>
        </CardBody>
        <CardFooter className="flex flex-wrap items-center justify-between gap-4">
          <div></div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="text"
              size="sm"
              className="hover:bg-blue-700 font-sans text-xs sm:text-sm hover:text-white focus:bg-blue-700 focus:text-white normal-case"
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
                className="w-6 h-6 hover:text-light-blue-700"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
              >
                <path
                  fillRule="evenodd"
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <IconButton className="rounded-full bg-blue-700 text-xs sm:text-sm">
                {currentPage}
              </IconButton>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-6 h-6 hover:text-light-blue-700"
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
              className="hover:bg-blue-700 font-sans text-xs sm:text-sm hover:text-white focus:bg-blue-700 focus:text-white normal-case"
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              {t("MAIN.TABLE.NEXT")}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Add Summary Modal */}
      <Dialog
        open={showModalSummary}
        size="lg"
        handler={handleCloseModalSummary}
        className="w-full h-fit"
      >
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">Add Summary</div>
          <div
            className="cursor-pointer mr-5"
            onClick={handleCloseModalSummary}
          >
            <FontAwesomeIcon
              className="cursor-pointer"
              icon={freeSolidSvgIcons.faXmark}
              color="blue"
              onClick={handleCloseModalSummary}
            />
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ol className="flex items-center ml-5 sm:ml-32 text-xs text-gray-900 font-medium sm:text-base scrollbar-true h-fit">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`flex w-full relative ${index < currentPage - 1
                  ? "text-indigo-600 after:content-[''] after:w-full after:h-0.5 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
                  : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
                  } ${index === steps.length - 1 ? " after:hidden" : ""} ${index + 1 === currentPage ? "after:bg-indigo-600" : ""
                  }`}
              >
                <div className="block whitespace-nowrap z-10">
                  {index < currentPage - 1 ? (
                    <span className="w-6 h-6 bg-green-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-white lg:w-10 lg:h-10">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span
                      className={`w-6 h-6 ${index === currentPage - 1
                        ? "bg-indigo-600 border-2 border-transparent"
                        : "bg-gray-50 border-2 border-gray-200"
                        } rounded-full flex justify-center items-center mx-auto mb-3 text-sm ${index === currentPage - 1
                          ? "text-white"
                          : "text-gray-900"
                        } lg:w-10 lg:h-10`}
                    >
                      {index + 1}
                    </span>
                  )}
                  {/* Step Title - Hidden on small screens */}
                  <div className="hidden sm:block text-black-500 hover:text-green-700 cursor-pointer">
                    {step.title}
                  </div>
                </div>
              </li>
            ))}
          </ol>


          <div className="mr-10 ml-10 h-auto max-h-[700px] w-fill">
            {steps[currentPage - 1].content}
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button
                color="blue"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button color="blue" type="button" onClick={goToNextPage}>
                {currentPage === steps.length ? "Finish" : "Next"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Modal for showing summary */}
      {showModalSummary && (
        <div
          onClick={handleCloseModalSummary}
          className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center"
        >
          <Card onClick={handleOpenModalSummary}>
            {/* Content for showing summary */}
          </Card>
        </div>
      )}
      <Dialog open={editModal} size="lg" handler={handleCloseeditModal}>
        <DialogHeader>
          <div className="cursor-pointer mr-5" onClick={handleCloseeditModal}>
            <FontAwesomeIcon
              className="cursor-pointer"
              icon={freeSolidSvgIcons.faXmark}
              color="blue"
              onClick={() => handleCloseeditModal()}
            />
          </div>
        </DialogHeader>
        <DialogBody>
          {/* lala lalalaalalal */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSubmit(modalData.id);
            }}
          >
            <div className="mb-5">
              <textarea
                className="block static mx-auto h-fit w-96 justify-center inset-x-10 top-0  resize-none mb-5 text-center"
                value={modalData.title}
                onChange={(e) =>
                  setModalData({ ...modalData, title: e.target.value })
                }
                placeholder="Title"
              />
              <label htmlFor="year" className="text-blue-600 mr-5">
                For the year of
              </label>
              <select
                id="year"
                className="outline-none inline focus:outline-none p-2 bg-white rounded-3xlbg-gray-50 border border-blue-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) =>
                  setModalData({ ...modalData, year: e.target.value })
                }
                value={modalData.year}
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <label
                htmlFor="quarter"
                className="ml-8 mr-8 mb-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <span className="text-blue-600">Quarter</span>
              </label>
              <select
                id="quarter"
                className="outline-none inline focus:outline-none p-2 bg-white rounded-3xlbg-gray-50 border border-blue-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) =>
                  setModalData({ ...modalData, quarter: e.target.value })
                }
                value={modalData.quarter}
              >
                <option value="first">First Quarter</option>
                <option value="second">Second Quarter</option>
                <option value="third">Third Quarter</option>
                <option value="fourth">Fourth Quarter</option>
                <option value="six">Six month</option>
                <option value="nine">Nine month</option>
                <option value="year">Annual</option>
              </select>

              <textarea
                id="description"
                rows="4"
                className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48 mt-5"
                placeholder="Write your text here..."
                onChange={(e) =>
                  setModalData({ ...modalData, description: e.target.value })
                }
                value={modalData.description}
              />
              <div className="flex items-center justify-center mt-7">
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="multiple_files"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              {modalData.summary_subtitle.map((accordion) => (
                <div key={accordion.key} className="mt-5 border rounded-md p-2">
                  <div className="cursor-pointer flex justify-between items-center">
                    <input
                      type="text"
                      className="border-none bg-transparent flex-1"
                      value={accordion.title}
                      onChange={(e) =>
                        handleAccordionChangee(
                          accordion.key,
                          "title",
                          e.target.value
                        )
                      }
                    />
                    <button
                      className="text-red-500 ml-2"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteAccordione(accordion.key);

                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <FontAwesomeIcon
                      icon={accordion.isOpen ? faChevronUp : faChevronDown}
                      className="ml-2"
                      onClick={() => toggleAccordione(accordion.key)}
                    />
                  </div>
                  {accordion.isOpen && (
                    <div className="mt-2 pl-5">
                      <textarea
                        rows="4"
                        className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48"
                        placeholder="Write your text here..."
                        value={accordion.content}
                        onChange={(e) =>
                          handleAccordionChangee(
                            accordion.key,
                            "content",
                            e.target.value
                          )
                        }
                      />
                      <div className="flex items-center justify-center mt-7">
                        <input
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          id={`multiple_files_${accordion.key}`}
                          type="file"
                          accept="image/*"
                          multiple
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button
                className="mt-5 text-blue-500 "
                type="button"
                onClick={addAccordione}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span className="ml-2">Add Sub Title</span>
              </button>
            </div>
            <div className="right-0 ">
              <button type="button" onClick={() => setEditModal(false)}>
                <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" type="submit">Save</button>

                Cancel
              </button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
}

export default Summary;
