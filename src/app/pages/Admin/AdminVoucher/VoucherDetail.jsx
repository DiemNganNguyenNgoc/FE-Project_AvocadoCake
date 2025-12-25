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
import StatCard from "../../../components/AdminLayout/StatCard";
import Button from "../../../components/AdminLayout/Button";

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
      const voucherRes = await getVoucherDetails(id, accessToken);

      if (voucherRes.status === "OK") {
        setVoucher(voucherRes.data);

        // Try to fetch statistics for this specific voucher if API supports it
        try {
          const statsRes = await getVoucherStatistics(accessToken);
          if (statsRes.status === "OK") {
            setStatistics(statsRes.data);
          }
        } catch (statsError) {
          console.log("Statistics not available for this voucher");
          // Don't show error toast for statistics, just log it
        }
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin voucher!");
      navigate("/admin/voucher");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-avocado-green-100"></div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center py-12">
          <p className="text-body-lg text-dark-6 dark:text-dark-6">
            Không tìm thấy voucher
          </p>
        </div>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/voucher")}
            className="min-w-[48px] min-h-[48px] p-0 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-heading-4 font-bold text-dark dark:text-white">
              Chi tiết voucher
            </h1>
            <p className="mt-1 text-body-sm text-dark-6 dark:text-dark-6">
              Xem thông tin chi tiết và thống kê
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate(`/admin/voucher/send-email/${id}`)}
          >
            <Mail className="w-5 h-5 mr-2" />
            <span>Gửi email</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/admin/voucher/edit/${id}`)}
          >
            <Edit className="w-5 h-5 mr-2" />
            <span>Chỉnh sửa</span>
          </Button>
        </div>
      </div>

      {/* Voucher Card */}
      <div className="bg-avocado-green-100 rounded-2xl shadow-card-3 p-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-6">
              {voucher.voucherImage && (
                <img
                  src={voucher.voucherImage}
                  alt={voucher.voucherName}
                  className="w-40 h-40 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-4 py-2 rounded-xl text-body-sm font-semibold shadow-md ${
                      voucher.isActive
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {voucher.isActive ? "Đang hoạt động" : "Tạm dừng"}
                  </span>
                  {voucher.isPublic && (
                    <span className="px-4 py-2 bg-blue-500 text-white rounded-xl text-body-sm font-semibold shadow-md">
                      Công khai
                    </span>
                  )}
                </div>
                <h2 className="text-heading-3 font-bold mb-3">
                  {voucher.voucherName}
                </h2>
                <p className="text-body-md text-white/95 mb-4 leading-relaxed">
                  {voucher.voucherDescription}
                </p>
                <div className="flex flex-wrap gap-2">
                  {voucher.voucherTags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-xl text-body-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 shadow-lg">
            <div className="text-center">
              <p className="text-white/90 text-body-xs font-medium mb-2">
                Mã voucher
              </p>
              <p className="text-heading-5 font-mono font-bold mb-4 tracking-wider">
                {voucher.voucherCode}
              </p>
              <div className="border-t-2 border-white/30 pt-4">
                <p className="text-white/90 text-body-xs font-medium mb-1">
                  Giảm giá
                </p>
                <p className="text-heading-4 font-bold mb-1">
                  {formatVoucherValue(voucher)}
                </p>
                <p className="text-white/90 text-body-xs font-medium">
                  {getVoucherTypeText(voucher.voucherType)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Ticket />}
          color="bg-blue-500"
          title="Đã phát hành"
          value={voucher.totalQuantity}
          subtitle={`Còn lại: ${remainingQuantity}`}
        />

        <StatCard
          icon={<Users />}
          color="bg-green-500"
          title="Đã lưu"
          value={voucher.claimedQuantity}
          subtitle={`${claimedPercentage.toFixed(1)}% tổng số`}
        />

        <StatCard
          icon={<ShoppingCart />}
          color="bg-orange-500"
          title="Đã sử dụng"
          value={voucher.usedQuantity}
          subtitle={`${usagePercentage.toFixed(1)}% đã lưu`}
        />

        <StatCard
          icon={<Calendar />}
          color="bg-purple-500"
          title="Còn lại"
          value={`${daysLeft > 0 ? daysLeft : 0} ngày`}
          subtitle={daysLeft <= 0 ? "Đã hết hạn" : "Còn hiệu lực"}
        />
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voucher Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
          <h3 className="text-heading-5 font-bold mb-6 text-dark dark:text-white flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl mr-3">
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>
            Thông tin chi tiết
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between py-4 border-b-2 border-gray-100 dark:border-gray-700">
              <span className="text-body-sm text-dark-6 dark:text-dark-6 font-medium">
                Loại voucher
              </span>
              <span className="text-body-sm font-semibold text-dark dark:text-white">
                {getVoucherTypeText(voucher.voucherType)}
              </span>
            </div>
            <div className="flex justify-between py-4 border-b-2 border-gray-100 dark:border-gray-700">
              <span className="text-body-sm text-dark-6 dark:text-dark-6 font-medium">
                Giá trị giảm
              </span>
              <span className="text-body-sm font-semibold text-avocado-green-100">
                {formatVoucherValue(voucher)}
              </span>
            </div>
            {voucher.maxDiscountAmount && (
              <div className="flex justify-between py-4 border-b-2 border-gray-100 dark:border-gray-700">
                <span className="text-body-sm text-dark-6 dark:text-dark-6 font-medium">
                  Giảm tối đa
                </span>
                <span className="text-body-sm font-semibold text-dark dark:text-white">
                  {voucher.maxDiscountAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>
            )}
            <div className="flex justify-between py-4 border-b-2 border-gray-100 dark:border-gray-700">
              <span className="text-body-sm text-dark-6 dark:text-dark-6 font-medium">
                Đơn tối thiểu
              </span>
              <span className="text-body-sm font-semibold text-dark dark:text-white">
                {voucher.minOrderValue.toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div className="flex justify-between py-4 border-b-2 border-gray-100 dark:border-gray-700">
              <span className="text-body-sm text-dark-6 dark:text-dark-6 font-medium">
                Giới hạn/user
              </span>
              <span className="text-body-sm font-semibold text-dark dark:text-white">
                {voucher.usageLimit} lần
              </span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-body-sm text-dark-6 dark:text-dark-6 font-medium">
                Ưu tiên
              </span>
              <span className="text-body-sm font-semibold text-dark dark:text-white">
                {voucher.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
          <h3 className="text-heading-5 font-bold mb-6 text-dark dark:text-white flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-3">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            Thời gian
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between py-4 border-b-2 border-gray-100 dark:border-gray-700">
              <span className="text-body-sm text-dark-6 dark:text-dark-6 font-medium">
                Ngày tạo
              </span>
              <span className="text-body-sm font-semibold text-dark dark:text-white">
                {new Date(voucher.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between py-4 border-b-2 border-gray-100 dark:border-gray-700">
              <span className="text-body-sm text-dark-6 dark:text-dark-6 font-medium">
                Ngày bắt đầu
              </span>
              <span className="text-body-sm font-semibold text-dark dark:text-white">
                {new Date(voucher.startDate).toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between py-4 border-b-2 border-gray-100 dark:border-gray-700">
              <span className="text-body-sm text-dark-6 dark:text-dark-6 font-medium">
                Ngày kết thúc
              </span>
              <span className="text-body-sm font-semibold text-dark dark:text-white">
                {new Date(voucher.endDate).toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-body-sm text-dark-6 dark:text-dark-6 font-medium">
                Cập nhật cuối
              </span>
              <span className="text-body-sm font-semibold text-dark dark:text-white">
                {new Date(voucher.updatedAt).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Statistics */}
      {statistics && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
          <h3 className="text-heading-5 font-bold mb-6 text-dark dark:text-white flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl mr-3">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            Thống kê nâng cao
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
              <div className="inline-flex p-3 bg-blue-500 rounded-2xl mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <p className="text-body-sm text-dark-6 dark:text-dark-6 font-medium mb-2">
                Tổng giảm giá
              </p>
              <p className="text-heading-4 font-bold text-dark dark:text-white">
                {statistics.totalDiscountAmount?.toLocaleString("vi-VN") || 0}₫
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border-2 border-green-200 dark:border-green-800">
              <div className="inline-flex p-3 bg-green-500 rounded-2xl mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-body-sm text-dark-6 dark:text-dark-6 font-medium mb-2">
                Người dùng duy nhất
              </p>
              <p className="text-heading-4 font-bold text-dark dark:text-white">
                {statistics.uniqueUsers || 0}
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800">
              <div className="inline-flex p-3 bg-orange-500 rounded-2xl mb-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <p className="text-body-sm text-dark-6 dark:text-dark-6 font-medium mb-2">
                Đơn hàng áp dụng
              </p>
              <p className="text-heading-4 font-bold text-dark dark:text-white">
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
