import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const ThreeYearPerformanceChart = ({ chartData }) => {
  const { t } = useTranslation();

  const chartOptions = {
    chart: {
      type: "area",
      fontFamily: 'Inter, sans-serif',
      zoom: { enabled: false },
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: false,
          pan: false,
          reset: false
        },
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3
    },
    xaxis: {
      categories: chartData.categories,
      labels: { style: { colors: "#9ca3af", fontSize: "11px" } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { style: { colors: "#9ca3af", fontSize: "11px" } },
    },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "light",
      x: { formatter: (val) => `${t('MAIN.TABLE.YEAR')} ${val}` }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontWeight: 500,
      labels: { colors: "#6b7280" }
    },
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100]
      }
    },
  };

  return (
    <Card className="w-full shadow-lg border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-shadow mt-6">
      <div className="p-4 border-b border-gray-50 bg-gray-50/30">
        <Typography variant="h6" color="blue-gray" className="font-bold opacity-80 flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          {t('MAIN.DASHBOARD_PAGE.CHARTS.THREE_YEAR_PERFORMANCE')}
        </Typography>
      </div>
      <CardBody className="p-2">
        <ReactApexChart
          options={chartOptions}
          series={chartData.series}
          type="area"
          height={350}
        />
      </CardBody>
    </Card>
  );
};

export default ThreeYearPerformanceChart;