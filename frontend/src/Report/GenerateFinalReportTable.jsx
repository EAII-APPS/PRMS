import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { ImSpinner9 } from "react-icons/im";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import { useTranslation } from "react-i18next";
import axiosInistance from "../GlobalContexts/Base_url";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { saveAs } from "file-saver";
import axios from "axios";
import Modal from "../tracking/components/Modal";
import FeedBackOnReport from "./FeedbackONReport";
import {
  Card,
  Button,
  CardBody,
  Select,
  Option,
} from "@material-tailwind/react";

function GenerateFinalReportTable() {
  const { t } = useTranslation();
  const authInfo = useAuth();

  const dispatch = useDispatch();
  const [isFixed, setIsFixed] = useState(false);

  //fetch sector data

  const { sectorData } = useSelector((state) => state.sector);

  useEffect(() => {
    dispatch(fetchSectorgData());
  }, []);

  //fetch division data

  const { divisionData } = useSelector((state) => state.division);

  useEffect(() => {
    dispatch(fetchDivisionData());
  }, []);

  //fetch table data

  const currentYear = new Date().getFullYear();
  const currentYearGC = new Date().getFullYear(); 
const currentMonthGC = new Date().getMonth() + 1; 
const ethiopianYear = currentYearGC - 7 - (currentMonthGC < 9 ? 1 : 0);
const years = Array.from({ length: ethiopianYear - 2013 + 2 }, (_, index) => 2013 + index);

  const [selectedYear, setSelectedYear] = useState(ethiopianYear);

  const [selectedQuarter, setSelectedQuarter] = useState("year");

  const [selectedSector, setSelectedSector] = useState(null);

  const [selectedDivision, setSelectedDivision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [pdfUrl, setPdfUrl] = useState("");
  const [docxUrl, setDocxUrl] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("access");
    setLoading(true)
    try {
      const responseData = await axiosInistance.get(
        "reportApp/generate_report_document_data/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            year: selectedYear,
            [selectedSector ? "sector" : "division"]:
              selectedSector || selectedDivision,
            quarter: selectedQuarter,
          },
        }
      );

      setPdfUrl(responseData.data.pdf_file_path);
      setDocxUrl(responseData.data.docx_file_path);
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedSector, selectedDivision, selectedQuarter]);
  const downloadFile = async (url) => {
    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(blob, "file.docx");
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="grid gap-3 items-center">
        <h1 className="whitespace-nowrap text-left text-xl font-bold text-black">
          {t("MAIN.SIDEBAR.REPORT.FINAL_DOCUMENT")}
        </h1>
        <Card className="rounded-md">
          <div className="ml-6 mt-5"></div>
          <CardBody className="xl:flex md:grid items-center xl:gap-10 sm:gap-5">
            <div className="grid gap-2">
              <h1 className="whitespace-nowrap text-left text-md font-bold text-black">
                {t("MAIN.TABLE.YEAR")}
              </h1>
              <Select
                label={t("MAIN.TABLE.SELECT_YEAR")}
                value={selectedYear}
                onChange={handleYearChange}
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
            </div>
            <div className="grid gap-2">
              <h1 className="whitespace-nowrap text-left text-md font-bold text-black">
                {t("MAIN.TABLE.QUARTER")}
              </h1>
              <Select
                label={t("MAIN.TABLE.SELECT_QUARTER")}
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e)}
              >
                <Option
                  value="first"
                  className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                >
                  {t("MAIN.TABLE.FIRST_QUARTER")}
                </Option>
                <Option
                  value="second"
                  className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                >
                  {t("MAIN.TABLE.SECOND_QUARTER")}
                </Option>
                <Option
                  value="third"
                  className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                >
                  {t("MAIN.TABLE.THIRD_QUARTER")}
                </Option>
                <Option
                  value="fourth"
                  className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                >
                  {t("MAIN.TABLE.FOURTH_QUARTER")}
                </Option>
                <Option
                  value="six"
                  className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                >
                  {t("MAIN.TABLE.SIX_MONTH")}
                </Option>
                <Option
                  value="nine"
                  className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                >
                  {t("MAIN.TABLE.NINE_MONTH")}
                </Option>
                <Option
                  value="year"
                  className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                >
                  {t("MAIN.TABLE.YEAR")}
                </Option>
              </Select>
            </div>
            {authInfo.user.userPermissions.includes("createAssign") && (
              <div className="grid gap-2">
                <h1 className="whitespace-nowrap text-left text-md font-bold text-black">
                  {t("MAIN.TABLE.SECTOR")}
                </h1>
                <Select
                  label={t("MAIN.TABLE.SELECT_SECTOR")}
                  onChange={(e) => setSelectedSector(e)}
                >
                  {sectorData
                    ? sectorData.map((sector) => (
                        <Option
                          key={sector.id}
                          className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                          value={sector.id}
                        >
                          {sector.name}
                        </Option>
                      ))
                    : []}
                </Select>
              </div>
            )}
            {(authInfo.user.userPermissions.includes("createAssign") ||
              authInfo.user.userPermissions.includes("createMainActivity")) && (
              <div className="grid gap-2">
                <h1 className="whitespace-nowrap text-left text-md font-bold text-black">
                  {t("MAIN.TABLE.DIVISION")}
                </h1>
                <Select
                  label={t("MAIN.TABLE.SELECT_DIVISION")}
                  onChange={(e) => setSelectedDivision(e)}
                >
                  {divisionData
                    ? divisionData.map((division) => (
                        <Option
                          key={division.id}
                          value={division.id}
                          className="focus:text-light-blue-700 whitespace-nowrap text-left text-md font-medium text-black"
                        >
                          {division.name}
                        </Option>
                      ))
                    : []}
                </Select>
              </div>
            )}
          </CardBody>
          <div className="flex justify-end mb-5 mr-12 gap-3">
            <Button
              variant="text"
              size="md"
              className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case text-left text-sm font-bold"
              onClick={() => fetchData()}
            >
              {t("MAIN.SIDEBAR.REPORT.GENERATE")}
            </Button>
            <Button
              variant="text"
              size="md"
              className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case text-left text-sm font-bold"
              onClick={() => setShowModal(true)}
            >
              {t("MAIN.SIDEBAR.REPORT.COMMENT")}
            </Button>
          </div>

          <Modal show={showModal} onClose={() => setShowModal(false)}>
            <FeedBackOnReport
              sectorData={sectorData}
              divisionData={divisionData}
            />
          </Modal>
        </Card>
        <Card className=" rounded-md overflow-auto h-[600px] scrollbar">
          <div className="flex gap-5 justify-start mt-5 ml-6">
            <div className="flex items-center gap-7 ">
              <Button
                variant="text"
                size="sm"
                className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700  text-white  normal-case whitespace-nowrap text-left text-sm font-bold"
                onClick={() => downloadFile(docxUrl)}
              >
                <FontAwesomeIcon icon={faDownload} />
                {t("MAIN.SIDEBAR.REPORT.DOWNLOAD")}
              </Button>
            </div>
          </div>
          <CardBody className="">
          {loading ? (
              <div className="flex justify-center items-center h-96">
                <ImSpinner9 className="animate-spin  w-40 h-40" />
              </div>
            ) : (
              pdfUrl && (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="500px"
                  title="PDF Preview"
                />
              )
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default GenerateFinalReportTable;
