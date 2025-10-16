import React, { useEffect, useState } from "react";
import "./Scrollbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faChartColumn } from "@fortawesome/free-solid-svg-icons";
import { faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import { TbRulerMeasure } from "react-icons/tb";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useTranslation } from "react-i18next";
import Loader from "react-js-loader";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function SideBar({ height, maxHeight }) {
  const { t } = useTranslation();

  const authInfo = useAuth();

  // const error = useAuth();

  const [open, setOpen] = useState(0);

  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    if (window.innerWidth >= 1024) {
      return true;
    } else if (window.innerWidth <= 910) {
      return false;
    } else {
      return true;
    }
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarVisible(true);
      } else if (window.innerWidth <= 910) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarVisible((prevIsSidebarVisible) => {
      return prevIsSidebarVisible === undefined ? true : !prevIsSidebarVisible;
    });
  };

  const handleInnerCLick = () => {
    if (window.innerWidth <= 910) {
      setIsSidebarVisible(false);
    }
  };

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const color = "#33AFFF";

  return (
    <>
      {authInfo ? (
        <div className="flex bg-blue-gray-50 w-full  " style={{ zoom: 0.9 }}>
          <Card
            className={`h-${height} h-[${maxHeight}] w-full max-w-[18rem] pt-4 pl-4 pr-0 rounded-none shadow-xl shadow-blue-gray-100 overflow-y-auto scrollbar fixed z-10 h-full bg-gray-50 border-t-2 ${isSidebarVisible ? "block" : "hidden"
              }`}
          >
            <List className="mt-16 mr-0 ">
              <Link to={`/Home/Dashboard`}>
                <Accordion open={open === 1} onClick={() => handleOpen(1)}>
                  <ListItem className="p-0 2xl:origin-left w-full  pr-0  2xl:left-0 2xl:m-0" selected={open === 1}>
                    <AccordionHeader className="border-b-0 2xl:scale-90 left-0 p-0 -ml-3 w-full pl-3 pt-3 pb-3  hover:text-light-blue-700">
                      <ListItemPrefix>
                        <FontAwesomeIcon icon={faChartColumn} />
                      </ListItemPrefix>
                      <Typography className="mr-auto font-custom text-lg font-light">
                        {t("MAIN.SIDEBAR.DASHBOARD")}
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                </Accordion>
              </Link>
              <Accordion

                open={open === 2}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""
                      }`}
                  />
                }
              >
                {authInfo.user.userPermissions.includes("readUser") ||
                  authInfo.user.userPermissions.includes("readAdmin") ? (
                  <ListItem className="p-0 2xl:origin-left w-full  pr-0  2xl:left-0 2xl:m-0" selected={open === 2}>
                    <AccordionHeader
                      onClick={() => handleOpen(2)}
                      className="border-b-0 2xl:scale-90 left-0 p-0 -ml-3 w-full pl-3 pt-3 pb-3  hover:text-light-blue-700"
                    >
                      <ListItemPrefix>
                        <FontAwesomeIcon icon={faTableCellsLarge} />
                      </ListItemPrefix>
                      <Typography className="mr-auto font-normal">
                        {t("MAIN.SIDEBAR.UMS.UMS")}
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                ) : (
                  <div></div>
                )}

                <AccordionBody className="py-1">
                  <List className="p-0 2xl:scale-90 2xl:origin-left  2xl:left-0 2xl:m-0">
                    {authInfo.user.userPermissions.includes("readUser") ||
                      authInfo.user.userPermissions.includes("readAdmin") ? (
                      <Link to={`/Home/Admin`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700  focus:text-light-blue-700 active:text-light-blue-700"
                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t("MAIN.SIDEBAR.UMS.USER.USER")}
                        </ListItem>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                  </List>
                </AccordionBody>
              </Accordion>
              <Accordion
                open={open === 3}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 3 ? "rotate-180" : ""
                      }`}
                  />
                }
              >
                {authInfo.user.userPermissions.includes("readRole") ? (

                  <ListItem className="p-0 2xl:origin-left w-full  pr-0  2xl:left-0 2xl:m-0" selected={open === 3}>
                    <AccordionHeader
                      onClick={() => handleOpen(3)}
                      className="border-b-0 2xl:scale-90 left-0 p-0 -ml-3 w-full pl-3 pt-3 pb-3  hover:text-light-blue-700"
                    >
                      <ListItemPrefix>
                        <FontAwesomeIcon icon={faTrophy} />{" "}
                      </ListItemPrefix>
                      <Typography className="mr-auto font-normal">
                        {t("MAIN.SIDEBAR.ROLE.ROLE")}
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                ) : (
                  <div></div>
                )}

                <AccordionBody className="py-1">
                  <List className="p-0 2xl:scale-90 2xl:origin-left  2xl:left-0 2xl:m-0">
                    <Link to={`/Home/Role`}>
                      <ListItem
                        onClick={() => {
                          handleInnerCLick();
                        }}
                        className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700 "
                      >
                        <ListItemPrefix>
                          <svg
                            width="4"
                            height="5"
                            viewBox="0 0 4 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              y="0.5"
                              width="4"
                              height="4"
                              rx="2"
                              fill="#94A3B8"
                            />
                          </svg>
                        </ListItemPrefix>
                        {t("MAIN.SIDEBAR.ROLE.ROLE")}
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
              <Accordion
                open={open === 9}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 9 ? "rotate-180" : ""
                      }`}
                  />
                }
              >


                <ListItem className="p-0 2xl:origin-left w-full  pr-0  2xl:left-0 2xl:m-0" selected={open === 9}>
                  <AccordionHeader
                    onClick={() => handleOpen(9)}
                    className="border-b-0 2xl:scale-90 left-0 p-0 -ml-3 w-full pl-3 pt-3 pb-3  hover:text-light-blue-700"
                  >
                    <ListItemPrefix>
                      <TbRulerMeasure />
                    </ListItemPrefix>
                    <Typography className="mr-auto font-normal">
                      {t(
                        "MAIN.SIDEBAR.MEASUREMENTMANAGEMENT.MEASUREMENTMANAGEMENT"
                      )}
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0 2xl:scale-90 2xl:origin-left  2xl:left-0 2xl:m-0">
                    <Link to={`/Home/MeasureManagement`}>
                      <ListItem className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700">
                        <ListItemPrefix>
                          <svg
                            width="4"
                            height="5"
                            viewBox="0 0 4 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              y="0.5"
                              width="4"
                              height="4"
                              rx="2"
                              fill="#94A3B8"
                            />
                          </svg>
                        </ListItemPrefix>
                        {t(
                          "MAIN.SIDEBAR.MEASUREMENTMANAGEMENT.MEASUREMENT.MEASUREMENT"
                        )}
                      </ListItem>
                    </Link>

                    <Link to={`/Home/Unite`}>
                      <ListItem className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700">
                        <ListItemPrefix>
                          <svg
                            width="4"
                            height="5"
                            viewBox="0 0 4 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              y="0.5"
                              width="4"
                              height="4"
                              rx="2"
                              fill="#94A3B8"
                            />
                          </svg>
                        </ListItemPrefix>
                        {t("MAIN.SIDEBAR.MEASUREMENTMANAGEMENT.UNITE.UNITE")}
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
              <Accordion
                open={open === 4}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 4 ? "rotate-180" : ""
                      }`}
                  />
                }
              >
                <ListItem className="p-0 2xl:origin-left w-full  pr-0  2xl:left-0 2xl:m-0" selected={open === 4}>
                  <AccordionHeader
                    onClick={() => handleOpen(4)}
                    className="border-b-0 2xl:scale-90 left-0 p-0 -ml-3 w-full pl-3 pt-3 pb-3  hover:text-light-blue-700"
                  >
                    <ListItemPrefix className="">
                      <FontAwesomeIcon icon={faCircleDot} />{" "}
                    </ListItemPrefix>
                    <Typography className="mr-auto font-normal">
                      {t("MAIN.SIDEBAR.PLAN.PLAN")}
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0 pt-0 mt-0 top-0 2xl:scale-90 2xl:origin-left 2xl:left-0 2xl:m-0">
                    {authInfo.user.userPermissions.includes(
                      "readStrategicGoal"
                    ) ? (
                      <Link to={`/Home/StrategicGoal`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700 !mt-0 !pt-0 focus:text-light-blue-700 active:text-light-blue-700"                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t("MAIN.SIDEBAR.PLAN.STRATEGIC_GOAL.STRATEGIC_GOAL")}
                        </ListItem>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                    {authInfo.user.userPermissions.includes(
                      "readMainActivity"
                    ) ? (
                      <Link to={`/Home/MainGoal`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700 "
                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t("MAIN.SIDEBAR.PLAN.MAIN_GOAL.MAIN_GOAL")}
                        </ListItem>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                    {authInfo.user.userPermissions.includes("readKpi") ? (
                      <Link to={`/Home/kpiall`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700 "
                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t("MAIN.SIDEBAR.PLAN.KPIALL.KPI")}
                        </ListItem>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                    {authInfo.user.userPermissions.includes("readKpi") ? (
                      <Link to={`/Home/Kpi3`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700 "
                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t("MAIN.SIDEBAR.PLAN.KPI3.KPI")}
                        </ListItem>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                    {authInfo.user.userPermissions.includes("readKpi") ? (
                      <Link to={`/Home/Kpi`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700 "
                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t("MAIN.SIDEBAR.PLAN.KPI.KPI")}
                        </ListItem>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                    {/* {authInfo.user.userPermissions.includes("readMeasure") ? (
                      <Link to={`/Home/Measure`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t("MAIN.SIDEBAR.REPORT.MEASURE.MEASURE")}
                        </ListItem>
                      </Link>
                    ) : (
                      <div></div>
                    )} */}
                    <Link to={`/Home/PlanSummary`}>
                      <ListItem
                        onClick={() => handleInnerCLick()}
                        className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
                      >
                        <ListItemPrefix>
                          <svg
                            width="4"
                            height="5"
                            viewBox="0 0 4 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              y="0.5"
                              width="4"
                              height="4"
                              rx="2"
                              fill="#94A3B8"
                            />
                          </svg>
                        </ListItemPrefix>
                        {t("MAIN.SIDEBAR.PLAN.PLAN_SUMMARY.PLAN_SUMMARY")}
                      </ListItem>
                    </Link>
                    <Link to={`/Home/GeneratePlanTable`}>
                      <ListItem
                        onClick={() => handleInnerCLick()}
                        className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700 "
                      >
                        <ListItemPrefix>
                          <svg
                            width="4"
                            height="5"
                            viewBox="0 0 4 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              y="0.5"
                              width="4"
                              height="4"
                              rx="2"
                              fill="#94A3B8"
                            />
                          </svg>
                        </ListItemPrefix>
                        {t(
                          "MAIN.SIDEBAR.PLAN.GENERATE_PLAN_TABLE.GENERATE_PLAN_TABLE"
                        )}
                      </ListItem>
                    </Link>
                    <Link to={`/Home/GenerateThreeyearTable`}>
                      <ListItem
                        onClick={() => handleInnerCLick()}
                        className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700 "
                      >
                        <ListItemPrefix>
                          <svg
                            width="4"
                            height="5"
                            viewBox="0 0 4 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              y="0.5"
                              width="4"
                              height="4"
                              rx="2"
                              fill="#94A3B8"
                            />
                          </svg>
                        </ListItemPrefix>
                        {t(
                          "MAIN.SIDEBAR.PLAN.GENERATE_PLAN_TABLE.GENERATE_THREE_YEAR_PLAN_TABLE"
                        )}
                      </ListItem>
                    </Link>
                    <Link to={`/Home/GenerateFinalPlanTable`}>
                      {/* <ListItem
                        onClick={() => handleInnerCLick()}
                        className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
                      >
                        <ListItemPrefix>
                          <svg
                            width="4"
                            height="5"
                            viewBox="0 0 4 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              y="0.5"
                              width="4"
                              height="4"
                              rx="2"
                              fill="#94A3B8"
                            />
                          </svg>
                        </ListItemPrefix>
                        {t(
                          "MAIN.SIDEBAR.PLAN.GENERATE_FINAL_PLAN.GENERATE_FINAL_PLAN"
                        )}
                      </ListItem> */}
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
              <Accordion
                open={open === 5}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 5 ? "rotate-180" : ""
                      }`}
                  />
                }
              >
                <ListItem className="p-0 2xl:origin-left w-full  pr-0  2xl:left-0 2xl:m-0" selected={open === 5}>
                  <AccordionHeader
                    onClick={() => handleOpen(5)}
                    className="border-b-0 2xl:scale-90 left-0 p-0 -ml-3 w-full pl-3 pt-3 pb-3  hover:text-light-blue-700"
                  >
                    <ListItemPrefix>
                      <FontAwesomeIcon icon={faChartPie} />{" "}
                    </ListItemPrefix>
                    <Typography className="mr-auto font-normal">
                      {t("MAIN.SIDEBAR.REPORT.REPORT")}
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0 2xl:scale-90 2xl:origin-left  2xl:left-0 2xl:m-0">
                    {authInfo.user.division_id &&  (
                      <Link to={`/Home/KpiDescription`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t(
                            "MAIN.SIDEBAR.REPORT.KPI_DESCRIPTION.KPI_DESCRIPTION"
                          )}
                        </ListItem>
                      </Link>
                    )}
                    {authInfo.user.userPermissions.includes("readSummmary") ? (
                      <Link to={`/Home/Summary`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t("MAIN.SIDEBAR.REPORT.SUMMARY.SUMMARY")}
                        </ListItem>
                      </Link>
                    ) : (
                      <div></div>
                    )}

                    {/*  */}
                    <Link to={`/Home/GenerateThreeReportTable`}>
                      <ListItem
                        onClick={() => handleInnerCLick()}
                        className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
                      >
                        <ListItemPrefix>
                          <svg
                            width="4"
                            height="5"
                            viewBox="0 0 4 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              y="0.5"
                              width="4"
                              height="4"
                              rx="2"
                              fill="#94A3B8"
                            />
                          </svg>
                        </ListItemPrefix>
                        {t(
                          "MAIN.SIDEBAR.REPORT.GENERATE_THREE_YEAR_REPORT_TABLE.GENERATE_REPORT_TABLE"
                        )}
                      </ListItem>
                    </Link>

                    <Link to={`/Home/GenerateReportTable`}>
                      <ListItem
                        onClick={() => handleInnerCLick()}
                        className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
                      >
                        <ListItemPrefix>
                          <svg
                            width="4"
                            height="5"
                            viewBox="0 0 4 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              y="0.5"
                              width="4"
                              height="4"
                              rx="2"
                              fill="#94A3B8"
                            />
                          </svg>
                        </ListItemPrefix>
                        {t(
                          "MAIN.SIDEBAR.REPORT.GENERATE_REPORT_TABLE.GENERATE_REPORT_TABLE"
                        )}
                      </ListItem>
                    </Link>

                    <Link to={`/Home/GenerateFinalReportTable`}>
                      <ListItem
                        onClick={() => handleInnerCLick()}
                        className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
                      >
                        <ListItemPrefix>
                          <svg
                            width="4"
                            height="5"
                            viewBox="0 0 4 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              y="0.5"
                              width="4"
                              height="4"
                              rx="2"
                              fill="#94A3B8"
                            />
                          </svg>
                        </ListItemPrefix>
                        {t(
                          "MAIN.SIDEBAR.REPORT.GENERATE_FINAL_REPORT.GENERATE_FINAL_REPORT"
                        )}
                      </ListItem>
                    </Link>
                  </List>
                </AccordionBody>
              </Accordion>
              <Accordion
                open={open === 6}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 6 ? "rotate-180" : ""
                      }`}
                  />
                }
              >

                <ListItem className="p-0 2xl:origin-left w-full  pr-0  2xl:left-0 2xl:m-0" selected={open === 6}>
                  <AccordionHeader
                    onClick={() => handleOpen(6)}
                    className="border-b-0 2xl:scale-90 left-0 p-0 -ml-3 w-full pl-3 pt-3 pb-3  hover:text-light-blue-700"
                  >
                    <ListItemPrefix>
                      <FontAwesomeIcon icon={faBookOpen} />{" "}
                    </ListItemPrefix>
                    <Typography className="mr-auto font-normal">
                      {t("MAIN.SIDEBAR.TRACKING.TRACKING")}
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1 ">
                  <List className="p-0 2xl:scale-90 2xl:origin-left  2xl:left-0 2xl:m-0">

                    {authInfo.user.userPermissions.includes(
                      "createAssignMain"
                    ) &&
                      authInfo.user.userPermissions.includes("readAssign") &&
                      authInfo.user.userPermissions.includes("readAssign") && (
                        <Link className="2xl:scale-90 2xl:origin-left  2xl:left-0 2xl:m-0" to={`/Home/DivisionTracking`}>
                          <ListItem className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700">
                            <ListItemPrefix>
                              <svg
                                width="4"
                                height="5"
                                viewBox="0 0 4 5"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  y="0.5"
                                  width="4"
                                  height="4"
                                  rx="2"
                                  fill="#94A3B8"
                                />
                              </svg>
                            </ListItemPrefix>
                            {t("MAIN.SIDEBAR.TRACKING.DIVISION.DIVISION")}
                          </ListItem>
                        </Link>
                      )}

                    {authInfo.user.userPermissions.includes("createKpiTrack") &&
                      !authInfo.user.userPermissions.includes("readAssign") && (
                        <Link to={`/Home/TeamTracking`}>
                          <ListItem className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700">
                            <ListItemPrefix>
                              <svg
                                width="4"
                                height="5"
                                viewBox="0 0 4 5"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  y="0.5"
                                  width="4"
                                  height="4"
                                  rx="2"
                                  fill="#94A3B8"
                                />
                              </svg>
                            </ListItemPrefix>
                            {t("MAIN.SIDEBAR.TRACKING.TEAM.TEAM")}
                          </ListItem>
                        </Link>
                      )}

                    {authInfo.user.userPermissions.includes("readKpiTrack") &&
                      !authInfo.user.userPermissions.includes(
                        "createKpiTrack"
                      ) && (
                        <Link to={`/Home/TeamTracking`}>
                          <ListItem className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700">
                            <ListItemPrefix>
                              <svg
                                width="4"
                                height="5"
                                viewBox="0 0 4 5"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  y="0.5"
                                  width="4"
                                  height="4"
                                  rx="2"
                                  fill="#94A3B8"
                                />
                              </svg>
                            </ListItemPrefix>
                            {t("MAIN.SIDEBAR.TRACKING.TEAM.TEAM")}
                          </ListItem>
                        </Link>
                      )}
                  </List>
                </AccordionBody>
              </Accordion>
              <Accordion
                open={open === 7}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 7 ? "rotate-180" : ""
                      }`}
                  />
                }
              >
                {authInfo.user.userPermissions.includes("readDivision") ||
                  authInfo.user.userPermissions.includes("readMonitoring") ||
                  authInfo.user.userPermissions.includes("readSector") ? (
                  <ListItem className="!mt-0 !pt-0 p-0 2xl:scale-90 2xl:origin-left  2xl:left-0 2xl:m-0" selected={open === 7}>
                    <AccordionHeader
                      onClick={() => handleOpen(7)}
                      className="border-b-0 p-3 hover:text-light-blue-700"
                    >
                      <ListItemPrefix>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25Zm4.03 6.28a.75.75 0 0 0-1.06-1.06L4.97 9.47a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06L6.56 10l1.72-1.72Zm4.5-1.06a.75.75 0 1 0-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06l2.25-2.25a.75.75 0 0 0 0-1.06l-2.25-2.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </ListItemPrefix>
                      <Typography className="mr-auto font-normal">
                        {t("MAIN.SIDEBAR.CLUSTER.CLUSTER")}
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                ) : (
                  <div></div>
                )}

                <AccordionBody className="py-1">
                  <List className="p-0 2xl:scale-90 2xl:origin-left  2xl:left-0 2xl:m-0">
                    {authInfo.user.userPermissions.includes(
                      "readMonitoring"
                    ) ? (
                      <Link to={`/Home/Monitoring`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t("MAIN.SIDEBAR.CLUSTER.MONITORING.MONITORING")}
                        </ListItem>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                    {authInfo.user.userPermissions.includes("readSector") ? (
                      <Link to={`/Home/Sector`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t("MAIN.SIDEBAR.CLUSTER.SECTOR.SECTOR")}
                        </ListItem>
                      </Link>
                    ) : (
                      <div></div>
                    )}

                    {authInfo.user.userPermissions.includes("readDivision") ? (
                      <Link to={`/Home/Division`}>
                        <ListItem
                          onClick={() => handleInnerCLick()}
                          className="hover:text-light-blue-700 focus:text-light-blue-700 active:text-light-blue-700"
                        >
                          <ListItemPrefix>
                            <svg
                              width="4"
                              height="5"
                              viewBox="0 0 4 5"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.5"
                                width="4"
                                height="4"
                                rx="2"
                                fill="#94A3B8"
                              />
                            </svg>
                          </ListItemPrefix>
                          {t("MAIN.SIDEBAR.CLUSTER.DIVISION.DIVISION")}
                        </ListItem>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                  </List>
                </AccordionBody>
              </Accordion>
            </List>
          </Card>
          <div className="grid gap-6 w-full  ">
            <NavBar onSidebarToggle={handleSidebarToggle} />
            <div className="ml-3 mr-3 h-full" id="detail">
              <div
                className={
                  isSidebarVisible
                    ? "xl:ml-72 md:ml-72 sm:ml-0 mt-24  min-h-screen "
                    : "mt-24 xl:w-full xl:ml-0 sm:ml-0  min-h-screen"
                }
              >
                <Outlet />
              </div>
            </div>
            <div
              className={
                isSidebarVisible ? "xl:ml-72 md:ml-72 sm:ml-0 " : "w-full "
              }
            >
              <div className=" w-full">
                <Footer />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <Loader
            type="spinner-default"
            bgColor={color}
            color={color}
            title={"Loading..."}
            size={100}
          />
        </div>
      )}
    </>
  );
}
export default SideBar;
