import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faMinus, faChevronDown, faChevronUp, faDownload, faEye,
  faPenToSquare,
  faTrash,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../GlobalContexts/Base_url";
import * as freeSolidSvgIcons from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  Select,
  Option,
  CardHeader,
  IconButton,
  Typography,
  Button,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import ReactLoading from 'react-loading';
import Loadingif from '/time.png';
import { useTranslation } from "react-i18next";
import PlanComments from "./PlanComments";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import dayjs from "dayjs";
import "dayjs/locale/am"; // Optional: For Amharic localization
const TABLE_HEAD = ["MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.SELECT", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.NO", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.TITLE", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.YEAR", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.QUARTER", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.APPROVE", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.SUBMIT", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.ACTION"];
const TABLE_HEAD2 = ["MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.SELECT", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.NO", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.TITLE", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.YEAR", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.QUARTER", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.SUBMIT", "MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.ACTION"];


function Summary() {
  const [tableRows, setTableRows] = useState([]);
  const token = localStorage.getItem("access");
  const authInfo = useAuth();
  const dispatch = useDispatch();
  const [selectedEditId, setSelectedEditId] = useState(null);
  const [commentModal, setCommentModal] = useState(false);
  const [docid, setDocid] = useState(null)
  const currentYear = new Date().getFullYear();
  const currentYearGC = new Date().getFullYear(); 
const currentMonthGC = new Date().getMonth() + 1; 
const ethiopianYear = currentYearGC - 7 - (currentMonthGC < 9 ? 1 : 0);
const years = Array.from({ length: ethiopianYear - 2013 + 2 }, (_, index) => 2013 + index);
  const [selectedYear, setSelectedYear] = useState(ethiopianYear);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const { sectorData } = useSelector((state) => state.sector);
  const [comments, setComments] = useState([]);
  const [availableComments, setAvailableComments] = useState({});


  useEffect(() => {
    if (!tableRows || tableRows.length === 0) return;

    // Create an object to store the comment count per document ID
    const commentsPerDocument = {};

    // For each document in tableRows, fetch comments based on its ID
    const fetchComments = async (id) => {
      try {
        const response = await axiosInstance.get(`/planApp/plancomments/?planDocument_id=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const comments = response.data;

        if (comments.length > 0) {
          // Store the number of comments for this document ID
          commentsPerDocument[id] = comments.length;
        }
      } catch (error) {
        console.error(`Error fetching comments for document ${id}`, error);
      }
    };

    // Trigger fetch for each document
    Promise.all(tableRows.map(row => fetchComments(row.id)))
      .then(() => {
        // Set available comments after all requests complete
        setAvailableComments(commentsPerDocument);
      });
  }, [token, tableRows]);


  useEffect(() => {
    dispatch(fetchSectorgData());
  }, []);
  const { divisionData } = useSelector((state) => state.division);
  useEffect(() => {
    dispatch(fetchDivisionData());
  }, []);


  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e));
    // Do something with the selected year
  };

  const handleCloseCommentModal = () => {
    setCommentModal(false);
    setDocid(null);
  }
  const handleCommentSection = (id) => {
    setCommentModal(true);
    setDocid(id);
  };
  const handleCloseModalSummary = () => {
    setShowModalSummary(false);
    setCurrentPage(1);
  };
  const [showModalSummary, setShowModalSummary] = useState(false);


  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axiosInstance.get('planApp/plan-document/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            year: selectedYear,
            sector: selectedSector,
            division: selectedDivision,
            quarter: selectedQuarter,
          },
        });
        setTableRows(response.data); // Assuming response.data is an array of objects
        setSelectedDivision(null);
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };

    fetchTableData();
  }, [token]);

  const handlerefresh = async () => {
    const fetchTableData = async () => {
      try {
        const response = await axiosInstance.get('planApp/plan-document/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            year: selectedYear,
            sector: selectedSector,
            division: selectedDivision,
            quarter: selectedQuarter,
          },
        });
        setTableRows(response.data); // Assuming response.data is an array of objects
        setSelectedDivision(null);
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };

    await fetchTableData();
    window.location.reload();
  };


  const handleclear = async () => {
    const clearall = async () => {
      setSelectedDivision(null);
      setSelectedSector(null);
      setSelectedYear(ethiopianYear);
      setSelectedQuarter(null);
      window.location.reload();
      handleFetchData();

    }
    await clearall();
  }
  const handleFetchData = async () => {
    const fetchTableData = async () => {
      try {
        const response = await axiosInstance.get('planApp/plan-document/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            year: selectedYear,
            sector: selectedSector,
            division: selectedDivision,
            quarter: selectedQuarter,
          },
        });
        setTableRows(response.data); // Assuming response.data is an array of objects
        setSelectedDivision(null);
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };
    await fetchTableData();
  };


  const { t } = useTranslation();
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);

  const [open, setOpen] = useState(false);
  const [doctitle, setdoctitle] = useState('');
  const [file2, setFile2] = useState([]);
  const [file3, setFile3] = useState([]);
  const [file4, setFile4] = useState([]);
  const [step1State, setStep1State] = useState({
    year: currentYear - 7,
    quarter: "12",
    multiple_files: [],
    // other state properties
  });
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  //pagination
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page
  const paginatedRows = tableRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(tableRows.length / itemsPerPage);

  const [step2Title, setstep2Title] = useState('');
  const [step3Title, setstep3Title] = useState('');
  const [step4Title, setstep4Title] = useState('');

  const [Step2Legend, setStep2Legend] = useState('የልማት ዕቅዱ እንድምታዎች እና የሚጠበቁ ውጤቶች', 'የልማት ዕቅዱ እንድምታዎች እና የሚጠበቁ ውጤቶች');
  const [Step3Legend, setStep3Legend] = useState('የበጀት ዓመት ኢላማዎችና የድርጊት መርሃ ግብር', 'የበጀት ዓመት ኢላማዎችና የድርጊት መርሃ ግብር');
  const [Step4Legend, setStep4Legend] = useState('የበጀት ዓመቱን የልማት ዕቅድ ለማሰካት የሚተገበሩ ማስፈጸሚያዎች', 'የበጀት ዓመቱን የልማት ዕቅድ ለማሰካት የሚተገበሩ ማስፈጸሚያዎች');


  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [pdfloading, setLoading] = useState(false);

  const [accordion2, setAccordion2] = useState([]);
  const [accordion3, setAccordion3] = useState([]);
  const [accordion4, setAccordion4] = useState([]);
  const [accordions, setAccordions] = useState([]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleOpen1 = () => {
    setOpen1((cur) => !cur);
    setOpen2(false);
    setOpen3(false);
    setOpen4(false);
  };

  const toggleOpen2 = () => {
    setOpen2((cur) => !cur);
    setOpen1(false);
    setOpen3(false);
    setOpen4(false);
  };

  const toggleOpen3 = () => {
    setOpen3((cur) => !cur);
    setOpen1(false);
    setOpen2(false);
    setOpen4(false);
  };

  const toggleOpen4 = () => {
    setOpen4((cur) => !cur);
    setOpen1(false);
    setOpen3(false);
    setOpen2(false);
  };
  const handleOpenModal = (userId) => {
    setShowModal(true);
    setSelectedEditId(userId);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  const handleOpenModalView = () => {
    setShowModalView(true);
  };


  const handleOpenModalSummary = () => {
    setShowModalSummary(true);
  };

  // Function to toggle selection of a document
  const handleCheckboxChange = (id) => {
    setSelectedDocuments((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };


  // Function to check if a document is selected
  const isSelected = (id) => selectedDocuments.includes(id);

  const handleMergeDocuments = () => {
    setLoading(true);
    // Make sure at least one document is selected
    if (selectedDocuments.length > 0) {
      // Construct query parameters string
      const queryParams = new URLSearchParams();
      selectedDocuments.forEach((id) => {
        queryParams.append('documentIds', id);
      });

      // Construct final URL with query parameters
      const url = `/planApp/mergeDocuments/?${queryParams.toString()}`;

      // Send GET request using Axios
      axiosInstance.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: {
          documentIds: selectedDocuments // Assuming selectedDocuments is an array of IDs
        }
      })
        .then((response) => {
          // Handle response from backend if needed
          const pdfUrl = response.data.pdf_file_path;
          const doxUrl = response.data.docx_file_path;
          handleOpenPdfModal(pdfUrl);
          setLoading(false);
          setDocUrl(doxUrl);
        })
        .catch((error) => {
          // Handle error
          console.error('Error merging documents:', error);
        });
    } else {
      // Inform user to select documents
      alert('Please select at least one document to merge.');
    }
  };

  const handleEdit = async (id) => {
    setShowModalSummary(true);
    setSelectedEditId(id);
    try {
      const response = await axiosInstance.get(`planApp/plan-document/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      // Set form fields with fetched data for step 1
      setdoctitle(data.title);
      if (data.plan_narrations[0]) {
        setStep1State({
          year: data.year,
          quarter: data.quarter,
          Introduction: data.plan_narrations[0].description,
          multiple_files: data.plan_narrations[0].Plan_photos, // Handle file loading if necessary
        });
      }

      // Set form fields for subsequent steps
      if (data.plan_narrations[1]) {
        setstep2Title(data.plan_narrations[1].description);
        setAccordions(data.plan_narrations[1].subtitles.map((subtitle, index) => ({
          key: index + 1,
          title: subtitle.subtitle,
          content: subtitle.description,
          file: [], // Handle file loading if necessary
          isOpen: false,
        })));
      }

      if (data.plan_narrations[2]) {
        setstep3Title(data.plan_narrations[2].description);
        setAccordion3(data.plan_narrations[2].subtitles.map((subtitle, index) => ({
          key: index + 1,
          title: subtitle.subtitle,
          content: subtitle.description,
          file: [], // Handle file loading if necessary
          isOpen: false,
        })));
      }

      if (data.plan_narrations[3]) {
        setstep4Title(data.plan_narrations[3].description);
        setAccordion4(data.plan_narrations[3].subtitles.map((subtitle, index) => ({
          key: index + 1,
          title: subtitle.subtitle,
          content: subtitle.description,
          file: [], // Handle file loading if necessary
          isOpen: false,
        })));
      }

      // Set additional state as needed
    } catch (error) {
      console.error("Error fetching document data:", error);
    }
  };


  const goToNextPage = () => {
    if (currentPage === 4) { // Replace totalSteps with your actual total steps count
      handleSubmit();
    } else {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const addAccordion = () => {
    const newAccordion = {
      key: accordions.length + 1,
      title: `Sub title #${accordions.length + 1}`,
      isOpen: false,
      file: [],
      content: '',
    };
    setAccordions([...accordions, newAccordion]);
  };

  const addAccordion3 = () => {
    const newAccordion = {
      key: accordion3.length + 1,
      title: `Sub title #${accordion3.length + 1}`,
      content: '',
      file: [],
      isOpen: false,
    };
    setAccordion3([...accordion3, newAccordion]);
  };
  const addAccordion4 = () => {
    const newAccordion = {
      key: accordion4.length + 1,
      title: `Sub title #${accordion4.length + 1}`,
      content: '',
      file: [],
      isOpen: false,
    };
    setAccordion4([...accordion4, newAccordion]);
  };
  const toggleAccordion = (accordionKey) => {
    setAccordions((prevAccordions) =>
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

  const deleteAccordion = (accordionKey) => {
    const updatedAccordions = accordions.filter((accord) => accord.key !== accordionKey);
    setAccordions(updatedAccordions);
  };

  const deleteAccordion4 = (accordionKey) => {
    const updatedAccordions = accordion4.filter((accord) => accord.key !== accordionKey);
    setAccordion4(updatedAccordions);
  };
  const deleteAccordion3 = (accordionKey) => {
    const updatedAccordions = accordion3.filter((accord) => accord.key !== accordionKey);
    setAccordion3(updatedAccordions);
  };

  const handleTitleChange = (accordionKey, event) => {
    const newTitle = event.target.value;
    setAccordions((prevAccordions) =>
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
  const handleContentChange2 = (key, event) => {
    const newContent = event.target.value;
    setAccordions(accordions.map((accordion) =>
      accordion.key === key ? { ...accordion, content: newContent } : accordion
    ));
  };
  const handleContentChange3 = (key, event) => {
    const newContent = event.target.value;
    setAccordion3(accordion3.map((accordion) =>
      accordion.key === key ? { ...accordion, content: newContent } : accordion
    ));
  };

  const handleContentChange4 = (accordionKey, event) => {
    const newTitle = event.target.value;
    setAccordion4((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey ? { ...accord, title: newTitle } : accord
      )
    );
  };
  const handleSubContentChange4 = (accordionKey, event) => {
    const newContent = event.target.value;
    setAccordion4((prevAccordions) =>
      prevAccordions.map((accord) =>
        accord.key === accordionKey ? { ...accord, content: newContent } : accord
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

  const handleFileChange = (key, files) => {
    setAccordions(accordions.map((accordion) =>
      accordion.key === key ? { ...accordion, file: files } : accordion
    ));
  };

  const handleFileChange3 = (key, files) => {
    setAccordion3(accordion3.map((accordion) =>
      accordion.key === key ? { ...accordion, file: files } : accordion
    ));
  };
  const handleFileChange4 = (key, files) => {
    setAccordion4(accordion3.map((accordion) =>
      accordion.key === key ? { ...accordion, file: files } : accordion
    ));
  };

  const UpdateApproval = async (id) => {
    try {
      // Fetch the existing data for the specified id  
      // Extract the data from table rows that has been fetched already instead of fethcing it again
      const data = tableRows.find(row => row.id === id);

      // Toggle the boolean value (assuming the field is named 'status')
      data.status = !data.status;

      // Prepare formData if needed, otherwise use data directly
      // const formData = new FormData();
      // Object.keys(data).forEach(key => formData.append(key, data[key]));

      // Submit the updated data
      const putResponse = await axiosInstance.put(
        `planApp/plan-document/${id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleFetchData();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };


  const Submit = async (id) => {
    try {
      // Fetch the existing data for the specified id
      // Extract the data
      const data = tableRows.find(row => row.id === id);

      // Toggle the boolean value (assuming the field is named 'status')
      data.submitted = !data.submitted;

      // Prepare formData if needed, otherwise use data directly
      // const formData = new FormData();
      // Object.keys(data).forEach(key => formData.append(key, data[key]));

      // Submit the updated data
      const putResponse = await axiosInstance.put(
        `planApp/plan-document/${id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleFetchData();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };


  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`planApp/plan-document/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        // Assuming status 204 means successful deletion (No Content)
        setTableRows(tableRows.filter(row => row.id !== id));
      } else {
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      // Log detailed error information
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };


  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      let formData = new FormData();
      formData.append("title", doctitle);
      formData.append("year", step1State.year);
      formData.append("quarter", step1State.quarter);

      const stepsData = {
        1: {
          type: "መግቢያ",
          title: "መግቢያ",
          description: step1State.Introduction,
          files: step1State.multiple_files || [],
          accordions: [],
        },
        2: {
          type: "የልማት ዕቅዱ እንድምታዎች እና የሚጠበቁ ውጤቶች",
          title: Step2Legend,
          description: step2Title,
          files: file2,
          accordions: accordions,
        },
        3: {
          type: "የበጀት ዓመት ኢላማዎችና የድርጊት መርሃ ግብር",
          title: Step3Legend,
          description: step3Title,
          files: file3,
          accordions: accordion3,
        },
        4: {
          type: "የበጀት ዓመቱን የልማት ዕቅድ ለማሰካት የሚተገበሩ ማስፈጸሚያዎች",
          title: Step4Legend,
          description: step4Title,
          files: file4,
          accordions: accordion4,
        },
      };

      const appendStepData = (stepData, stepIndex) => {
        formData.append(
          `plan_narrations[${stepIndex}]section_type`,
          stepData.type
        );
        formData.append(`plan_narrations[${stepIndex}]title`, stepData.title);
        formData.append(
          `plan_narrations[${stepIndex}]description`,
          stepData.description
        );

        if (Array.isArray(stepData.files)) {
          stepData.files.forEach((file, fileIndex) => {
            formData.append(
              `plan_narrations[${stepIndex}]Plan_photos[${fileIndex}]photos`,
              file
            );
          });
        }

        if (Array.isArray(stepData.accordions)) {
          stepData.accordions.forEach((accordion, index) => {
            formData.append(
              `plan_narrations[${stepIndex}]subtitles[${index}]subtitle`,
              accordion.title
            );
            formData.append(
              `plan_narrations[${stepIndex}]subtitles[${index}]description`,
              accordion.content
            );

            if (accordion.file instanceof FileList) {
              Array.from(accordion.file).forEach((photo, photoIndex) => {
                formData.append(
                  `plan_narrations[${stepIndex}]subtitles[${index}]Plan_photos[${photoIndex}]photos`,
                  photo
                );
              });
            }

            if (Array.isArray(accordion.accordions)) {
              accordion.accordions.forEach((subAccordion, jndex) => {
                formData.append(
                  `plan_narrations[${stepIndex}]subtitles[${index}]subtitles[${jndex}]subtitle`,
                  subAccordion.title
                );
                formData.append(
                  `plan_narrations[${stepIndex}]subtitles[${index}]subtitles[${jndex}]description`,
                  subAccordion.content
                );

                if (subAccordion.file instanceof FileList) {
                  Array.from(subAccordion.file).forEach((photo, photoIndex) => {
                    formData.append(
                      `plan_narrations[${stepIndex}]subtitles[${index}]subtitles[${jndex}]Plan_photos[${photoIndex}]photos`,
                      photo
                    );
                  });
                }
              });
            }
          });
        }
      };

      Object.keys(stepsData).forEach((key, index) => {
        appendStepData(stepsData[key], index);
      });

      let response;
      if (selectedEditId) {
        response = await axiosInstance.put(
          `planApp/plan-document/${selectedEditId}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        handleCloseModalSummary();
        handlerefresh();
      } else {
        response = await axiosInstance.post(
          "planApp/plan-document/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setShowModalSummary(false);
        handlerefresh();
      }


      if (currentPage < steps.length) {
        setCurrentPage(currentPage + 1);
      } else {
      }
    } catch (error) {
      console.error(
        "Error sending data:",
        error.response ? error.response.data : error.message
      );
    }
  };


  const steps = [
    {
      title: "መግቢያ",
      content: (
        <div className="mt-10">
          <div className="mb-10 justify-end">
            <div className=" w-full inline-block">
              <label
                htmlFor="year"
                className="text-blue-600 mr-5"
              >
                For the year of
              </label>
              <select
                id="year"
                className="outline-none inline focus:outline-none p-2 bg-white rounded-3xlbg-gray-50 border border-blue-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleStep1Change}
                value={step1State.year || selectedYear}
                required
              >
                {years.map((year) => (
                  <option key={year.key} value={year} >{year}</option>
                ))}
              </select>
              <label
                htmlFor="quarter"
                className="ml-8 mr-8 mb-2 text-sm font-bold text-gray-900 dark:text-white"
              >
                <span className="text-blue-600">And</span>
              </label>

              <select
                id="quarter"
                className="outline-none inline focus:outline-none p-2 bg-white rounded-3xlbg-gray-50 border border-blue-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleStep1Change}
                value={step1State.quarter}
                defaultValue={12}
              >
                <option value="12">Annual</option>
                <option value="1">First Quarter</option>
                <option value="2">Second Quarter</option>
                <option value="3">Third Quarter</option>
                <option value="4">Fourth Quarter</option>
                <option value="6">Six Month</option>
                <option value="9">Nine Month</option>
              </select>


              <input type="text" className=" mt-2 mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-light-blue-700   focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500  " placeholder="type your document title" id="doctit" value={doctitle} name="" onChange={(e) => setdoctitle(e.target.value)} />
              <textarea
                id="Introduction"
                value={step1State.Introduction}
                rows="4"
                className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48 "
                placeholder="Write your text here..."

                onChange={handleStep1Change}
              ></textarea>

              <div class="flex  items-center justify-center mt-7">
                <input
                  onChange={handleFileChange0}
                  className="block w-full text-sm text-gray-900 border   rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="multiple_files"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>

            </div>
          </div>
        </div>
      ),
    },
    {
      title: "እንድምታዎች እና ውጤቶች",
      content: (
        <div>
          <textarea value={Step2Legend} onChange={(e) => setStep2Legend(e.target.value)}>{Step2Legend}</textarea>
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
                    onChange={(value) => handleContentChange2(accordion.key, value)}
                  />
                  <div className="flex items-center justify-center mt-7">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="multiple_files">Upload multiple files</label>
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id={`multiple_files_${accordion.key}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange(accordion.key, e.target.files)}
                    />                  </div>
                </div>
              )}
            </div>
          ))}
          <button className="mt-2 text-blue-500" type="button" onClick={addAccordion}>
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-2">Add Sub Title</span>
          </button>
        </div>
      ),
    },
    {
      title: "የድርጊት መርሃ ግብር",
      content: (
        <div>
          <textarea value={Step3Legend} onChange={(e) => setStep3Legend(e.target.value)}>{Step3Legend}</textarea>
          <textarea
            id="step3maintext"
            rows="4"
            className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48"
            placeholder="Write your text here..."
            value={step3Title}
            onChange={(e) => setstep3Title(e.target.value)}
          />
          <div className="flex items-center justify-center mt-7">
            <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="multiple_files" onChange={(e) => setFile3(e.target.files)} type="file" accept="image/*" multiple />
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
                    onChange={(value) => handleContentChange3(accordion.key, value)}
                  />
                  <div className="flex items-center justify-center mt-7">
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id={`multiple_files3_${accordion.key}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange3(accordion.key, e.target.files)}
                    />                  </div>
                </div>
              )}
            </div>
          ))}
          <button className="mt-2 text-blue-500" type='button' onClick={addAccordion3}>
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-2">Add Sub Title</span>
          </button>
        </div>
      ),
    },
    {
      title: "የሚተገበሩ ማስፈጸሚያዎች",
      content: (
        <div>
          <textarea value={Step4Legend} onChange={(e) => setStep4Legend(e.target.value)}>{Step4Legend}</textarea>
          <textarea
            id="step4maintext"
            rows="4"
            className="block p-2.5 w-full text-sm resize-none border-2 rounded-md border-light-blue-700 h-48"
            placeholder="Write your text here..."
            value={step4Title}
            onChange={(e) => setstep4Title(e.target.value)}
          />
          <div className="flex items-center justify-center mt-7">
            <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" onChange={(e) => setFile4(e.target.files)} type="file" accept="image/*" multiple />
          </div>
          {accordion4.map((accordion) => (
            <div key={accordion.key} className="mt-5 border rounded-md p-2">
              <div className="cursor-pointer flex justify-between items-center">
                <input
                  type="text"
                  className="border-none bg-transparent flex-1"
                  value={accordion.title}
                  onChange={(value) => handleContentChange4(accordion.key, value)}
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
                    onChange={(value) => handleSubContentChange4(accordion.key, value)}
                  />
                  <div className="flex items-center justify-center mt-7">
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id={`multiple_files4_${accordion.key}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange4(accordion.key, e.target.files)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <button className="mt-2 text-blue-500" type="button" onClick={addAccordion4}>
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-2">Add Sub Title</span>
          </button>
        </div>
      ),
    },
  ];


  const handleDownload = () => {
    // Create a temporary anchor element
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.href = docUrl;
    downloadAnchorNode.setAttribute('download', 'download.pdf'); // Specify the filename for download
    document.body.appendChild(downloadAnchorNode); // Append anchor to body
    downloadAnchorNode.click(); // Click the anchor to trigger download
    document.body.removeChild(downloadAnchorNode); // Clean up anchor node after download
  };

  const handleOpenPdfModal = (pdfUrl) => {
    setPdfUrl(pdfUrl);
    setShowPdfModal(true);
  };
  const handleClosePdfModal = () => setShowPdfModal(false);

  const handleGenerateDocument = async (item) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/planApp/getDocument/?doc_id=${item}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Assuming response.data contains the JSON response
      const pdfUrl = response.data.pdf_file_path;
      const doxUrl = response.data.docx_file_path;
      handleOpenPdfModal(pdfUrl);
      setLoading(false);
      setDocUrl(doxUrl);
    } catch (error) {
      console.error('Error generating document:', error);
    }
  };

  return (
    <>
      <p className="text-base font-bold font-sans">{t("MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.PLAN_SUMMARY")}</p>

      <Card className="w-full rounded-md shadow-md">
   
        <CardBody className="grid gap-2 md:gap-4 lg:gap-6 md:grid-cols-2 xl:grid-cols-4 items-center">
          <div className="grid gap-1">
            <h1 className="whitespace-nowrap text-left text-xs md:text-sm font-semibold text-black">
              {t("MAIN.TABLE.YEAR")}
            </h1>
            <Select
              label={t("MAIN.TABLE.SELECT_YEAR")}
              value={selectedYear}
              onChange={handleYearChange}
              className="text-xs md:text-sm"
            >
              {years.map((year) => (
                <Option
                  key={year}
                  value={year}
                  className="focus:text-light-blue-700 whitespace-nowrap text-left text-xs md:text-sm font-medium text-black"
                >
                  {year}
                </Option>
              ))}
            </Select>
          </div>
          <div className="grid gap-1">
            <h1 className="whitespace-nowrap text-left text-xs md:text-sm font-semibold text-black">
              {t("MAIN.TABLE.QUARTER")}
            </h1>
            <Select
              label={t("MAIN.TABLE.SELECT_QUARTER")}
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e)}
              className="text-xs md:text-sm"
            >
              {[
                { value: "12", label: t("MAIN.TABLE.YEAR") },
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
                  className="focus:text-light-blue-700 whitespace-nowrap text-left text-xs md:text-sm font-medium text-black"
                >
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          {authInfo.user.userPermissions.includes("createAssign") && (
            <div className="grid gap-1">
              <h1 className="whitespace-nowrap text-left text-xs md:text-sm font-semibold text-black">
                {t("MAIN.TABLE.SECTOR")}
              </h1>
              <Select
                label={t("MAIN.TABLE.SELECT_SECTOR")}
                onChange={(e) => setSelectedSector(e)}
                className="text-xs md:text-sm"
              >
                {sectorData
                  ? sectorData.map((sector) => (
                    <Option
                      key={sector.id}
                      className="focus:text-light-blue-700 whitespace-nowrap text-left text-xs md:text-sm font-medium text-black"
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
              <div className="grid gap-1">
                <h1 className="whitespace-nowrap text-left text-xs md:text-sm font-semibold text-black">
                  {t("MAIN.TABLE.DIVISION")}
                </h1>
                <Select
                  label={t("MAIN.TABLE.SELECT_DIVISION")}
                  onChange={(e) => setSelectedDivision(e)}
                  className="text-xs md:text-sm"
                >
                  {divisionData
                    ? divisionData.map((division) => (
                      <Option
                        key={division.id}
                        value={division.id}
                        className="focus:text-light-blue-700 whitespace-nowrap text-left text-xs md:text-sm font-medium text-black"
                      >
                        {division.name}
                      </Option>
                    ))
                    : []}
                </Select>
              </div>
            )}
        </CardBody>
        <div className="flex flex-col md:flex-row justify-end gap-2 mb-4 mx-4">
          <Button
            variant="text"
            size="sm"
            className="flex items-center justify-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case text-xs md:text-sm font-bold"
            onClick={() => handleFetchData()}
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

      <Card className="w-full h-min mt-5 rounded-md">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex flex-wrap items-center justify-between mt-1 gap-2 md:gap-0">
            <div className="w-full md:w-72">
              {/* Input for search */}
            </div>
            <div className="flex flex-col sm:flex-row gap-1">
              <Button
                variant="text"
                size="sm"
                className=" items-center gap-0 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                onClick={handleOpenModalSummary}
              >
                <FontAwesomeIcon icon={faPlus} />
                {t("MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.ADD_SUMMARY")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left border-b-2">
              <thead>
                {authInfo.user.sector_id ? (
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b-2 text-center border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-sans font-bold leading-none opacity-70"
                        >
                          {t(head)}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                ) : (
                  <tr>
                    {TABLE_HEAD2.map((head) => (
                      <th
                        key={head}
                        className="border-b-2 text-center border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-sans font-bold leading-none opacity-70"
                        >
                          {t(head)}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                )}
              </thead>
              <tbody>
                {paginatedRows.map(
                  (
                    { select, id, section_type, No, title, year, quarter, status, submitted, late },
                    index
                  ) => {
                    const displayNo = (currentPage - 1) * itemsPerPage + index + 1;
                    const isLast = index === tableRows.length - 1;
                    const classes = isLast
                      ? "p-2 text-center"
                      : "p-2 text-center border-b-2 border-blue-gray-50";

                    return (
                      <tr key={id}>
                        <td className={`flex ${classes}`}>
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            onChange={() => handleCheckboxChange(id)}
                            checked={isSelected(id)}
                          />
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {displayNo}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {title}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {year}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {quarter}
                          </Typography>
                        </td>
                        {authInfo.user.sector_id && (
                          <td className={classes}>
                            <label className="flex justify-center items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={status}
                                onChange={() => UpdateApproval(id)}
                                className="sr-only peer"
                              />
                              <div className={`relative w-9 h-5 rounded-full peer bg-white border border-gray-200 peer-checked:after:translate-x-full after:absolute  ${status ? 'after:top-[-1px] after:start-[-5px] after:bg-green-900 after:border after:rounded-full after:h-5 after:w-5 after:transition-all' : 'after:top-[-1px] after:start-[-5px] after:bg-red-900 after:border after:rounded-full after:h-5 after:w-5 after:transition-all'}`}/>
 
                            </label>
                          </td>
                        )}
                        <td className={classes}>
                          <label className="flex justify-center items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={submitted}
                              onChange={() => Submit(id)}
                              className="sr-only peer"
                            />
                              <div className={`relative w-9 h-5 rounded-full peer bg-white border border-gray-200 peer-checked:after:translate-x-full after:absolute  ${submitted ? 'after:top-[-1px] after:start-[-5px] after:bg-green-900 after:border after:rounded-full after:h-5 after:w-5 after:transition-all' : 'after:top-[-1px] after:start-[-5px] after:bg-red-900 after:border after:rounded-full after:h-5 after:w-5 after:transition-all'}`}/>
                              </label>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center justify-center gap-2">
                            <FontAwesomeIcon
                              className="cursor-pointer"
                              icon={faComment}
                              color="blue"
                              onClick={() => handleCommentSection(id)}
                            />
                            <FontAwesomeIcon
                              className="cursor-pointer"
                              icon={faEye}
                              color="blue"
                              onClick={() => handleGenerateDocument(id)}
                            />
                            <FontAwesomeIcon
                              className="cursor-pointer"
                              icon={faPenToSquare}
                              color="orange"
                              onClick={() => handleEdit(id)}
                            />
                            <FontAwesomeIcon
                              className="cursor-pointer"
                              icon={faTrash}
                              color="red"
                              onClick={() => handleDelete(id)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
        <CardFooter className="flex flex-wrap justify-between items-center gap-4">
          {selectedDocuments.length > 1 && (
            <Button
              className="bg-blue-500 hover:bg-blue-700 font-sans text-sm text-white"
              onClick={handleMergeDocuments}
            >
              Merge Selected Documents
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              variant="text"
              size="sm"
              className="hover:bg-blue-700 font-sans text-sm text-blue-700"
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
            >
              {t("MAIN.TABLE.PREVIOUS")}
            </Button>
            <IconButton className="rounded-full bg-blue-700 text-white">
              {currentPage}
            </IconButton>
            <Button
              variant="text"
              size="sm"
              className="hover:bg-blue-700 font-sans text-sm text-blue-700"
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              {t("MAIN.TABLE.NEXT")}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog
        open={showModalSummary}
        size="lg"
        handler={handleCloseModalSummary}
        className="max-h-screen overflow-y-auto"
      >
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">{t("MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.ADD_SUMMARY")}</div>
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
        <form onSubmit={handleSubmit} className="h-full w-full">
          <ol className="flex items-center ml-3 lg:ml-16 text-xs text-gray-900 font-medium sm:text-sm overflow-auto">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`flex w-full relative ${index < currentPage - 1
                  ? "text-indigo-600 after:content-[''] after:w-full after:h-0.5 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-4 after:top-2 after:left-3"
                  : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-4 after:top-2 after:left-3"
                  } ${index === steps.length - 1 ? ' after:hidden' : ''} ${index + 1 === currentPage ? 'after:bg-indigo-600' : ''
                  }`}
              >
                <div className="block whitespace-nowrap z-10">
                  {index < currentPage - 1 ? (
                    <span className="w-5 h-5 bg-green-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-2 text-xs text-white lg:w-8 lg:h-8">
                      <svg
                        className="w-4 h-4"
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
                      className={`w-5 h-5 ${index === currentPage - 1
                        ? 'bg-indigo-600 border-2 border-transparent'
                        : 'bg-gray-50 border-2 border-gray-200'
                        } rounded-full flex justify-center items-center mx-auto mb-2 text-xs ${index === currentPage - 1 ? 'text-white' : 'text-gray-900'
                        } lg:w-8 lg:h-8`}
                    >
                      {index + 1}
                    </span>
                  )}
                  <span className="hidden sm:block text-xs">{step.title}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="mr-3 ml-3 lg:mr-8 lg:ml-8 h-auto max-h-[65vh] lg:max-h-[65vh] overflow-auto">
            {steps[currentPage - 1].content}
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button
                color="blue"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="text-xs lg:text-sm"
              >
                Previous
              </Button>
              <Button
                color="blue"
                type="button"
                onClick={goToNextPage}
                className="text-xs lg:text-sm"
              >
                {currentPage === steps.length ? 'Finish' : 'Next'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Dialog>




      <Dialog open={showPdfModal} size="xl" handler={handleClosePdfModal}>

        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">PDF Document</div>
          <div className="cursor-pointer mr-5" onClick={handleClosePdfModal}>
            X
          </div>
        </DialogHeader>
        <DialogBody>
          {(authInfo.user.monitoring_id || authInfo.user.is_superadmin) && (
          <Button
          variant="text"
          size="sm"
          className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700  text-white  normal-case whitespace-nowrap text-left text-sm font-bold"
          onClick={handleDownload}
        >
          <FontAwesomeIcon icon={faDownload} />
          Download Word Document
        </Button>
          )}
        </DialogBody>
        <DialogFooter>
          <iframe src={pdfUrl} width="100%" height="500px"></iframe>
        </DialogFooter>
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
      {pdfloading && (
        <div className="w-1/2 shadow-2xl bg-white absolute top-36 left-[35%] p-5 rounded-lg h-[400px]">
          <div className="cursor-pointer mr-5 font-bold text-2xl" onClick={() => {setLoading(false);handleClosePdfModal();}}>X</div>
          <div className="text-center">
            <label className="font-semibold">Please wait a moment...</label>
            <img src={Loadingif} className="mx-auto mt-20" width={"20%"} />
          </div>
          <ReactLoading type={"bubbles"} className="mx-auto mb-0" color={"#1976d2"} height={'10%'} width={'20%'} />
        </div>
      )}
      <Dialog open={commentModal} size="xl" className="h-[700px]" handler={handleCloseCommentModal}>
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">{t("MAIN.SIDEBAR.REPORT.COMMENT_SECTION")}</div>
          <div className="cursor-pointer mr-5" onClick={handleCloseCommentModal}>
            X
          </div>
        </DialogHeader>
        <PlanComments doc_id={docid} />
      </Dialog>
    </>
  );

}

export default Summary;