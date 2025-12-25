import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Target,
} from "lucide-react";
import { DashboardService } from "../services/dashboardService";

const BusinessOverview = () => {
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("month"); // 'month' or 'year'

  useEffect(() => {
    fetchBusinessData();
  }, [viewType]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getBusinessOverview(viewType);
      setBusinessData(data);
    } catch (error) {
      console.error("Error fetching business data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    type = "currency",
  }) => {
    const isPositive = change > 0;
    const formattedValue =
      type === "currency" ? formatCurrency(value) : value.toLocaleString();

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-gray-700 font-medium">{title}</h3>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900">{formattedValue}</p>
          <div className="flex items-center space-x-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {Math.abs(change).toFixed(1)}% so với{" "}
              {viewType === "month" ? "tháng trước" : "năm trước"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!businessData) return null;

  return (
    <div className="space-y-6">
      {/* Header with Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Toàn cảnh hiệu suất kinh doanh
          </h2>
          <p className="text-gray-600 mt-1">
            Theo dõi các chỉ số kinh doanh quan trọng
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewType("month")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewType === "month"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            So sánh tháng
          </button>
          <button
            onClick={() => setViewType("year")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewType === "year"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            So sánh năm
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Doanh thu"
          value={businessData.totalSales}
          change={businessData.salesChange}
          icon={DollarSign}
          type="currency"
        />
        <MetricCard
          title="Số lượng bán"
          value={businessData.totalQuantity}
          change={businessData.quantityChange}
          icon={Package}
          type="number"
        />
        <MetricCard
          title="Lợi nhuận"
          value={businessData.totalProfit}
          change={businessData.profitChange}
          icon={Target}
          type="currency"
        />
        <MetricCard
          title="Đơn hàng"
          value={businessData.totalOrders}
          change={businessData.ordersChange}
          icon={Users}
          type="number"
        />
      </div>
    </div>
  );
};

export default BusinessOverview;
