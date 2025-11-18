import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  Package,
  XCircle,
  Clock,
} from "lucide-react";
import * as StatusService from "../../../../api/services/StatusService";
import Button from "../../../../components/AdminLayout/Button";

const UpdateOrderStatus = ({
  onBack,
  selectedOrders = [],
  orders = [],
  updateMultipleOrderStatuses,
  clearSelection,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(-1);

  // Fetch statuses from database
  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");
      const response = await StatusService.getAllStatus(accessToken);
      const statusData = response.data || response;

      if (Array.isArray(statusData)) {
        setStatusOptions(statusData);

        // Get current status of selected orders
        if (selectedOrders.length > 0) {
          const selectedOrdersData = orders.filter((order) =>
            selectedOrders.includes(order._id)
          );
          if (selectedOrdersData.length > 0) {
            const currentStatus = selectedOrdersData[0].status;
            const index = statusData.findIndex(
              (status) => status._id === currentStatus?._id
            );
            setCurrentStatusIndex(index);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      setError("Không thể tải danh sách trạng thái");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const getSelectedOrdersData = () => {
    if (!orders || !Array.isArray(orders)) return [];
    if (!selectedOrders || !Array.isArray(selectedOrders)) return [];
    return orders.filter((order) => selectedOrders.includes(order._id));
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      setError("Vui lòng chọn trạng thái mới");
      return;
    }

    if (selectedOrders.length === 0) {
      setError("Vui lòng chọn ít nhất một đơn hàng");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await updateMultipleOrderStatuses(selectedOrders, selectedStatus);
      clearSelection();
      onBack();
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (clearSelection && typeof clearSelection === "function") {
      clearSelection();
    }
    onBack();
  };

  const selectedOrdersData = getSelectedOrdersData();

  // If no orders selected, show message
  if (selectedOrders.length === 0) {
    return (
      <div className="w-full mx-auto p-6">
        <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 border border-stroke dark:border-stroke-dark p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-heading-6 font-bold text-gray-900 dark:text-white mb-2">
            Chưa có đơn hàng nào được chọn
          </h2>
          <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-6">
            Vui lòng quay lại và chọn ít nhất một đơn hàng để cập nhật trạng
            thái
          </p>
          <Button onClick={handleBack} variant="primary" size="md">
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-dark-2 transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-heading-5 font-bold text-gray-900 dark:text-white">
              Cập nhật trạng thái đơn hàng
            </h1>
            <p className="text-body-sm text-gray-600 dark:text-gray-400 mt-1">
              Đã chọn{" "}
              <span className="font-semibold text-primary">
                {selectedOrders.length}
              </span>{" "}
              đơn hàng để cập nhật
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-5 bg-red-light-6 dark:bg-dark-2 border-l-4 border-red rounded-xl">
          <p className="text-red-dark dark:text-red-light font-medium">
            {error}
          </p>
        </div>
      )}

      {/* Progress Line Section */}
      <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 border border-stroke dark:border-stroke-dark p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-6 font-bold text-gray-900 dark:text-white">
            Trạng thái đơn hàng
          </h2>
          <div className="text-body-sm text-gray-600 dark:text-gray-400">
            Click vào trạng thái để chọn
          </div>
        </div>

        {/* Progress Line */}
        {statusOptions.length > 0 && currentStatusIndex >= 0 && (
          <div className="mb-12">
            <div className="relative">
              {/* Background Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-dark-3 rounded-full" />

              {/* Progress Line */}
              <div
                className="absolute top-6 left-0 h-1 bg-avocado-green-100 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (currentStatusIndex / (statusOptions.length - 1)) * 100
                  }%`,
                }}
              />

              {/* Status Points */}
              <div className="relative flex justify-between">
                {statusOptions.map((status, index) => {
                  const isCompleted = index < currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const isSelected = selectedStatus === status._id;

                  return (
                    <div
                      key={status._id}
                      className="flex flex-col items-center"
                      style={{ flex: 1 }}
                    >
                      {/* Circle */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCurrent
                            ? "bg-avocado-green-100 ring-4 ring-avocado-green-30 cursor-not-allowed opacity-70"
                            : isSelected
                            ? "bg-primary ring-4 ring-primary/30 scale-110 cursor-pointer"
                            : isCompleted
                            ? "bg-avocado-green-100 cursor-pointer hover:ring-2 hover:ring-avocado-green-50"
                            : "bg-gray-200 dark:bg-dark-3 hover:bg-gray-300 dark:hover:bg-dark-4 cursor-pointer"
                        }`}
                        onClick={() => {
                          if (!isCurrent) {
                            setSelectedStatus(status._id);
                          }
                        }}
                      >
                        {isCurrent && !isSelected && (
                          <Truck className="w-6 h-6 text-avocado-brown-100" />
                        )}
                        {isCompleted && !isCurrent && !isSelected && (
                          <CheckCircle2 className="w-6 h-6 text-avocado-brown-100" />
                        )}
                        {isSelected && (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        )}
                        {!isCompleted && !isCurrent && !isSelected && (
                          <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-dark-5" />
                        )}
                      </div>

                      {/* Label */}
                      <p
                        className={`mt-3 text-center text-body-sm font-medium transition-colors ${
                          isSelected
                            ? "text-primary"
                            : isCurrent
                            ? "text-avocado-green-100"
                            : isCompleted
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {status.statusName}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Orders List */}
      <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 border border-stroke dark:border-stroke-dark p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-heading-6 font-bold text-gray-900 dark:text-white">
            Danh sách đơn hàng được chọn
          </h3>
          <div className="px-4 py-2 bg-blue-light-5 dark:bg-dark-3 text-primary font-semibold rounded-xl text-body-sm">
            {selectedOrdersData.length} đơn hàng
          </div>
        </div>

        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-3 mb-2 border-b-2 border-stroke dark:border-stroke-dark">
          <div className="flex items-center gap-4 min-w-[200px]">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              STT
            </span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Mã đơn hàng
            </span>
          </div>
          <div className="min-w-[180px]">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Ngày tạo
            </span>
          </div>
          <div className="min-w-[140px] text-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Trạng thái
            </span>
          </div>
          <div className="min-w-[140px] text-right">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tổng tiền
            </span>
          </div>
        </div>

        {/* List View */}
        <div className="space-y-3">
          {selectedOrdersData.map((order, index) => (
            <div
              key={order._id}
              className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-2 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-avocado-green-10 hover:border-avocado-green-50 transition-all duration-200"
            >
              {/* Left: Order Number + Index */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-8 h-8 rounded-full bg-avocado-green-30 dark:bg-avocado-green-80 flex items-center justify-center">
                  <span className="text-sm font-bold text-avocado-brown-100">
                    {index + 1}
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white text-base">
                  {order.orderCode}
                </span>
              </div>

              {/* Middle: Date */}
              <div className="flex items-center gap-2 text-body-sm text-gray-600 dark:text-gray-400 min-w-[180px]">
                <Clock className="w-4 h-4" />
                <span>{order.formatDate(order.createdAt)}</span>
              </div>

              {/* Status */}
              <div className="flex items-center min-w-[140px] justify-center">
                <span
                  className={`inline-flex px-3 py-1.5 text-xs font-medium rounded-full ${order.getStatusColor()}`}
                >
                  {order.status?.statusName}
                </span>
              </div>

              {/* Right: Price */}
              <div className="flex items-center justify-end min-w-[140px]">
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  {order.formatPrice(order.finalPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 border border-stroke dark:border-stroke-dark p-6">
        <div className="flex items-center justify-between">
          <div className="text-body-sm text-gray-600 dark:text-gray-400">
            {selectedStatus ? (
              <span>
                Sẽ cập nhật sang:{" "}
                <span className="font-semibold text-primary">
                  {
                    statusOptions.find((s) => s._id === selectedStatus)
                      ?.statusName
                  }
                </span>
              </span>
            ) : (
              <span>Vui lòng chọn trạng thái mới</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleBack} variant="outline" size="md">
              Hủy
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={loading || !selectedStatus}
              loading={loading}
              variant="primary"
              size="md"
            >
              Xác nhận cập nhật
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;
