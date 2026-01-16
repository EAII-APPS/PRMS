import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const Barchart = ({ chartData }) => {
  const { t } = useTranslation();

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
      },
    },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 4,
      padding: { left: 10, right: 10 }
    },
    xaxis: {
      categories: [],
      labels: {
        show: false,
        style: { colors: "#9ca3af", fontSize: "11px" }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      min: 0,
      labels: { style: { colors: "#9ca3af", fontSize: "11px" } },
    },
    tooltip: {
      theme: "light",
      style: { fontSize: '12px', fontFamily: 'Inter' }
    },
    dataLabels: { enabled: false },
    colors: ["#3b82f6"], // Modern blue
  });

  const [series, setSeries] = useState([
    { name: "Performance", data: [] }
  ]);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const categories = chartData.map((item) => item.strategic_goal);
      const performanceData = chartData.map((item) => item.performance_percentage);

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: { ...prevOptions.xaxis, categories },
      }));

      setSeries([{ name: t('MAIN.DASHBOARD_PAGE.CHARTS.PERFORMANCE'), data: performanceData }]);
    }
  }, [chartData, t]);

  if (!chartData || chartData.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-shadow w-full">
      <div className="p-4 border-b border-gray-50 bg-gray-50/30">
        <Typography variant="h6" color="blue-gray" className="font-bold opacity-80 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full" />
          {t('MAIN.DASHBOARD_PAGE.CHARTS.PERFORMANCE_PER_STRATEGIC_GOAL')}
        </Typography>
      </div>
      <CardBody className="p-2">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          height={280}
          width="100%"
        />
      </CardBody>
    </Card>
  );
};

export default Barchart;