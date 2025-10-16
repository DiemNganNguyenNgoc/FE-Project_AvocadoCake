import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { DashboardService } from "../services/dashboardService";
import PeriodPicker from "../../../../components/AdminComponents/PeriodPicker";
import { standardFormat } from "../../../../../utils/formatNumber";

const OverallRevenue = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const months = [
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
  ];
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyItems, setMonthlyItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await DashboardService.getDashboardData();
        setMonthlyRevenue(data.revenueByMonth || []);
        setMonthlyItems(data.productsSoldByMonth || []);
      } catch (e) {
        setMonthlyRevenue([]);
        setMonthlyItems([]);
      }
    };
    load();
  }, []);

  const revenueData = useMemo(() => monthlyRevenue, [monthlyRevenue]);
  const pipelineData = useMemo(() => monthlyItems, [monthlyItems]);

  const totalRevenue = revenueData.reduce((s, v) => s + (v || 0), 0) || 0;
  const totalProducts = pipelineData.reduce((s, v) => s + (v || 0), 0) || 0;

  const options = {
    legend: { show: false },
    colors: ["#3C50E0", "#22AD5C"],
    chart: {
      fontFamily: "Poppins, sans-serif",
      height: 335,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shadeIntensity: 1,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 3,
      hover: { size: 6 },
    },
    grid: {
      borderColor: "#E6EBF1",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      theme: "light",
      style: {
        fontSize: "12px",
        fontFamily: "Poppins, sans-serif",
      },
    },
    xaxis: {
      type: "category",
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
          fontFamily: "Poppins, sans-serif",
        },
        formatter: (value) => {
          if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
          if (value >= 1000) return (value / 1000).toFixed(1) + "K";
          return value.toFixed(0);
        },
      },
    },
  };

  const series = [
    { name: "Doanh thu", data: revenueData },
    { name: "Sản phẩm", data: pipelineData },
  ];

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Tổng quan doanh thu
        </h2>
        <PeriodPicker value={selectedPeriod} onChange={setSelectedPeriod} />
      </div>

      {/* Chart */}
      <div className="overflow-hidden">
        <Chart options={options} series={series} type="area" height={335} />
      </div>

      {/* Summary Stats */}
      <dl className="mt-4 grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="max-sm:mb-3 max-sm:border-b max-sm:pb-3 dark:border-dark-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
            {standardFormat(totalRevenue)} ₫
          </dt>
          <dd className="text-body-sm font-medium text-dark-6 dark:text-dark-6">
            Tổng doanh thu
          </dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            {standardFormat(totalProducts)}
          </dt>
          <dd className="text-body-sm font-medium text-dark-6 dark:text-dark-6">
            Tổng sản phẩm đã bán
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default OverallRevenue;
