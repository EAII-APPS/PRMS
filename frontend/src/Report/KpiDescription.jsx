import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Carousel } from "@material-tailwind/react";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardHeader,
  Input,
  Textarea,
  Button,
  CardBody,
  CardFooter,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react";

import { useTranslation } from "react-i18next";

// import axios from "axios";
import axiosInistance from "../GlobalContexts/Base_url";

import Switch from "../components/Switch";
import {
  deleteSelectedKpiDescriptionData,
  fetchKpiDescriptionData,
} from "../reduxToolKit/slices/kpiDescriptionSlice";
import { fetchKpiData } from "../reduxToolKit/slices/kpiSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function KpiDescription() {
  const { t } = useTranslation();

  const authInfo = useAuth();

  const dispatch = useDispatch();

  const token = localStorage.getItem("access");

  const { kpiDescriptionData } = useSelector((state) => state.kpiDescription);
  const [measureData, setMeasureData] = useState({});

  useEffect(() => {
    const fetchMeasureData = async () => {
      try {
        const response = await axiosInistance.get("/reportApp/measure/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMeasureData(response.data);
      } catch (error) { }
    };

    fetchMeasureData();
  }, []);

  useEffect(() => {
    dispatch(fetchKpiDescriptionData());
  }, []);

  //add

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  // view
  const [showModalView, setShowModalView] = useState(false);
  // const [kpiname, setKpiname] = useState(false);

  const [kpidesc, setKpidesc] = useState("");

  // const [showModalView, setShowModalView] = useState(false);

  const handleCloseModalView = () => {
    // setKpiname(KPI.name);
    setShowModalView(false);
  };
  const handleOpenModalView = (items) => {
    setKpidesc(items.description);
    setShowModalView(true);
  };
  const handleModalClickView = (e) => {
    e.stopPropagation();
  };

  //add kpi

  //fetchdata

  //addData
  const [kpi_id, setRole] = useState("");

  const [description, setDescription] = useState([
    {
      description: "",
      file: [],
    },
  ]);
  const [errorEmptyMessage, setErrorEmptyMessage] = useState("");

  const handleDescriptionChange = (index, e) => {
    const newDescription = [...description];
    newDescription[index].description = e.target.value;

    setDescription(newDescription);
  };

  const handlePhotoChange = (index, e) => {
    const newDescription = [...description];
    newDescription[index].file = Array.from(e.target.files);
    setDescription(newDescription);
  };

  //add another description
  const addAnotherDescription = () => {
    setDescription([...description, { description: "", file: [] }]);
  };

  //remove opened description
  const handleRemoveDescription = (index) => {
    setDescription(description.filter((_, i) => i !== index));
  };

  const handleAddDescription = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("kpi_id", kpi_id);

    // description.forEach((desc) => {
    //   formData.append("description", desc.description);
    //   if (desc.file) {
    //     formData.append("description_photo", desc.file);
    //   }
    // });

    formData.append("kpi_id", kpi_id);

    description.forEach((desc, index) => {
      formData.append(`description[${index}]description`, desc.description);
      desc.file.forEach((file, fileIndex) => {
        formData.append(
          `description[${index}]description_photo[${fileIndex}]photos`,
          file
        );
      });
    });

    // description.forEach((desc, index) => {
    //   for (const [key, value] of Object.entries(desc)) {
    //     if (key === "description_photos") {
    //       value.forEach((file, fileIndex) => {
    //         // Construct the key as per your requirement
    //         formData.append(
    //           `description[${index}]description_photo[${fileIndex}]photos`,
    //           file
    //         );
    //       });
    //     } else {
    //       formData.append(`description[${index}][${key}]`, value);
    //     }
    //   }
    // });

    try {
      const response = await axiosInistance.post(
        "/reportApp/kpidescription/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(fetchKpiDescriptionData());
      setOpen(false);
      setRole("");
      setDescription("");

      toast.success(`KPI Description Added successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) { }
  };

  // Edit
  // const [openEdit, setOpenEdit] = useState();
  // const [editkpi_id, setEditKpi_id] = useState("");
  // const [editDescription, setEditDescription] = useState("");
  // const [editFile, setEditFile] = useState("");

  // const [selectedEditId, setSelectedEditId] = useState();

  const [openEdit, setOpenEdit] = useState(false); // For opening the edit modal
  const [editkpi_id, setEditKpi_id] = useState(""); // KPI ID
  const [editDescription, setEditDescription] = useState([]); // Array of descriptions
  const [selectedEditId, setSelectedEditId] = useState(null); // ID of the selected KPI for editing

  // const handleOpenEdit = (items) => {
  //   setOpenEdit(!openEdit);

  //   setEditKpi_id(items.kpi_id);
  //   setEditDescription(items.description);
  //   setEditFile();
  //   setSelectedEditId(items.id);
  // };
const [editName,setEditName] = useState("");
  const handleOpenEdit = (items) => {
    setOpenEdit(!openEdit);
    setEditName(items.kpi_name);
    // Populate the form fields with current data
    setEditKpi_id(items.kpi_id);
    setEditDescription(items.description.map((desc) => ({
      ...desc,
      file: desc.description_photo || [], // Handle the photos for each description
    })));
    setSelectedEditId(items.id);
    console.log(items)
  };


  const handleEditDescription = async (e) => {


    e.preventDefault();

    const formData = new FormData();
    formData.append("kpi_id", editkpi_id);

    // Append each description with associated text and photos
    editDescription.forEach((desc, index) => {
      // Append the description text
      if (desc.description) {
        formData.append(`description[${index}]description`, desc.description);
      }

      // Append the description ID if it exists
      if (desc.id) {
        formData.append(`description[${index}]id`, desc.id);
      }

      desc.file.forEach((file, fileIndex) => {
        formData.append(
          `description[${index}]description_photo[${fileIndex}]photos`,
          file.photos
        );
        if (file.id) {
          formData.append(
            `description[${index}]description_photo[${fileIndex}]id`,
            file.id
          );

        }

      });




    });






    const token = localStorage.getItem("access");

    try {
      const response = await axiosInistance.put(
        `/reportApp/kpidescription/${selectedEditId}/`,

        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setShowModalAddDivision(false);
      dispatch(fetchKpiDescriptionData());
      setOpenEdit(false);

      toast.success(`KPI Description Updated successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) { }
  };

  //delete data

  const [selectedId, setSelectedId] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);

  const handleOpenDelete = (selectedId) => {
    setSelectedId(selectedId);

    setOpenDelete(!openDelete);
  };
  const handleDelete = async () => {
    dispatch(deleteSelectedKpiDescriptionData(selectedId));
    setOpenDelete(false);

    toast.success(`KPI Description Deleted successfully`, {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  //fetch kpi data
  const { kpiData } = useSelector((state) => state.kpi);
  console.log("This is teh kpi data:",kpiData);

  useEffect(() => {
    dispatch(fetchKpiData());
   
  }, []);
  //pagination
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page
  const [totalPages, setTotalPages] = useState(0); //

  useEffect(() => {
    const calculateTotalPages = () => {
      setTotalPages(
        Math.ceil(
          kpiDescriptionData ? kpiDescriptionData.length / itemsPerPage : []
        )
      );
    };
    calculateTotalPages();
  }, [kpiDescriptionData, itemsPerPage]);

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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageData = kpiDescriptionData
    ? kpiDescriptionData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  return (
    <>
      <ToastContainer />
      {authInfo ? (
        <div className="grid gap-3 items-center">
          <p className="text-base font-bold font-sans">
            {t("MAIN.SIDEBAR.REPORT.KPI_DESCRIPTION.TITLE")}
          </p>
          <Card className="rounded-md overflow-auto scrollbar">
            <CardHeader floated={false} shadow={false} className="rounded-none">
              <div className="flex items-center justify-between mt-5">
                <div>
                  <div className="w-full md:w-72">
                    <Input
                      label={t("MAIN.TABLE.SEARCH")}
                      icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    />
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  {authInfo.user.userPermissions.includes(
                    "createKpiDescription"
                  ) ? (
                    <Button
                      variant="text"
                      size="md"
                      className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                      onClick={handleOpen}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      {t("MAIN.SIDEBAR.REPORT.KPI_DESCRIPTION.ADDBUTTON")}
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
                      {t("MAIN.INPUTFIELD.KPI")}
                    </th>
                    {/* <th
                      scope="col"
                      className="p-2 text-left text-md font-bold text-black  tracking-wider"
                    >
                      {t("MAIN.TABLE.DESCRIPTION")}
                    </th> */}

                    <th
                      scope="col"
                      className="p-2 text-center text-md font-bold text-black  tracking-wider"
                    >
                      {t("MAIN.TABLE.ACTION")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData &&
                    currentPageData.map((items, index) => (
                      <React.Fragment key={items.id}>
                        <tr className="bg-white border-b hover:bg-blue-gray-50">
                          <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                            {indexOfFirstItem + 1 + index}
                          </td>
                          <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                            {items.kpi_name}
                          </td>

                          <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                            <div className="flex items-center justify-center gap-2">
                              {authInfo.user.userPermissions.includes(
                                "updateKpiDescription"
                              ) ? (
                                <FontAwesomeIcon
                                  color="orange"
                                  onClick={() => handleOpenEdit(items)}
                                  icon={faPenToSquare}
                                  className="cursor-pointer"
                                />
                              ) : (
                                <div></div>
                              )}
                              {authInfo.user.userPermissions.includes(
                                "deleteRole"
                              ) ? (
                                <FontAwesomeIcon
                                  color="red"
                                  onClick={() => handleOpenDelete(items.id)}
                                  icon={faTrash}
                                  className="cursor-pointer"
                                />
                              ) : (
                                <div></div>
                              )}
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between  p-4">
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
          <div className="text-xl ml-9">Add Kpi Description</div>
          <div className="cursor-pointer mr-5" onClick={handleOpen}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-[30rem] items-center overflow-auto scrollbar">
          <form
            onSubmit={handleAddDescription}
            className="grid gap-5 items-center w-full mx-auto"
          >
            <div className="w-11/12 justify-self-center">
              {kpiData ? (
                <Select
                  label="KPI"
                  value={kpi_id}
                  onChange={(e) => {
                    setRole(e), setErrorEmptyMessage("");
                  }}
                >
                {kpiData &&
                  kpiData.map((items) => {
                    const measureName = Array.isArray(measureData)
                      ? measureData.find((m) => m.id === items.measure)?.name
                      : 'Unknown';

                    return (
                      <Option key={items.id} value={items.id} className="text-black h-fit">
                        {items.kpi_name} ({measureName})
                      </Option>
                    );
                  })}
                </Select>
              ) : (
                <div>please add kpi first</div>
              )}
            </div>
            {description &&
              description.map((desc, index) => (
                <React.Fragment key={index}>
                  <div className="w-11/12 justify-self-center">
                    <div className="flex justify-between m-2">
                      <label className="text-black font-bold">
                        Description-{index + 1}
                      </label>

                      <FontAwesomeIcon
                        className="cursor-pointer text-black font-bold"
                        size="lg"
                        icon={faXmark}
                        onClick={() => handleRemoveDescription(index)}
                      />
                    </div>

                    <Textarea
                      color="blue"
                      label="Description"
                      value={desc.description}
                      onChange={(e) => handleDescriptionChange(index, e)}
                    ></Textarea>
                  </div>
                  <div class="space-y-8 font-[sans-serif] w-11/12 justify-self-center">
                    <input
                      type="file"
                      multiple
                      className="w-full text-black text-base bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:mr-4 file:bg-light-blue-700 file:hover:bg-light-blue-700 file:text-white rounded-md"
                      value={FormData.file}
                      onChange={(e) => handlePhotoChange(index, e)}
                    // onChange={(e) => {
                    //   setFile(Array.from(e.target.files));
                    // }}
                    />
                    <p className="text-sm text-red-900">{errorEmptyMessage}</p>
                  </div>
                </React.Fragment>
              ))}
            <div>
              <Button
                variant="text"
                className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                onClick={addAnotherDescription}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Another Description
              </Button>
            </div>

            <div className="space-x-2 flex justify-self-end mr-8">
              <Button
                variant="text"
                color="red"
                onClick={handleOpen}
                className="normal-case"
              >
                <span>Cancel</span>
              </Button>
              <Button
                variant="text"
                size="sm"
                className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                onClick={handleAddDescription}
              >
                Add
              </Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>

      {/* delete */}
      <Dialog open={openDelete} handler={handleOpenDelete}>
        <DialogHeader className="flex justify-center items-center">
          Are you sure you want to delete?
        </DialogHeader>

        <DialogFooter className="flex gap-3 justify-center items-center">
          <Button
            variant="text"
            size="md"
            className="hover:bg-light-blue-700  text-white bg-light-blue-700"
            onClick={handleOpenDelete}
          >
            No
          </Button>
          <Button variant="text" size="md" color="red" onClick={handleDelete}>
            Yes
          </Button>
        </DialogFooter>
      </Dialog>
      {/* edit */}
      <Dialog open={openEdit} handler={handleOpenEdit} size="lg">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">Update Kpi Description</div>
          <div className="cursor-pointer mr-5" onClick={handleOpenEdit}>
            X
          </div>
        </DialogHeader>

        <DialogBody className="h-[25rem] items-center overflow-y-scroll">
          <form
            onSubmit={handleEditDescription} // Ensure form submission is handled correctly
            className="grid gap-5 items-center w-full mx-auto"
          >
            {/* KPI Selector */}
            <div className="w-11/12 justify-self-center">
              <select
                label="KPI"
                className="w-full p-2"
                value={editkpi_id} // Bound to the state
                onChange={(e) => setEditKpi_id(e)} // Update the state when changed
              >
                {kpiData &&
                  kpiData.map((items) => (
                    <option
                      key={items.id}
                      value={items.id} // Option value set to KPI id
                      className="focus:text-light-blue-700"
                    >
                      {items.kpi_name} {/* Display KPI name */}
                    </option>
                  ))}
              </select>
            </div>

            {/* Loop through each description for dynamic input */}
            {editDescription.map((desc, index) => (
              <div key={index} className="w-11/12 justify-self-center">
                {/* Description Textarea */}
                <label
                  htmlFor={`description-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description {index + 1}
                </label>
                <textarea
                  id={`description-${index}`}
                  rows="4"
                  value={desc.description} // Bound to the specific description's state
                  onChange={(e) =>
                    setEditDescription((prevDescriptions) =>
                      prevDescriptions.map((d, i) =>
                        i === index ? { ...d, description: e.target.value } : d
                      )
                    )
                  } // Update specific description in the state
                  className="block p-2.5 w-full text-sm resize-none text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your Description here..."
                ></textarea>


                {/* File Input */}
                <div className="space-y-8 font-[sans-serif] w-11/12 justify-self-center">
                  {/* Display Existing Photos if Available */}
                  {desc.description_photo && desc.description_photo.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-4">
                      {desc.description_photo.map((photo, fileIndex) => (
                        <div key={fileIndex} className="flex flex-col items-center">
                          <img
                            src={photo.photos} // Assuming `photos` contains the URL or path to the image
                            alt={`Photo ${fileIndex + 1}`}
                            className="h-24 w-24 object-cover rounded"
                          />
                          <span className="text-sm text-gray-600 mt-2">{`Photo ${fileIndex + 1}`}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File Input */}
                  <input
                    type="file"
                    className="w-full text-black text-base bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:mr-4 file:bg-light-blue-700 file:hover:bg-light-blue-700 file:text-white rounded-md"
                    multiple // Allow multiple file uploads
                    onChange={(e) =>
                      setEditDescription((prevDescriptions) =>
                        prevDescriptions.map((d, i) =>
                          i === index ? { ...d, file: Array.from(e.target.files) } : d
                        )
                      )
                    } // Update files in the specific description's state
                  />
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="space-x-2 flex justify-self-end mr-5">
              <Button
                variant="text"
                color="red"
                onClick={handleOpenEdit} // Close the edit dialog
                className="normal-case"
              >
                <span>Cancel</span>
              </Button>
              <Button
                variant="text"
                size="sm"
                className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                type="submit" // Set button type to submit to trigger form submission
              >
                Update
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
            className=" w-3/4 h-5/6 bg-white rounded-md "
          >
            <button
              onClick={handleCloseModalView}
              className="text-black text-xl  border-0 bg-white place-self-end mr-5 mt-5 cursor-pointer"
            >
              X
            </button>
            <CardBody className="flex flex-col justify-center items-center">
              <div>
                {Array.isArray(KPI) &&
                  KPI.map((items) => (
                    <h1
                      key={items.id}
                      className="text-black font-sans font-bold text-xl"
                    >
                      {items.name}
                    </h1>
                  ))}
              </div>
              <div>
                <h1 className="font-bold text-black">Description</h1>
                <p className="ml-10 mr-10">{kpidesc}</p>
              </div>
            </CardBody>
            <CardFooter className="flex justify-center">
              <Carousel
                loop={true}
                autoplay={true}
                className="rounded-md h-1/2 w-2/3"
              >
                <img
                  src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="image 1"
                  className="h-full w-full object-cover object-center"
                />
                <img
                  src="https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                  alt="image 2"
                  className="h-full w-full object-cover object-center"
                />
                <img
                  src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80"
                  alt="image 3"
                  className="h-full w-full object-cover object-center"
                />
              </Carousel>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
export default KpiDescription;
