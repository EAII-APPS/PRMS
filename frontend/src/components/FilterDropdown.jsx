import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../GlobalContexts/Auth-Context";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Select,
  Option,
  Typography,
  IconButton,
} from "@material-tailwind/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import { fetchKpiData } from "../reduxToolKit/slices/kpiSlice";
import { fetchKpiAllData } from "../reduxToolKit/slices/kpiAllSlice";

const FilterDropdown = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  // Load filters from localStorage
  const getSavedFilters = () => {
    try {
      const savedFilters = localStorage.getItem("filters");
      return savedFilters ? JSON.parse(savedFilters) : { year: "", sector: "", division: "", kpi: "" };
    } catch (error) {
      console.error("Error reading filters from localStorage", error);
      return { year: "", sector: "", division: "", kpi: "" };
    }
  };

  const [filters, setFilters] = useState(getSavedFilters);
  const { sectorData } = useSelector((state) => state.sector);
  const { kpiData } = useSelector((state) => state.kpi);
  const { divisionData } = useSelector((state) => state.division);

  const authInfo = useAuth();
  const { t } = useTranslation();
  const currentYearGC = new Date().getFullYear();
  const currentMonthGC = new Date().getMonth() + 1;
  const ethiopianYear = currentYearGC - 7 - (currentMonthGC < 9 ? 1 : 0);
  const years = Array.from({ length: ethiopianYear - 2013 + 2 }, (_, index) => 2013 + index);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    const clearedFilters = { year: "", sector: "", division: "", kpi: "" };
    setFilters(clearedFilters);
    localStorage.setItem("filters", JSON.stringify(clearedFilters));
    setOpen(false);
  };

  useEffect(() => {
    setFilters(getSavedFilters());
  }, []);

  useEffect(() => {
    if (!sectorData) dispatch(fetchSectorgData());
    if (!divisionData) dispatch(fetchDivisionData());
    if (!kpiData) dispatch(fetchKpiData());
  }, [dispatch, sectorData, divisionData, kpiData]);
  const handleFilter = () => {
    localStorage.setItem("filters", JSON.stringify(filters));
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      <Menu
        open={open}
        handler={setOpen}
        placement="top-end"
        dismiss={{ itemClick: false }}
      >
        <MenuHandler>
          <Button
            size="lg"
            className="flex items-center justify-center p-4 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-tr from-blue-700 to-blue-500 hover:scale-110 hover:shadow-blue-500/40"
          >
            <FontAwesomeIcon icon={open ? faTimes : faFilter} className={`text-xl transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
          </Button>
        </MenuHandler>
        <MenuList className="p-4 w-72 rounded-xl shadow-2xl border border-gray-100 flex flex-col gap-4">
          <Typography variant="h6" color="blue-gray" className="font-bold flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faFilter} className="text-blue-500 opacity-70" />
            {t("MAIN.DASHBOARD_PAGE.FILTER.TITLE")}
          </Typography>

          {/* Year Select */}
          <div className="flex flex-col gap-1">
            <Typography variant="small" color="blue-gray" className="font-semibold px-1 opacity-70">
              {t("MAIN.DASHBOARD_PAGE.FILTER.SELECT_YEAR")}
            </Typography>
            <Select
              label="Year"
              menuProps={{ className: "max-h-72" }}
              value={filters.year?.toString() || ""}
              onChange={(val) => handleFilterChange("year", val)}
              className="bg-white"
            >
              {years.map((year) => (
                <Option key={year} value={year.toString()}>{year}</Option>
              ))}
            </Select>
          </div>

          {/* Sector Select */}
          {(authInfo.user.monitoring_id || authInfo.user.is_superadmin) && (
            <div className="flex flex-col gap-1">
              <Typography variant="small" color="blue-gray" className="font-semibold px-1 opacity-70">
                {t("MAIN.DASHBOARD_PAGE.FILTER.SELECT_SECTOR")}
              </Typography>
              <Select
                label="Sector"
                menuProps={{ className: "max-h-72" }}
                value={filters.sector?.toString() || ""}
                onChange={(val) => handleFilterChange("sector", val)}
                className="bg-white"
              >
                {(sectorData || []).map((sector) => (
                  <Option key={sector.id} value={sector.id.toString()}>
                    {sector.name}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {/* Division Select */}
          <div className="flex flex-col gap-1">
            <Typography variant="small" color="blue-gray" className="font-semibold px-1 opacity-70">
              {t("MAIN.DASHBOARD_PAGE.FILTER.SELECT_DIVISION")}
            </Typography>
            <Select
              label="Division"
              menuProps={{ className: "max-h-72" }}
              value={filters.division?.toString() || ""}
              disabled={!filters.sector && (authInfo.user.monitoring_id || authInfo.user.is_superadmin)}
              onChange={(val) => handleFilterChange("division", val)}
              className="bg-white"
            >
              {(authInfo.user.monitoring_id || authInfo.user.is_superadmin) ? (
                (divisionData?.filter((division) => division.sector === parseInt(filters.sector)) ?? [])
                  .map((division) => (
                    <Option key={division.id} value={division.id.toString()}>
                      {division.name}
                    </Option>
                  ))
              ) : (
                (divisionData?.filter((division) => division.sector === authInfo.user.sector_id) ?? [])
                  .map((division) => (
                    <Option key={division.id} value={division.id.toString()}>
                      {division.name}
                    </Option>
                  ))
              )}
            </Select>
            {!filters.sector && (authInfo.user.monitoring_id || authInfo.user.is_superadmin) && (
              <Typography variant="small" color="red" className="text-[10px] px-1 font-medium italic">
                {t("MAIN.DASHBOARD_PAGE.FILTER.SELECT_SECTOR_FIRST")}
              </Typography>
            )}
          </div>

          {/* KPI Select */}
          <div className="flex flex-col gap-1">
            <Typography variant="small" color="blue-gray" className="font-semibold px-1 opacity-70">
              {t("MAIN.DASHBOARD_PAGE.FILTER.SELECT_KPI")}
            </Typography>
            <Select
              label="KPI"
              menuProps={{ className: "max-h-72" }}
              value={filters.kpi?.toString() || ""}
              onChange={(val) => handleFilterChange("kpi", val)}
              className="bg-white"
            >
              {(kpiData || []).map((kpi) => (
                <Option key={kpi.id} value={kpi.id.toString()}>
                  {kpi.kpi_name}
                </Option>
              ))}
            </Select>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              variant="gradient"
              color="blue"
              fullWidth
              onClick={handleFilter}
              className="flex items-center justify-center gap-2 normal-case"
            >
              <FontAwesomeIcon icon={faCheck} />
              {t("MAIN.DASHBOARD_PAGE.FILTER.FILTER_BUTTON")}
            </Button>
            <IconButton
              variant="outlined"
              color="red"
              onClick={handleClearFilters}
              className="flex-shrink-0"
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </div>
        </MenuList>
      </Menu>
    </div>
  );
};

export default FilterDropdown;