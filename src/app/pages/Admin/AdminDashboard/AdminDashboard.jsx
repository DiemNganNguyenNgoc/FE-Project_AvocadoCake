import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import AdvancedTopProductsChart from "./partials/AdvancedTopProductsChart";
import OverallRevenue from "./partials/OverallRevenue";
import RecentOrders from "./partials/RecentOrders";
import StatCard from "../../../components/AdminLayout/StatCard";
import TopProducts from "./partials/TopProducts";
import TopProductsChart from "./partials/TopProductsChart";
import { DashboardService } from "./services/dashboardService";
import { useAdminLanguage } from "../../../context/AdminLanguageContext";

const AdminDashboard = () => {
  const { t } = useAdminLanguage();
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

  // Dữ liệu thống kê từ API - Tuần này
  const statsData = [
    {
      title: t("newOrdersThisWeek"),
      value: (dashboardData.newOrders || 0).toLocaleString(),
      change: Number((dashboardData.newOrdersChangePct || 0).toFixed(2)),
      icon: <ShoppingCart className="h-6 w-6 text-white" />,
      color: "bg-green",
      progress: Math.round(dashboardData.newOrdersProgress || 0),
      subtitle: `${t("lastWeek")}: ${(
        dashboardData.newOrdersPrev || 0
      ).toLocaleString()}`,
    },
    {
      title: t("newCustomersThisWeek"),
      value: (dashboardData.newCustomers || 0).toLocaleString(),
      change: Number((dashboardData.newCustomersChangePct || 0).toFixed(2)),
      icon: <Users className="h-6 w-6 text-white" />,
      color: "bg-blue",
      progress: Math.round(dashboardData.newCustomersProgress || 0),
      subtitle: `${t("lastWeek")}: ${(
        dashboardData.newCustomersPrev || 0
      ).toLocaleString()}`,
    },
    {
      title: t("newProductsThisWeek"),
      value: (dashboardData.newProducts || 0).toLocaleString(),
      change: Number((dashboardData.newProductsChangePct || 0).toFixed(2)),
      icon: <Package className="h-6 w-6 text-white" />,
      progress: Math.round(dashboardData.newProductsProgress || 0),
      color: "bg-orange-light",
      subtitle: `${t("lastWeek")}: ${(
        dashboardData.newProductsPrev || 0
      ).toLocaleString()}`,
    },
  ];

  // Thống kê tổng quan
  const overviewStats = [
    {
      title: t("totalUsers"),
      value: (dashboardData.totalUsers || 0).toLocaleString(),
      icon: <Users className="h-6 w-6 text-white" />,
      color: "bg-primary",
    },
    {
      title: t("totalOrders"),
      value: (dashboardData.totalOrders || 0).toLocaleString(),
      icon: <ShoppingCart className="h-6 w-6 text-white" />,
      color: "bg-blue",
    },
    {
      title: t("productsSold"),
      value: (dashboardData.totalProductsSold || 0).toLocaleString(),
      icon: <Package className="h-6 w-6 text-white" />,
      color: "bg-orange-light",
    },
    {
      title: t("totalRevenue"),
      value: `${(dashboardData.totalRevenue || 0).toLocaleString()} ₫`,
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      color: "bg-green",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          {t("dashboardTitle")}
        </h1>
        <p className="mt-2 text-body-sm text-dark-6 dark:text-dark-6">
          {t("dashboardSubtitle")}
        </p>
      </div>

      {/* Weekly Stats - Grid 3 columns */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:gap-7.5">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Overview Stats - Grid 4 columns */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {overviewStats.map((stat, index) => (
          <StatCard key={index} {...stat} hideProgress />
        ))}
      </div>

      {/* Charts Section - Full width */}
      <div className="grid gap-4 sm:gap-6 2xl:gap-7.5">
        <OverallRevenue />
      </div>

      <div className="grid gap-4 sm:gap-6 2xl:gap-7.5">
        <RecentOrders />
      </div>

      {/* Additional Analytics */}
      <div className="grid gap-4 sm:gap-6 2xl:gap-7.5">
        <TopProducts />
      </div>

      <div className="grid gap-4 sm:gap-6 2xl:gap-7.5">
        <TopProductsChart />
      </div>

      <div className="grid gap-4 sm:gap-6 2xl:gap-7.5">
        <AdvancedTopProductsChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
