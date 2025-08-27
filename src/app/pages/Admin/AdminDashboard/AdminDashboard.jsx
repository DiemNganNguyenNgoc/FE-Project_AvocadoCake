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

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    newOrders: 0,
    newCustomers: 0,
    newProducts: 0,
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
      value: dashboardData.newOrders.toLocaleString(),
      change: 0.43,
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      color: "bg-green-500",
      progress: 75,
    },
    {
      title: "New Customers This week",
      value: dashboardData.newCustomers.toLocaleString(),
      change: 0.39,
      icon: <Users className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
      progress: 65,
    },
    {
      title: "New Products This week",
      value: dashboardData.newProducts.toLocaleString(),
      change: 0.39,
      icon: <Package className="w-6 h-6 text-white" />,
      color: "bg-orange-500",
      progress: 45,
    },
  ];

  // Thêm thống kê tổng quan
  const overviewStats = [
    {
      title: "Tổng người dùng",
      value: dashboardData.totalUsers.toLocaleString(),
      icon: <Users className="w-6 h-6 text-white" />,
      color: "bg-purple-500",
    },
    {
      title: "Tổng đơn hàng",
      value: dashboardData.totalOrders.toLocaleString(),
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      color: "bg-indigo-500",
    },
    {
      title: "Sản phẩm đã bán",
      value: dashboardData.totalProductsSold.toLocaleString(),
      icon: <Package className="w-6 h-6 text-white" />,
      color: "bg-pink-500",
    },
    {
      title: "Tổng doanh thu",
      value: `${dashboardData.totalRevenue.toLocaleString()} VND`,
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards Row - Tuần này */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Overview Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Monthly Target */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <MonthlyTarget />
          </div>

          {/* Analytics Charts */}
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VisitorsAnalytics />
            <RevenueAnalytics />
          </div>
        </div>

        {/* Overall Revenue */}
        <div className="mb-8">
          <OverallRevenue />
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders />
          <TopProducts />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
