import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material";

const Barchart = ({ chartData }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar", // Change to bar chart
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    grid: { borderColor: "#e0e0e0", strokeDashArray: 5 },
    xaxis: {
      categories: [], // Categories will be populated dynamically
      labels: { 
        show: false
      }
    },
    yaxis: {
      min: 0,
      labels: { style: { colors: "#888", fontSize: "12px" } },
    },
    tooltip: { theme: "dark" },
    colors: ["#4CAF50"], // Green bars
  });

  const [series, setSeries] = useState([
    { name: "Performance", data: [] } // Dynamic data will be populated here
  ]);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const categories = chartData.map((item) => item.strategic_goal);
      const performanceData = chartData.map((item) => item.performance_percentage);
  
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: { ...prevOptions.xaxis, categories },
      }));
  
      setSeries([{ name: "Performance", data: performanceData }]);
    }
  }, [chartData]);
  

  return (
    <Card sx={{ width: "63%", p: 2, boxShadow: 3, borderRadius: 2, mx: "auto" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Performance Per Strategic Goal
        </Typography>
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          height={250}
          width="100%"
        />
      </CardContent>
    </Card>
  );
};

export default Barchart;
