import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "@material-tailwind/react";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axiosInstance from "../GlobalContexts/Base_url";
import {
  editSelectedUser,
  fetchUserData,
} from "../reduxToolKit/slices/userSlice";
import { fetchRoleData } from "../reduxToolKit/slices/roleSlice";
import { fetchMonitoringData } from "../reduxToolKit/slices/monitoringSlice";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { deleteSelectedUser } from "../reduxToolKit/slices/userSlice";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import { changeStatusOfSelectedUser } from "../reduxToolKit/slices/userSlice";
import { useCountries } from "use-react-countries";
import {
  faXmark,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./Scrollbar.css";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Card,
  Input,
  Button,
  IconButton,
  CardBody,
  CardFooter,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

function Admin() {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const authInfo = useAuth();

  //regular expression
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const phoneRegex = /^[1-9][0-9]{6,14}$/;

  const nameRegex = /^[A-Za-z'-/]+$/;

  //fetch admin data

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  //fetch role data

  const { roleData } = useSelector((state) => state.role);
  useEffect(() => {
    dispatch(fetchRoleData());
  }, []);

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

  //delete Admin
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = (adminId) => {
    setSelectedId(adminId);

    setOpenDelete(!openDelete);
  };

  const [selectedId, setSelectedId] = useState(null);

  const handleDelete = async () => {
    dispatch(deleteSelectedUser(selectedId));

    setOpenDelete(false);

    toast.success("User Deleted successfully", {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  //statusUpdate
  const handleStatusUpdate = async (changeStatusId, currentItem) => {
    dispatch(changeStatusOfSelectedUser({ changeStatusId, currentItem }));
  };

  //add admin

  const [email, setEmail] = useState("");

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [phone, setPhone] = useState("");

  const [gender, setGender] = useState("");

  const [role, setRole] = useState("");

  const [monitoringId, setMonitotoringId] = useState("");

  const [sectorId, setSectorId] = useState(null);

  const [divisionId, setDivisionId] = useState(null);

  const [userChecked, setUserChecked] = useState(false);

  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => {
    if (authInfo.user.is_superadmin) {
      setAdminChecked(true);
    }
  }, []);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);

    setEmail("");

    setFirstName("");

    setLastName("");

    setPhone("");

    setGender("");

    setRole("");

    setUserChecked(false);

    setMonitotoringId(null);

    setDivisionId(null);

    setSectorId(null);

    setDivisionChecked(null);

    setSectorChecked(null);

    setMonitoringChecked(null);

    setErrorEmptyMessage("");
  };

  const [errorEmptyMessage, setErrorEmptyMessage] = useState("");

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    const checkCanCreateAdmin =
      authInfo.user.userPermissions.includes("createAdmin");

    if (!userChecked && !adminChecked && checkCanCreateAdmin) {
      setErrorEmptyMessage("Please select user type");
      return;
    }

    if (!firstName) {
      setErrorEmptyMessage("Please enter first name");
      return;
    }
    if (!lastName) {
      setErrorEmptyMessage("Please enter last name");
      return;
    }
    if (!email) {
      setErrorEmptyMessage("Please enter email");
      return;
    }

    if (!phone) {
      setErrorEmptyMessage("Please enter phone");
      return;
    }
    if (!gender) {
      setErrorEmptyMessage("Please enter gender");
      return;
    }
    if (!role) {
      setErrorEmptyMessage("Please enter role");
      return;
    }
    if (adminChecked) {
      if (!monitoringId && !sectorId && !divisionId) {
        setErrorEmptyMessage("Please enter department");
        return;
      }
    }

    if (!nameRegex.test(firstName)) {
      setErrorEmptyMessage("Invalid First Name");
      return;
    }

    if (!nameRegex.test(lastName)) {
      setErrorEmptyMessage("Invalid Last Name");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorEmptyMessage("Invalid Email");
      return;
    }

    if (!phoneRegex.test(phone)) {
      setErrorEmptyMessage(
        "Invalid phone, the legth of you phone must be between 7-15 digits and don't start with zero since country code already included!"
      );
      return;
    }

    const phoneWithCountryCode = `${countryCallingCode}${phone}`;

    try {
      await axiosInstance.post(
        "/userApp/users/",
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          gender: gender,
          role: role,
          monitoring_id: monitoringId,
          sector_id: sectorId,
          division_id: divisionId,
          is_admin: adminChecked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(fetchUserData());

      setEmail("");

      setFirstName("");

      setLastName("");

      setPhone("");

      setGender("");

      setRole("");

      setOpen(false);

      setMonitotoringId(null);

      setDivisionId(null);

      setSectorId(null);

      setUserChecked(false);

      if (authInfo && !authInfo.user.is_superadmin) {
        setAdminChecked(false);
      }

      toast.success("New User Added successfully", {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      // console.error("Error while adding new user data:", error);
    }
  };

  const [sectorChecked, setSectorChecked] = useState(false);

  const [monitoringChecked, setMonitoringChecked] = useState(false);

  const [divisionChecked, setDivisionChecked] = useState(false);

  const handleUserClick = () => {
    setUserChecked(true);

    setAdminChecked(false);
  };

  const handleAdminClick = () => {
    setAdminChecked(true);

    setUserChecked(false);
  };

  const handleSectorClick = () => {
    setSectorChecked(true);

    setDivisionChecked(false);

    setMonitoringChecked(false);
  };

  const handleMonitoringClick = () => {
    setSectorChecked(false);

    setDivisionChecked(false);

    setMonitoringChecked(true);
  };

  const handleDivisionClick = () => {
    setDivisionChecked(true);

    setMonitoringChecked(false);

    setSectorChecked(false);
  };

  // Edit

  const [openEdit, setOpenEdit] = useState(false);

  const [departmentId, selectedDepartmentId] = useState(null);

  const handleOpenEdit = (items) => {
    setOpenEdit(!openEdit);

    setErrorEmptyMessage("");

    setEmailEdit(items.email);

    setFirstNameEdit(items.first_name);

    setLastNameEdit(items.last_name);

    setPhoneEdit(items.phone);

    setGenderEdit(items.gender);

    if (items.role) {
      setRoleEdit(items.role);
    }

    if (items.monitoring_id) {
      setMonitotoringIdEdit(items.monitoring_id);
      setMonitoringCheckedEdit(true);
      setSectorCheckedEdit(false);
      setDivisionCheckedEdit(false);
    }

    if (items.sector_id) {
      setSectorIdEdit(items.sector_id);
      setSectorCheckedEdit(true);
      setMonitoringCheckedEdit(false);
      setDivisionCheckedEdit(false);
    }
    if (items.division_id) {
      setDivisionIdEdit(items.division_id);
      setDivisionCheckedEdit(true);
      setMonitoringCheckedEdit(false);
      setSectorCheckedEdit(false);
    }

    setEditUserId(items.id);
  };

  const [emailEdit, setEmailEdit] = useState("");

  const [firstNameEdit, setFirstNameEdit] = useState("");

  const [lastNameEdit, setLastNameEdit] = useState("");

  const [phoneEdit, setPhoneEdit] = useState("");

  const [genderEdit, setGenderEdit] = useState("");

  const [roleEdit, setRoleEdit] = useState("");

  const [monitoringIdEdit, setMonitotoringIdEdit] = useState("");

  const [sectorIdEdit, setSectorIdEdit] = useState("");

  const [divisionIdEdit, setDivisionIdEdit] = useState("");

  const [editUserId, setEditUserId] = useState(null);

  const handleEditAdmin = async (e) => {
    e.preventDefault();

    if (!firstNameEdit) {
      setErrorEmptyMessage("Please enter first name");
      return;
    }
    if (!lastNameEdit) {
      setErrorEmptyMessage("Please enter last name");
      return;
    }
    if (!emailEdit) {
      setErrorEmptyMessage("Please enter email");
      return;
    }

    if (!phoneEdit) {
      setErrorEmptyMessage("Please enter phone");
      return;
    }
    if (!genderEdit) {
      setErrorEmptyMessage("Please enter gender");
      return;
    }
    if (!roleEdit) {
      setErrorEmptyMessage("Please enter role");
      return;
    }
    if (adminChecked) {
      if (!monitoringIdEdit && !sectorIdEdit && !divisionIdEdit) {
        setErrorEmptyMessage("Please enter department");
        return;
      }
    }

    if (!nameRegex.test(firstNameEdit)) {
      setErrorEmptyMessage("Invalid First Name");
      return;
    }

    if (!nameRegex.test(lastNameEdit)) {
      setErrorEmptyMessage("Invalid Last Name");
      return;
    }

    if (!emailRegex.test(emailEdit)) {
      setErrorEmptyMessage("Invalid Email");
      return;
    }

    if (!phoneRegex.test(phoneEdit)) {
      setErrorEmptyMessage(
        "Invalid phone, the legth of you phone must be between 7-15 digits and don't start with zero since country code already included!"
      );
      return;
    }

    dispatch(
      editSelectedUser({
        emailEdit,
        firstNameEdit,
        lastNameEdit,
        phoneEdit,
        genderEdit,
        roleEdit,
        monitoringIdEdit,
        sectorIdEdit,
        divisionIdEdit,
        editUserId,
      })
    );
    setOpenEdit(false);
    toast.success("User Account Updated successfully", {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  const [sectorCheckedEdit, setSectorCheckedEdit] = useState(false);

  const [monitoringCheckedEdit, setMonitoringCheckedEdit] = useState(false);

  const [divisionCheckedEdit, setDivisionCheckedEdit] = useState(false);

  const handleSectorClickEdit = () => {
    setSectorCheckedEdit(true);

    setDivisionCheckedEdit(false);

    setMonitoringCheckedEdit(false);
  };

  const handleMonitoringClickEdit = () => {
    setSectorCheckedEdit(false);

    setDivisionCheckedEdit(false);

    setMonitoringCheckedEdit(true);
  };

  const handleDivisionClickEdit = () => {
    setDivisionCheckedEdit(true);

    setMonitoringCheckedEdit(false);

    setSectorCheckedEdit(false);
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
      setTotalPages(Math.ceil(userData ? userData.length / itemsPerPage : []));
    };
    calculateTotalPages();
  }, [userData, itemsPerPage]);

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

  const currentPageData = userData
    ? userData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  return (
    <div>
      {authInfo ? (
        <>
          <ToastContainer />
          <div className="grid gap-3 items-center">
            <h1 className="whitespace-nowrap text-left text-xl font-bold text-black">
              {t("MAIN.SIDEBAR.UMS.USER.USER")}
            </h1>
            <Card className=" rounded-md overflow-auto scrollbar">
              <div className="flex items-center gap-10 justify-between mt-5 mx-5">
                <div>
                  <div className="">
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
                  <Button
                    variant="text"
                    size="sm"
                    onClick={handleOpen}
                    className={`flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case ${
                      roleData && sectorData && monitoringData && divisionData
                        ? ""
                        : "cursor-wait"
                    }`}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    {t("MAIN.SIDEBAR.UMS.USER.ADDBUTTON")}
                  </Button>
                </div>
              </div>
              <CardBody id="reportTable">
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
                        className="p-2 text-left text-md font-bold text-black tracking-wider"
                      >
                        {t("MAIN.TABLE.NAME")}
                      </th>

                      <th
                        scope="col"
                        className="p-2  text-left text-md font-bold text-black tracking-wider"
                      >
                        {t("MAIN.TABLE.EMAIL")}
                      </th>

                      <th
                        scope="col"
                        className="p-2  text-left text-md font-bold text-black  tracking-wider  "
                      >
                        {t("MAIN.TABLE.ROLE")}
                      </th>
                      <th
                        scope="col"
                        className="p-2  text-left text-md font-bold text-black  tracking-wider  "
                      >
                        {t("MAIN.TABLE.USERTYPE")}
                      </th>
                      <th
                        scope="col"
                        className="p-2  text-left text-md font-bold text-black  tracking-wider  "
                      >
                        {t("MAIN.TABLE.STATUS")}
                      </th>
                      <th
                        scope="col"
                        className="p-2  text-center text-md font-bold text-black  tracking-wider "
                      >
                        {t("MAIN.TABLE.ACTION")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {currentPageData &&
                      currentPageData.map((items, index) => (
                        <React.Fragment key={items.id}>
                          <tr className="bg-white border-b hover:bg-blue-gray-50">
                            <td className="p-2  text-left text-sm font-normal text-blue-gray-900">
                              {indexOfFirstItem + index + 1}
                            </td>
                            <td className="p-2  text-left text-sm font-normal text-blue-gray-900 cursor-pointer">
                              {items.first_name} {items.last_name}
                            </td>
                            <td className="p-2  text-left text-sm font-normal text-blue-gray-900 cursor-pointer">
                              {items.email}
                            </td>
                            <td className="p-2  text-left text-sm font-normal text-blue-gray-900 cursor-pointer">
                              {items.role_name}
                            </td>
                            <td className="p-2  text-left text-sm font-normal text-blue-gray-900 cursor-pointer">
                            {items.monitoring_id
                              ? monitoringData?.find((data) => data.id === items.monitoring_id)?.name || "No permission"
                              : items.sector_id
                              ? sectorData?.find((data) => data.id === items.sector_id)?.name || "No Permission"
                              : items.division_id
                              ? divisionData?.find((data) => data.id === items.division_id)?.name || "No Permission"
                              : ""}
                            </td>

                            <td className="p-2 text-left text-sm font-normal text-blue-gray-900">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={items.status}
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

                            <td className="p-2  text-left text-sm text-blue-gray-900 font-normal">
                              <div className="flex items-center justify-center gap-2">
                                <FontAwesomeIcon
                                  color="orange"
                                  onClick={() => handleOpenEdit(items)}
                                  icon={faPenToSquare}
                                  className="cursor-pointer"
                                />
                                <FontAwesomeIcon
                                  color="red"
                                  onClick={() => handleOpenDelete(items.id)}
                                  icon={faTrash}
                                  className="cursor-pointer"
                                />
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
          </div>
        </>
      ) : (
        <div></div>
      )}

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
      <Dialog open={openEdit} handler={handleOpenEdit} size="sm">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">Update {firstNameEdit}'s account</div>
          <div className="cursor-pointer mr-5" onClick={handleOpenEdit}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </DialogHeader>

        <DialogBody className="h-[35rem] overflow-auto scrollbar">
          <form
            onSubmit={handleEditAdmin}
            className="grid gap-5 items-center w-11/12  mx-auto"
          >
            <div className="w-full justify-self-center">
              <Input
                type="text"
                color="blue"
                id="email"
                label="First Name"
                size="lg"
                value={firstNameEdit}
                onChange={(e) => {
                  setFirstNameEdit(e.target.value), setErrorEmptyMessage("");
                }}
              />
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="email"
                color="blue"
                label="Last Name"
                size="lg"
                value={lastNameEdit}
                onChange={(e) => {
                  setLastNameEdit(e.target.value), setErrorEmptyMessage("");
                }}
              />
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="email"
                label="Email"
                color="blue"
                size="lg"
                value={emailEdit}
                onChange={(e) => {
                  setEmailEdit(e.target.value);
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
                label="Mobile Number"
                className="rounded-l-none"
                value={phoneEdit}
                onChange={(e) => {
                  setPhoneEdit(e.target.value), setErrorEmptyMessage("");
                }}
              />
            </div>
            <div className="w-full justify-self-center">
              <Select
                label="Gender"
                value={genderEdit}
                color="blue"
                onChange={(e) => {
                  setGenderEdit(e);
                }}
              >
                <Option value="Male" className="focus:text-light-blue-700">
                  Male
                </Option>
                <Option value="Female" className="focus:text-light-blue-700">
                  Female
                </Option>
              </Select>
            </div>
            <div className="w-full justify-self-center">
              <Select
                label="Role"
                color="blue"
                value={roleEdit}
                onChange={(e) => {
                  setRoleEdit(e), setErrorEmptyMessage("");
                }}
              >
                {roleData ? (
                  roleData.map((items) => (
                    <Option
                      key={items.id}
                      value={items.id}
                      className="focus:text-light-blue-700"
                    >
                      {items.name}
                    </Option>
                  ))
                ) : (
                  <div></div>
                )}
              </Select>
            </div>
            <div className="w-full justify-self-center">
              <Checkbox
                color="blue"
                label="Sector"
                checked={sectorCheckedEdit}
                onClick={handleSectorClickEdit}
              />

              <Checkbox
                color="blue"
                label="Monitoring"
                checked={monitoringCheckedEdit}
                onClick={handleMonitoringClickEdit}
              />
              <Checkbox
                color="blue"
                label="Division"
                checked={divisionCheckedEdit}
                onClick={handleDivisionClickEdit}
              />
              <Select
                color="blue"
                label={
                  (monitoringCheckedEdit && "Monitoring") ||
                  (sectorCheckedEdit && "Sector") ||
                  (divisionCheckedEdit && "Division")
                }
                value={
                  monitoringCheckedEdit
                    ? monitoringIdEdit
                    : sectorCheckedEdit
                    ? sectorIdEdit
                    : divisionCheckedEdit
                    ? divisionIdEdit
                    : ""
                }
                onChange={(e) => {
                  if (monitoringCheckedEdit) {
                    setMonitotoringIdEdit(e);
                    setSectorIdEdit("");
                    setDivisionIdEdit("");
                    setErrorEmptyMessage("");
                  } else if (sectorCheckedEdit) {
                    setSectorIdEdit(e);
                    setMonitotoringIdEdit("");
                    setDivisionIdEdit("");
                    setErrorEmptyMessage("");
                  } else if (divisionCheckedEdit) {
                    setDivisionIdEdit(e);
                    setMonitotoringIdEdit("");
                    setSectorIdEdit("");
                    setErrorEmptyMessage("");
                  }
                }}
              >
                {(monitoringCheckedEdit
                  ? monitoringData
                  : sectorCheckedEdit
                  ? sectorData
                  : divisionCheckedEdit
                  ? divisionData
                  : []
                )?.map((items) => (
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
            {adminChecked && (
              <p className="text-red-500 text-sm">{errorEmptyMessage}</p>
            )}
            <div className="space-x-2 flex justify-self-end">
              <Button
                variant="text"
                color="red"
                onClick={handleOpenEdit}
                className="normal-case"
              >
                <span>Cancel</span>
              </Button>
              <Button
                variant="text"
                size="sm"
                className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                onClick={handleEditAdmin}
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

      {/* add */}
      {roleData && sectorData && monitoringData && divisionData && (
        <Dialog open={open} handler={handleOpen} size="sm">
          <DialogHeader className="flex justify-between">
            <div className="text-xl ml-5">
              {adminChecked
                ? t("MAIN.INPUTFIELD.ADD_ADMIN")
                : t("MAIN.INPUTFIELD.ADD_USER")}
            </div>
            <div className="cursor-pointer mr-5" onClick={handleOpen}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </DialogHeader>

          <DialogBody className="h-[35rem] overflow-auto scrollbar">
            <form
              onSubmit={handleAddAdmin}
              className="grid gap-5 items-center w-11/12  mx-auto"
            >
              {authInfo.user.userPermissions.includes("createAdmin") &&
              !authInfo.user.is_superadmin ? (
                <div className="w-full justify-self-center">
                  <Checkbox
                    color="blue"
                    label={t("MAIN.INPUTFIELD.USER")}
                    checked={userChecked}
                    onClick={handleUserClick}
                  />
                  <Checkbox
                    color="blue"
                    label={t("MAIN.INPUTFIELD.ADMIN")}
                    checked={adminChecked}
                    onClick={handleAdminClick}
                  />
                </div>
              ) : (
                <div></div>
              )}

              <div className="w-full justify-self-center">
                <Input
                  type="text"
                  id="email"
                  label={t("MAIN.INPUTFIELD.FIRSTNAME")}
                  size="lg"
                  color="blue"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value), setErrorEmptyMessage("");
                  }}
                />
              </div>
              <div className="w-full justify-self-center">
                <Input
                  type="text"
                  id="email"
                  label={t("MAIN.INPUTFIELD.LASTNAME")}
                  size="lg"
                  color="blue"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value), setErrorEmptyMessage("");
                  }}
                />
              </div>
              <div className="w-full justify-self-center">
                <Input
                  type="text"
                  color="blue"
                  id="email"
                  label={t("MAIN.INPUTFIELD.EMAIL")}
                  size="lg"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value), setErrorEmptyMessage("");
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
                      className="flex h-10 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3
                    "
                    >
                      <img
                        src={flags.svg}
                        alt={name}
                        className="h-4 w-4 rounded-full object-cover"
                      />
                      {countryCallingCode}
                    </Button>
                  </MenuHandler>
                  <MenuList className="max-h-[20rem] max-w-[18rem] z-50">
                    {countries.map(
                      ({ name, flags, countryCallingCode }, index) => {
                        return (
                          <MenuItem
                            key={name}
                            value={name}
                            className="flex items-center gap-2 z-50"
                            onClick={() => setCountry(index)}
                          >
                            <img
                              src={flags.svg}
                              alt={name}
                              className="h-5 w-5 rounded-full object-cover"
                            />

                            {name}
                            <span className="ml-auto">
                              {countryCallingCode}
                            </span>
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
                  className="rounded-l-none border-l-none"
                  containerProps={{
                    className: "min-w-0",
                  }}
                  value={phone}
                  onChange={(e) => (
                    setPhone(e.target.value), setErrorEmptyMessage("")
                  )}
                />
              </div>
              <div className="w-full justify-self-center">
                <Select
                  label={t("MAIN.INPUTFIELD.GENDER")}
                  value={gender}
                  color="blue"
                  onChange={(e) => {
                    setGender(e), setErrorEmptyMessage("");
                  }}
                >
                  <Option value="Male" className="focus:text-light-blue-700">
                    {t("MAIN.INPUTFIELD.MALE")}
                  </Option>
                  <Option value="Female" className="focus:text-light-blue-700">
                    {t("MAIN.INPUTFIELD.FEMALE")}
                  </Option>
                </Select>
              </div>
              <div className="w-full justify-self-center">
                <Select
                  label={t("MAIN.INPUTFIELD.ROLE")}
                  value={role}
                  color="blue"
                  onChange={(e) => {
                    setRole(e), setErrorEmptyMessage("");
                  }}
                >
                  {roleData ? (
                    roleData.map((items) => (
                      <Option
                        key={items.id}
                        value={items.id}
                        className="focus:text-light-blue-700"
                      >
                        {items.name}
                      </Option>
                    ))
                  ) : (
                    <div></div>
                  )}
                </Select>
                {!adminChecked && (
                  <p className="text-red-500 text-sm">{errorEmptyMessage}</p>
                )}
              </div>
              {adminChecked && (
                <div className="w-full justify-self-center">
                  {authInfo.user.userPermissions.includes("createSector") &&
                    authInfo.user.userPermissions.includes("createSector") && (
                      <Checkbox
                        color="blue"
                        label={t("MAIN.INPUTFIELD.SECTOR")}
                        checked={sectorChecked}
                        onClick={handleSectorClick}
                      />
                    )}
                  {authInfo.user.userPermissions.includes("createMonitoring") &&
                    authInfo.user.userPermissions.includes(
                      "createMonitoring"
                    ) && (
                      <Checkbox
                        color="blue"
                        label={t("MAIN.INPUTFIELD.MONITORING")}
                        checked={monitoringChecked}
                        onClick={handleMonitoringClick}
                      />
                    )}
                  {authInfo.user.userPermissions.includes("createDivision") && (
                    <Checkbox
                      color="blue"
                      label={t("MAIN.INPUTFIELD.DIVISION")}
                      checked={divisionChecked}
                      onClick={handleDivisionClick}
                    />
                  )}

                  <Select
                    color="blue"
                    label={
                      (monitoringChecked && t("MAIN.INPUTFIELD.MONITORING")) ||
                      (sectorChecked && t("MAIN.INPUTFIELD.SECTOR")) ||
                      (divisionChecked && t("MAIN.INPUTFIELD.DIVISION"))
                    }
                    onChange={(e) => {
                      (monitoringChecked && setMonitotoringId(e)) ||
                        (sectorChecked && setSectorId(e)) ||
                        (divisionChecked && setDivisionId(e)),
                        setErrorEmptyMessage("");
                    }}
                  >
                    {(monitoringChecked &&
                      monitoringData &&
                      monitoringData.map((items) => (
                        <Option
                          key={items.id}
                          value={items.id}
                          className="focus:text-light-blue-700"
                        >
                          {items.name}
                        </Option>
                      ))) ||
                      (sectorChecked &&
                        sectorData &&
                        sectorData.map((items) => (
                          <Option
                            key={items.id}
                            value={items.id}
                            className="focus:text-light-blue-700"
                          >
                            {items.name}
                          </Option>
                        ))) ||
                      (divisionData &&
                        divisionData.map((items) => (
                          <Option
                            key={items.id}
                            value={items.id}
                            className="focus:text-light-blue-700"
                          >
                            {items.name}
                          </Option>
                        )))}
                  </Select>

                  {adminChecked && (
                    <p className="text-red-500 text-sm">{errorEmptyMessage}</p>
                  )}
                </div>
              )}
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
                  onClick={handleAddAdmin}
                >
                  {adminChecked
                    ? t("MAIN.INPUTFIELD.ADD_ADMIN")
                    : t("MAIN.INPUTFIELD.ADD_USER")}
                </Button>
              </div>
            </form>
          </DialogBody>
        </Dialog>
      )}
    </div>
  );
}
export default Admin;
