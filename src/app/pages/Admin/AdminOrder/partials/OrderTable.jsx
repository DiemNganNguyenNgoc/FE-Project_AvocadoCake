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
      <div className="text-center py-8 text-gray-500">
        No orders found. Please adjust your filters or try again later.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedOrders.length === orders.length && orders.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("_id")}
              >
                <div className="flex items-center gap-1">
                  No
                  {getSortIcon("_id")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("orderCode")}
              >
                <div className="flex items-center gap-1">
                  Code
                  {getSortIcon("orderCode")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("userName")}
              >
                <div className="flex items-center gap-1">
                  Client
                  {getSortIcon("userName")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("deliveryDate")}
              >
                <div className="flex items-center gap-1">
                  Deadline
                  {getSortIcon("deliveryDate")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("finalPrice")}
              >
                <div className="flex items-center gap-1">
                  Total
                  {getSortIcon("finalPrice")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status
                  {getSortIcon("status")}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => handleSelectOrder(order._id)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="text-green-600 font-medium">
                    {order.orderCode}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {order.userName ||
                    order.userId?.userName ||
                    order.shippingAddress?.userName ||
                    "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {order.formatDate(order.deliveryDate || order.deadline)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {order.formatPrice(order.finalPrice)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.getStatusColor()}`}
                  >
                    {order.status?.statusName || "Unknown"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-150"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEditOrder(order)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors duration-150"
                      title="Edit order"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteOrder(order)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
                      title="Delete order"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không có đơn hàng nào được tìm thấy.
        </div>
      )}
    </div>
  );
};

export default OrderTable;
