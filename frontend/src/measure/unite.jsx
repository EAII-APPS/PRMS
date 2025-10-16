import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
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
  Typography,
  Button,
  CardBody,
  CardFooter,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import axiosInistance from "../GlobalContexts/Base_url";
import {
  deleteSelectedMeasureData,
  editSelectedMeasure,
  fetchMeasureData,
} from "../reduxToolKit/slices/measureSlice";

import {
  deleteSelectedUniteData,
  editSelectedUnite,
  fetchUniteData,
} from "../reduxToolKit/slices/uniteSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function convertStringToInt(str) {
  str = str.trim();

  if (str === "") {
    console.error("Input string is empty.");
    return null;
  }

  const num = parseInt(str, 10);

  if (isNaN(num)) {
    console.error("Invalid input: Unable to convert to integer.");
    return null;
  }

  return num;
}

const Unite = () => {
  const { t } = useTranslation();

  const authInfo = useAuth();

  const [showModalt, setShowModalt] = useState(false);

  const dispatch = useDispatch();

  //fetch measure data

  const { measureData } = useSelector((state) => state.measure);
  useEffect(() => {
    dispatch(fetchMeasureData());
  }, []);

  //fetch unite data
  const { uniteData } = useSelector((state) => state.unite);
  useEffect(() =>  {
    dispatch(fetchUniteData());
  },[]);



  //add

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  // Edit

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleOpenModal = (userId) => {
    setShowModal(true);

    setSelectedEditId(userId);
  };
  const handleModalClick = (e) => {
    e.stopPropagation();
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

  //add unite

  const [unite, setUnite] = useState("");
  const [hisMeasure, setHisMeasure] = useState("");
  const [symbol, setSymbol] = useState("");
  const [conversionFactor, setConversionFactor] = useState("");
  const [isBaseUnit, setIsBaseUnit] = useState(false);
  const handleAddUnite = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    try {
      const measureId = convertStringToInt(hisMeasure);

      // Check if measureId is valid
      if (measureId === null) {
        throw new Error("Invalid measure_id: Unable to convert to integer.");
      }

      const payload = {
        name: unite,
        measure_id: measureId,
        symbol: symbol,
        conversionFactor: conversionFactor,
        isBaseUnit: isBaseUnit,
      };

      const res = await axiosInistance.post("planApp/units/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Dispatch action and reset state
      dispatch(fetchUniteData());
      setOpen(false);
      setUnite("");
      setHisMeasure("");
      setSymbol("");
      setConversionFactor("");
      setIsBaseUnit(false);
      toast.success(`New Unite Added successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  };

  //delete data

  const [selectedId, setSelectedId] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = (selectedId) => {
    setSelectedId(selectedId);

    setOpenDelete(!openDelete);
  };
  const handleDelete = async () => {
    dispatch(deleteSelectedMeasureData(selectedId));

    setOpenDelete(false);

    toast.success(`Measure Deleted successfully`, {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  //edit
  const [editUnite, setEditUnite] = useState("");
  const [editHisMeasure, setEditHisMeasure] = useState("");
  const [editSymbol, setEditSymbol] = useState("");
  const [editConversionFactor, setEditConversionFactor] = useState("");
  const [editIsBaseUnit, setEditIsBaseUnit] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [selectedEditId, setSelectedEditId] = useState(null);

  const handleOpenEdit = (items) => {
    setOpenEdit(!openEdit);
    setEditUnite(items.name);
    setEditHisMeasure(items.measure_id);
    setEditSymbol(items.symbol);
    setEditConversionFactor(items.conversionFactor);
    setEditIsBaseUnit(items.isBaseUnit);
    setSelectedEditId(items.id);
  };

  const handleEditUnite = async (e) => {
    e.preventDefault();

    dispatch(
      editSelectedUnite({
        editUnite,

        editHisMeasure: convertStringToInt(editHisMeasure),
        editSymbol,
        editConversionFactor,
        editIsBaseUnit,
        selectedEditId,
      })
    );
    dispatch(fetchUniteData());
    setOpenEdit(false);

    toast.success(`Unite Updated successfully`, {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  //pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const calculateTotalPages = () => {
      setTotalPages(
        Math.ceil(uniteData ? uniteData.length / itemsPerPage : [])
      );
    };
    calculateTotalPages();
  }, [uniteData, itemsPerPage]);

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

  const currentPageData = uniteData
    ? uniteData.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  return (
    <>
      <ToastContainer />
      {authInfo ? (
        <div className="grid gap-3 items-center">
          <p className="text-base font-bold font-sans">
            {t("MAIN.SIDEBAR.MEASUREMENTMANAGEMENT.UNITE.UNITE")}
          </p>
          <Card className="rounded-md overflow-auto scrollbar">
            <CardHeader floated={false} shadow={false} className="rounded-none">
              <div className="flex items-center justify-between mt-5 gap-5">
                <div>
                  <div className="w-full">
                    <Input
                      color="blue"
                      size="md"
                      label={t("MAIN.TABLE.SEARCH")}
                      icon={
                        <MagnifyingGlassIcon className="h-5 w-5 cursor-pointer hover:text-light-blue-700" />
                      }
                    />
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  {authInfo.user.userPermissions.includes("createMeasure") ? (
                    <Button
                      variant="text"
                      size="sm"
                      className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                      onClick={handleOpen}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      {t("MAIN.SIDEBAR.MEASUREMENTMANAGEMENT.UNITE.ADDBUTTON")}
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
                      {t("MAIN.TABLE.NAME")}
                    </th>

                    <th
                      scope="col"
                      className="p-2 text-center text-md font-bold text-black  tracking-wider"
                    >
                      {t("MAIN.TABLE.ACTION")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {uniteData &&
                    currentPageData.map((items, index) => (
                      <React.Fragment key={items.id}>
                        <tr className="bg-white border-b hover:bg-blue-gray-50">
                          <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="p-2  text-left text-sm font-normal text-blue-gray-900 cursor-pointer">
                            {items.name}
                          </td>

                          <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                            <div className="flex items-center justify-center gap-2">
                              {authInfo.user.userPermissions.includes(
                                "updateMeasure"
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
                                "deleteMeasure"
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
      <Dialog open={open} handler={handleOpen} size="sm">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-0">{t("MAIN.INPUTFIELD.ADD_UNITE")}</div>
          <div className="cursor-pointer mr-0" onClick={handleOpen}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-[25rem] items-center">
          <form
            onSubmit={handleAddUnite}
            className="grid gap-5 items-center mx-auto"
          >
           {(authInfo.user.userRole === "superadmin" || authInfo.user.userPermissions.includes("createMeasure")) &&
 measureData?.length > 0 ? ( // Ensure measureData exists before accessing length
  <div className="w-full justify-self-center">
    <Select
      label={t("MAIN.INPUTFIELD.MEASURE")}
      color="blue"
      value={hisMeasure}
      onChange={(e) => {
        setHisMeasure(e);
      }}
    >
      {measureData?.map((items) => (
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
  <p>No data available for measure selection</p>
)}


            <div className="w-full justify-self-center">
              <Input
                type="text"
                color="blue"
                id="name"
                label={t("MAIN.INPUTFIELD.UNITE")}
                size="lg"
                value={unite}
                onChange={(e) => setUnite(e.target.value)}
              />
            </div>

            <div className="w-full justify-self-center">
              <Input
                type="text"
                color="blue"
                id="symbol"
                label={t("MAIN.INPUTFIELD.SYMBOL")}
                size="lg"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>

            <div className="w-full justify-self-center">
              <Input
                type="text"
                color="blue"
                id="conversionFactor"
                label={t("MAIN.INPUTFIELD.CONVERSION_FACTOR")}
                size="lg"
                value={conversionFactor}
                onChange={(e) => setConversionFactor(e.target.value)}
              />
            </div>

            <div className="w-full justify-self-center">
              <label htmlFor="isBaseUnit" className="inline-flex items-center">
                <input
                  type="checkbox"
                  id="isBaseUnit"
                  name="isBaseUnit"
                  checked={isBaseUnit}
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => setIsBaseUnit(e.target.checked)}
                />
                <span className="ml-2 text-gray-700">
                  {t("MAIN.INPUTFIELD.IS_BASE_UNITE")}
                </span>
              </label>
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
                onClick={handleAddUnite}
              >
                {t("MAIN.INPUTFIELD.ADD_UNITE")}
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

      {/* edit */}
      <Dialog open={openEdit} handler={handleOpenEdit} size="sm">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">
            {t("MAIN.INPUTFIELD.UPDATE_UNITE")}
          </div>
          <div className="cursor-pointer mr-5" onClick={handleOpenEdit}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-[25rem] items-center">
          <form
            onSubmit={handleEditUnite}
            className="grid gap-5  items-center w-11/12 mx-auto"
          >
            {authInfo.user.userRole === "superadmin" &&
            measureData &&
            measureData.length > 0 ? (
              <div className="w-full justify-self-center">
                <Select
                  label={t("MAIN.INPUTFIELD.MEASURE")}
                  color="blue"
                  value={editHisMeasure}
                  onChange={(e) => {
                    setEditHisMeasure(e);
                  }}
                >
                  {measureData.map((items) => (
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
              <p>No data available for measure selection</p>
            )}

            <div className="w-full justify-self-center">
              <Input
                type="text"
                color="blue"
                id="measure_id"
                label={t("MAIN.INPUTFIELD.UNITE")}
                size="lg"
                value={editUnite}
                onChange={(e) => setEditUnite(e.target.value)}
              />
            </div>

            <div className="w-full justify-self-center">
              <Input
                type="text"
                color="blue"
                id="symbol"
                label={t("MAIN.INPUTFIELD.SYMBOL")}
                size="lg"
                value={editSymbol}
                onChange={(e) => setEditSymbol(e.target.value)}
              />
            </div>

            <div className="w-full justify-self-center">
              <Input
                type="text"
                color="blue"
                id="conversionFactor"
                label={t("MAIN.INPUTFIELD.CONVERSION_FACTOR")}
                size="lg"
                value={editConversionFactor}
                onChange={(e) => setEditConversionFactor(e.target.value)}
              />
            </div>

            <div className="w-full justify-self-center">
              <label htmlFor="isBaseUnit" className="inline-flex items-center">
                <input
                  type="checkbox"
                  id="isBaseUnit"
                  name="isBaseUnit"
                  checked={editIsBaseUnit}
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => setEditIsBaseUnit(e.target.checked)}
                />
                <span className="ml-2 text-gray-700">
                  {t("MAIN.INPUTFIELD.IS_BASE_UNITE")}
                </span>
              </label>
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
                onClick={handleEditUnite}
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
};
export default Unite;
