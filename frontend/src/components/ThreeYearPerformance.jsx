import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card } from "@mui/material";

const ThreeYearPerformanceChart = ({ chartData }) => {
  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      zoom: { enabled: false },
      toolbar: {
        show: true,  // This will display the toolbar
        tools: {
          download: true,  // Enables the download button
          zoom: false,  // Disable zoom if you don't need it
          pan: false,  // Disable pan if you don't need it
          reset: false  // Disable reset zoom button
        },}  
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Year"
      }
    },
    yaxis: {
      title: {
        text: "Three year Performance"
      }
    },
    tooltip: {
      x: {
        formatter: (val) => `Year ${val}`
      }
    },
    legend: {
      position: 'top'
    },
    colors: ["#00E396", "#FEB019", "#008FFB", "#FF4560"]
  };

  return (
    <div className="w-full">
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, mx: "auto", mt: 2 }}>
      <ReactApexChart
        options={chartOptions}
        series={chartData.series}
        type="area"
        height={350}
      />
    </Card>
    </div>
  );
};

export default ThreeYearPerformanceChart;