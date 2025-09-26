import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAdminOrderStore } from "../adminOrderStore";

const ViewOrderDetail = ({ onBack }) => {
  const { orderId } = useParams();
  const { fetchOrderById, currentOrder, loading, error } = useAdminOrderStore();
  const [localLoading, setLocalLoading] = useState(false);

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
        <p className="text-gray-600 mt-2">
          Mã đơn hàng: {currentOrder.orderCode}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Trạng thái đơn hàng
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${currentOrder.getStatusColor()}`}
                >
                  {currentOrder.status?.statusName || "Unknown"}
                </span>
                <span className="text-sm text-gray-500">
                  Tạo lúc: {currentOrder.formatDate(currentOrder.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sản phẩm đã đặt
            </h2>
            <div className="space-y-4">
              {currentOrder.orderItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <img
                    src={
                      item.product?.productImage ||
                      item.product?.image ||
                      "/placeholder-product.jpg"
                    }
                    alt={item.product?.productName || item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product?.productName ||
                        item.product?.name ||
                        "Sản phẩm"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Đơn giá:{" "}
                      {currentOrder.formatPrice(
                        item.product?.productPrice || item.price
                      )}
                    </p>
                    {item.discountPercent > 0 && (
                      <p className="text-sm text-green-600">
                        Giảm giá: {item.discountPercent}%
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
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
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Thông tin thanh toán
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-medium text-gray-900">
                  {currentOrder.paymentMethod || "Chưa xác định"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                <p className="font-medium text-gray-900">
                  {currentOrder.paymentStatus || "Chưa xác định"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information & Summary */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Thông tin khách hàng
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">
                  {currentOrder.userName ||
                    currentOrder.userId?.userName ||
                    currentOrder.shippingAddress?.userName ||
                    "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">
                  {currentOrder.userEmail ||
                    currentOrder.userId?.userEmail ||
                    currentOrder.shippingAddress?.userEmail ||
                    "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">
                  {currentOrder.userPhone ||
                    currentOrder.userId?.userPhone ||
                    currentOrder.shippingAddress?.userPhone ||
                    "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Địa chỉ giao hàng
            </h2>
            <div className="text-sm text-gray-900">
              <p>
                {currentOrder.shippingAddress?.familyName}{" "}
                {currentOrder.shippingAddress?.userName}
              </p>
              <p>{currentOrder.shippingAddress?.userPhone}</p>
              <p>{currentOrder.shippingAddress?.userAddress}</p>
              <p>
                {currentOrder.shippingAddress?.userWard &&
                  `${currentOrder.shippingAddress.userWard}, `}
                {currentOrder.shippingAddress?.userDistrict &&
                  `${currentOrder.shippingAddress.userDistrict}, `}
                {currentOrder.shippingAddress?.userCity}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Tổng quan đơn hàng
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tổng tiền hàng:</span>
                <span className="text-sm font-medium text-gray-900">
                  {currentOrder.formatPrice(currentOrder.totalItemPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Phí vận chuyển:</span>
                <span className="text-sm font-medium text-gray-900">
                  {currentOrder.formatPrice(currentOrder.shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Xu đã sử dụng:</span>
                <span className="text-sm font-medium text-gray-900">
                  {currentOrder.coinsUsed} xu
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">
                    Tổng cộng:
                  </span>
                  <span className="text-base font-semibold text-green-600">
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
