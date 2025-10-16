import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material";

const LineChart = () => {
  const [chartOptions] = useState({
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: { curve: "smooth", width: 3 },
    grid: { borderColor: "#e0e0e0", strokeDashArray: 5 },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      labels: { style: { colors: "#888", fontSize: "12px" } },
    },
    yaxis: {
      min: 0,
      max: 1600,
      labels: { style: { colors: "#888", fontSize: "12px" } },
    },
    tooltip: { theme: "dark" },
    colors: ["#4CAF50"], // Green Line
  });

  const [series] = useState([
    { 
      name: "Performance", 
      data: [400, 550, 800, 750, 900, 1200, 1100, 950, 1300, 1250, 1400, 1500]
    }
  ]);

  return (
    <Card sx={{ width: "63%", p: 2, boxShadow: 3, borderRadius: 2, mx: "auto" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Performance Over Time
        </Typography>
        <ReactApexChart options={chartOptions} series={series} type="line" height={250} width="100%" />
      </CardContent>
    </Card>
  );
};

export default LineChart;
