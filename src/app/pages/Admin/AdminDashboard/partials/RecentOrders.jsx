import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, Filter, Eye } from "lucide-react";
import { DashboardService } from "../services/dashboardService";

const RecentOrders = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getRecentOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/LogoAvocado.png";
    if (typeof imagePath === "string" && imagePath.startsWith("http"))
      return imagePath;
    // Handle new API response format
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (!path) return "/LogoAvocado.png";

    // Clean up path and create Cloudinary URL
    const cleanPath = String(path).replace(/\\/g, "/").replace(/^\/+/, "");
    if (cleanPath.includes("res.cloudinary.com")) return cleanPath;

    return `https://res.cloudinary.com/dlyl41lgq/image/upload/${cleanPath}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
      case "Đã giao hàng":
        return "bg-green-100 text-green-800";
      case "Processing":
      case "Đang xử lý":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      case "Pending":
      case "Chờ xử lý":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => order.status !== "cancelled");
  }, [orders]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[2rem] font-semibold text-gray-900 leading-tight">
            Recent Orders
          </h3>
          <p className="text-[1.6rem] text-gray-600">
            Danh sách đơn hàng gần đây
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Delivered</option>
              <option>Processing</option>
              <option>Cancelled</option>
              <option>Pending</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <button className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
            See all
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Không có đơn hàng nào
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Code
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Price
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <span className="text-blue-600 font-medium">
                      {order.orderCode || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {order.customerName}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {order.price}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
