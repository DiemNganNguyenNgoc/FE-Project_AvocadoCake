import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import Chart from "react-apexcharts";
import { DashboardService } from "../services/dashboardService";

const OverallRevenue = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");

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

  const options = {
    legend: { show: false, position: "top", horizontalAlign: "left" },
    colors: ["#3b82f6", "#10b981"],
    chart: {
      fontFamily: "Inter, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: { curve: "straight", width: [2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    xaxis: {
      type: "category",
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: { style: { colors: "#6B7280" } },
    },
    yaxis: {
      labels: { style: { fontSize: "12px", colors: ["#6B7280"] } },
      title: { text: "", style: { fontSize: "0px" } },
    },
  };

  const series = [
    { name: "Revenue", data: revenueData },
    { name: "Products", data: pipelineData },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[2rem] font-bold text-gray-900 leading-tight">
            {(
              revenueData.reduce((s, v) => s + (v || 0), 0) || 0
            ).toLocaleString()}{" "}
            VND
          </h3>
          <p className="text-[1.6rem] text-gray-600">
            Tổng doanh thu theo tháng
          </p>
        </div>

        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-[1.6rem] text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-[1.6rem] text-gray-600">Products</span>
        </div>
      </div>
    </div>
  );
};

export default OverallRevenue;
