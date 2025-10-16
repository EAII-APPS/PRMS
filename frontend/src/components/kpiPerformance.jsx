import React, { useEffect, useState, useRef } from "react";
import ApexCharts from "apexcharts";
import axiosInstance from "../GlobalContexts/Base_url";

function KpiGraphs({ data }) {  // Destructure the data prop here
  const [chartData, setChartData] = useState(null);
  const [chartHeight, setChartHeight] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (data && data.length) { // Check if data is available
        const kpiNames = data.map(item => item.kpi_name);
        const performancePercentages = data.map(item => 
          parseFloat(item.compared_performance_percent.replace('%', ''))
        );

        setChartData({
          kpiNames,
          performancePercentages
        });

        const barHeight = 110; // Fixed height for each bar
        const Height = kpiNames.length * barHeight;
        setChartHeight(Height);
      }
    };

    fetchData();
  }, [data]);  // Add data to the dependency array to rerun if data changes

  useEffect(() => {
    if (chartData && chartRef.current) {
      const colors = chartData.performancePercentages.map(percent => {
        if (percent > 90) {
          return '#00E396'; // Green
        } else if (percent > 70) {
          return '#008FFB'; // Yellow
        } else if (percent < 50) {
          return '#FF4560'; // Red
        } else {
          return '#F9C80E'; // Default Blue
        }
      });

      const chartOptions = {
        series: [
          {
            name: "Performance Percentage",
            data: chartData.performancePercentages,
          },
        ],
        chart: {
          type: 'bar',
          height: chartHeight,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val}%`,
        },
        xaxis: {
          categories: chartData.kpiNames,
          labels: {
            style: {
              fontSize: '14px',
              cssClass: 'apexcharts-xaxis-label',
            },
          }
        },
        legend: {
          show: false,
        },
        fill: {
          colors: colors,
        },
      };

      const chart = new ApexCharts(chartRef.current, chartOptions);
      chart.render();

      // Cleanup function to destroy the chart when the component unmounts or data changes
      return () => {
        chart.destroy();
      };
    }
  }, [chartData, chartHeight]);  // Ensure chartHeight is part of dependency

  return (
<div className="overflow-scroll max-h-[400px]">
  <div className="sticky top-0 bg-white z-10">
    <h4>Legend:</h4>
    <div className="flex items-center">
      <span className="w-4 h-4 bg-green-500 inline-block mr-2"></span>
      <span>Greater than 90%</span>
    </div>
    <div className="flex items-center">
      <span className="w-4 h-4 bg-yellow-500 inline-block mr-2"></span>
      <span>Greater than 70%</span>
    </div>
    <div className="flex items-center">
      <span className="w-4 h-4 bg-blue-500 inline-block mr-2"></span>
      <span>Greater than 50%</span>
    </div>
    <div className="flex items-center">
      <span className="w-4 h-4 bg-red-500 inline-block mr-2"></span>
      <span>Less than 50%</span>
    </div>
  </div>
  <div className="h-auto" ref={chartRef}></div>
  <h1 className="sticky bottom-0 text-center bg-white font-bold">KPI Performance</h1>
</div>

  );
}

export default KpiGraphs;
