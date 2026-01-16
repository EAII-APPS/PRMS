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

function GeneratePlanTable() {
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

  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const [selectedSector, setSelectedSector] = useState(null);

  const [selectedDivision, setSelectedDivision] = useState(null);
  const [pdfpath, setpdfpath] = useState("");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleclear = async () => {
    const clearall = async () => {
      setSelectedDivision(null);
      setSelectedSector(null);
      setSelectedYear(ethiopianYear);
      setSelectedQuarter(null);
      window.location.reload();
      fetchData();

    }
    await clearall();
  }

  const fetchData = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await axiosInistance.get("/planApp/table-data/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          year: selectedYear,
          sector: selectedSector,
          division: selectedDivision,
          quarter: selectedQuarter,
        },
      });
      setData(response.data);
      setSelectedDivision(null);
    } catch (error) { }
  };

  useEffect(() => {
    if (selectedQuarter !== null) {
      fetchData();
    }
  }, [selectedQuarter]); // This useEffect runs when selectedQuarter changes

  useEffect(() => {
    fetchData();
  }, []);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e));
    // Do something with the selected year
  };
  const handleQuarterChange = async (e) => {
    const selectedValue = e;
    if (selectedValue === 12) {
      window.location.reload(); // Reload the window
    } else {
      setSelectedQuarter(selectedValue); // Set the selected quarter
    }
  };

  const downloadTableAsPDF = async () => {
    try {

      const response = await axiosInistance.get("/planApp/pdf/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          year: selectedYear,
          sector: selectedSector,
          division: selectedDivision,
          quarter: selectedQuarter,
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
      const response = await axiosInistance.get("/planApp/word/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        params: {
          year: selectedYear,
          sector: selectedSector,
          division: selectedDivision,
          quarter: selectedQuarter,
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
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {t("MAIN.SIDEBAR.PLAN.GENERATE_PLAN_TABLE.TITLE")}
          </h1>
        </div>

        {/* Filters Card */}
        <Card className="rounded-xl shadow-lg border border-gray-100">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Year Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {t("MAIN.TABLE.YEAR")}
                </label>
                <Select
                  label={t("MAIN.TABLE.SELECT_YEAR")}
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="border-gray-300"
                >
                  {years.map((year) => (
                    <Option
                      className="hover:bg-blue-50"
                      key={year}
                      value={year}
                    >
                      {year}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Quarter Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {t("MAIN.TABLE.QUARTER")}
                </label>
                <Select
                  label={t("MAIN.TABLE.SELECT_QUARTER")}
                  value={selectedQuarter}
                  onChange={handleQuarterChange}
                  className="border-gray-300"
                >
                  <Option value={1} className="hover:bg-blue-50">{t("MAIN.TABLE.FIRST_QUARTER")}</Option>
                  <Option value={2} className="hover:bg-blue-50">{t("MAIN.TABLE.SECOND_QUARTER")}</Option>
                  <Option value={3} className="hover:bg-blue-50">{t("MAIN.TABLE.THIRD_QUARTER")}</Option>
                  <Option value={4} className="hover:bg-blue-50">{t("MAIN.TABLE.FOURTH_QUARTER")}</Option>
                  <Option value={6} className="hover:bg-blue-50">{t("MAIN.TABLE.SIX_MONTH")}</Option>
                  <Option value={9} className="hover:bg-blue-50">{t("MAIN.TABLE.NINE_MONTH")}</Option>
                  <Option value={12} className="hover:bg-blue-50">{t("MAIN.TABLE.YEAR")}</Option>
                </Select>
              </div>

              {/* Sector Filter */}
              {authInfo?.user?.userPermissions?.includes("createAssign") && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {t("MAIN.TABLE.SECTOR")}
                  </label>
                  <Select
                    label={t("MAIN.TABLE.SELECT_SECTOR")}
                    onChange={(e) => setSelectedSector(e)}
                    className="border-gray-300"
                  >
                    {(sectorData || []).map((sector) => (
                      <Option key={sector.id} value={sector.id} className="hover:bg-blue-50">
                        {sector.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}

              {/* Division Filter */}
              {(authInfo?.user?.userPermissions?.includes("createAssign") ||
                authInfo?.user?.userPermissions?.includes("createMainActivity")) && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      {t("MAIN.TABLE.DIVISION")}
                    </label>
                    <Select
                      label={t("MAIN.TABLE.SELECT_DIVISION")}
                      onChange={(e) => setSelectedDivision(e)}
                      className="border-gray-300"
                    >
                      {(divisionData || []).map((division) => (
                        <Option key={division.id} value={division.id} className="hover:bg-blue-50">
                          {division.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 justify-end">
              <Button
                size="md"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all normal-case font-medium px-6"
                onClick={() => fetchData()}
              >
                {t("MAIN.TABLE.FILTER")}
              </Button>
              <Button
                size="md"
                variant="outlined"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 normal-case font-medium px-6"
                onClick={() => handleclear()}
              >
                {t("MAIN.TABLE.CLEAR")}
              </Button>
            </div>
          </CardBody>
        </Card>
        {/* Table Card */}
        <Card className="rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">Plan Data Table</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search KPIs, goals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-64"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Menu
                  open={isMenuOpen}
                  handler={setIsMenuOpen}
                  placement="bottom-end"
                >
                  <MenuHandler>
                    <Button
                      size="md"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all normal-case font-medium flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      {t("MAIN.TABLE.DOWNLOAD")}
                    </Button>
                  </MenuHandler>
                  <MenuList className="p-2 shadow-xl">
                    <MenuItem
                      className="flex items-center gap-3 rounded-lg hover:bg-blue-50 p-3 transition-colors"
                      onClick={downloadTableAsImage}
                    >
                      <Typography as="span" variant="small" className="font-medium">
                        📷 Image
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className="flex items-center gap-3 rounded-lg hover:bg-blue-50 p-3 transition-colors"
                      onClick={downloadTableAsPDF}
                    >
                      <Typography as="span" variant="small" className="font-medium">
                        📄 PDF
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className="flex items-center gap-3 rounded-lg hover:bg-blue-50 p-3 transition-colors"
                      onClick={downloadTableAsWord}
                    >
                      <Typography as="span" variant="small" className="font-medium">
                        📝 Word (docx)
                      </Typography>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
          </div>
          <CardBody id="planTable" className="overflow-x-auto max-h-[600px]">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                  <th scope="col" className="px-4 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider">
                    {t("MAIN.TABLE.NO")}
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider min-w-[250px]">
                    {t("MAIN.TABLE.STRATEGIC_GOAL_MAIN_GOAL_AND_KPI")}
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider">
                    {t("MAIN.TABLE.WEIGHT")}
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider">
                    {t("MAIN.TABLE.MEASURE")}
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider">
                    {t("MAIN.TABLE.LAST_YEAR_PERFORMANCE", { lastYear: selectedYear - 1 })}
                  </th>
                  <th scope="col" className="px-4 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider">
                    {t("MAIN.TABLE.NEXT_YEAR_GOAL", { thisYear: selectedYear })}
                  </th>
                  <th scope="col" className="px-4 py-4 text-center text-xs md:text-sm font-bold uppercase tracking-wider" colSpan="4">
                    {selectedQuarter === 6 ? t("MAIN.TABLE.SIX_MONTH") : selectedQuarter === 9 ? t("MAIN.TABLE.NINE_MONTH") : t("MAIN.TABLE.QUARTER")}
                  </th>
                </tr>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <th colSpan="6" className="px-4 py-2"></th>
                  {(!selectedQuarter || selectedQuarter === 1) && (
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold">
                      {t("MAIN.TABLE.FIRST_QUARTER")}
                    </th>
                  )}
                  {(!selectedQuarter || selectedQuarter === 2) && (
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold">
                      {t("MAIN.TABLE.SECOND_QUARTER")}
                    </th>
                  )}
                  {(!selectedQuarter || selectedQuarter === 3) && (
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold">
                      {t("MAIN.TABLE.THIRD_QUARTER")}
                    </th>
                  )}
                  {(!selectedQuarter || selectedQuarter === 4) && (
                    <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold">
                      {t("MAIN.TABLE.FOURTH_QUARTER")}
                    </th>
                  )}
                  {(!selectedQuarter || selectedQuarter === 6) && (
                    <th className={`px-4 py-3 text-left text-xs md:text-sm font-semibold ${selectedQuarter === 6 ? '' : 'hidden'}`}>
                      {t("MAIN.TABLE.SIX_MONTH")}
                    </th>
                  )}
                  {(!selectedQuarter || selectedQuarter === 9) && (
                    <th className={`px-4 py-3 text-left text-xs md:text-sm font-semibold ${selectedQuarter === 9 ? '' : 'hidden'}`}>
                      {t("MAIN.TABLE.NINE_MONTH")}
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {(data || [])
                  .map((strategicGoal, sIndex) => {
                    const normalizedSearch = searchTerm.trim().toLowerCase();

                    // Always map maingoals to include their original index mIndex
                    const processedMainGoals = (strategicGoal.maingoals || [])
                      .map((maingoal, mIndex) => ({ ...maingoal, mIndex }));

                    if (!normalizedSearch) {
                      return { ...strategicGoal, maingoals: processedMainGoals, sIndex };
                    }

                    const sgMatch = strategicGoal.strategic_goal_name?.toLowerCase().includes(normalizedSearch);

                    const filteredMainGoals = processedMainGoals
                      .map((maingoal) => {
                        const mgMatch = maingoal.main_goal_name?.toLowerCase().includes(normalizedSearch);

                        const filteredKPIs = (maingoal.kpis || []).filter((kpi) =>
                          sgMatch || mgMatch ||
                          kpi.kpi_name?.toLowerCase().includes(normalizedSearch) ||
                          kpi.measure?.toLowerCase().includes(normalizedSearch)
                        );

                        if (sgMatch || mgMatch || filteredKPIs.length > 0) {
                          return { ...maingoal, kpis: filteredKPIs };
                        }
                        return null;
                      })
                      .filter(Boolean);

                    if (sgMatch || filteredMainGoals.length > 0) {
                      return { ...strategicGoal, maingoals: filteredMainGoals, sIndex };
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .map((strategicGoal) => (
                    <React.Fragment key={strategicGoal.index}>
                      {/* Strategic Goal Row */}
                      <tr className="bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 transition-colors">
                        <td className="px-4 py-4 text-sm md:text-base font-bold text-gray-800 border-b-2 border-gray-300">
                          {strategicGoal.sIndex + 1}
                        </td>
                        <td colSpan="10" className="px-4 py-4 text-sm md:text-base font-bold text-gray-800 border-b-2 border-gray-300">
                          {strategicGoal.strategic_goal_name}
                        </td>
                      </tr>

                      {/* Main Activities */}
                      {(strategicGoal.maingoals || []).map((maingoal) => (
                        <React.Fragment key={`${strategicGoal.index}-${maingoal.mIndex}`}>
                          <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors">
                            <td className="px-4 py-4 text-sm md:text-base font-semibold text-gray-700 border-b border-gray-300">
                              {strategicGoal.sIndex + 1}.{maingoal.mIndex + 1}
                            </td>
                            <td colSpan="10" className="px-4 py-4 text-sm md:text-base font-semibold text-gray-700 border-b border-gray-300">
                              {maingoal.main_goal_name}
                            </td>
                          </tr>

                          {/* KPIs */}
                          {(maingoal.kpis || []).map((kpi, kIndex) => (
                            <React.Fragment key={`${maingoal.id}-${kIndex}`}>
                              <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-600 font-medium border-b border-gray-200">
                                  {strategicGoal.sIndex + 1}.{maingoal.mIndex + 1}.{kIndex + 1}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
                                  {kpi.kpi_name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                                  {kpi.weight}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                                  {kpi.measure}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                                  {kpi.initial}{kpi.initial_unit}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                                  {kpi.annual_value}{kpi.annual_unit}
                                </td>
                                {(!selectedQuarter || selectedQuarter === 1) && (
                                  <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                                    {kpi.pl1}{kpi.pl1_unit}
                                  </td>
                                )}
                                {(!selectedQuarter || selectedQuarter === 2) && (
                                  <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                                    {kpi.pl2}{kpi.pl2_unit}
                                  </td>
                                )}
                                {(!selectedQuarter || selectedQuarter === 3) && (
                                  <td className="px-4 py-3 text-sm text-gray-700">
                                    {kpi.pl3}{kpi.pl3_unit}
                                  </td>
                                )}
                                {(!selectedQuarter || selectedQuarter === 4) && (
                                  <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                                    {kpi.pl4}{kpi.pl4_unit}
                                  </td>
                                )}
                                {(!selectedQuarter || selectedQuarter === 6) && (
                                  <td className={`px-4 py-3 text-sm text-gray-700 border-b border-gray-200 ${selectedQuarter === 6 ? '' : 'hidden'}`}>
                                    {kpi.pl6 || "-"}
                                  </td>
                                )}
                                {(!selectedQuarter || selectedQuarter === 9) && (
                                  <td className={`px-4 py-3 text-sm text-gray-700 border-b border-gray-200 ${selectedQuarter === 9 ? '' : 'hidden'}`}>
                                    {kpi.pl9 || "-"}
                                  </td>
                                )}
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

export default GeneratePlanTable;