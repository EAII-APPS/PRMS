import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axiosInistance from "../GlobalContexts/Base_url";
import avatarImage from "../assets/EAII.png";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { faPersonDress } from "@fortawesome/free-solid-svg-icons";
import { faPersonArrowDownToLine } from "@fortawesome/free-solid-svg-icons";
import { faPersonArrowUpFromLine } from "@fortawesome/free-solid-svg-icons";
import { useCountries } from "use-react-countries";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  changeStatusOfSelectedUser,
  editSelectedUser,
} from "../reduxToolKit/slices/userSlice";
import { fetchRoleData } from "../reduxToolKit/slices/roleSlice";

import {
  // addNewUser,
  deleteSelectedUser,
  fetchUserData,
} from "../reduxToolKit/slices/userSlice";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Card,
  CardHeader,
  Input,
  Typography,
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

function Table() {
  const { t } = useTranslation();
  const authInfo = useAuth();

  const dispatch = useDispatch();

  //fetch user data
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  //fetch role data
  const { roleData } = useSelector((state) => state.role);
  useEffect(() => {
    dispatch(fetchRoleData());
  }, []);

  //statusUpdate
  const handleStatusUpdate = async (changeStatusId, currentItem) => {
    dispatch(changeStatusOfSelectedUser({ changeStatusId, currentItem }));
  };

  //delete user
  const [selectedId, setSelectedId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = (userId) => {
    setSelectedId(userId);
    setOpenDelete(!openDelete);
  };

  const handleDelete = async () => {
    dispatch(deleteSelectedUser(selectedId));
    setShowModalt(false);
  };

  //add new user
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");

  const handleadduser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("role", role);
    // dispatch(addNewUser(formData));
    setShowModalAddUser(false);
  };

  // Edit

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = (items) => {
    setOpenEdit(!openEdit);
    setEmailEdit(items.email);
    setFirstNameEdit(items.first_name);
    setLastNameEdit(items.last_name);
    setPhoneEdit(items.phone);
    setGenderEdit(items.gender);
    setRoleEdit(items.role);

    setEditUserId(items.id);
  };

  const [emailEdit, setEmailEdit] = useState("");
  const [firstNameEdit, setFirstNameEdit] = useState("");
  const [lastNameEdit, setLastNameEdit] = useState("");
  const [phoneEdit, setPhoneEdit] = useState("");
  const [genderEdit, setGenderEdit] = useState("");
  const [roleEdit, setRoleEdit] = useState("");

  const [editUserId, setEditUserId] = useState(null);

  const handleEditAdmin = async (e) => {
    e.preventDefault();

    dispatch(
      editSelectedUser({
        emailEdit,
        firstNameEdit,
        lastNameEdit,
        phoneEdit,
        genderEdit,
        roleEdit,
        editUserId,
      })
    );
    setOpen(false);
  };

  // View
  const [showModalView, setShowModalView] = useState(false);
  const handleCloseModalView = () => {
    setShowModalView(false);
  };
  // const [selectedUserIdForEdit, setSelectedUserIdForEdit] = useState();
  // const handleOpenModalView = (userId) => {
  //   setShowModalView(true);
  //   setSelectedUserIdForEdit(userId);
  // };
  const handleModalClickView = (e) => {
    e.stopPropagation();
  };

  //handle view
  const [viewUser, setViewUser] = useState();
  const handleOpenModalView = async (selectedUserIdForEdit) => {
    setShowModalView(true);
    // setSelectedUserIdForEdit(userId);
    try {
      const res = await axiosInistance.get(
        `/userApp/users/${selectedUserIdForEdit}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setViewUser(res.data);
    } catch (error) {
      console.error("error changing status user:", error);
    }
  };
  //phone
  const { countries } = useCountries();

  const ethiopiaIndex = countries.findIndex(
    (country) => country.name === "Ethiopia"
  );
  const [country, setCountry] = React.useState(ethiopiaIndex);
  const { name, flags, countryCallingCode } = countries[country];

  const user = userData
    ? userData.filter((items) => !items.is_admin && !items.is_superadmin)
    : [];
  //pagination
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page
  const [totalPages, setTotalPages] = useState(0); //

  useEffect(() => {
    const calculateTotalPages = () => {
      setTotalPages(Math.ceil(userData ? user.length / itemsPerPage : []));
    };
    calculateTotalPages();
  }, [user, itemsPerPage]);

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
    ? user.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  return (
    <div>
      <>
        {authInfo ? (
          <div>
            <>
              <p className="text-base font-bold font-sans">
                {t("MAIN.SIDEBAR.UMS.USER.TITLE")}
              </p>
              <Card className="w-full h-screen mt-5 rounded-md">
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
                      {/* {authInfo.user.userPermissions.createUser ? ( */}
                      <Button
                        variant="text"
                        size="sm"
                        onClick={handleOpen}
                        className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        {t("MAIN.SIDEBAR.UMS.USER.ADDBUTTON")}
                      </Button>
                      {/* ) : (
                        <div></div>
                      )} */}
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <table className="w-full min-w-max table-auto text-left border-b-2">
                    <thead>
                      <tr>
                        <th className="font-sans text-black font-bold border-b-2 border-blue-gray-100 bg-blue-gray-50 p-4">
                          {t("MAIN.TABLE.NO")}
                        </th>
                        <th className="font-sans text-black font-bold border-b-2 border-blue-gray-100 bg-blue-gray-50 p-4">
                          {t("MAIN.TABLE.NAME")}
                        </th>
                        <th className="font-sans text-black font-bold border-b-2 border-blue-gray-100 bg-blue-gray-50 p-4">
                          {t("MAIN.TABLE.EMAIL")}
                        </th>
                        <th className="font-sans text-black font-bold border-b-2 border-blue-gray-100 bg-blue-gray-50 p-4">
                          {t("MAIN.TABLE.ROLE")}
                        </th>
                        <th className="font-sans text-black font-bold border-b-2 border-blue-gray-100 bg-blue-gray-50 p-4">
                          {t("MAIN.TABLE.STATUS")}
                        </th>
                        <th className="text-center font-sans text-black font-bold border-b-2 border-blue-gray-100 bg-blue-gray-50 p-4">
                          {t("MAIN.TABLE.ACTION")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageData &&
                        currentPageData
                          // .filter((items) => !items.is_admin)
                          .map((items, index) => (
                            <tr key={items.id} className="">
                              <td className="px-5 py-2 border-b-2 border-blue-gray-50">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {index + 1}
                                </Typography>
                              </td>
                              <td className="px-5 py-2  border-b-2 border-blue-gray-50">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {items.first_name} {items.last_name}
                                </Typography>
                              </td>
                              <td className="px-5 py-2  border-b-2 border-blue-gray-50">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {items.username}
                                </Typography>
                              </td>
                              <td className="px-5 py-2  border-b-2 border-blue-gray-50">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {items.role_name}{" "}
                                </Typography>
                              </td>
                              <td className="px-5 py-2  border-b-2 border-blue-gray-50">
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
                                    className="
                                    relative w-11 h-6 rounded-full peer peer-checked:after:translate-x-full
                                    after:absolute after:top-[1px] after:start-[1px] after:bg-red-900  
                                    after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                  bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                                  ></div>
                                </label>
                              </td>
                              <td className="px-5 py-2 border-b-2 border-blue-gray-50 ">
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="text"
                                    size="sm"
                                    className="hover:bg-blue-200 text-white bg-blue-200"
                                    onClick={() =>
                                      handleOpenModalView(items.id)
                                    }
                                  >
                                    <svg
                                      width="24"
                                      height="18"
                                      viewBox="0 0 24 18"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M11.9613 0.199219C4.6875 0.199219 0.375 8.69922 0.375 8.69922C0.375 8.69922 4.6875 17.1992 11.9613 17.1992C19.0625 17.1992 23.375 8.69922 23.375 8.69922C23.375 8.69922 19.0625 0.199219 11.9613 0.199219ZM11.875 3.03255C15.0662 3.03255 17.625 5.58255 17.625 8.69922C17.625 11.8442 15.0662 14.3659 11.875 14.3659C8.7125 14.3659 6.125 11.8442 6.125 8.69922C6.125 5.58255 8.7125 3.03255 11.875 3.03255ZM11.875 5.86589C10.2937 5.86589 9 7.14089 9 8.69922C9 10.2576 10.2937 11.5326 11.875 11.5326C13.4563 11.5326 14.75 10.2576 14.75 8.69922C14.75 8.41588 14.635 8.16089 14.5775 7.90589C14.3475 8.35922 13.8875 8.69922 13.3125 8.69922C12.5075 8.69922 11.875 8.07589 11.875 7.28255C11.875 6.71589 12.22 6.26255 12.68 6.03588C12.4213 5.95089 12.1625 5.86589 11.875 5.86589Z"
                                        fill="white"
                                      />
                                    </svg>
                                  </Button>
                                  {authInfo.user.userPermissions.readUser ? (
                                    <Button
                                      variant="text"
                                      size="sm"
                                      className="hover:bg-blue-700 text-white bg-blue-700"
                                      onClick={() => handleOpenEdit(items)}
                                    >
                                      <svg
                                        width="17"
                                        height="16"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M12.375 0L10.375 2L14.375 6L16.375 4L12.375 0ZM8.375 4L0.375 12V16H4.375L12.375 8L8.375 4Z"
                                          fill="white"
                                        />
                                      </svg>
                                    </Button>
                                  ) : (
                                    <></>
                                  )}

                                  {authInfo.user.userPermissions.deleteUser ? (
                                    <Button
                                      variant="text"
                                      size="sm"
                                      className="hover:bg-red-900 text-white bg-red-900"
                                      onClick={() => handleOpenDelete(items.id)}
                                    >
                                      <svg
                                        width="16"
                                        height="18"
                                        viewBox="0 0 16 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M6.85891 0.910156C5.72928 0.910156 4.80503 1.85639 4.80503 3.0129H2.75115C1.62151 3.0129 0.697266 3.95913 0.697266 5.11564H15.0744C15.0744 3.95913 14.1502 3.0129 13.0206 3.0129H10.9667C10.9667 1.85639 10.0424 0.910156 8.91279 0.910156H6.85891ZM2.75115 7.21839V17.3326C2.75115 17.5639 2.91546 17.7321 3.14138 17.7321H12.6509C12.8768 17.7321 13.0411 17.5639 13.0411 17.3326V7.21839H10.9872V14.578C10.9872 15.1668 10.5354 15.6294 9.96027 15.6294C9.38518 15.6294 8.93333 15.1668 8.93333 14.578V7.21839H6.87945V14.578C6.87945 15.1668 6.42759 15.6294 5.85251 15.6294C5.27742 15.6294 4.82557 15.1668 4.82557 14.578V7.21839H2.77169H2.75115Z"
                                          fill="white"
                                        />
                                      </svg>
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </CardBody>
                <CardFooter className="flex items-center justify-between p-4">
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
      </>
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

      {/* add */}
      <Dialog open={open} handler={handleOpen} size="sm">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">Add New User</div>
          <div className="cursor-pointer mr-5" onClick={handleOpen}>
            X
          </div>
        </DialogHeader>

        <DialogBody className="h-[30rem]">
          <form
            onSubmit={handleadduser}
            className="grid gap-5 items-center w-11/12 mx-auto"
          >
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="email"
                label="First Name"
                size="lg"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="email"
                label="Last Name"
                size="lg"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="email"
                label="Email"
                size="lg"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
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
                placeholder="Mobile Number"
                className="rounded-l-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0",
                }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="w-full justify-self-center">
              <Select
                label="Gender"
                value={gender}
                onChange={(e) => {
                  setGender(e);
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
                value={role}
                onChange={(e) => {
                  setRole(e);
                }}
              >
                {roleData &&
                  roleData.map((items) => (
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
            <div className="space-x-2 flex justify-self-end">
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
                onClick={handleadduser}
              >
                Add User
              </Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>

      {/* Edit */}
      <Dialog open={openEdit} handler={handleOpenEdit} size="sm">
        <DialogHeader className="flex justify-between">
          <div className="text-xl ml-5">Update {firstNameEdit}'s account</div>
          <div className="cursor-pointer mr-5" onClick={handleOpenEdit}>
            X
          </div>
        </DialogHeader>

        <DialogBody className="h-[30rem]">
          <form
            onSubmit={handleEditAdmin}
            className="grid gap-5 items-center w-11/12  mx-auto"
          >
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="email"
                label="First Name"
                size="lg"
                value={firstNameEdit}
                onChange={(e) => {
                  setFirstNameEdit(e.target.value);
                }}
              />
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="email"
                label="Last Name"
                size="lg"
                value={lastNameEdit}
                onChange={(e) => {
                  setLastNameEdit(e.target.value);
                }}
              />
            </div>
            <div className="w-full justify-self-center">
              <Input
                type="text"
                id="email"
                label="Email"
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
                placeholder="Mobile Number"
                className="rounded-l-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0",
                }}
                value={phoneEdit}
                onChange={(e) => setPhoneEdit(e.target.value)}
              />
            </div>
            <div className="w-full justify-self-center">
              <Select
                label="Gender"
                value={genderEdit}
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
                value={roleEdit}
                onChange={(e) => {
                  setRoleEdit(e);
                }}
              >
                {roleData &&
                  roleData.map((items) => (
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

      {/* View */}
      {showModalView && (
        <div
          onClick={() => setShowModalView(false)}
          className="fixed z-20 inset-0 flex justify-center items-center bg-black bg-opacity-25 "
        >
          <Card
            onClick={handleModalClickView}
            className=" w-1/2 h-5/6 flex justify-center items-center bg-white rounded-md "
          >
            <button
              onClick={handleCloseModalView}
              className="text-black text-xl border-0 bg-white place-self-end mr-10 mb-5 cursor-pointer"
            >
              X
            </button>

            <CardBody className="flex flex-col gap-2 justify-center items-center border-b">
              <img
                src={avatarImage}
                alt="avatar"
                className="w-1/3 border rounded-full border-light-blue-700"
              />
              <h1 className="">
                {" "}
                {viewUser ? viewUser.first_name : ""}{" "}
                {viewUser ? viewUser.last_name : ""}
              </h1>
            </CardBody>
            <CardFooter className="mb-16">
              <ul className="grid justify-center items-center gap-5">
                <div className="flex gap-2 items-center">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <li>{viewUser ? viewUser.username : ""}</li>
                </div>
                <div className="flex gap-2 items-center ">
                  {viewUser ? (
                    viewUser.gender === "male" ? (
                      <FontAwesomeIcon icon={faPerson} />
                    ) : viewUser.gender === "female" ? (
                      <FontAwesomeIcon icon={faPersonDress} />
                    ) : (
                      "No gender"
                    )
                  ) : (
                    ""
                  )}
                  {/* <FontAwesomeIcon icon={faPerson} /> */}

                  <li>
                    {viewUser
                      ? viewUser.gender === "male"
                        ? "Male"
                        : viewUser.gender === "female"
                        ? "Female"
                        : "we don't know his gender :)"
                      : ""}
                  </li>
                </div>
                <div className="flex gap-2 items-center">
                  <FontAwesomeIcon icon={faTrophy} />
                  <li>
                    {viewUser
                      ? viewUser.role
                        ? viewUser.role
                        : "No role"
                      : ""}
                  </li>
                </div>
                <div className="flex gap-2 items-center">
                  {viewUser ? (
                    viewUser.status ? (
                      <FontAwesomeIcon icon={faPersonArrowUpFromLine} />
                    ) : (
                      <FontAwesomeIcon icon={faPersonArrowDownToLine} />
                    )
                  ) : (
                    ""
                  )}

                  <li>
                    {viewUser ? (viewUser.status ? "Active" : "Inactive") : ""}
                  </li>
                </div>
                <div className="flex gap-2 items-center">
                  <FontAwesomeIcon icon={faPhone} />
                  <li>{viewUser ? viewUser.phone : ""}</li>
                </div>
              </ul>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
export default Table;
