import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import MonthlyTarget from "./partials/MonthlyTarget";
import OverallRevenue from "./partials/OverallRevenue";
import RecentOrders from "./partials/RecentOrders";
import RevenueAnalytics from "./partials/RevenueAnalytics";
import StatCard from "./partials/StatCard";
import TopProducts from "./partials/TopProducts";
import VisitorsAnalytics from "./partials/VisitorsAnalytics";
import { DashboardService } from "./services/dashboardService";
import BusinessOverview from "./partials/BusinessOverview";
import CustomerProfile from "./partials/CustomerProfile";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    newOrders: 0,
    newCustomers: 0,
    newOrdersPrev: 0,
    newCustomersPrev: 0,
    newOrdersChangePct: 0,
    newCustomersChangePct: 0,
    newOrdersProgress: 0,
    newCustomersProgress: 0,
    newProducts: 0,
    newProductsPrev: 0,
    newProductsChangePct: 0,
    newProductsProgress: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalProductsSold: 0,
    totalCoinsUsed: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await DashboardService.getDashboardData();
        setDashboardData(data.stats);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Dữ liệu thống kê từ API
  const statsData = [
    {
      title: "New Orders This week",
      value: (dashboardData.newOrders || 0).toLocaleString(),
      change: Number((dashboardData.newOrdersChangePct || 0).toFixed(2)),
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      color: "bg-green-500",
      progress: Math.round(dashboardData.newOrdersProgress || 0),
      subtitle: `Prev: ${(dashboardData.newOrdersPrev || 0).toLocaleString()}`,
    },
    {
      title: "New Customers This week",
      value: (dashboardData.newCustomers || 0).toLocaleString(),
      change: Number((dashboardData.newCustomersChangePct || 0).toFixed(2)),
      icon: <Users className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
      progress: Math.round(dashboardData.newCustomersProgress || 0),
      subtitle: `Prev: ${(
        dashboardData.newCustomersPrev || 0
      ).toLocaleString()}`,
    },
    {
      title: "New Products This week",
      value: (dashboardData.newProducts || 0).toLocaleString(),
      change: Number((dashboardData.newProductsChangePct || 0).toFixed(2)),
      icon: <Package className="w-6 h-6 text-white" />,
      progress: Math.round(dashboardData.newProductsProgress || 0),
      color: "bg-orange-500",
      subtitle: `Prev: ${(
        dashboardData.newProductsPrev || 0
      ).toLocaleString()}`,
    },
  ];

  // Thêm thống kê tổng quan
  const overviewStats = [
    {
      title: "Tổng người dùng",
      value: (dashboardData.totalUsers || 0).toLocaleString(),
      icon: <Users className="w-6 h-6 text-white" />,
      color: "bg-purple-500",
    },
    {
      title: "Tổng đơn hàng",
      value: (dashboardData.totalOrders || 0).toLocaleString(),
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      color: "bg-indigo-500",
    },
    {
      title: "Sản phẩm đã bán",
      value: (dashboardData.totalProductsSold || 0).toLocaleString(),
      icon: <Package className="w-6 h-6 text-white" />,
      color: "bg-pink-500",
    },
    {
      title: "Tổng doanh thu",
      value: `${(dashboardData.totalRevenue || 0).toLocaleString()} VND`,
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="w-full mx-auto">
        {/* Page Title */}
        <h1 className="text-[2rem] font-semibold text-gray-900 mb-4">
          Bảng điều khiển
        </h1>
        {/* Stats Cards Row - Tuần này */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Overview Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {overviewStats.map((stat, index) => (
            <StatCard key={index} {...stat} hideProgress />
          ))}
        </div>

        {/* Monthly Target */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* <div className="lg:col-span-1">
            <MonthlyTarget />
          </div> */}

          {/* Analytics Charts */}
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* <VisitorsAnalytics /> */}
            <RevenueAnalytics />
          </div>
        </div>

        {/* Overall Revenue */}
        <div className="mb-6">
          <OverallRevenue />
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 gap-4">
          <RecentOrders />
          <TopProducts />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
