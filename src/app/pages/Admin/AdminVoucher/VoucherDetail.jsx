import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Mail,
  TrendingUp,
  Users,
  ShoppingCart,
  Calendar,
  Ticket,
  DollarSign,
  BarChart3,
} from "lucide-react";
import {
  getVoucherDetails,
  getVoucherStatistics,
  getVoucherTypeText,
  formatVoucherValue,
} from "../../../api/services/VoucherService";
import { toast } from "react-toastify";

const VoucherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const [voucherRes, statsRes] = await Promise.all([
        getVoucherDetails(id, accessToken),
        getVoucherStatistics(id, accessToken),
      ]);

      if (voucherRes.status === "OK") {
        setVoucher(voucherRes.data);
      }
      if (statsRes.status === "OK") {
        setStatistics(statsRes.data);
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin voucher!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Không tìm thấy voucher
        </p>
      </div>
    );
  }

  const remainingQuantity = voucher.totalQuantity - voucher.claimedQuantity;
  const claimedPercentage =
    (voucher.claimedQuantity / voucher.totalQuantity) * 100;
  const usagePercentage =
    voucher.claimedQuantity > 0
      ? (voucher.usedQuantity / voucher.claimedQuantity) * 100
      : 0;

  const daysLeft = Math.ceil(
    (new Date(voucher.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/voucher")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-heading-4 font-bold text-dark dark:text-white">
              Chi tiết voucher
            </h1>
            <p className="mt-1 text-body-sm text-dark-6 dark:text-dark-6">
              Xem thông tin chi tiết và thống kê
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/admin/voucher/send-email/${id}`)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Mail className="w-4 h-4" />
            <span>Gửi email</span>
          </button>
          <button
            onClick={() => navigate(`/admin/voucher/edit/${id}`)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Edit className="w-4 h-4" />
            <span>Chỉnh sửa</span>
          </button>
        </div>
      </div>

      {/* Voucher Card */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-start space-x-4">
              {voucher.voucherImage && (
                <img
                  src={voucher.voucherImage}
                  alt={voucher.voucherName}
                  className="w-32 h-32 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      voucher.isActive ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {voucher.isActive ? "Đang hoạt động" : "Tạm dừng"}
                  </span>
                  {voucher.isPublic && (
                    <span className="px-3 py-1 bg-blue-500 rounded-full text-xs font-medium">
                      Công khai
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {voucher.voucherName}
                </h2>
                <p className="text-white/90 mb-4">
                  {voucher.voucherDescription}
                </p>
                <div className="flex flex-wrap gap-2">
                  {voucher.voucherTags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-center">
              <p className="text-white/80 text-sm mb-2">Mã voucher</p>
              <p className="text-3xl font-mono font-bold mb-4">
                {voucher.voucherCode}
              </p>
              <div className="border-t border-white/30 pt-4">
                <p className="text-white/80 text-sm mb-1">Giảm giá</p>
                <p className="text-4xl font-bold">
                  {formatVoucherValue(voucher)}
                </p>
                <p className="text-white/80 text-sm mt-2">
                  {getVoucherTypeText(voucher.voucherType)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Đã phát hành
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {voucher.totalQuantity}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Còn lại: {remainingQuantity}
              </p>
            </div>
            <Ticket className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Đã lưu
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {voucher.claimedQuantity}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {claimedPercentage.toFixed(1)}% tổng số
              </p>
            </div>
            <Users className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Đã sử dụng
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {voucher.usedQuantity}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {usagePercentage.toFixed(1)}% đã lưu
              </p>
            </div>
            <ShoppingCart className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Còn lại
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {daysLeft > 0 ? daysLeft : 0} ngày
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {daysLeft <= 0 ? "Đã hết hạn" : "Còn hiệu lực"}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voucher Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Thông tin chi tiết
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">
                Loại voucher
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {getVoucherTypeText(voucher.voucherType)}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">
                Giá trị giảm
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatVoucherValue(voucher)}
              </span>
            </div>
            {voucher.maxDiscountAmount && (
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Giảm tối đa
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {voucher.maxDiscountAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>
            )}
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">
                Đơn tối thiểu
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {voucher.minOrderValue.toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">
                Giới hạn/user
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {voucher.usageLimit} lần
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Ưu tiên</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {voucher.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Thời gian
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Ngày tạo</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(voucher.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">
                Ngày bắt đầu
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(voucher.startDate).toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">
                Ngày kết thúc
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(voucher.endDate).toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600 dark:text-gray-400">
                Cập nhật cuối
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(voucher.updatedAt).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Statistics */}
      {statistics && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Thống kê nâng cao
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Tổng giảm giá
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.totalDiscountAmount?.toLocaleString("vi-VN") || 0}₫
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Người dùng duy nhất
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.uniqueUsers || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Đơn hàng áp dụng
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.totalOrders || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherDetail;
