import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../GlobalContexts/Auth-Context";
import {
  Fab,
  Menu,
  MenuItem,
  FormControl,
  Select,
  Box,
  Button,
  Typography,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { fetchSectorgData } from "../reduxToolKit/slices/sectorSlice";
import { fetchDivisionData } from "../reduxToolKit/slices/divisionSlice";
import { fetchKpiData } from "../reduxToolKit/slices/kpiSlice";

const FilterDropdown = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  
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
  const currentYear = new Date().getFullYear();
  const yearData = Array.from(
    { length: currentYear - 2020 },
    (_, index) => 2013 + index + 1
  );
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event) => {
    const updatedFilters = { ...filters, [event.target.name]: event.target.value };
    setFilters(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { year: "", sector: "", division: "", kpi: "" };
    setFilters(clearedFilters);
    localStorage.setItem("filters", JSON.stringify(clearedFilters)); // Clear localStorage
  };

  // Sync state with localStorage if it changes
  useEffect(() => {
    setFilters(getSavedFilters());
  }, []);

  // Fetch data only if it's not already available
  useEffect(() => {
    if (!sectorData) dispatch(fetchSectorgData());
    if (!divisionData) dispatch(fetchDivisionData());
    if (!kpiData) dispatch(fetchKpiData());
  }, [dispatch, sectorData, divisionData, kpiData]);

  console.log(JSON.parse(localStorage.getItem("filters")), "These items are currently in localStorage");
  const handleFilter = () => {
    // Save the filters to localStorage when the filter button is clicked
    localStorage.setItem("filters", JSON.stringify(filters));
    console.log("Filters applied:", filters);
    // Trigger any additional filter actions like API calls or state updates here
  };
  return (
    <>
      {/* Floating Circular Icon */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1500 }}
        onClick={handleClick}
      >
        <TuneIcon />
      </Fab>

      {/* Dropdown Menu (Positioned ABOVE Button) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ mt: -1 }} // Move it up slightly
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>

          {/* Sectors Dropdown */}
          <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
            <Select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              displayEmpty
            >
              <MenuItem value="">Select year</MenuItem>
              {yearData.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Sectors Dropdown */}
          {authInfo.user.monitoring_id || authInfo.user.is_superadmin ? (
                      <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                      <Select
                        name="sector"
                        value={filters.sector}
                        onChange={handleFilterChange}
                        displayEmpty
                        overflow="scroll"
                      >
                        <MenuItem value="">Select Sector</MenuItem>
                        {(sectorData || []).map((sector) => (
                          <MenuItem key={sector.id} value={sector.id}>
                            {sector.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
          ):(          
          <></>)}

          {/* Divisions Dropdown */}
          <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
          {authInfo.user.monitoring_id  && (
            <Select
              name="division"
              value={filters.division}
              onChange={handleFilterChange}
              displayEmpty
              overflow="scroll"
            >
              <MenuItem disabled value="">Select Division</MenuItem>
              {/* <MenuItem value="">{filters.sector ? "Select Division" : "Please select sector first"}</MenuItem> */}
              {!filters.sector && <MenuItem disabled sx={{ color: "red", fontStyle: "italic" }}>
                Please select sector first
              </MenuItem>}

              {filters.sector &&
                (divisionData?.filter((division) => division.sector === filters.sector) ?? [])
                  .map((division) => (
                    <MenuItem key={division.id} value={division.id}>
                      {division.name}
                    </MenuItem>
                  ))}
            </Select>)}
          {authInfo.user.is_superadmin  && (
            <Select
              name="division"
              value={filters.division}
              onChange={handleFilterChange}
              displayEmpty
              overflow="scroll"
            >
              <MenuItem disabled value="">Select Division</MenuItem>
              {/* <MenuItem value="">{filters.sector ? "Select Division" : "Please select sector first"}</MenuItem> */}
              {!filters.sector && <MenuItem disabled sx={{ color: "red", fontStyle: "italic" }}>
                Please select sector first
              </MenuItem>}

              {filters.sector &&
                (divisionData?.filter((division) => division.sector === filters.sector) ?? [])
                  .map((division) => (
                    <MenuItem key={division.id} value={division.id}>
                      {division.name}
                    </MenuItem>
                  ))}
            </Select>)}
            
          {authInfo.user.sector_id && (
            <Select
              name="division"
              value={filters.division}
              onChange={handleFilterChange}
              displayEmpty
              overflow="scroll"
            >
              <MenuItem disabled value="">Select Division</MenuItem>

                {(divisionData?.filter((division) => division.sector === authInfo.user.sector_id) ?? [])
                  .map((division) => (
                    <MenuItem key={division.id} value={division.id}>
                      {division.name}
                    </MenuItem>
                  ))}
            </Select>
            )}
          </FormControl>

          {/* KPIs Dropdown */}
          <FormControl fullWidth variant="outlined">
            <Select
              name="kpi"
              value={filters.kpi}
              onChange={handleFilterChange}
              displayEmpty
              overflow="scroll"
            >
              <MenuItem value="">Select KPI</MenuItem>
              {(kpiData || []).map((kpi) => (
                <MenuItem key={kpi.id} value={kpi.id}>
                  {kpi.kpi_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filter & Clear Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleFilter}>
              Filter
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
              Clear
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default FilterDropdown;
