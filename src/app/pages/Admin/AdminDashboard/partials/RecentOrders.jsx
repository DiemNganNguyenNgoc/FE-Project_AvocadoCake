import React, { useState, useEffect, useMemo } from "react";
import { Filter, Eye } from "lucide-react";
import { DashboardService } from "../services/dashboardService";
import { cn } from "../../../../../utils/cn";

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

  const getStatusColor = (status) => {
    const statusMap = {
      Delivered: "bg-green-light-7 text-green-dark",
      "Đã giao hàng": "bg-green-light-7 text-green-dark",
      Processing: "bg-yellow-light-4 text-yellow-dark",
      "Đang xử lý": "bg-yellow-light-4 text-yellow-dark",
      Cancelled: "bg-red-light-6 text-red-dark",
      "Đã hủy": "bg-red-light-6 text-red-dark",
      Pending: "bg-blue-light-5 text-blue-dark",
      "Chờ xử lý": "bg-blue-light-5 text-blue-dark",
    };
    return statusMap[status] || "bg-gray-2 text-dark-4";
  };

  const filteredOrders = useMemo(() => {
    if (selectedFilter === "All") return orders;
    return orders.filter((order) =>
      order.status.toLowerCase().includes(selectedFilter.toLowerCase())
    );
  }, [orders, selectedFilter]);

  if (loading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-1/3 rounded bg-gray-2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded bg-gray-2"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-6 xl:px-7.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-medium text-dark dark:text-white text-body-2xlg">
              Đơn hàng gần đây
            </h2>
            <p className="mt-1 text-body-sm text-dark-6 dark:text-dark-6">
              Danh sách đơn hàng mới nhất
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="appearance-none rounded-md border border-stroke bg-white px-4 py-2 pr-10 text-sm font-medium text-dark outline-none transition-colors hover:border-primary focus:border-primary dark:border-dark-3 dark:bg-gray-dark dark:text-white"
              >
                <option value="All">Tất cả</option>
                <option value="Delivered">Đã giao</option>
                <option value="Processing">Đang xử lý</option>
                <option value="Cancelled">Đã hủy</option>
                <option value="Pending">Chờ xử lý</option>
              </select>
              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-4" />
            </div>

            <button className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-blue-light-5">
              <Eye className="h-4 w-4" />
              Xem tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-4 sm:p-6 xl:p-7.5">
        {filteredOrders.length === 0 ? (
          <div className="py-8 text-center text-dark-6 dark:text-dark-6">
            Không có đơn hàng nào
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Mã đơn hàng
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Giá trị
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-gray-1 dark:hover:bg-dark-2"
                >
                  <td className="px-4 py-4">
                    <span className="font-medium text-primary">
                      {order.orderCode || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-dark-4 dark:text-dark-6">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-4 font-medium text-dark dark:text-white">
                    {order.price}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                        getStatusColor(order.status)
                      )}
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
