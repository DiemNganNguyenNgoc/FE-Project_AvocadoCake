import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { DashboardService } from "../services/dashboardService";

const CustomerAnalytics = () => {
  const [customerData, setCustomerData] = useState({
    newCustomers: 0,
    returningCustomers: 0,
    totalCustomers: 0,
    customerGrowth: 0,
    segments: [],
  });
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const [hoveredSegment, setHoveredSegment] = useState(null);

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        const [dashboardData] = await Promise.all([
          DashboardService.getDashboardData(),
          DashboardService.getCustomerProfile(),
        ]);

        // Calculate customer metrics
        const totalCustomers = dashboardData.stats.totalUsers || 0;
        const newCustomers = dashboardData.stats.newCustomers || 0;
        const returningCustomers = Math.max(0, totalCustomers - newCustomers);
        const customerGrowth = dashboardData.stats.newCustomersChangePct || 0;

        // Prepare segments data for donut chart
        const segments = [
          {
            name: "New Customers",
            value: newCustomers,
            percentage:
              totalCustomers > 0 ? (newCustomers / totalCustomers) * 100 : 0,
            color: "#3b82f6", // blue
            icon: UserPlus,
          },
          {
            name: "Returning Customers",
            value: returningCustomers,
            percentage:
              totalCustomers > 0
                ? (returningCustomers / totalCustomers) * 100
                : 0,
            color: "#10b981", // emerald
            icon: UserCheck,
          },
        ];

        setCustomerData({
          newCustomers,
          returningCustomers,
          totalCustomers,
          customerGrowth,
          segments,
        });
      } catch (error) {
        console.error("Error loading customer data:", error);
      }
    };

    loadCustomerData();
  }, []);

  // Donut chart calculations
  const radius = 70;
  const strokeWidth = 20;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  let cumulativePercentage = 0;

  return (
    <div className="bg-gradient-to-br from-white via-emerald-50/30 to-blue-50/30 rounded-3xl border border-gray-200/60 p-6 shadow-lg backdrop-blur-sm">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-[2.2rem] font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
              Customer Analytics
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Phân tích khách hàng và xu hướng
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur rounded-2xl p-3 border border-gray-200/50">
            {customerData.segments.map((segment, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {segment.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>

          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-white/80 backdrop-blur border border-gray-300/50 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all duration-200"
            >
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 mb-6">
        <div className="flex items-center justify-center">
          {/* Donut Chart */}
          <div className="relative">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90"
            >
              {/* Background circle */}
              <circle
                stroke="#f1f5f9"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />

              {/* Segments */}
              {customerData.segments.map((segment, index) => {
                const strokeDasharray = `${
                  (segment.percentage / 100) * circumference
                } ${circumference}`;
                const strokeDashoffset =
                  (-cumulativePercentage / 100) * circumference;
                cumulativePercentage += segment.percentage;

                return (
                  <circle
                    key={index}
                    stroke={segment.color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className={`transition-all duration-300 cursor-pointer ${
                      hoveredSegment === index ? "opacity-80" : "opacity-100"
                    }`}
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={{
                      filter:
                        hoveredSegment === index
                          ? "drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                          : "none",
                    }}
                  />
                );
              })}
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-gray-900">
                {customerData.totalCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Total Customers
              </div>
              <div className="flex items-center gap-1 mt-1">
                {customerData.customerGrowth > 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                )}
                <span
                  className={`text-sm font-medium ${
                    customerData.customerGrowth > 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {customerData.customerGrowth > 0 ? "+" : ""}
                  {customerData.customerGrowth.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="ml-8 space-y-4">
            {customerData.segments.map((segment, index) => {
              const IconComponent = segment.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                    hoveredSegment === index
                      ? "bg-white/80 shadow-lg scale-105"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div
                    className="p-2 rounded-lg shadow-sm"
                    style={{ backgroundColor: segment.color }}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {segment.name}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {segment.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {segment.percentage.toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer Growth */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Growth Rate</p>
                <p className="text-2xl font-bold text-blue-900">
                  {customerData.customerGrowth > 0 ? "+" : ""}
                  {customerData.customerGrowth.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="text-sm text-blue-600">vs last period</div>
          </div>
        </div>

        {/* New Customers */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500 rounded-xl">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-700">
                  New Customers
                </p>
                <p className="text-2xl font-bold text-emerald-900">
                  {customerData.newCustomers.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-sm text-emerald-600">This period</div>
          </div>
        </div>

        {/* Retention Rate */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-xl">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Retention Rate
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {customerData.totalCustomers > 0
                    ? (
                        (customerData.returningCustomers /
                          customerData.totalCustomers) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className="text-sm text-purple-600">Returning customers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
