import React, { useState, useEffect, useRef } from "react";
import "./strategic.css";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faFileImport,
  faCalendarDays,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../GlobalContexts/Base_url";
import { useTranslation } from "react-i18next";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { faHandHoldingHand } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "@material-tailwind/react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Chip,
  Tooltip,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  assignStrategicGoal,
  deleteSelectedStrategicGoalData,
  editSelectedStrategicGoal,
  fetchStrategicGoalData,
} from "../reduxToolKit/slices/strategicGoalSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Strategictable() {
  const { t } = useTranslation();

  const token = localStorage.getItem("access");

  const weightRegex = /^(100|[1-9]?[0-9])$/;

  const authInfo = useAuth();

  const dispatch = useDispatch();

  //fetch strategicGoalData

  const { strategicGoalData, error, errorMessageSlice, isLoading } =
    useSelector((state) => state.strategicGoal);

  useEffect(() => {
    dispatch(fetchStrategicGoalData());
  }, []);


  //fetch sector data
  const { sectorData } = useSelector((state) => state.sector);

  useEffect(() => {
    dispatch(fetchSectorgData());
  }, []);

  // view
  const [showModalView, setShowModalView] = useState(false);

  const handleCloseModalView = () => {
    setShowModalView(false);
  };
  const [strategicgoal, setStrategicgoal] = useState("");

  const handleOpenModalView = (items) => {
    setStrategicgoal(items.name);
    setShowModalView(true);
  };
  const handleModalClickView = (e) => {
    e.stopPropagation();
  };

  //assign
  const [openAssign, setOpenAssign] = useState(false);
  const [assigned, setAssigned] = useState([]);

  const handleOpenAssign = (items) => {
    setOpenAssign(!openAssign);
    dispatch(fetchStrategicGoalData());
    setSelectedStrategicGoalId(items.id);

    setAssigned(items.sector_id);
  };

  const handleAssignStrategicGoal = async (e) => {
    e.preventDefault();

    dispatch(assignStrategicGoal({ selectedStrategicGoalId, assigned }));

    dispatch(fetchStrategicGoalData());

    toast.success(`Strategic Goal Assigned successfully`, {
      autoClose: 2000,
      hideProgressBar: true,
    });

    setOpenAssign(false);
  };

  //add

  const [open, setOpen] = useState(false);

  const handleOpen = (strategicGolaId) => {
    setSelectedStrategicGoalId(strategicGolaId);

    setOpen(!open);

    setName("");

    setYear("");

    setWeight("");

    setErrorMessageWeight("");

    setEmptyMessage("");
  };

  const [name, setName] = useState("");

  const [weight, setWeight] = useState("");

  const [emptyMessage, setEmptyMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [errorMessageWeight, setErrorMessageWeight] = useState("");

  //date
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear+1 - 2020 },
    (_, index) => 2013 + index
  );
  const [year, setYear] = useState(currentYear - 8);

  const handleAddStrategicGoal = async (e) => {
    e.preventDefault();

    if (!name) {
      setEmptyMessage("Please enter Strategic Goal");

      setErrorMessageWeight("");
      return;
    }
    // if (!year) {
    //   setEmptyMessage("Please enter Strategic Goal year");

    //   setErrorMessageWeight("");

    //   return;
    // }
    if (!weight) {
      setEmptyMessage("Please enter Strategic Goal weight");

      setErrorMessageWeight("");

      return;
    }

    if (!weightRegex.test(weight)) {
      setEmptyMessage(
        "Invalid Weight, Weight can't be exceed 100 and can't be negative!"
      );

      setErrorMessageWeight("");

      return;
    }
    setEmptyMessage("");

    try {
      const res = await axiosInstance.post(
        "/planApp/strategicGoals/",
        { name, weight },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchStrategicGoalData());

      setOpen(false);

      setName("");

      setYear("");

      setWeight("");

      toast.success(`Strategic Goal added successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });

      setErrorMessage("");
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
    dispatch(deleteSelectedStrategicGoalData(selectedId));

    setOpenDelete(false);

    toast.success(`Strategic Goal Deleted successfully`, {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  //editassign

  const [selectedItems, setSelectedItems] = useState([]);

  const [selectedStrategicGoalId, setSelectedStrategicGoalId] = useState(null);

  const handleCheckBoxThree = (itemId) => {
    setAssigned((prevAssigned) => {
      if (prevAssigned.includes(itemId)) {
        return prevAssigned.filter((item) => item !== itemId);
      } else {
        return [...prevAssigned, itemId];
      }
    });
  };

  //edit
  const [openEdit, setOpenEdit] = useState(false);

  const [nameEdit, setNameEdit] = useState("");

  const [yearEdit, setYearEdit] = useState("");

  const [weightEdit, setWeightEdit] = useState("");

  const [editId, setEditId] = useState("");

  const handleOpenEdit = (items) => {
    setOpenEdit(!openEdit);

    setNameEdit(items.name);

    setYearEdit(items.year);

    setWeightEdit(items.weight);

    setEditId(items.id);

    setErrorMessageWeight("");

    setEmptyMessage("");
  };

  const handleEditStrategicGoal = async (e) => {
    e.preventDefault();

    if (!nameEdit) {
      setEmptyMessage("Please enter Strategic Goal");

      setErrorMessageWeight("");
      return;
    }
    // if (!yearEdit) {
    //   setEmptyMessage("Please enter Strategic Goal year");

    //   setErrorMessageWeight("");

    //   return;
    // }
    if (!weightEdit) {
      setEmptyMessage("Please enter Strategic Goal weight");

      setErrorMessageWeight("");

      return;
    }

    if (!weightRegex.test(weightEdit)) {
      setEmptyMessage(
        "Invalid Weight, Weight can't be exceed 100 and can't be negative!"
      );

      setErrorMessageWeight("");

      return;
    }
    setEmptyMessage("");

    try {
      await axiosInstance.put(
        `/planApp/strategicGoals/${editId}/`,
        {
          name: nameEdit,
          weight: weightEdit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchStrategicGoalData());

      setOpenEdit(false);

      setNameEdit("");

      setYearEdit("");

      setWeightEdit("");

      toast.success(`Strategic Goal Updated successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });

      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response.status);

      setErrorMessageWeight(error.response.data.message);
    }
  };

  //pagination

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const calculateTotalPages = () => {
      setTotalPages(
        Math.ceil(
          strategicGoalData ? strategicGoalData.length / itemsPerPage : []
        )
      );
    };
    calculateTotalPages();
  }, [strategicGoalData, itemsPerPage]);

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

  const currentPageData = (strategicGoalData || []).slice(indexOfFirstItem, indexOfLastItem);
  const filteredData = currentPageData?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  


  //upload

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {authInfo ? (
        <>
          <div className="grid gap-3 items-center">
            <>
              <input type="file" ref={fileInputRef} className="hidden" />
              <ToastContainer />
              <p className="text-base font-bold font-sans">
                {t("MAIN.SIDEBAR.PLAN.STRATEGIC_GOAL.TITLE")}
              </p>
              <Card className="rounded-md overflow-auto scrollbar">
                <CardHeader
                  floated={false}
                  shadow={false}
                  className="rounded-none"
                >
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
                    <div className="flex shrink-0 gap-2">
                      {authInfo.user.userPermissions.includes(
                        "createStrategicGoal"
                      ) ? (
                        <div className="flex gap-5">
                          <Button
                            variant="text"
                            size="sm"
                            onClick={handleOpen}
                            className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                            {t("MAIN.SIDEBAR.PLAN.STRATEGIC_GOAL.ADDBUTTON")}
                          </Button>
                        </div>
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
                          className="p-2 text-left text-md font-bold text-black  tracking-wider"
                        >
                          {t("MAIN.TABLE.WEIGHT")}
                        </th>
                        {/* <th
                          scope="col"
                          className="p-2 text-left text-md font-bold text-black  tracking-wider"
                        >
                          {t("MAIN.TABLE.YEAR")}
                        </th> */}
                        <th
                          scope="col"
                          className="p-2 text-left text-md font-bold text-black  tracking-wider"
                        >
                          {t("MAIN.TABLE.STATUS")}
                        </th>

                        {authInfo.user.userPermissions.includes(
                          "deleteStrategicGoal"
                        ) &&
                        authInfo.user.userPermissions.includes(
                          "updateStrategicGoal"
                        ) &&
                        authInfo.user.userPermissions.includes(
                          "createAssign"
                        ) ? (
                          <th
                            scope="col"
                            className="p-2 text-center text-md font-bold text-black  tracking-wider"
                          >
                            {t("MAIN.TABLE.ACTION")}
                          </th>
                        ) : (
                          <></>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {filteredData &&
                        filteredData.map((items, index) => (
                          <React.Fragment key={items.id}>
                            <tr className="bg-white border-b hover:bg-green-200">
                             
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                {indexOfFirstItem + index + 1}
                              </td>
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900  cursor-pointer">
                                <div className="font-normal flex gap-2 items-center">
                                  {items.name}
                                  {items.sector_id.includes &&
                                    items.sector_id.includes(
                                      authInfo.user.sector_id
                                    ) && (
                                      <Tooltip
                                        content="You are assigned this Strategic Goal"
                                        animate={{
                                          mount: { scale: 1, y: 0 },
                                          unmount: { scale: 0, y: 25 },
                                        }}
                                      >
                                        <Chip
                                          variant="ghost"
                                          color="green"
                                          size="md"
                                          value="Assigned"
                                          className="rounded-full  text-center normal-case  border border-green-700"
                                        />
                                      </Tooltip>
                                    )}
                                </div>
                              </td>
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900 cursor-pointer">
                                {items.weight}
                              </td>
                              {/* <td className="p-2  text-left text-sm font-normal text-blue-gray-900 cursor-pointer">
                                {items.year}
                              </td> */}
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                <label className="inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    defaultChecked
                                    onChange={() =>
                                      handleStatusUpdate(items.id, items.status)
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
                              {authInfo.user.userPermissions.includes(
                                "deleteStrategicGoal"
                              ) &&
                              authInfo.user.userPermissions.includes(
                                "updateStrategicGoal"
                              ) &&
                              authInfo.user.userPermissions.includes(
                                "createAssign"
                              ) ? (
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
                                            handleOpenAssign(items)
                                          }
                                          icon={faHandHoldingHand}
                                          color="green"
                                          className="cursor-pointer"
                                        />
                                      </Tooltip>
                                    )}

                                    {authInfo.user.userPermissions.includes(
                                      "updateStrategicGoal"
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
                                      "deleteStrategicGoal"
                                    ) ? (
                                      <FontAwesomeIcon
                                        color="red"
                                        onClick={() =>
                                          handleOpenDelete(items.id, items.name)
                                        }
                                        icon={faTrash}
                                        className="cursor-pointer"
                                      />
                                    ) : (
                                      <div></div>
                                    )}
                                  </div>
                                </td>
                              ) : (
                                <></>
                              )}
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
            </>
          </div>
        </>
      ) : (
        <div></div>
      )}

      {/* Edit */}
      <Dialog open={openEdit} handler={handleOpenEdit} size="sm">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">
            {t("MAIN.INPUTFIELD.UPDATE_STRATEGIC_GOAL")}
          </div>
          <div className="cursor-pointer mr-5" onClick={handleOpenEdit}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-[20rem] items-center">
          <form
            onSubmit={handleEditStrategicGoal}
            className="grid gap-5 items-center w-11/12 mx-auto"
          >
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="name"
                label={t("MAIN.INPUTFIELD.STRATEGIC_GOAL")}
                size="lg"
                color="blue"
                value={nameEdit}
                onChange={(e) => {
                  setNameEdit(e.target.value),
                    setEmptyMessage(""),
                    setErrorMessage("");
                }}
              />
            </div>
            {/* <div className="w-full justify-self-center">
              <Select
                label={t("MAIN.TABLE.SELECT_YEAR")}
                value={yearEdit}
                color="blue"
                onChange={(e) => {
                  setYearEdit(e), setEmptyMessage(""), setErrorMessage("");
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
            </div> */}
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="role"
                label={t("MAIN.INPUTFIELD.WEIGHT")}
                color="blue"
                size="lg"
                value={weightEdit}
                onChange={(e) => {
                  setWeightEdit(e.target.value),
                    setEmptyMessage(""),
                    setErrorMessage("");
                }}
              />
              {errorMessage && errorMessage === 403 && (
                <h1 className="text-red-500 text-sm">{errorMessageWeight}</h1>
              )}
              <p className="text-red-500 text-sm">{emptyMessage}</p>
            </div>
            <div className="space-x-2 flex justify-self-end">
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
                onClick={handleEditStrategicGoal}
              >
                {t("MAIN.INPUTFIELD.UPDATE")}
              </Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>

      <>
        {/* assign */}
        <Dialog open={openAssign} handler={handleOpenAssign} size="sm">
          <DialogHeader className="flex justify-between items-center mx-5">
            {t("MAIN.INPUTFIELD.ASSIGN_STRATEGIC_GOAL")}
            <FontAwesomeIcon
              onClick={handleOpenAssign}
              className="cursor-pointer"
              icon={faXmark}
            />
          </DialogHeader>
          <DialogBody className="grid gap-3 ml-5 items-center">
            {sectorData &&
              sectorData.map((items) => (
                <ul
                  key={items.id}
                  className="flex flex-col gap-3 justify-center"
                >
                  <li className="flex items-center text-center h-5">
                    <span className="">
                      <Checkbox
                        onChange={() => handleCheckBoxThree(items.id)}
                        checked={assigned && assigned.includes(items.id)}
                        color="blue"
                      />
                    </span>
                    <Typography className="font-sans font-bold text-sm">
                      {items.name}
                    </Typography>
                  </li>
                </ul>
              ))}
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpenAssign}
              className="mr-1"
            >
              <span> {t("MAIN.INPUTFIELD.CANCEL")}</span>
            </Button>
            <Button
              variant="gradient"
              color="blue"
              onClick={handleAssignStrategicGoal}
            >
              <span> {t("MAIN.INPUTFIELD.ASSIGN")}</span>
            </Button>
          </DialogFooter>
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

        {/* add */}
        <Dialog open={open} handler={handleOpen} size="sm">
          <DialogHeader className="flex justify-between">
            <div className="text-xl ml-5">
              {t("MAIN.INPUTFIELD.ADD_STRATEGIC_GOAL")}
            </div>
            <div className="cursor-pointer mr-5" onClick={handleOpen}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </DialogHeader>

          <DialogBody className="h-[15rem] items-center">
            <form
              onSubmit={handleAddStrategicGoal}
              className="grid gap-5 items-center w-11/12 mx-auto"
            >
              <div className="w-full justify-self-center">
                <Input
                  type="text"
                  id="name"
                  label={t("MAIN.INPUTFIELD.STRATEGIC_GOAL")}
                  size="lg"
                  color="blue"
                  required
                  value={name}
                  onChange={(e) => (
                    setName(e.target.value),
                    setEmptyMessage(""),
                    setErrorMessage("")
                  )}
                />
              </div>
              {/* <div className="w-full justify-self-center">
                <Select
                  label={t("MAIN.TABLE.SELECT_YEAR")}
                  value={year}
                  color="blue"
                  onChange={(e) => {
                    setYear(e), setEmptyMessage(""), setErrorMessage("");
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
              </div> */}
              <div className="w-full justify-self-center">
                <Input
                  type="text"
                  id="role"
                  label={t("MAIN.INPUTFIELD.WEIGHT")}
                  size="lg"
                  color="blue"
                  required
                  value={weight}
                  onChange={(e) => (
                    setWeight(e.target.value),
                    setEmptyMessage(""),
                    setErrorMessage("")
                  )}
                />
                {errorMessage && errorMessage === 403 && (
                  <h1 className="text-red-500 text-sm">{errorMessageWeight}</h1>
                )}
                <p className="text-red-500 text-sm">{emptyMessage}</p>
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
                  type="submit"
                  className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                  onClick={handleAddStrategicGoal}
                >
                  {t("MAIN.INPUTFIELD.ADD_STRATEGIC_GOAL")}
                </Button>
              </div>
            </form>
          </DialogBody>
        </Dialog>
      </>
    </>
  );
}
export default Strategictable;
