import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAdminOrderStore } from "../adminOrderStore";
import * as StatusService from "../../../../api/services/StatusService";
import Button from "../../../../components/AdminLayout/Button";

const ViewOrderDetail = ({ onBack }) => {
  const { orderId } = useParams();
  const { fetchOrderById, currentOrder, loading, error, updateOrderStatus } =
    useAdminOrderStore();
  const [localLoading, setLocalLoading] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadOrderDetail = async () => {
      if (orderId) {
        setLocalLoading(true);
        try {
          await fetchOrderById(orderId);
        } catch (error) {
          console.error("Error loading order detail:", error);
        } finally {
          setLocalLoading(false);
        }
      }
    };

    loadOrderDetail();
  }, [orderId, fetchOrderById]);

  // Fetch all statuses
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await StatusService.getAllStatus(token);
        if (response.status === "OK" && response.data) {
          // Sắp xếp status theo thứ tự logic
          const statusOrder = {
            PENDING: 1,
            PAID: 2,
            PROCESSING: 3,
            DELIVERING: 4,
            COMPLETED: 5,
            CANCEL: 6,
          };

          const sortedStatuses = [...response.data].sort((a, b) => {
            const orderA = statusOrder[a.statusCode] || 999;
            const orderB = statusOrder[b.statusCode] || 999;
            return orderA - orderB;
          });

          setStatusList(sortedStatuses);
        }
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchStatuses();
  }, []);

  const handleUpdateStatus = async (newStatusId) => {
    if (!currentOrder || !newStatusId) return;

    try {
      setUpdating(true);
      await updateOrderStatus(currentOrder._id, newStatusId);
      // Reload order detail
      await fetchOrderById(orderId);
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setUpdating(false);
    }
  };

  const getCurrentStatusIndex = () => {
    if (!currentOrder || !statusList.length) return -1;
    return statusList.findIndex(
      (status) => status._id === currentOrder.status?._id
    );
  };

  const canMoveToNextStatus = () => {
    const currentIndex = getCurrentStatusIndex();
    if (currentIndex === -1) return false;
    const currentStatus = statusList[currentIndex];
    return (
      currentStatus?.statusCode !== "COMPLETED" &&
      currentStatus?.statusCode !== "CANCEL" &&
      currentIndex < statusList.length - 1
    );
  };

  const getNextStatus = () => {
    const currentIndex = getCurrentStatusIndex();
    if (currentIndex === -1 || currentIndex >= statusList.length - 1)
      return null;
    return statusList[currentIndex + 1];
  };

  const getCancelStatus = () => {
    return statusList.find((status) => status.statusCode === "CANCEL");
  };

  if (localLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy thông tin đơn hàng</p>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();
  const nextStatus = getNextStatus();
  const cancelStatus = getCancelStatus();

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-dark-2 transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-heading-5 font-bold text-gray-900 dark:text-white">
              Chi tiết đơn hàng
            </h1>
            <p className="text-body-sm text-gray-600 dark:text-gray-400 mt-1">
              Mã đơn hàng:{" "}
              <span className="font-semibold text-primary">
                {currentOrder.orderCode}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Progress */}
          <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 border border-stroke dark:border-stroke-dark p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-6 font-bold text-gray-900 dark:text-white">
                Trạng thái đơn hàng
              </h2>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-body-sm text-gray-600 dark:text-gray-400">
                  {currentOrder.formatDate(currentOrder.createdAt)}
                </span>
              </div>
            </div>

            {/* Progress Line */}
            {statusList.length > 0 && (
              <div className="mb-8">
                <div className="relative">
                  {/* Background Line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-dark-3 rounded-full" />

                  {/* Progress Line */}
                  <div
                    className="absolute top-6 left-0 h-1 bg-avocado-green-100 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (currentStatusIndex / (statusList.length - 1)) * 100
                      }%`,
                    }}
                  />

                  {/* Status Points */}
                  <div className="relative flex justify-between">
                    {statusList.map((status, index) => {
                      const isCompleted = index < currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const isCancel = status.statusCode === "CANCEL";

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
                                ? "bg-avocado-green-100 ring-4 ring-avocado-green-30"
                                : isCompleted
                                ? "bg-avocado-green-100"
                                : "bg-gray-200 dark:bg-dark-3"
                            }`}
                          >
                            {isCurrent && (
                              <Truck className="w-6 h-6 text-avocado-brown-100" />
                            )}
                            {isCompleted && !isCurrent && (
                              <CheckCircle2 className="w-6 h-6 text-avocado-brown-100" />
                            )}
                            {!isCompleted && !isCurrent && (
                              <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-dark-5" />
                            )}
                          </div>

                          {/* Label */}
                          <p
                            className={`mt-3 text-center text-body-sm font-medium ${
                              isCurrent
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

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-stroke dark:border-stroke-dark">
              {canMoveToNextStatus() && nextStatus && (
                <Button
                  onClick={() => handleUpdateStatus(nextStatus._id)}
                  disabled={updating}
                  loading={updating}
                  variant="primary"
                  size="md"
                  className="flex-1"
                >
                  Chuyển sang: {nextStatus.statusName}
                </Button>
              )}
              {cancelStatus &&
                currentOrder.status?.statusCode !== "CANCEL" &&
                currentOrder.status?.statusCode !== "COMPLETED" && (
                  <Button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Bạn có chắc chắn muốn hủy đơn hàng này?"
                        )
                      ) {
                        handleUpdateStatus(cancelStatus._id);
                      }
                    }}
                    disabled={updating}
                    loading={updating}
                    variant="danger"
                    size="md"
                  >
                    Hủy đơn
                  </Button>
                )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 border border-stroke dark:border-stroke-dark p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-6 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Package className="w-6 h-6 text-primary" />
                Sản phẩm đã đặt
              </h2>
              <span className="px-4 py-2 bg-blue-light-5 dark:bg-dark-3 text-primary font-semibold rounded-xl text-body-sm">
                {currentOrder.orderItems?.length || 0} sản phẩm
              </span>
            </div>
            <div className="space-y-4">
              {currentOrder.orderItems?.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-5 p-5 border border-stroke dark:border-stroke-dark rounded-2xl hover:shadow-card-2 hover:border-primary/30 transition-all duration-200"
                >
                  <div className="relative">
                    <img
                      src={
                        item.product?.productImage ||
                        item.product?.image ||
                        "/placeholder-product.jpg"
                      }
                      alt={item.product?.productName || item.product?.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    {item.discountPercent > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{item.discountPercent}%
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2">
                      {item.product?.productName ||
                        item.product?.name ||
                        "Sản phẩm"}
                    </h3>
                    <div className="flex items-center gap-4 text-body-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Số lượng:{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Đơn giá:{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {currentOrder.formatPrice(
                            item.product?.productPrice || item.price
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-body-2xlg font-bold text-primary">
                      {currentOrder.formatPrice(
                        item.total || item.price * item.quantity
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 border border-stroke dark:border-stroke-dark p-8">
            <h2 className="text-heading-6 font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-primary" />
              Thông tin thanh toán
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-gray-50 dark:bg-dark-2 rounded-xl">
                <p className="text-body-sm text-gray-500 dark:text-gray-400 mb-2">
                  Phương thức thanh toán
                </p>
                <p className="font-semibold text-gray-900 dark:text-white text-base">
                  {currentOrder.paymentMethod || "Chưa xác định"}
                </p>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-dark-2 rounded-xl">
                <p className="text-body-sm text-gray-500 dark:text-gray-400 mb-2">
                  Trạng thái thanh toán
                </p>
                <p className="font-semibold text-gray-900 dark:text-white text-base">
                  {currentOrder.paymentStatus || "Chưa xác định"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information & Summary */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 border border-stroke dark:border-stroke-dark p-7">
            <h2 className="text-heading-6 font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-light-5 dark:bg-dark-3 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              Khách hàng
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-dark-2 rounded-xl">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-body-xs text-gray-500 dark:text-gray-400 mb-1">
                    Họ tên
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {currentOrder.userName ||
                      currentOrder.userId?.userName ||
                      currentOrder.shippingAddress?.userName ||
                      "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-dark-2 rounded-xl">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-body-xs text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-white break-all">
                    {currentOrder.userEmail ||
                      currentOrder.userId?.userEmail ||
                      currentOrder.shippingAddress?.userEmail ||
                      "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-dark-2 rounded-xl">
                <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-body-xs text-gray-500 dark:text-gray-400 mb-1">
                    Số điện thoại
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {currentOrder.userPhone ||
                      currentOrder.userId?.userPhone ||
                      currentOrder.shippingAddress?.userPhone ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 border border-stroke dark:border-stroke-dark p-7">
            <h2 className="text-heading-6 font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-light-7 dark:bg-dark-3 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green" />
              </div>
              Địa chỉ giao hàng
            </h2>
            <div className="p-5 bg-gray-50 dark:bg-dark-2 rounded-xl space-y-3">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {currentOrder.shippingAddress?.familyName}{" "}
                  {currentOrder.shippingAddress?.userName}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                <p className="text-base text-gray-700 dark:text-gray-300">
                  {currentOrder.shippingAddress?.userPhone}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentOrder.shippingAddress?.userAddress}
                  {currentOrder.shippingAddress?.userWard &&
                    `, ${currentOrder.shippingAddress.userWard}`}
                  {currentOrder.shippingAddress?.userDistrict &&
                    `, ${currentOrder.shippingAddress.userDistrict}`}
                  {currentOrder.shippingAddress?.userCity &&
                    `, ${currentOrder.shippingAddress.userCity}`}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-avocado-green-10 to-white dark:from-dark-2 dark:to-gray-dark rounded-2xl shadow-card-2 border-2 border-avocado-green-30 dark:border-stroke-dark p-7">
            <h2 className="text-heading-6 font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-avocado-green-30 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-avocado-green-100" />
              </div>
              Tổng quan
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-3 rounded-xl">
                <span className="text-body-sm text-gray-600 dark:text-gray-400">
                  Tổng tiền hàng
                </span>
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  {currentOrder.formatPrice(currentOrder.totalItemPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-3 rounded-xl">
                <span className="text-body-sm text-gray-600 dark:text-gray-400">
                  Phí vận chuyển
                </span>
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  {currentOrder.formatPrice(currentOrder.shippingPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-3 rounded-xl">
                <span className="text-body-sm text-gray-600 dark:text-gray-400">
                  Xu đã sử dụng
                </span>
                <span className="text-base font-semibold text-yellow-dark">
                  {currentOrder.coinsUsed} xu
                </span>
              </div>
              <div className="border-t-2 border-avocado-green-30 dark:border-stroke-dark pt-4">
                <div className="flex items-center justify-between p-5 bg-avocado-green-100 rounded-xl">
                  <span className="text-body-2xlg font-bold text-avocado-brown-100">
                    Tổng cộng
                  </span>
                  <span className="text-heading-5 font-bold text-avocado-brown-100">
                    {currentOrder.formatPrice(currentOrder.finalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetail;
