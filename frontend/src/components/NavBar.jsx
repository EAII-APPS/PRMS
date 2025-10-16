import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import MessageScreen from "../Chats/Chat";
import avatarImage from "../assets/EAII.png";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link } from "react-router-dom";
import axiosInistance from "../GlobalContexts/Base_url";
import instance from "../GlobalContexts/Base_url"

import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  PowerIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import { fetchLogo } from "../reduxToolKit/slices/settingSlice";
import CommonUtil from "../util/commonUtil";
import ServerUrl from "../api/serverUrl";
import SocketActions from "../lib/socketActions";
import { useAuth } from "../GlobalContexts/Auth-Context";

function MessageMenu({ unreadCounts, setUnreadCounts, markMessagesAsRead }) {
  const [isMenuOpenMessage, setIsMenuOpenMessage] = useState(false);
  const closeMessage = () => setIsMenuOpenMessage(true);

  return (
    <Menu
      open={isMenuOpenMessage}
      handler={setIsMenuOpenMessage}
      placement="bottom-end"
    >
      <div className="flex items-center gap-7">
        <MenuHandler>
          <button className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto" style={{ position: 'relative' }}>
            {Object.values(unreadCounts).some(count => count > 0) && (
              <span style={{
                backgroundColor: 'rgb(222, 8, 8)',
                color: 'white',
                borderRadius: '3px',
                padding: '3px',
                fontSize: '10px',
                position: 'absolute',
                top: '-10px', // Adjust this value as needed
                right: '-10px', // Adjust this value as needed
                zIndex: 1 // Ensure it appears above the SVG
              }}
                className="badge badge-danger ml-2">
                new
              </span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
          </button>
        </MenuHandler>
      </div>

      <MenuList>
        <MessageScreen markMessagesAsRead={markMessagesAsRead} setUnreadCounts={setUnreadCounts} />
      </MenuList>
    </Menu>
  );
}

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const authInfo = useAuth();

  const token = localStorage.getItem("access");

  const { t } = useTranslation();

  const closeMenu = () => setIsMenuOpen(false);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axiosInistance.get("/userApp/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const clearedFilters = { year: "", sector: "", division: "", kpi: "" };
      localStorage.setItem("filters", JSON.stringify(clearedFilters)); // Clear localStorage
      localStorage.clear(); // clears all localStorage keys
      navigate("/");
      localStorage.removeItem("refresh");
      localStorage.removeItem("access");
    } catch (error) { }
  };
  const handleMyprofile = () => {
    navigate("/Home/MyProfile");
  };
  const handleSetting = () => {
    navigate("/Home/Setting");
  };
  const handlePassword = () => {
    navigate("/Home/ChangePassword")
  }

  const [sectorDate, setSectorDate] = useState(null);
  const [divisionDate, setDivisionDate] = useState(null);
  const [refresh, setRefresh] = useState(false);
  // Fetch latest sector reminder
  const fetchLatestSectorReminder = () => {
    fetch(`${instance.defaults.baseURL}userApp/sector_reminders/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setSectorDate(data[0].submision_dateof_sector);
        } else {
          setSectorDate(null);
        }
      })
      .catch((error) => console.error("Error fetching sector reminders:", error));
  };

  // Fetch latest division reminder
  const fetchLatestDivisionReminder = () => {
    fetch(`${instance.defaults.baseURL}userApp/division_reminders/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setDivisionDate(data[0].submision_dateof_division);
        } else {
          setDivisionDate(null);
        }
      })
      .catch((error) => console.error("Error fetching division reminders:", error));
  };

  // Check if there's an active reminder
  const hasActiveReminder = sectorDate !== null || divisionDate !== null;
  // Fetch data on mount and when refresh state changes
  useEffect(() => {
    fetchLatestSectorReminder();
    fetchLatestDivisionReminder();
  }, [token, refresh]);


  const handleShow = () => {
    const currentState = localStorage.getItem("hideComponent") === "true";
    localStorage.setItem("hideComponent", currentState ? "false" : "true");
    window.dispatchEvent(new Event("storage")); // Ensure changes reflect immediately
  };


  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <div className="flex items-center gap-7 ">
        <div >
          {authInfo.user.userRole === "superadmin" ? (
            <div></div>
          ) : (
            <div>
              <a className="cursor-pointer" onClick={handleShow}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                  />
                </svg>
                {hasActiveReminder && (
                  <div className="absolute inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full top-4 dark:border-gray-900">
                    1
                  </div>
                )}
              </a>
            </div>
          )}

        </div>
        <MenuHandler>
          <button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1
          rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
          >
            {authInfo.user.photo ? (
              <Avatar
                variant="circular"
                size="sm"
                alt="Pp"
                className="border border-gray-900 p-0.5"
                src={authInfo.user.photo}
              />
            ) : (
              <FontAwesomeIcon
                className="border border-gray-900 p-2 rounded-full"
                icon={faUser}
              />
            )}

            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""
                }`}
            />
          </button>
        </MenuHandler>
      </div>
      <MenuList className="p-1">
        return (
        <MenuItem
          onClick={handleMyprofile}
          className="flex items-center gap-2 rounded hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
        >
          {React.createElement(UserCircleIcon, {
            className: `h-4 w-4 `,
            strokeWidth: 2,
          })}

          <Typography as="span" variant="small" className="font-normal">
            {t("MAIN.PROFILE.MYPROFILE")}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handleSetting}
          className="flex items-center gap-2 rounded hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
        >
          {React.createElement(SunIcon, {
            className: `h-4 w-4 `,
            strokeWidth: 2,
          })}

          <Typography as="span" variant="small" className="font-normal">
            {t("MAIN.PROFILE.SETTING")}
          </Typography>
        </MenuItem>
        {/* <Link to={`/Home/ChangePassword`}> */}
        <MenuItem
          onClick={handlePassword}
          className="flex items-center border-none gap-2 rounded  hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
        >
          <FontAwesomeIcon icon={faLock} />

          <Typography as="span" variant="small" className="font-normal">
            {t("MAIN.PROFILE.CHANGE_PASSWORD")}
          </Typography>
        </MenuItem>
        {/* </Link> */}
        <MenuItem
          onClick={handleLogout}
          className="flex text-red-500 hover:text-red-500 active:text-red-500 focus:text-red-500 items-center gap-2 rounded  hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
        >
          {React.createElement(PowerIcon, {
            className: `h-4 w-4 `,
            strokeWidth: 2,
          })}

          <Typography as="span" variant="small" className="font-normal">
            {t("MAIN.PROFILE.SIGNOUT")}
          </Typography>
        </MenuItem>
        );
      </MenuList>
    </Menu>
  );
}

function NavBar({ onSidebarToggle }) {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = useRef(null);
  const loggedInUserId = CommonUtil.getUserId();
  const authInfo = useAuth();
  useEffect(() => {
    socketRef.current = new WebSocket(
      `${ServerUrl.WS_BASE_URL}ws/users/${loggedInUserId}/chat/`
    );

    socketRef.current.onopen = () => {
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === SocketActions.MESSAGE && data.user !== loggedInUserId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.roomId]: (prev[data.roomId] || 0) + 1,
        }));
      }
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [loggedInUserId]);

  const markMessagesAsRead = (roomId) => {
    socketRef.current.send(
      JSON.stringify({
        action: "markAsRead",
        roomId: roomId,
        user: loggedInUserId,
      })
    );

    setUnreadCounts((prev) => ({
      ...prev,
      [roomId]: 0,
    }));
  };

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("en"); // Default selected option

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    toggleDropdown(); // Close the dropdown after selecting an option
  };

  const handleAmharic = () => {
    i18next.changeLanguage("am");
    setIsOpen(false);
  };
  const handleEnglish = () => {
    i18next.changeLanguage("en");
    setIsOpen(false);
  };
  const handleOromifa = () => {
    i18next.changeLanguage("oro");
    setIsOpen(false);
  };
  // const handleOromic = () => {
  //   i18next.changeLanguage("oro");
  //   setIsOpen(false);
  // };
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { logo } = useSelector((state) => state.setting);

  useEffect(() => {
    dispatch(fetchLogo());
  }, []);


  return (
    <div className="w-full h-16  rounded-none bg-gray-50 fixed z-10 border-l-2">
      <div className="flex items-center   justify-between text-blue-gray-900">
        <div className="flex gap-3 mt-2  items-center justify-center">
          <a onClick={onSidebarToggle}>
            <FontAwesomeIcon icon={faBars} className="cursor-pointer ml-10" />
          </a>
          <img src={logo} alt="PRMS logo" className="w-12 ml-3" />
          <h1 className=" mr-10 font-bold text-black text-lg">
            {t("MAIN.TITLE")}
          </h1>
        </div>
        <div className="flex gap-3 mt-3 2xl:scale-75 2xl:right-0 2xl:mr-0 mr-7 justify-center items-center relative">
          <Menu open={isOpen} handler={setIsOpen} placement="bottom-end">
            <div className="flex items-center gap-7 ">
              <MenuHandler>
                <button
                  variant="text"
                  color="blue-gray"
                  className="flex items-center gap-1
          rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
                >
                  <FontAwesomeIcon icon={faGlobe} className="w-5 h-5" />

                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </MenuHandler>
            </div>
            <MenuList className="">
              return (
              <MenuItem
                onClick={handleAmharic}
                className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
              >
                <Typography as="span" variant="small" className="font-normal">
                  አማርኛ
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={handleEnglish}
                className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
              >
                <Typography as="span" variant="small" className="font-normal">
                  English
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={handleOromifa}
                className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
              >
                <Typography as="span" variant="small" className="font-normal">
                  Oromifa
                </Typography>
              </MenuItem>
              );
            </MenuList>
          </Menu>
          <MessageMenu
            unreadCounts={unreadCounts}
            setUnreadCounts={setUnreadCounts}
            markMessagesAsRead={markMessagesAsRead}
          />
          <ProfileMenu />
          <div className="px-2 text-sm font-bold text-gray-900 dark:text-white">
            <div className="truncate">{authInfo.user.first_name} <p className=" inline text-blue-gray-500">{authInfo.user.last_name}</p> </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}
export default NavBar;
