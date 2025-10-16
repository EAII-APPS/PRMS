import React, { useEffect, useState, useRef } from "react";
import ApexCharts from "apexcharts";

function KpisectorGraph({ data }) {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);
  const apexChartRef = useRef(null); // Store ApexCharts instance

  useEffect(() => {
    if (data && data.length) {
      const sectorName = data.map((item) => item.sector);
      const performancePercentages = data.map((item) =>
        typeof item.average_performance === "string"
          ? parseFloat(item.average_performance.replace("%", ""))
          : item.average_performance
      );

      setChartData({ sectorName, performancePercentages });
    }
  }, [data]);

  useEffect(() => {
    if (chartData && chartRef.current) {
      const colors = chartData.performancePercentages.map((percent) =>
        percent > 90 ? "#00E396" : "#008FFB"
      );

      const chartOptions = {
        series: [
          {
            name: "Performance Percentage",
            data: chartData.performancePercentages,
          },
        ],
        chart: {
          type: 'bar',
          height: 350,
          width: "100%", // Set to 100% to respect the container width
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val}%`,
        },
        xaxis: {
          categories: chartData.sectorName,
          labels: {
            style: {
              fontSize: "14px",
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        legend: {
          show: false,
        },
        fill: {
          colors: colors,
        },
      };

      if (!apexChartRef.current) {
        apexChartRef.current = new ApexCharts(chartRef.current, chartOptions);
        apexChartRef.current.render();
      } else {
        apexChartRef.current.updateOptions(chartOptions);
      }
    }

    return () => {
      if (apexChartRef.current) {
        apexChartRef.current.destroy();
        apexChartRef.current = null;
      }
    };
  }, [chartData]);

  return (
    <>
    <div
      ref={chartRef}
      className="mx-auto"
    >
    </div>
    <h1 className="sticky bottom-0 text-center bg-white font-bold">KPI Performance Per Sector</h1>
      </>
  );
}

export default KpisectorGraph;
