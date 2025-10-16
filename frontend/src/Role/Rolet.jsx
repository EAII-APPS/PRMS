import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axiosInstance from "../GlobalContexts/Base_url";
import {
  deleteSelectedRoleData,
  fetchRoleData,
} from "../reduxToolKit/slices/roleSlice";
import { fetchPermissionData } from "../reduxToolKit/slices/permissionSlice";
import "./Scrollbar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";

function Roletable() {
  const { t } = useTranslation();

  const authInfo = useAuth();

  const dispatch = useDispatch();

  //fetch role data
  const { roleData } = useSelector((state) => state.role);

  useEffect(() => {
    dispatch(fetchRoleData());
  }, []);

  //fetch permissionData data
  const { permissionData } = useSelector((state) => state.permission);

  useEffect(() => {
    dispatch(fetchPermissionData());
  }, []);

  //delete role data
  const [selectedId, setSelectedId] = useState(null);

  const [selectedName, setSelectedNme] = useState("");

  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = (roleId, roleName) => {
    setSelectedId(roleId);

    setSelectedNme(roleName);

    setOpenDelete(!openDelete);
  };

  const handleDelete = async () => {
    dispatch(deleteSelectedRoleData(selectedId));

    setOpenDelete(!openDelete);

    toast.success(`Role Deleted successfully`, {
      autoClose: 2000,
      hideProgressBar: true,
    });
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

  const [selectedItems, setSelectedItems] = useState(new Set());

  //admin toggle
  const [adminToggle, setAdminToggle] = useState(false);

  const handleAdminToggle = () => {
    setAdminToggle(!adminToggle);
    if (permissionData && permissionData.Admin) {
      const adminIds = new Set(permissionData.Admin.map((item) => item.id));
      if (!adminToggle) {
        setSelectedItems(
          (prevSelectedItems) => new Set([...prevSelectedItems, ...adminIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          adminIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //user toggle
  const [userToggle, setUserToggle] = useState(false);

  const handleUserToggle = () => {
    setUserToggle(!userToggle);
    if (permissionData && permissionData.User) {
      const userIds = new Set(permissionData.User.map((item) => item.id));
      if (!userToggle) {
        setSelectedItems(
          (prevSelectedItems) => new Set([...prevSelectedItems, ...userIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          userIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //role toggle
  const [roleToggle, setRoleToggle] = useState(false);

  const handleRoleToggle = () => {
    setRoleToggle(!roleToggle);
    if (permissionData && permissionData.Role) {
      const roleIds = new Set(permissionData.Role.map((item) => item.id));
      if (!roleToggle) {
        setSelectedItems(
          (prevSelectedItems) => new Set([...prevSelectedItems, ...roleIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          roleIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //chat toggle
  const [chatToggle, setChatToggle] = useState(false);

  const handleChatToggle = () => {
    setChatToggle(!chatToggle);
    if (permissionData && permissionData.Chat) {
      const chatIds = new Set(permissionData.Chat.map((item) => item.id));
      if (!chatToggle) {
        setSelectedItems(
          (prevSelectedItems) => new Set([...prevSelectedItems, ...chatIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          chatIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //notification toggle
  const [notificationToggle, setNotificationToggle] = useState(false);

  const handleNotificationToggle = () => {
    setNotificationToggle(!notificationToggle);
    if (permissionData && permissionData.Notification) {
      const notificationIds = new Set(
        permissionData.Notification.map((item) => item.id)
      );
      if (!notificationToggle) {
        setSelectedItems(
          (prevSelectedItems) =>
            new Set([...prevSelectedItems, ...notificationIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          notificationIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //monitoring toggle
  const [monitoringToggle, setMonitoringToggle] = useState(false);

  const handleMonitoringToggle = () => {
    setMonitoringToggle(!monitoringToggle);
    if (permissionData && permissionData.Monitoring) {
      const monitoringIds = new Set(
        permissionData.Monitoring.map((item) => item.id)
      );
      if (!monitoringToggle) {
        setSelectedItems(
          (prevSelectedItems) =>
            new Set([...prevSelectedItems, ...monitoringIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          monitoringIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //sector toggle
  const [sectorToggle, setSectorToggle] = useState(false);

  const handleSectorToggle = () => {
    setSectorToggle(!sectorToggle);
    if (permissionData && permissionData.Sector) {
      const sectorIds = new Set(permissionData.Sector.map((item) => item.id));
      if (!sectorToggle) {
        setSelectedItems(
          (prevSelectedItems) => new Set([...prevSelectedItems, ...sectorIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          sectorIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //division toggle
  const [divisionToggle, setDivisionToggle] = useState(false);

  const handleDivisionToggle = () => {
    setDivisionToggle(!divisionToggle);
    if (permissionData && permissionData.Division) {
      const divisionIds = new Set(
        permissionData.Division.map((item) => item.id)
      );
      if (!divisionToggle) {
        setSelectedItems(
          (prevSelectedItems) => new Set([...prevSelectedItems, ...divisionIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          divisionIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //strategicGoal toggle
  const [strategicGoalToggle, setStrategicGoalToggle] = useState(false);

  const handleStrategicGoalToggle = () => {
    setStrategicGoalToggle(!strategicGoalToggle);
    if (permissionData && permissionData.Goal) {
      const strategicGoalIds = new Set(
        permissionData.Goal.map((item) => item.id)
      );
      if (!strategicGoalToggle) {
        setSelectedItems(
          (prevSelectedItems) =>
            new Set([...prevSelectedItems, ...strategicGoalIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          strategicGoalIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //mainActivity toggle
  const [mainActvityToggle, setMainActvityToggle] = useState(false);

  const handleMainActvityToggle = () => {
    setMainActvityToggle(!mainActvityToggle);
    if (permissionData && permissionData.Activity) {
      const mainActvityIds = new Set(
        permissionData.Activity.map((item) => item.id)
      );
      if (!mainActvityToggle) {
        setSelectedItems(
          (prevSelectedItems) =>
            new Set([...prevSelectedItems, ...mainActvityIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          mainActvityIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //kpi toggle
  const [kpiToggle, setKpiToggle] = useState(false);

  const handleKpiToggle = () => {
    setKpiToggle(!kpiToggle);
    if (permissionData && permissionData.Kpi) {
      const kpiIds = new Set(permissionData.Kpi.map((item) => item.id));
      if (!kpiToggle) {
        setSelectedItems(
          (prevSelectedItems) => new Set([...prevSelectedItems, ...kpiIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          kpiIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //measure toggle
  const [measureToggle, setMeasureToggle] = useState(false);

  const handleMeasureToggle = () => {
    setMeasureToggle(!measureToggle);
    if (permissionData && permissionData.Measure) {
      const measureIds = new Set(permissionData.Measure.map((item) => item.id));
      if (!measureToggle) {
        setSelectedItems(
          (prevSelectedItems) => new Set([...prevSelectedItems, ...measureIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          measureIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //assign strategic goal toggle
  const [assignToggle, setAssignToggle] = useState(false);

  const handleAssignToggle = () => {
    setAssignToggle(!assignToggle);
    if (permissionData && permissionData.Assign) {
      const assignIds = new Set(permissionData.Assign.map((item) => item.id));
      if (!assignToggle) {
        setSelectedItems(
          (prevSelectedItems) => new Set([...prevSelectedItems, ...assignIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          assignIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  // Assign Main Goal Toggle
  const [assignMainGoalToggle, setAssignMainGoalToggle] = useState(false);
  const handleAssignMainGoalToggle = () => {
    setAssignMainGoalToggle(!assignMainGoalToggle);
    if (permissionData && permissionData.Main) {
      const mainGoalIds = new Set(permissionData.Main.map((item) => item.id));
      setSelectedItems((prevSelectedItems) => {
        const newSelectedItems = new Set(prevSelectedItems);
        if (!assignMainGoalToggle) {
          mainGoalIds.forEach((id) => newSelectedItems.add(id));
        } else {
          mainGoalIds.forEach((id) => newSelectedItems.delete(id));
        }
        return newSelectedItems;
      });
    }
  };

  // Assign KPIs Toggle
  const [assignKpisToggle, setAssignKpisToggle] = useState(false);
  const handleAssignKpisToggle = () => {
    setAssignKpisToggle(!assignKpisToggle);
    if (permissionData && permissionData.Track) {
      const kpisIds = new Set(permissionData.Track.map((item) => item.id));
      setSelectedItems((prevSelectedItems) => {
        const newSelectedItems = new Set(prevSelectedItems);
        if (!assignKpisToggle) {
          kpisIds.forEach((id) => newSelectedItems.add(id));
        } else {
          kpisIds.forEach((id) => newSelectedItems.delete(id));
        }
        return newSelectedItems;
      });
    }
  };

  //summary toggle
  const [summaryToggle, setSummaryToggle] = useState(false);

  const handleSummaryToggle = () => {
    setSummaryToggle(!summaryToggle);
    if (permissionData && permissionData.Summmary) {
      const summaryIds = new Set(
        permissionData.Summmary.map((item) => item.id)
      );
      if (!summaryToggle) {
        setSelectedItems(
          (prevSelectedItems) => new Set([...prevSelectedItems, ...summaryIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          summaryIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  //description toggle
  const [descriptionToggle, setDescriptionToggle] = useState(false);

  const handleDescriptionToggle = () => {
    setDescriptionToggle(!descriptionToggle);
    if (permissionData && permissionData.Description) {
      const descriptionIds = new Set(
        permissionData.Description.map((item) => item.id)
      );
      if (!descriptionToggle) {
        setSelectedItems(
          (prevSelectedItems) =>
            new Set([...prevSelectedItems, ...descriptionIds])
        );
      } else {
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = new Set(prevSelectedItems);
          descriptionIds.forEach((id) => newSelectedItems.delete(id));
          return newSelectedItems;
        });
      }
    }
  };

  const handleCheckBoxThree = (itemId) => {
    const isSelected = selectedItems.has(itemId); // Check if the item is already selected

    if (isSelected) {
      // Item is selected, remove it
      const newSelectedItems = new Set(selectedItems);

      newSelectedItems.delete(itemId);

      setSelectedItems(newSelectedItems);
    } else {
      // Item is not selected, add it
      setSelectedItems(new Set([...selectedItems, itemId]));
    }
  };
  //create new Role
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const [newRole, setNewRole] = useState("");
  const token = localStorage.getItem("access");

  const handleCreateRole = async (e) => {
    e.preventDefault();

    const permission_id = Array.from(selectedItems);
    const name = newRole;

    try {
      await axiosInstance.post(
        "/roleApp/roles/",
        {
          name,
          permission_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpen(!open);

      toast.success(`New Role added successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });

      dispatch(fetchRoleData());

      setNewRole("");

      setSelectedItems(new Set());

      setAdminToggle(false);

      setUserToggle(false);

      setRoleToggle(false);

      setChatToggle(false);

      setNotificationToggle(false);

      setMonitoringToggle(false);

      setSectorToggle(false);

      setDivisionToggle(false);

      setStrategicGoalToggle(false);

      setMainActvityToggle(false);

      setKpiToggle(false);

      setDescriptionToggle(false);

      setSummaryToggle(false);

      setMeasureToggle(false);

    } catch (error) {
    }
  };

  //edit
  const [editRole, setEditRole] = useState("");

  const [openEdit, setOpenEdit] = useState(false);

  const [roleId, setRoleId] = useState(false);

  const [selectedEditItems, setSelectedEditItems] = useState([]);

  const handleCheckBoxEdit = (itemId) => {
    setSelectedEditItems((prevSelectedEditItems) => {
      if (prevSelectedEditItems.includes(itemId)) {
        return prevSelectedEditItems.filter((item) => item !== itemId);
      } else {
        return [...prevSelectedEditItems, itemId];
      }
    });
  };

  const handleOpenEdit = (item) => {
    setOpenEdit(!openEdit);

    setEditRole(item.name);

    setRoleId(item.id);

    setSelectedEditItems(item.permission_id);
  };
  const handleEditRole = async () => {
    try {
      await axiosInstance.put(
        `/roleApp/roles/${roleId}/`,
        {
          name: editRole,
          permission_id: selectedEditItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpenEdit(false);

      dispatch(fetchRoleData());

      toast.success(`Role Updated successfully`, {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {}
  };

  //pagination

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const calculateTotalPages = () => {
      setTotalPages(Math.ceil(roleData ? roleData.length / itemsPerPage : []));
    };
    calculateTotalPages();
  }, [roleData, itemsPerPage]);

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

  const currentPageData = roleData
    ? roleData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  return (
    <>
      {authInfo ? (
        <>
          <div className="grid gap-3 items-center">
            <p className="text-base font-bold font-sans">
              {t("MAIN.SIDEBAR.ROLE.TITLE")}
            </p>
            <ToastContainer />
            <Card className="rounded-md overflow-auto scrollbar">
              <CardHeader
                floated={false}
                shadow={false}
                className="rounded-none"
              >
                <div className="flex items-center justify-between mt-5">
                  <div>
                    <div className="w-full">
                      <Input
                        color="blue"
                        label={t("MAIN.TABLE.SEARCH")}
                        icon={
                          <MagnifyingGlassIcon className="h-5 w-5 cursor-pointer hover:text-light-blue-700" />
                        }
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    {authInfo.user.userPermissions.includes("createRole") ? (
                      <Button
                        variant="text"
                        size="sm"
                        onClick={handleOpen}
                        className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        {t("MAIN.SIDEBAR.ROLE.ADDBUTTON")}
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
                  <tbody className="bg-white ">
                    {roleData &&
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
                                  "updateRole"
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
                </div>{" "}
              </CardFooter>
            </Card>
          </div>
        </>
      ) : (
        <div></div>
      )}
      {/* add */}

      <Dialog open={open} size="xl" handler={handleOpen} className="">
        <DialogHeader className="flex justify-between">
          <div></div>
          <div className="cursor-pointer mr-5" onClick={handleOpen}>
            X
          </div>
        </DialogHeader>
        <form onSubmit={handleCreateRole}>
          <div className="flex gap-5 ml-10 items-center pb-5">
            <div className="">
              <h1 className="text-lg text-black font-bold">New Role</h1>
            </div>
            <div className="w-3/5">
              <Input
                type="text"
                id="name"
                label="Role"
                size="lg"
                required
                value={newRole}
                onChange={(e) => {
                  setNewRole(e.target.value);
                }}
              />
            </div>
          </div>
          <DialogBody className="h-[25rem]  overflow-y-scroll scrollbar">
            <div className="xl:grid grid-cols-3 sm:flex flex-col gap-10">
              {permissionData && permissionData.Admin && (
                <Card className="">
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Admin</div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={adminToggle}
                          onChange={handleAdminToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>

                  <div>
                    {permissionData &&
                      permissionData.Admin &&
                      permissionData.Admin.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.User && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">User</div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userToggle}
                          onChange={handleUserToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.User &&
                      permissionData.User.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Role && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Role</div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleToggle}
                          onChange={handleRoleToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Role &&
                      permissionData.Role.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Chat && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Chat</div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={chatToggle}
                          onChange={handleChatToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Chat &&
                      permissionData.Chat.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Notification && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Notification
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationToggle}
                          onChange={handleNotificationToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div className="grid gap-3 justify-center items-center"></div>
                  <div>
                    {permissionData &&
                      permissionData.Notification &&
                      permissionData.Notification.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Monitoring && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Monitoring
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={monitoringToggle}
                          onChange={handleMonitoringToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Monitoring &&
                      permissionData.Monitoring.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Division && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Division</div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={divisionToggle}
                          onChange={handleDivisionToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Division &&
                      permissionData.Division.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Sector && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Sector</div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sectorToggle}
                          onChange={handleSectorToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Sector &&
                      permissionData.Sector.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Goal && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Strategic Goal
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={strategicGoalToggle}
                          onChange={handleStrategicGoalToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Goal &&
                      permissionData.Goal.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Activity && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Main Activity
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mainActvityToggle}
                          onChange={handleMainActvityToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Activity &&
                      permissionData.Activity.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Kpi && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Kpi</div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={kpiToggle}
                          onChange={handleKpiToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Kpi &&
                      permissionData.Kpi.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Description && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Kpi Description
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={descriptionToggle}
                          onChange={handleDescriptionToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Description &&
                      permissionData.Description.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Measure && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Measure</div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={measureToggle}
                          onChange={handleMeasureToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Measure &&
                      permissionData.Measure.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Summmary && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Summary</div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={summaryToggle}
                          onChange={handleSummaryToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Summmary &&
                      permissionData.Summmary.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Assign && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Assign Strategic Goal
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={assignToggle}
                          onChange={handleAssignToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Assign &&
                      permissionData.Assign.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}

              {permissionData && permissionData.Main && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Assign main Goal
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={assignMainGoalToggle}
                          onChange={handleAssignMainGoalToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Main &&
                      permissionData.Main.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}

              {permissionData && permissionData.Track && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Assign kpis
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={assignKpisToggle}
                          onChange={handleAssignKpisToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                                rounded-full peer 
                                peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                                after:start-[1px] after:bg-red-900  
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Track &&
                      permissionData.Track.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxThree(items.id)}
                                checked={selectedItems.has(items.id)}
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
            </div>
          </DialogBody>
          <DialogFooter className="space-x-2">
            <Button
              variant="text"
              color="red"
              size="md"
              onClick={handleOpen}
              className="mr-1 normal-case"
            >
              Cancel
            </Button>
            <Button
              variant="text"
              size="md"
              onClick={handleCreateRole}
              className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
            >
              Add Role
            </Button>
          </DialogFooter>
        </form>
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

      {/* roleedit */}

      <Dialog open={openEdit} size="xl" handler={handleOpenEdit} className="">
        <DialogHeader className="flex justify-between">
          <div></div>
          <div className="cursor-pointer mr-5" onClick={handleOpenEdit}>
            X
          </div>
        </DialogHeader>
        <form onSubmit={handleEditRole}>
          <div className="flex gap-5 ml-10 items-center pb-5">
            <div className="">
              <h1 className="text-lg text-black font-bold">Role</h1>
            </div>
            <div className="w-3/5">
              <Input
                type="text"
                id="name"
                label="Role"
                color="blue"
                size="lg"
                required
                value={editRole}
                onChange={(e) => {
                  setEditRole(e.target.value);
                }}
              />
            </div>
          </div>
          <DialogBody className="h-[25rem]  overflow-y-scroll scrollbar">
            <div className="xl:grid grid-cols-3 sm:flex flex-col gap-10">
              {permissionData && permissionData.Admin && (
                <Card className="">
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Admin</div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={adminToggle}
                          onChange={handleAdminToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>

                  <div>
                    {permissionData &&
                      permissionData.Admin &&
                      permissionData.Admin.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.User && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">User</div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userToggle}
                          onChange={handleUserToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.User &&
                      permissionData.User.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Role && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Role</div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roleToggle}
                          onChange={handleRoleToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Role &&
                      permissionData.Role.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Chat && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Chat</div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={chatToggle}
                          onChange={handleChatToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Chat &&
                      permissionData.Chat.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Notification && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Notification
                    </div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationToggle}
                          onChange={handleNotificationToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div className="grid gap-3 justify-center items-center"></div>
                  <div>
                    {permissionData &&
                      permissionData.Notification &&
                      permissionData.Notification.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Monitoring && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Monitoring
                    </div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={monitoringToggle}
                          onChange={handleMonitoringToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Monitoring &&
                      permissionData.Monitoring.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Division && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Division</div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={divisionToggle}
                          onChange={handleDivisionToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Division &&
                      permissionData.Division.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Sector && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Sector</div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sectorToggle}
                          onChange={handleSectorToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Sector &&
                      permissionData.Sector.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Goal && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Strategic Goal
                    </div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={strategicGoalToggle}
                          onChange={handleStrategicGoalToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Goal &&
                      permissionData.Goal.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Activity && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Main Activity
                    </div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mainActvityToggle}
                          onChange={handleMainActvityToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Activity &&
                      permissionData.Activity.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Kpi && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Kpi</div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={kpiToggle}
                          onChange={handleKpiToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Kpi &&
                      permissionData.Kpi.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Description && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Kpi Description
                    </div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={descriptionToggle}
                          onChange={handleDescriptionToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Description &&
                      permissionData.Description.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Measure && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Measure</div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={measureToggle}
                          onChange={handleMeasureToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Measure &&
                      permissionData.Measure.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Summmary && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">Summary</div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={summaryToggle}
                          onChange={handleSummaryToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Summmary &&
                      permissionData.Summmary.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Assign && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Assign Strategic Goal
                    </div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={assignToggle}
                          onChange={handleAssignToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Assign &&
                      permissionData.Assign.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Main && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Assign Main Goal
                    </div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={MainToggle}
                          onChange={handleMainToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Main &&
                      permissionData.Main.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
              {permissionData && permissionData.Track && (
                <Card>
                  <div className="flex justify-between m-5">
                    <div className="text-lg text-black font-bold">
                      Assign KPI 
                    </div>
                    <div>
                      {/* <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={TrackToggle}
                          onChange={handleTrackToggle}
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-11 h-6
                           rounded-full peer 
                           peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
                           after:start-[1px] after:bg-red-900  
                           after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
                        ></div>
                      </label> */}
                    </div>
                  </div>
                  <div>
                    {permissionData &&
                      permissionData.Track &&
                      permissionData.Track.map((items) => (
                        <ul
                          key={items.id}
                          className="flex flex-col gap-3 justify-center pb-2"
                        >
                          <li className="flex items-center text-center h-7">
                            <span className="">
                              <Checkbox
                                onClick={() => handleCheckBoxEdit(items.id)}
                                checked={
                                  selectedEditItems &&
                                  selectedEditItems.includes(items.id)
                                }
                                color="blue"
                              />
                            </span>
                            <Typography className="font-sans text-black font-bold text-sm">
                              {items.name}
                            </Typography>
                          </li>
                        </ul>
                      ))}
                  </div>
                </Card>
              )}
            </div>
          </DialogBody>
          <DialogFooter className="space-x-2">
            <Button
              variant="text"
              color="red"
              size="md"
              onClick={handleOpenEdit}
              className="mr-1 normal-case"
            >
              Cancel
            </Button>
            <Button
              variant="text"
              size="md"
              onClick={handleEditRole}
              className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case"
            >
              Edit Role
            </Button>
          </DialogFooter>
        </form>
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
export default Roletable;
