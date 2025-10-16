import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../GlobalContexts/Auth-Context";


const PieChart = ({ data }) => {
  const authInfo = useAuth();
  
  // Check if data is valid and contains the expected 'pie' structure
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div></div>;
  }

  // Extract labels (sector names) and series (values) dynamically
  const labels = data.map((item) => item.sector);  // Use 'sector' as label
  const series = data.map((item) => item.value);  // Use 'value' as series data

  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels, // Set the labels for the pie chart
    colors: ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"], // Define more colors if needed
    legend: {
      position: "bottom",
      fontSize: "14px",
      labels: { colors: "#888" },
    },
  };

  return (
    <Card sx={{ width: "35%", p: 2, boxShadow: 3, borderRadius: 2, mx: "auto" }}>
      <CardContent>
        {authInfo.user.monitoring_id && (
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Sector performance overview
          </Typography>
        )}
        {authInfo.user.is_superadmin  && (
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Sector performance overview
          </Typography>
        )}
        {authInfo.user.sector_id && (
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Division performance overview
          </Typography>
        )}


        <ReactApexChart options={chartOptions} series={series} type="pie" height={250} />
      </CardContent>
    </Card>
  );
};

export default PieChart;
