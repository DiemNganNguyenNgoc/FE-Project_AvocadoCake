import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Truck, Package, XCircle } from "lucide-react";
import { useAdminOrderStore } from "../adminOrderStore";
import * as StatusService from "../../../../api/services/StatusService";

const UpdateOrderStatus = ({ onBack }) => {
  const { selectedOrders, updateMultipleOrderStatuses, clearSelection } =
    useAdminOrderStore();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);

  // Fetch statuses from database
  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");
      const response = await StatusService.getAllStatus(accessToken);
      const statusData = response.data || response;

      if (Array.isArray(statusData)) {
        const options = statusData.map((status) => {
          // Map status names to appropriate icons
          let icon = CheckCircle;
          let color = "text-green-600";

          const statusName = status.statusName?.toLowerCase();
          if (statusName?.includes("hủy") || statusName?.includes("cancel")) {
            icon = XCircle;
            color = "text-red-600";
          } else if (
            statusName?.includes("giao") ||
            statusName?.includes("deliver")
          ) {
            icon = Truck;
            color = "text-yellow-600";
          } else if (
            statusName?.includes("làm") ||
            statusName?.includes("process")
          ) {
            icon = Package;
            color = "text-blue-600";
          }

          return {
            id: status._id,
            name: status.statusName,
            icon,
            color,
          };
        });
        setStatusOptions(options);
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
    clearSelection();
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Cập nhật trạng thái đơn hàng
        </h1>
        <p className="text-gray-600 mt-2">
          Đã chọn {selectedOrders.length} đơn hàng để cập nhật
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Trạng thái hiện tại
        </h2>

        <div className="flex items-center justify-between mb-8">
          {statusOptions.map((status, index) => {
            const IconComponent = status.icon;
            const isActive = selectedStatus === status.id;

            return (
              <div key={status.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isActive ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <IconComponent
                    className={`w-6 h-6 ${
                      isActive ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {status.name}
                </span>
                {index < statusOptions.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-6 w-16 h-0.5 bg-gray-200" />
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn trạng thái mới
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {statusOptions.map((status) => {
                const IconComponent = status.icon;
                const isSelected = selectedStatus === status.id;

                return (
                  <button
                    key={status.id}
                    onClick={() => setSelectedStatus(status.id)}
                    className={`p-4 border rounded-lg text-left transition-colors duration-150 ${
                      isSelected
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent
                        className={`w-5 h-5 mr-3 ${
                          isSelected ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          isSelected ? "text-green-900" : "text-gray-700"
                        }`}
                      >
                        {status.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Hủy
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={loading || !selectedStatus}
              className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật trạng thái"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;
