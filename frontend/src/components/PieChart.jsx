import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useTranslation } from "react-i18next";

const PieChart = ({ data }) => {
  const authInfo = useAuth();
  const { t } = useTranslation();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const labels = data.map((item) => item.sector);
  const series = data.map((item) => item.value);

  const chartOptions = {
    chart: {
      type: "pie",
      fontFamily: 'Inter, sans-serif',
    },
    labels,
    colors: ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"],
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontWeight: 500,
      labels: { colors: "#6b7280" },
      markers: { radius: 12 }
    },
    stroke: { show: false },
    dataLabels: {
      enabled: true,
      style: { fontSize: '12px', fontWeight: 'bold' },
      dropShadow: { enabled: false }
    },
    tooltip: { theme: 'light' }
  };

  const title = authInfo.user.sector_id
    ? t('MAIN.DASHBOARD_PAGE.CHARTS.DIVISION_PERFORMANCE_OVERVIEW')
    : t('MAIN.DASHBOARD_PAGE.CHARTS.SECTOR_PERFORMANCE_OVERVIEW');

  return (
    <Card className="shadow-lg border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-shadow w-full">
      <div className="p-4 border-b border-gray-50 bg-gray-50/30">
        <Typography variant="h6" color="blue-gray" className="font-bold opacity-80 flex items-center gap-2">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          {title}
        </Typography>
      </div>
      <CardBody className="p-4 flex items-center justify-center">
        <ReactApexChart options={chartOptions} series={series} type="pie" height={320} width="100%" />
      </CardBody>
    </Card>
  );
};

export default PieChart;