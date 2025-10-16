import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faChevronDown, faChevronUp,  faChartColumn,faEye,
  faXmark,
  faPenToSquare,
  faTrash, } from "@fortawesome/free-solid-svg-icons";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import axiosInstance from "../GlobalContexts/Base_url";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardHeader,
  Input,
  IconButton,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Collapse,
} from "@material-tailwind/react";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

const TABLE_HEAD = ["No", "Title", "year",,"quarter", "Action"];


function Summary() {
  const [tableRows, setTableRows] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axiosInstance.get('planApp/plan-document/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTableRows(response.data); // Assuming response.data is an array of objects
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };
  
    fetchTableData();
  }, [token]);
  
  const { t } = useTranslation();
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);

  const [open, setOpen] = useState(false);
  const[doctitle,setdoctitle]=useState('');
  const [file2, setFile2] = useState([]);
  const [file3, setFile3] = useState([]);
  const [file4, setFile4] = useState([]);

  const [step1State, setStep1State] = useState({
    multiple_files: [],
    // other state properties
  });

    //pagination
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page
    const [totalPages, setTotalPages] = useState(0); //
  const [step2Title, setstep2Title] = useState('');
  const [step3Title, setstep3Title] = useState('');
  const [step4Title, setstep4Title] = useState('');

  const [Step2Legend, setStep2Legend] = useState('የልማት ዕቅዱ እንድምታዎች እና የሚጠበቁ ውጤቶች', 'የልማት ዕቅዱ እንድምታዎች እና የሚጠበቁ ውጤቶች');
  const [Step3Legend, setStep3Legend] = useState('የበጀት ዓመት ኢላማዎችና የድርጊት መርሃ ግብር', 'የበጀት ዓመት ኢላማዎችና የድርጊት መርሃ ግብር');
  const [Step4Legend, setStep4Legend] = useState('የበጀት ዓመቱን የልማት ዕቅድ ለማሰካት የሚተገበሩ ማስፈጸሚያዎች', 'የበጀት ዓመቱን የልማት ዕቅድ ለማሰካት የሚተገበሩ ማስፈጸሚያዎች');

  const [showModalSummary, setShowModalSummary] = useState(false);

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
  const handleCloseModalSummary = () => {
    setShowModalSummary(false);
  };

  const handleOpenModalSummary = () => {
    setShowModalSummary(true);
  };

  const handleModalClickSummary = (e) => {
    e.stopPropagation();
  };

  const goToNextPage = () => {
    if (currentPage === 4) { // Replace totalSteps with your actual total steps count
      handleSubmit();
    }else{
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
  
      // Common data for all steps
      formData.append('title', doctitle);
      formData.append('year', step1State.year);
      formData.append('quarter', step1State.quarter);
  
      const stepsData = {
        1: {
          type: 'መግቢያ',
          title: 'Introduction',
          description: step1State.Introduction,
          files: step1State.multiple_files || [],
          accordions: []
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
        formData.append(`plan_narrations[${stepIndex}]section_type`, stepData.type);
        formData.append(`plan_narrations[${stepIndex}]title`, stepData.title);
        formData.append(`plan_narrations[${stepIndex}]description`, stepData.description);
  
        // Append main photos for current step
        if (Array.isArray(stepData.files)) {
          stepData.files.forEach((file, fileIndex) => {
            formData.append(`plan_narrations[${stepIndex}]Plan_photos[${fileIndex}]photos`, file);
          });
        }
  
        // Append subtitles with photos for current step
        if (Array.isArray(stepData.accordions)) {
          stepData.accordions.forEach((accordion, index) => {
            formData.append(`plan_narrations[${stepIndex}]subtitles[${index}]subtitle`, accordion.title);
            formData.append(`plan_narrations[${stepIndex}]subtitles[${index}]description`, accordion.content);
  
            if (accordion.file instanceof FileList) {
              Array.from(accordion.file).forEach((photo, photoIndex) => {
                formData.append(`plan_narrations[${stepIndex}]subtitles[${index}]Plan_photos[${photoIndex}]photos`, photo);
              });
            }
  
            if (Array.isArray(accordion.accordions)) {
              accordion.accordions.forEach((subAccordion, jndex) => {
                formData.append(`plan_narrations[${stepIndex}]subtitles[${index}]subtitles[${jndex}]subtitle`, subAccordion.title);
                formData.append(`plan_narrations[${stepIndex}]subtitles[${index}]subtitles[${jndex}]description`, subAccordion.content);
  
                if (subAccordion.file instanceof FileList) {
                  Array.from(subAccordion.file).forEach((photo, photoIndex) => {
                    formData.append(`plan_narrations[${stepIndex}]subtitles[${index}]subtitles[${jndex}]Plan_photos[${photoIndex}]photos`, photo);
                  });
                }
              });
            }
          });
        }
      };
  
      // Loop through each step and append data
      Object.keys(stepsData).forEach((key, index) => {
        appendStepData(stepsData[key], index);
      });
  
  
      const response = await axiosInstance.post('planApp/plan-document/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
  
      if (currentPage < steps.length) {
        setCurrentPage(currentPage + 1);
      } else {
      }
    } catch (error) {
      console.error('Error sending data:', error.response ? error.response.data : error.message);
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
                default={2016}
                required
              >
                <option value="2013">2013</option>
                <option value="2014">2014</option>
                <option value="2015">2015</option>
                <option value="2016">2016</option>
                <option value="2017">2017</option>
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
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
                defaultValue={1}
              >
                
                <option value="1">First Quarter</option>
                <option value="2">Second Quarter</option>
                <option value="3">Third Quarter</option>
                <option value="4">Fourth Quarter</option>
              </select>


                <input type="text" className=" mt-2 mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-light-blue-700   focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500  "  placeholder="type your document title" name="" onChange={(e) => setdoctitle(e.target.value)}/>
              <textarea
                id="Introduction"
              
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
      title: "ውጤቶች",
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
            <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="multiple_files" onChange={(e) => setFile3(e.target.files)} type="file" multiple />
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
      title: "ማጠቃለያ",
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
            <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" onChange={(e) => setFile4(e.target.files)} type="file" multiple />
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

  return (
    <>
      <p className="text-base font-bold font-sans">Summary</p>
      <Card className="w-full h-min mt-5 rounded-md">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between mt-5">
            <div className="w-full md:w-72">
              {/* Input for search */}
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                variant="text"
                size="sm"
                className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                onClick={handleOpenModalSummary}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Summary
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>

        <table className="w-full min-w-max table-auto text-left border-b-2">
        <thead>
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
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
      {tableRows.map(({ id,section_type, No, title, year, quarter }, index) => {
        const displayNo = index + 1;
        const isLast = index === tableRows.length - 1;
        const classes = isLast
          ? "p-2 text-center"
          : "p-2 text-center border-b-2 border-blue-gray-50";

        return (
          <tr key={id}>
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
            <td className={classes}>
            <div className="flex items-center justify-center gap-2">

<FontAwesomeIcon
  className="cursor-pointer"
  icon={faEye}
  color="blue"
  onClick={() =>
    handleOpenModal(item)
  }
/>


<FontAwesomeIcon
  color="orange"
  onClick={() =>
    handleOpenModal(item)
  }
  icon={faPenToSquare}
  className="cursor-pointer"
/>


<FontAwesomeIcon
  color="red"
  onClick={() =>
    handleDelete(id)
  }
  icon={faTrash}
  className="cursor-pointer"
/>

{/* Add other action buttons here */}
</div>
            </td>
          </tr>
        );
      })}
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

      {/* Add Summary Modal */}
      <Dialog open={showModalSummary} size="lg" handler={handleCloseModalSummary}>
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">Add Summary</div>
          <div className="cursor-pointer mr-5" onClick={handleCloseModalSummary}>
            X
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ol className="flex items-center ml-32 text-xs text-gray-900 font-medium sm:text-base scrollbar-true h-fit">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`flex w-full relative ${index < currentPage - 1
                  ? "text-indigo-600 after:content-[''] after:w-full after:h-0.5 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
                  : "text-gray-900 after:content-[''] after:w-full after:h-0.5 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4"
                  } ${index === steps.length - 1 ? ' after:hidden' : ''} ${index + 1 === currentPage ? 'after:bg-indigo-600' : ''
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
                        ? 'bg-indigo-600 border-2 border-transparent'
                        : 'bg-gray-50 border-2 border-gray-200'
                        } rounded-full flex justify-center items-center mx-auto mb-3 text-sm ${index === currentPage - 1 ? 'text-white' : 'text-gray-900'
                        } lg:w-10 lg:h-10`}
                    >
                      {index + 1}
                    </span>
                  )}
                  {step.title}
                </div>
              </li>
            ))}
          </ol>

          <div className="mr-10 ml-10 h-auto max-h-[700px] overflow-scroll">
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
              <Button
                color="blue"
                type="button"
                onClick={goToNextPage}
              >
                {currentPage === steps.length ? 'Finish' : 'Next'}
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
    </>
  );

}

export default Summary;
