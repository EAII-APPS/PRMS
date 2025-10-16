import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, TextField, Box } from "@mui/material";

const DashboardTable = ( { data = [] } ) => {
  const [search, setSearch] = useState("");

  // Add unique IDs to the dataset for DataGrid
  const rows = data.map((item, index) => ({ id: index + 1, ...item }));

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "kpi", headerName: "KPI Name", flex: 1 },
    { field: "weight", headerName: "Weight", flex: 1 },
    { field: "total_plan", headerName: "Total Plan", flex: 1 },
    { field: "q1_performance(%)", headerName: "Q1 (%)", flex: 1 },
    { field: "q2_performance(%)", headerName: "Q2 (%)", flex: 1 },
    { field: "q3_performance(%)", headerName: "Q3 (%)", flex: 1 },
    { field: "q4_performance(%)", headerName: "Q4 (%)", flex: 1 },
    { field: "total_performance(%)", headerName: "Total Performance (%)", flex: 1 },
  ];

  // Filter rows based on search input (KPI name)
  const filteredRows = rows.filter((row) =>
    row.kpi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card sx={{ width: "100%", p: 2, boxShadow: 3, borderRadius: 2, mt: 2 }}>
      <CardContent>
        {/* Search Input */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Search by KPI Name"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {/* Data Table */}
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            pagination
            disableColumnMenu
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardTable;
