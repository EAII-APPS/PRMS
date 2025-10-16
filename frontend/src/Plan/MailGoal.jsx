import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faPenToSquare,
  faTrash,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useSelector, useDispatch } from "react-redux";
import axiosInistance from "../GlobalContexts/Base_url";
import {
  deleteSelectedMainGoalData,
  editSelectedMainGoal,
  assignMainGoal,
  fetchMainGoalData,
} from "../reduxToolKit/slices/mainGoalSlice";
import { faHandHoldingHand } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardHeader,
  Input,
  Chip,
  Tooltip,
  Button,
  CardBody,
  CardFooter,
  Typography,
  IconButton,
  Select,
  Checkbox,
  Option,
  MenuItem
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { fetchStrategicGoalData } from "../reduxToolKit/slices/strategicGoalSlice";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function MailGoal() {
  const { t } = useTranslation();

  const token = localStorage.getItem("access");

  const weightRegex = /^(100|[1-9]?[0-9])$/;

  const authInfo = useAuth();

  const dispatch = useDispatch();

  //fetch sector data

  const { sectorData } = useSelector((state) => state.sector);

  useEffect(() => {
    dispatch(fetchSectorgData());
  }, []);

  //fetch main goal data

  const { mainGoalData } = useSelector((state) => state.mainGoal);

  useEffect(() => {
    dispatch(fetchMainGoalData());
  }, []);

  //fetch startegic goal date

  const { strategicGoalData } = useSelector((state) => state.strategicGoal);

  useEffect(() => {
    dispatch(fetchStrategicGoalData());
  }, []);

  // Edit
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
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

  //add strategic goal

  const [name, setName] = useState("");

  const [sectorId, setSectorId] = useState([]);

  const [strategic_goal_id, setStrategic] = useState("");

  const [weight, setWeight] = useState("");

  const [expectedoutcome, setExpectedOutcome] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [errorMessageWeight, setErrorMessageWeight] = useState("");

  const [errorEmptyMessage, setErrorEmptyMessage] = useState("");


  const [open, setOpen] = useState(false);

  const handleOpen = (id) => {

    setSelectedMainGoalId(id);
    setOpen(!open);

    setName("");

    setStrategic("");

    setWeight("");

    setSectorId([]);

    setExpectedOutcome("");

    setErrorMessage("");

    setErrorEmptyMessage("");
  };
  const handleSelectChange = (event) => {
    const value = event.target.value; // Get the selected values
    setSectorId(value); // Update the state
    setErrorEmptyMessage("");
    setErrorMessage("");

  };
  const handleEditSelectChange = (event) => {
    const value = event.target.value; // Get the selected values
    setSectorEditId(value); // Update the state
    setErrorEmptyMessage("");
    setErrorMessage("");

  };

  const handleCheckboxChange = (id) => {
    setSectorId((prev) => {
      if (prev.includes(id)) {
        // If already selected, remove it
        return prev.filter((item) => item !== id);
      } else {
        // If not selected, add it
        return [...prev, id];
      }
    });
  };
  const handleEditCheckboxChange = (id) => {
    setSectorEditId((prev) => {
      if (prev.includes(id)) {
        // If already selected, remove it
        return prev.filter((item) => item !== id);
      } else {
        // If not selected, add it
        return [...prev, id];
      }
    });
  };
  const handleAddMainGoal = async (e) => {
    e.preventDefault();

    // if (!sectorId) {
    //   setErrorEmptyMessage("Please select sector");
    //   setErrorMessage("");
    //   return;
    // }

    if (!strategic_goal_id) {
      setErrorEmptyMessage("Please select Strategic Goal");
      setErrorMessage("");

      return;
    }
    if (!name) {
      setErrorEmptyMessage("Please enter Main Goal");
      setErrorMessage("");

      return;
    }
    if (!weight) {
      setErrorEmptyMessage("Please enter weight");
      setErrorMessage("");

      return;
    }

    if (!weightRegex.test(weight)) {
      setErrorEmptyMessage(
        "Invalid weight, weight can't exceed 100 and can't be negative"
      );
      setErrorMessage("");

      return;
    }

    try {
      const res = await axiosInistance.post(
        "/planApp/mainGoals/",
        { name, strategic_goal_id, weight, expected_outcome: expectedoutcome, sector_id: sectorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchMainGoalData());

      setName("");

      setStrategic("");

      setWeight("");

      setExpectedOutcome("");

      setSectorId([]);

      setOpen(false);

      setErrorMessage("");

      toast.success(`Main Goal Added successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      setErrorMessage(error.response.status);

      setErrorMessageWeight(error.response.data.message);
    }
  };
  const [openAssign, setOpenAssign] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const handleCheckBoxThree = (itemId) => {
    setAssigned((prevAssigned) => {
      if (prevAssigned.includes(itemId)) {
        return prevAssigned.filter((item) => item !== itemId);
      } else {
        return [...prevAssigned, itemId];
      }
    });
  };
  const [selectedMainGoalId, setSelectedMainGoalId] = useState(null);
  const handleOpenAssign = (item) => {
    setOpenAssign(!openAssign);
    setSelectedMainGoalId(item.id);
    setAssigned(Array.isArray(item.sector_id) ? item.sector_id : []);

  };
  const handleAssignMainGoal = async (e) => {
    e.preventDefault();
  
    try {
      const resultAction = await dispatch(
        assignMainGoal({ selectedMainGoalId, assigned })
      );
  
      if (assignMainGoal.fulfilled.match(resultAction)) {
        await dispatch(fetchMainGoalData());
        toast.success(`Main Goal Assigned successfully`, {
          autoClose: 2000,
          hideProgressBar: true,
        });
        setOpenAssign(false); // Close only if successful
      }
  
      if (assignMainGoal.rejected.match(resultAction)) {
        setErrorMessage(resultAction.payload); // Show error message from API
      }
    } catch (error) {
      setErrorMessage("Unexpected error occurred.");
    }
  };
  
  //edit
  const [openEdit, setOpenEdit] = useState(null);

  const [sectorEditId, setSectorEditId] = useState([]);

  const [editName, setEditName] = useState("");

  const [editStrategicGoalId, setEditStrategicGoalId] = useState();

  const [editWeight, setEditWeight] = useState("");

  const [editexpectedoutcome, setEditExpectedOutcome] = useState("");

  const [editId, setEditId] = useState("");

  const handleOpenEdit = (items) => {

    setOpenEdit(!openEdit);

    setSectorEditId(items.sector_id);

    setEditName(items.name);

    setEditStrategicGoalId(items.strategic_goal_id);

    setEditWeight(items.weight);

    setEditExpectedOutcome(items.expected_outcome);

    setEditId(items.id);

    setErrorMessage("");

    setErrorEmptyMessage("");
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!editStrategicGoalId) {
      setErrorEmptyMessage("Please select Strategic Goal");
      setErrorMessage("");

      return;
    }
    if (!editName) {
      setErrorEmptyMessage("Please enter Main Goal");
      setErrorMessage("");

      return;
    }
    if (!editWeight) {
      setErrorEmptyMessage("Please enter weight");
      setErrorMessage("");

      return;
    }

    if (!weightRegex.test(editWeight)) {
      setErrorEmptyMessage(
        "Invalid weight, weight can't exceed 100 and can't be negative"
      );
      setErrorMessage("");

      return;
    }

    try {
      await axiosInistance.put(
        `/planApp/maingoal/${editId}/`,
        {
          sector_id: sectorEditId,
          name: editName,
          strategic_goal_id: editStrategicGoalId,
          weight: editWeight,
          expected_outcome: editexpectedoutcome,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchMainGoalData());

      setEditName("");

      setEditStrategicGoalId("");

      setEditWeight("");

      setOpenEdit(false);

      setErrorMessage("");

      toast.success(`Main Goal Updated successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      setErrorMessage(error.response.status);

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
    dispatch(deleteSelectedMainGoalData(selectedId));

    setOpenDelete(false);

    toast.success(`Main Goal Deleted successfully`, {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  const [transformedData, setTransformedData] = useState([]);

  useEffect(() => {
    // Transform the data

    if (Array.isArray(mainGoalData)) {
      const transformData = (dataArray) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          return [];
        }
      
        const groupedData = dataArray.reduce((acc, curr) => {
          const {
            strategic_goal_id,
            strategic_name,
            id,
            name,
            weight,
            expected_outcome,
            sector_id,
          } = curr;
      
          if (!acc[strategic_goal_id]) {
            acc[strategic_goal_id] = {
              strategic_goal_id,
              strategic_name,
              maingoal: [],
            };
          }
      
          acc[strategic_goal_id].maingoal.push({
            strategic_goal_id,
            id,
            name,
            weight,
            expected_outcome,
            sector_id,
          });
      
          return acc;
        }, {});
      
        return Object.values(groupedData);
      };
      

      const transformed = transformData(mainGoalData);

      setTransformedData(transformed);
    }
  }, [mainGoalData]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const calculateTotalPages = () => {
      setTotalPages(
        Math.ceil(transformedData ? transformedData.length / itemsPerPage : [])
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

  const currentPageData = transformedData
    ? transformedData.slice(indexOfFirstItem, indexOfLastItem)
    : [];
    const filteredData = currentPageData
    ?.map(item => {
      const matchingMainGoals = item.maingoal?.filter(goal =>
        goal.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      const strategicNameMatches = item.strategic_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
  
      if (strategicNameMatches || (matchingMainGoals && matchingMainGoals.length > 0)) {
        return {
          ...item,
          maingoal: matchingMainGoals, // keep only matching maingoals
        };
      }
  
      return null;
    })
    .filter(Boolean); // remove nulls
    const [openMainGoal, setOPenMainGoal] = useState(-1);
  const handleOPenMainGoal = (index) => {
    setTimeout(() => setOPenMainGoal(openMainGoal === index ? -1 : index), 50);
  };

  return (
    <>
      {authInfo ? (
        <div>
          <>
            <ToastContainer />
            <div className="grid gap-3 items-center">
              <p className="text-base font-bold font-sans">
                {t("MAIN.SIDEBAR.PLAN.MAIN_GOAL.TITLE")}
              </p>
              <Card className="rounded-md overflow-auto scrollbar">
                <CardHeader
                  floated={false}
                  shadow={false}
                  className="rounded-none"
                >
                  <div className="flex items-center justify-between mt-5 gap-10">
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
                      {authInfo.user.userPermissions.includes(
                        "createMainActivity"
                      ) ? (
                        <Button
                          variant="text"
                          size="sm"
                          onClick={handleOpen}
                          className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          {t("MAIN.SIDEBAR.PLAN.MAIN_GOAL.ADDBUTTON")}
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
                          {t("MAIN.SIDEBAR.PLAN.STRATEGIC_GOAL.STRATEGIC_GOAL")}
                        </th>
                        <th
                          scope="col"
                          className="p-2 text-center text-md font-bold text-black  tracking-wider"
                        >
                          {t("MAIN.SIDEBAR.PLAN.MAIN_GOAL.MAIN_GOAL")}
                        </th>
                        <th
                          scope="col"
                          className="p-2 text-center text-md font-bold text-black  tracking-wider"
                        ></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {filteredData &&
                        filteredData.map((items, index) => (
                          <React.Fragment key={items.strategic_goal_id}>
                            <tr className="bg-white border-b hover:bg-green-200 cursor-default">
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                {indexOfFirstItem + index + 1}
                              </td>
                              <td
                                className="p-2  text-left text-sm font-normal text-blue-gray-900"
                                onClick={() => handleOPenMainGoal(index)}
                              >
                                <div className="flex gap-2 items-center">
                                  {items.strategic_name}
                                  <Tooltip
                                    content={`Under this Strategic Goal There ${items.maingoal.length != 0 &&
                                      items.maingoal.length != 1
                                      ? "are"
                                      : "is"
                                      } ${items.maingoal.length} Main Goal${items.maingoal.length != 0 &&
                                        items.maingoal.length != 1
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
                                      value={items.maingoal.length}
                                      className="rounded-full  text-center normal-case  border border-green-700"
                                    />
                                  </Tooltip>
                                </div>
                              </td>
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                {openMainGoal === index && (
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
                                          {t(
                                            "MAIN.SIDEBAR.PLAN.MAIN_GOAL.MAIN_GOAL"
                                          )}
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
                                      {items.maingoal &&
                                        items.maingoal.map((item, index) => (
                                          <tr
                                            key={item.id}
                                            className="bg-white border-b hover:bg-gray-400 cursor-default "
                                          >
                                            <td className=" p-2  text-left text-sm font-normal text-blue-gray-900">
                                              {index + 1}
                                            </td>
                                            <td className=" p-2  text-left text-sm font-normal text-blue-gray-900">
                                              {item.name}
                                            </td>

                                            <td className="p-2  text-left text-sm font-normal text-blue-gray-900 ">
                                              {item.weight}
                                            </td>

                                            <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                              <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                  type="checkbox"
                                                  defaultChecked
                                                  onChange={() =>
                                                    handleStatusUpdate(
                                                      item.id,
                                                      item.status
                                                    )
                                                  }
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
                                              </label>
                                            </td>
                                            <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                              <div className="flex items-center justify-center gap-2">
                                                {authInfo.user.userPermissions.includes(
                                                  "createAssign"
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
                                                          handleOpenAssign(item)
                                                        }
                                                        icon={faHandHoldingHand}
                                                        color="green"
                                                        className="cursor-pointer"
                                                      />
                                                    </Tooltip>
                                                  )}
                                                {authInfo.user.userPermissions.includes(
                                                  "updateMainActivity"
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
                                                  "deleteMainActivity"
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
                                onClick={() => handleOPenMainGoal(index)}
                                className="p-2  text-center text-sm font-normal text-blue-gray-900 cursor-pointer"
                              >
                                {
                                  <ChevronDownIcon
                                    strokeWidth={2.5}
                                    className={`mx-auto h-4 w-4 transition-transform ${openMainGoal === index ? "rotate-180" : ""
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
          </>
        </div>
      ) : (
        <div></div>
      )}

      {/* add */}
      <Dialog open={open} handler={handleOpen} size="sm">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">
            {t("MAIN.INPUTFIELD.ADD_MAIN_GOAL")}
          </div>
          <div className="cursor-pointer mr-5" onClick={handleOpen}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-[23rem] items-center overflow-auto">
          <form
            onSubmit={handleAddMainGoal}
            className="grid gap-5  items-center w-11/12 mx-auto"
          >
            {/* {authInfo.user.userPermissions.includes("createAssign") && (
        <div className="w-full justify-self-center">
          <Select
            label={t("MAIN.INPUTFIELD.SECTOR")}
            color="blue"
            multiple
            value={sectorId.toString()} // Make sure this is an array
            onChange={handleSelectChange} // Handle select change
            renderValue={(selected) => {
              return selected.join(", "); // Display the selected values
            }}
          >
            {sectorData &&
              sectorData.map((items) => (
                <MenuItem key={items.id} value={items}>
                  <Checkbox
                    checked={sectorId.includes(items.id)} // Check if the sector ID is in the selected array
                    onChange={() => handleCheckboxChange(items.id)} // Handle checkbox change
                  />
                  {items.name}
                </MenuItem>
              ))}
          </Select>
        </div>
      )} */}

            <div className="w-full justify-self-center">
              <Select
                label={t("MAIN.INPUTFIELD.STRATEGIC_GOAL")}
                color="blue"
                value={strategic_goal_id}
                onChange={(e) => {
                  setStrategic(e),
                    setErrorEmptyMessage(""),
                    setErrorMessage("");
                }}
              >
                {strategicGoalData &&
                  strategicGoalData.map((items) => (
                    <Option
                      key={items.id}
                      value={items.id}
                      className="focus:text-light-blue-700 flex"
                    >
                      {items.name}

                      {items.sector_id.includes &&
                        items.sector_id.includes(authInfo.user.sector_id) && (
                          <FontAwesomeIcon color="green" icon={faCheck} />
                        )}
                    </Option>
                  ))}
              </Select>
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="text"
                required
                id="name"
                label={t("MAIN.INPUTFIELD.MAIN_GOAL")}
                color="blue"
                size="lg"
                value={name}
                onChange={(e) => (
                  setName(e.target.value),
                  setErrorEmptyMessage(""),
                  setErrorMessage("")
                )}
              />
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="role"
                label={t("MAIN.INPUTFIELD.WEIGHT")}
                required
                color="blue"
                size="lg"
                value={weight}
                onChange={(e) => (
                  setWeight(e.target.value),
                  setErrorMessageWeight(""),
                  setErrorEmptyMessage("")
                )}
              />
              {errorMessage && errorMessage === 403 && (
                <h1 className="text-red-500 text-sm ml-3">
                  {errorMessageWeight}
                </h1>
              )}
              <p className="text-red-500 text-sm"> {errorEmptyMessage}</p>
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="expected_outcome"
                required
                color="blue"
                label="Expected Outcome"
                size="lg"
                value={expectedoutcome}
                onChange={(e) => {
                  setExpectedOutcome(e.target.value),
                    setErrorEmptyMessage(""),
                    setErrorMessage("");
                }}
              />
            </div>
            <div className="space-x-2 flex justify-self-end">
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
                onClick={handleAddMainGoal}
              >
                {t("MAIN.INPUTFIELD.ADD_MAIN_GOAL")}
              </Button>
            </div>
          </form>
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
      {/* assign */}
      <Dialog open={openAssign} handler={handleOpenAssign} size="sm">
  <DialogHeader className="flex justify-between items-center mx-5">
    {t("MAIN.INPUTFIELD.ASSIGN_MAIN_GOAL")}
    <FontAwesomeIcon
      onClick={handleOpenAssign}
      className="cursor-pointer"
      icon={faXmark}
    />
  </DialogHeader>
  <DialogBody className="grid gap-3 ml-5 items-center">
    {sectorData &&
      sectorData.map((items) => (
        <ul key={items.id} className="flex flex-col gap-3 justify-center">
          <li className="flex items-center text-center h-5">
            <Checkbox
              onChange={() => handleCheckBoxThree(items.id)}
              checked={Array.isArray(assigned) && assigned.includes(items.id)}
              color="blue"
            />
            <Typography className="font-sans font-bold text-sm">
              {items.name}
            </Typography>
          </li>
        </ul>
      ))}
    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
  </DialogBody>
  <DialogFooter>
    <Button variant="text" color="red" onClick={handleOpenAssign}>
      {t("MAIN.INPUTFIELD.CANCEL")}
    </Button>
    <Button variant="gradient" color="blue" onClick={handleAssignMainGoal}>
      {t("MAIN.INPUTFIELD.ASSIGN")}
    </Button>
  </DialogFooter>
</Dialog>

      {/* edit */}
      <Dialog open={openEdit} handler={handleOpenEdit} size="sm">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">
            {t("MAIN.INPUTFIELD.UPDATE_MAIN_GOAL")}
          </div>
          <div className="cursor-pointer mr-5" onClick={handleOpenEdit}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-[23rem] items-center">
          <form
            onSubmit={handleEdit}
            className="grid gap-5  items-center w-11/12 mx-auto"
          >

            {/* {authInfo.user.userPermissions.includes("createAssign") && (
              <div className="w-full justify-self-center">
                <Select
                  label={t("MAIN.INPUTFIELD.SECTOR")}
                  color="blue"
                  multiple
                  value={sectorEditId} // Make sure this is an array
                  onChange={handleEditSelectChange} // Handle select change
                  renderValue={(selected) => {
                    return selected.join(", "); // Display the selected values
                  }}
                >
                  {sectorData &&
                    sectorData.map((items) => (
                      <MenuItem key={items.id} value={items.id}>
                        <Checkbox
                          checked={sectorEditId && sectorEditId.includes(items.id)} // Safeguard for undefined
                          onChange={() => handleEditCheckboxChange(items.id)} // Handle checkbox change
                        />
                        {items.name}
                      </MenuItem>
                    ))}
                </Select>
              </div>
            )} */}
            <div className="w-full justify-self-center">
              <Select
                label={t("MAIN.INPUTFIELD.STRATEGIC_GOAL")}
                color="blue"
                value={editStrategicGoalId}
                onChange={(e) => {
                  setEditStrategicGoalId(e),
                    setErrorEmptyMessage(""),
                    setErrorMessage("");
                }}
              >
                {strategicGoalData &&
                  strategicGoalData.map((items) => (
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
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="name"
                required
                color="blue"
                label={t("MAIN.INPUTFIELD.MAIN_GOAL")}
                size="lg"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value),
                    setErrorEmptyMessage(""),
                    setErrorMessage("");
                }}
              />
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="weight"
                required
                color="blue"
                label={t("MAIN.INPUTFIELD.WEIGHT")}
                size="lg"
                value={editWeight}
                onChange={(e) => {
                  setEditWeight(e.target.value),
                    setErrorEmptyMessage(""),
                    setErrorMessage("");
                }}
              />
              {errorMessage && errorMessage === 403 && (
                <h1 className="text-red-500 text-sm ml-3">
                  {errorMessageWeight}
                </h1>
              )}
              <p className="text-red-500 text-sm"> {errorEmptyMessage}</p>
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="expected_outcome"
                required
                color="blue"
                label="Expected Outcome"
                size="lg"
                value={editexpectedoutcome}
                onChange={(e) => {
                  setEditExpectedOutcome(e.target.value),
                    setErrorEmptyMessage(""),
                    setErrorMessage("");
                }}
              />
            </div>
            <div className="space-x-2 flex justify-self-end">

              <Button
                variant="text"
                color="red"
                onClick={handleOpenEdit}
                className="normal-case"
              >
                <span>{t("MAIN.INPUTFIELD.CANCEL")}</span>
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
export default MailGoal;
