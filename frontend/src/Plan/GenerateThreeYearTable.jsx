import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import axiosInistance from "../GlobalContexts/Base_url";
import { useTranslation } from "react-i18next";
import { useAuth } from "../GlobalContexts/Auth-Context";
import {
  Card,
  Button,
  CardBody,
  Select,
  Option,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
} from "@material-tailwind/react";

function GenerateThreeYearTable() {
  const { t } = useTranslation();

  const authInfo = useAuth();

  const dispatch = useDispatch();

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

  const [selectedSector, setSelectedSector] = useState(null);

  const [selectedDivision, setSelectedDivision] = useState(null);
  const [pdfpath,setpdfpath] = useState("");
  const [data, setData] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await axiosInistance.get("/planApp/threeyear-table-data/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          year: selectedYear,
          sector: selectedSector,
          division: selectedDivision,

        },
      });
      setData(response.data);
      setSelectedDivision(null);
    } catch (error) {}
  };


  
  useEffect(() => {
    fetchData();
  }, []);
  const handleclear = async () => {
    const clearall = async () => {
      setSelectedDivision(null);
      setSelectedSector(null);
      setSelectedYear(ethiopianYear);
      window.location.reload();
      fetchData();
    }
    await clearall();
  }
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e));
    // Do something with the selected year
  };

  
  const downloadTableAsPDF = async () => {
    try {
      const quarterMapping = {
        Q1: 1,
        Q2: 2,
        Q3: 3,
        Q4: 4,
        '6': 6,
        '12': 12,
      };
      const response = await axiosInistance.get("/planApp/threepdf/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          year: selectedYear,
          sector: selectedSector,
          division: selectedDivision,
        },
        responseType: 'blob',  // Set responseType to 'blob' to handle binary file data
      });
  
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
  
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'table.pdf';  // Specify the file name for download
      document.body.appendChild(link);
      link.click();
      
      // Clean up by removing the temporary link
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);  // Release the object URL after download
  
      setSelectedDivision(null);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };
  
  const downloadTableAsWord = async () => {
    try {
      const response = await axiosInistance.get("/planApp/threeword/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          year: selectedYear,
          sector: selectedSector,
          division: selectedDivision,
        },
        responseType: 'blob',  // Set responseType to 'blob' to handle binary file data
      });
  
      // Create a Blob for the Word document
      const wordBlob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const wordUrl = URL.createObjectURL(wordBlob);
  
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = wordUrl;
      link.download = 'table.docx';  // Specify the file name for download
      document.body.appendChild(link);
      link.click();
  
      // Clean up by removing the temporary link
      document.body.removeChild(link);
      URL.revokeObjectURL(wordUrl);  // Release the object URL after download
  
      setSelectedDivision(null);
    } catch (error) {
      console.error("Error downloading Word file:", error);
    }
  };

  const downloadTableAsImage = () => {
    const table = document.getElementById("planTable");

    html2canvas(table).then((canvas) => {
      const link = document.createElement("a");

      link.href = canvas.toDataURL();

      link.download = "plan-table.png";

      link.click();
    });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  return (
    <>
      <div className="grid gap-3 items-center">
        <h1 className="whitespace-nowrap text-left text-xl font-bold text-black">
          {t("MAIN.SIDEBAR.PLAN.GENERATE_PLAN_TABLE.TITLETHREEYEAR")}
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

            {authInfo.user.userPermissions.includes("createAssign") && (
              <div className="grid gap-2">
                <h1 className="whitespace-nowrap text-left text-md font-bold text-black">
                  {t("MAIN.TABLE.SECTOR")}
                </h1>
                <Select
                  label={t("MAIN.TABLE.SELECT_SECTOR")}
                  // value={selectedSector}
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
          <div className="flex justify-end gap-2 mb-5 mr-12">
            <Button
              variant="text"
              size="md"
              className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case text-left text-sm font-bold"
              onClick={() => fetchData()}
            >
              {t("MAIN.TABLE.FILTER")}
            </Button>
            <Button
            variant="text"
            size="sm"
            className="flex items-center justify-center gap-1 hover:bg-blue-700 bg-blue-700 text-white focus:bg-blue-700 normal-case text-xs md:text-sm font-bold"
            onClick={() => handleclear()}
          >
            {t("MAIN.TABLE.CLEAR")}
          </Button>
          </div>
        </Card>
        <Card className=" rounded-md overflow-auto scrollbar h-[500px]">
          <div className="flex gap-5 justify-start mt-5 ml-6">
            <Menu
              open={isMenuOpen}
              handler={setIsMenuOpen}
              placement="bottom-middle"
            >
              <div className="flex items-center gap-7 ">
                <MenuHandler>
                  <Button
                    variant="text"
                    size="sm"
                    className="flex items-center gap-1 hover:bg-blue-700 bg-blue-700  text-white  normal-case whitespace-nowrap text-left text-sm font-bold"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    {t("MAIN.TABLE.DOWNLOAD")}
                  </Button>
                </MenuHandler>
              </div>
              <MenuList className="p-1">
                return (
                <MenuItem
                  className="flex items-center gap-2 rounded"
                  onClick={downloadTableAsImage}
                >
                  <Typography as="span" variant="small" className="font-normal">
                    Image
                  </Typography>
                </MenuItem>
                <MenuItem
                  className="flex items-center gap-2 rounded"
                  onClick={downloadTableAsPDF}
                >
                  <Typography as="span" variant="small" className="font-normal">
                    PDF
                  </Typography>
                </MenuItem>

                <MenuItem
                  className="flex items-center gap-2 rounded"
                  onClick={downloadTableAsWord}
                >
                  <Typography as="span" variant="small" className="font-normal">
                    Word(docx)
                  </Typography>
                </MenuItem>
                );
              </MenuList>
            </Menu>
          </div>
          <CardBody id="planTable" className="mx-auto w-full pt-0 overflow-scroll">
            <table className="w-full">
              <thead className="bg-white text-sm sticky -top-3">
                <tr className=" sticky top-[0px]">
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left text-md font-bold text-black  tracking-wider "
                  >
                    {t("MAIN.TABLE.NO")}
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left text-md font-bold text-black  tracking-wider "
                  >
                    {t("MAIN.TABLE.STRATEGIC_GOAL_MAIN_GOAL_AND_KPI")}
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left  text-md font-bold text-black  tracking-wider"
                  >
                    {t("MAIN.TABLE.MEASURE")}
                  </th>

                  <th
                    scope="col"
                    className="p-0 m-0 text-center text-md font-bold text-black  tracking-wider "
                  >

                    {t("MAIN.TABLE.YEARTHREE_VALUES", { year_one: selectedYear,year_three: selectedYear +2 })}
             

                    <div className="flex
                      justify-center gap-0">
                          <th className="px-2 py-3.5 text-left text-md font-bold text-black w-full tracking-wider ">
                            {selectedYear}
                          </th>
  
                          <th className="px-2 py-3.5 text-left text-md font-bold text-black w-full tracking-wider ">
                            {selectedYear + 1}
                          </th>
                          <th className="px-2 py-3.5 text-left text-md font-bold text-black w-full tracking-wider ">
                            {selectedYear + 2}
                          </th>

                      </div>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white text-sm w-full">
                {data && 
                  data.map((strategicGoal, sIndex) => (
                    <React.Fragment key={strategicGoal.index}>
                      {/* Strategic Goal Row */}
                      <tr className="bg-[#97daac] hover:bg-[#6fb389]">
                        <td className="px-3 py-4 text-left pl-4 text-md font-bold text-black border-b border-[#535353]">
                          {sIndex + 1}
                        </td>
                        <td colSpan="3" className=" py-4 text-left pl-4 text-md font-bold text-black border-b border-[#535353]">
                          {strategicGoal.strategic_goal_name}
                        </td>
                      </tr>

                      {/* Main Activities */}
                      {strategicGoal.maingoals.map((maingoal, mIndex) => (
                        <React.Fragment key={`${strategicGoal.index}-${mIndex}`}>
                          <tr className="bg-[#dfdfdf] hover:bg-[#ebebeb] ">
                            <td className=" py-4 text-left pl-4 text-md font-bold text-black border-b border-[#535353]">
                              {sIndex + 1}.{mIndex + 1}
                            </td>
                            <td colSpan="3" className=" py-4 text-left pl-4 text-md font-bold text-black border-b border-[#535353]">
                              {maingoal.main_goal_name}
                            </td>
                          </tr>

                          {/* KPIs */}
                          {maingoal.kpis.map((kpi, kIndex) => (
                            <React.Fragment key={`${maingoal.id}-${kIndex}`}>
                              <tr className="bg-white hover:bg-gray-100 ">
                                <td className="px-2 py-4 text-left pl-4 text-md font-bold text-black border-b border-[#535353]">
                                  {sIndex + 1}.{mIndex + 1}.{kIndex}
                                </td>
                                <td className=" py-4 text-left pl-4 text-md font-bold text-black border-b  border-[#535353]">
                                  {kpi.kpi_name}
                                </td>
                                <td className=" py-4  text-left pl-4 text-md font-bold text-black  border-b border-[#535353]">
                                  {kpi.measure}
                                </td>
                                <td className="text-left p-0 m-0 text-sm font-bold text-black  border-b border-[#535353]">
                                  <div className="flex justify-center gap-0">
                                
                                      <td className="py-4  text-left pl-4 text-sm  text-black w-full tracking-wider  border-[#535353]">
                                        {kpi.year_one_value} 
                                      </td>
                   
                                  
                                      <td className="py-4  text-left pl-4 text-sm  text-black w-full tracking-wider  border-[#535353]">
                                        {kpi.year_two_value}
                                      </td>
                   
                          
                                      <td className="py-4  text-left pl-4 text-sm  text-black w-full tracking-wider  border-[#535353]">
                                        {kpi.year_three_value} 
                                      </td>
                   
                                  </div>
                                </td>
                                </tr>
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default GenerateThreeYearTable;
