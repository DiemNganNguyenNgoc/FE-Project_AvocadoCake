import React from "react";
import { ChevronUp, ChevronDown, Edit, Trash2, Eye } from "lucide-react";
import { useAdminOrderStore } from "../adminOrderStore";

const OrderTable = ({ onViewOrder, onEditOrder, onDeleteOrder, orders }) => {
  const {
    selectedOrders,
    sortBy,
    sortOrder,
    loading,
    selectOrder,
    selectAllOrders,
    setSortBy,
    setSortOrder,
  } = useAdminOrderStore();

  console.log("orders in OrderTable", orders);
  console.log("loading", loading);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  const handleSelectAll = () => {
    selectAllOrders();
    console.log("selectedOrders", selectedOrders);
  };

  const handleSelectOrder = (orderId) => {
    selectOrder(orderId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Add a fallback message for empty orders
  if (orders.length === 0 && !loading) {
    console.log("No orders found after filtering and pagination.");
    return (
      <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2">
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No orders found. Please adjust your filters or try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-2">
            <tr>
              <th className="px-8 py-4 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedOrders.length === orders.length && orders.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary"
                />
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("_id")}
              >
                <div className="flex items-center gap-2">
                  No
                  {getSortIcon("_id")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("orderCode")}
              >
                <div className="flex items-center gap-2">
                  Code
                  {getSortIcon("orderCode")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("userName")}
              >
                <div className="flex items-center gap-2">
                  Client
                  {getSortIcon("userName")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("deliveryDate")}
              >
                <div className="flex items-center gap-2">
                  Deadline
                  {getSortIcon("deliveryDate")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("finalPrice")}
              >
                <div className="flex items-center gap-2">
                  Total
                  {getSortIcon("finalPrice")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon("status")}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-dark divide-y divide-stroke dark:divide-stroke-dark">
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors"
              >
                <td className="px-8 py-5">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => handleSelectOrder(order._id)}
                    className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-8 py-5 text-base text-gray-900 dark:text-white font-medium">
                  {index + 1}
                </td>
                <td className="px-8 py-5 text-base">
                  <span className="text-primary font-semibold">
                    {order.orderCode}
                  </span>
                </td>
                <td className="px-8 py-5 text-base text-gray-900 dark:text-white">
                  {order.userName ||
                    order.userId?.userName ||
                    order.shippingAddress?.userName ||
                    "N/A"}
                </td>
                <td className="px-8 py-5 text-base text-gray-500 dark:text-gray-400">
                  {order.formatDate(order.deliveryDate || order.deadline)}
                </td>
                <td className="px-8 py-5 text-base text-gray-900 dark:text-white font-semibold">
                  {order.formatPrice(order.finalPrice)}
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${order.getStatusColor()}`}
                  >
                    {order.status?.statusName || "Unknown"}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="p-2.5 text-green hover:text-green-dark hover:bg-green-light-7 dark:hover:bg-dark-3 rounded-xl transition-all"
                      title="View details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEditOrder(order)}
                      className="p-2.5 text-primary hover:text-primary/80 hover:bg-blue-light-5 dark:hover:bg-dark-3 rounded-xl transition-all"
                      title="Edit order"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDeleteOrder(order)}
                      className="p-2.5 text-red hover:text-red-dark hover:bg-red-light-6 dark:hover:bg-dark-3 rounded-xl transition-all"
                      title="Delete order"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-base">
          Không có đơn hàng nào được tìm thấy.
        </div>
      )}
    </div>
  );
};

export default OrderTable;
