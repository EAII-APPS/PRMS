import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useCountries } from "use-react-countries";
import { useTranslation } from "react-i18next";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useDispatch, useSelector } from "react-redux";
import axiosInistance from "../GlobalContexts/Base_url";
import {
  deleteSelectedMonitoringData,
  editSelectedMonitoringData,
  fetchMonitoringData,
} from "../reduxToolKit/slices/monitoringSlice";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Card,
  CardHeader,
  Input,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Monitoring() {
  const { t } = useTranslation();

  const token = localStorage.getItem("access");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const phoneRegex = /^[1-9][0-9]{6,14}$/;

  const authInfo = useAuth();

  const dispatch = useDispatch();

  //fetch monitoring data

  const { monitoringData } = useSelector((state) => state.monitoring);

  useEffect(() => {
    dispatch(fetchMonitoringData());
  }, []);

  //Addmonitoring user
  const [namem, setname] = useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [errorEmptyMessage, setErrorEmptyMessage] = useState("");

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);

    setname("");

    setPhone("");

    setEmail("");

    setErrorEmptyMessage("");
  };

  const handleAddMonitoring = async (e) => {
    e.preventDefault();

    if (!namem) {
      setErrorEmptyMessage("please enter monitoring");
      return;
    }
    if (!email) {
      setErrorEmptyMessage("please enter email");
      return;
    }
    if (!phone) {
      setErrorEmptyMessage("please enter phone");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorEmptyMessage("Invalid email");
      return;
    }
    if (!phoneRegex.test(phone)) {
      setErrorEmptyMessage(
        "Invalid phone, the legth of you phone must be between 7-15 digits and don't start with zero since country code already included!"
      );
      return;
    }

    try {
      const addNewMonoting = await axiosInistance.post(
        "/userApp/monitoring/",
        { name: namem, phone_no: phone, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(fetchMonitoringData());

      setOpen(false);

      toast.success(`Monitoring Added successfully`, {
        autoClose: 2000,
      });

      setname("");

      setPhone("");

      setEmail("");
    } catch (error) {}
  };

  //delete monitoring
  const [selectedId, setSelectedId] = useState(null);

  const [selectedName, setSelectedName] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = (monitoringId, monitoringName) => {
    setSelectedId(monitoringId);

    setSelectedName(monitoringName);

    setOpenDelete(!openDelete);
  };

  const handleDelete = async () => {
    dispatch(deleteSelectedMonitoringData(selectedId));

    setOpenDelete(!openDelete);

    toast.success(`Deleted successfully`, {
      autoClose: 2000,
    });
  };

  // Edit
  const [editMonitoringId, setEditMonitoringId] = useState(null);

  const [editName, setEditName] = useState("");

  const [editPhone, setEditPhone] = useState("");

  const [editEmail, setEditEmail] = useState("");

  const [openEdit, setOpenEdit] = useState(null);

  const handleOpenEdit = (items) => {
    setOpenEdit(!openEdit);

    setEditName(items.name);

    setEditPhone(items.phone_no);

    setEditEmail(items.email);

    setEditMonitoringId(items.id);

    setErrorEmptyMessage("");
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!editName) {
      setErrorEmptyMessage("please enter monitoring");
      return;
    }
    if (!editEmail) {
      setErrorEmptyMessage("please enter email");
      return;
    }
    if (!editPhone) {
      setErrorEmptyMessage("please enter phone");
      return;
    }

    if (!emailRegex.test(editEmail)) {
      setErrorEmptyMessage("Invalid email");
      return;
    }
    if (!phoneRegex.test(editPhone)) {
      setErrorEmptyMessage(
        "Invalid phone, the legth of you phone must be between 7-15 digits and don't start with zero since country code already included!"
      );
      return;
    }

    try {
      await axiosInistance.put(
        `/userApp/monitoring/${editMonitoringId}/`,
        {
          name: editName,
          phone_no: editPhone,
          email: editEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchMonitoringData());

      toast.success(`Monitoring edited successfully`, {
        autoClose: 2000,
      });

      setOpenEdit(false);
    } catch (error) {}
  };

  //phone
  const { countries } = useCountries();

  const ethiopiaIndex = countries.findIndex(
    (country) => country.name === "Ethiopia"
  );
  const [country, setCountry] = React.useState(ethiopiaIndex);

  const { name, flags, countryCallingCode } = countries[country];

  //pagination

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const calculateTotalPages = () => {
      setTotalPages(
        Math.ceil(monitoringData ? monitoringData.length / itemsPerPage : [])
      );
    };

    calculateTotalPages();
  }, [monitoringData, itemsPerPage]);

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

  const currentPageData =
    Array.isArray(monitoringData) &&
    monitoringData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div>
        {authInfo ? (
          <div className="grid gap-3 items-center">
            <ToastContainer />
            <>
              <p className="text-base font-bold font-sans">
                {t("MAIN.SIDEBAR.CLUSTER.MONITORING.MONITORING")}
              </p>
              <Card className="rounded-md overflow-auto scrollbar">
                <CardHeader
                  floated={false}
                  shadow={false}
                  className="rounded-none"
                >
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
                        "createMonitoring"
                      ) ? (
                        <Button
                          variant="text"
                          size="sm"
                          className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                          onClick={handleOpen}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          {t("MAIN.SIDEBAR.CLUSTER.MONITORING.ADDBUTTON")}
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
                          className="p-2 text-left text-md font-bold text-black  tracking-wider"
                        >
                          {t("MAIN.TABLE.PHONENUMBER")}
                        </th>
                        <th
                          scope="col"
                          className="p-2 text-left text-md font-bold text-black  tracking-wider"
                        >
                          {t("MAIN.TABLE.EMAIL")}
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
                    <tbody className="bg-white">
                      {Array.isArray(monitoringData) &&
                        currentPageData.map((items, index) => (
                          <React.Fragment key={items.id}>
                            <tr className="bg-white border-b hover:bg-blue-gray-50">
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                {indexOfFirstItem + index + 1}
                              </td>
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                {items.name}
                              </td>
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                {items.phone_no}
                              </td>
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                {items.email}
                              </td>
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
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
                                </label>
                              </td>
                              <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                                <div className="flex items-center justify-center gap-2">
                                  {authInfo.user.userPermissions.includes(
                                    "updateMonitoring"
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
                                    "deleteMonitoring"
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
        ) : (
          <div></div>
        )}
      </div>

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
            {t("MAIN.INPUTFIELD.ADD_MONITORING")}
          </div>
          <div className="cursor-pointer mr-5" onClick={handleOpen}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>
        <DialogBody className="h-[20rem] items-center">
          <form
            onSubmit={handleAddMonitoring}
            className="grid gap-5 items-center  w-11/12 mx-auto"
          >
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="name"
                color="blue"
                label={t("MAIN.INPUTFIELD.MONITORING")}
                size="lg"
                value={namem}
                onChange={(e) => (
                  setname(e.target.value), setErrorEmptyMessage("")
                )}
              />
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="email"
                id="email"
                label={t("MAIN.INPUTFIELD.EMAIL")}
                size="lg"
                color="blue"
                value={email}
                onChange={(e) => (
                  setEmail(e.target.value), setErrorEmptyMessage("")
                )}
              />
            </div>
            <div className="w-full relative flex justify-self-center">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="flex h-10 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                  >
                    <img
                      src={flags.svg}
                      alt={name}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                    {countryCallingCode}
                  </Button>
                </MenuHandler>
                <MenuList className="max-h-[20rem] max-w-[18rem]">
                  {countries.map(
                    ({ name, flags, countryCallingCode }, index) => {
                      return (
                        <MenuItem
                          key={name}
                          value={name}
                          className="flex items-center gap-2"
                          onClick={() => setCountry(index)}
                        >
                          <img
                            src={flags.svg}
                            alt={name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          {name}
                          <span className="ml-auto">{countryCallingCode}</span>
                        </MenuItem>
                      );
                    }
                  )}
                </MenuList>
              </Menu>
              <Input
                type="tel"
                label={t("MAIN.INPUTFIELD.PHONENUMBER")}
                className="rounded-l-none"
                color="blue"
                value={phone}
                onChange={(e) => (
                  setPhone(e.target.value), setErrorEmptyMessage("")
                )}
              />
            </div>
            <p className="text-red-500 text-sm"> {errorEmptyMessage}</p>

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
                onClick={handleAddMonitoring}
              >
                {t("MAIN.INPUTFIELD.ADD_MONITORING")}
              </Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>

      {/* Edit */}
      <Dialog open={openEdit} handler={handleOpenEdit} size="sm">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">
            {t("MAIN.INPUTFIELD.UPDATE_MONITORING")}{" "}
          </div>
          <div className="cursor-pointer mr-5" onClick={handleOpenEdit}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-[20rem] items-center">
          <form
            onSubmit={handleEdit}
            className="grid gap-5 items-center w-11/12 mx-auto"
          >
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="name"
                color="blue"
                label={t("MAIN.INPUTFIELD.MONITORING")}
                size="lg"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value).setErrorEmptyMessage("");
                }}
              />
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="email"
                id="email"
                color="blue"
                label={t("MAIN.INPUTFIELD.EMAIL")}
                size="lg"
                value={editEmail}
                onChange={(e) => {
                  setEditEmail(e.target.value).setErrorEmptyMessage("");
                }}
              />
            </div>
            <div className="w-full relative flex justify-self-center">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="flex h-10 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                  >
                    <img
                      src={flags.svg}
                      alt={name}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                    {countryCallingCode}
                  </Button>
                </MenuHandler>
                <MenuList className="max-h-[20rem] max-w-[18rem]">
                  {countries.map(
                    ({ name, flags, countryCallingCode }, index) => {
                      return (
                        <MenuItem
                          key={name}
                          value={name}
                          className="flex items-center gap-2"
                          onClick={() => setCountry(index)}
                        >
                          <img
                            src={flags.svg}
                            alt={name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          {name}
                          <span className="ml-auto">{countryCallingCode}</span>
                        </MenuItem>
                      );
                    }
                  )}
                </MenuList>
              </Menu>
              <Input
                type="tel"
                color="blue"
                label={t("MAIN.INPUTFIELD.PHONENUMBER")}
                className="rounded-l-none"
                value={editPhone}
                onChange={(e) => {
                  setEditPhone(e.target.value), setErrorEmptyMessage("");
                }}
              />
            </div>
            <p className="text-red-500 text-sm"> {errorEmptyMessage}</p>

            <div className="space-x-2 flex justify-self-end">
              <Button
                variant="text"
                color="red"
                onClick={handleOpenEdit}
                className="normal-case"
              >
                <span>{t("MAIN.INPUTFIELD.CANCEL")} </span>
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
    </>
  );
}
export default Monitoring;
