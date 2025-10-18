import React, { useState, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useAdminOrderStore } from "./adminOrderStore";
import OrderTable from "./partials/OrderTable";
import Breadcrumb from "./partials/Breadcrumb";
import UpdateOrderStatus from "./usecases/UpdateOrderStatus";
import ViewOrderDetail from "./usecases/ViewOrderDetail";

const AdminOrder = ({ onNavigate }) => {
  const {
    orders,
    selectedOrders,
    loading,
    error,
    fetchOrders,
    deleteOrder,
    clearSelection,
  } = useAdminOrderStore();

  const [currentView, setCurrentView] = useState("main");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (order) => {
    if (onNavigate) {
      onNavigate(`view-detail/${order._id}`);
    } else {
      setCurrentView("view");
    }
  };

  const handleEditOrder = (order) => {
    setCurrentView("edit");
  };

  const handleDeleteOrder = async (order) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${order.orderCode}?`)
    ) {
      try {
        await deleteOrder(order._id);
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const handleUpdateStatus = () => {
    if (selectedOrders.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn hàng để cập nhật trạng thái");
      return;
    }
    if (onNavigate) {
      onNavigate("update-status");
    } else {
      setCurrentView("update-status");
    }
  };

  const handleBackToMain = () => {
    setCurrentView("main");
    clearSelection();
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  // Render different views
  if (currentView === "update-status") {
    return <UpdateOrderStatus onBack={handleBackToMain} />;
  }

  if (currentView === "view") {
    return <ViewOrderDetail onBack={handleBackToMain} />;
  }

  // Main view
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Breadcrumb currentPage="Orders" />
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
            <button
              onClick={handleUpdateStatus}
              disabled={selectedOrders.length === 0}
              className="flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cập nhật trạng thái
            </button>
            <button
              onClick={() => onNavigate("create")}
              className="flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo mới
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Orders Table */}
      <OrderTable
        orders={orders}
        onViewOrder={handleViewOrder}
        onEditOrder={handleEditOrder}
        onDeleteOrder={handleDeleteOrder}
      />
    </div>
  );
};

export default AdminOrder;
