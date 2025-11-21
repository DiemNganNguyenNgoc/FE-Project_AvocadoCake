import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Clock, CheckCircle, XCircle } from "lucide-react";
import { getUserVouchers } from "../../api/services/VoucherService";
import VoucherCard from "../../components/VoucherComponents/VoucherCard";
import { toast } from "react-toastify";

const MyVouchersPage = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ACTIVE");

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.warning("Vui lòng đăng nhập!");
        navigate("/sign-in");
        return;
      }

      const response = await getUserVouchers(accessToken);
      if (response.status === "OK") {
        setVouchers(response.data || []);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách voucher!");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const handleUseVoucher = () => {
    navigate("/products");
  };

  const filteredVouchers = vouchers.filter(
    (voucher) => voucher.status === activeTab
  );

  const tabs = [
    { value: "ACTIVE", label: "Có thể dùng", icon: Clock, color: "blue" },
    { value: "USED", label: "Đã sử dụng", icon: CheckCircle, color: "green" },
    { value: "EXPIRED", label: "Hết hạn", icon: XCircle, color: "red" },
  ];

  const getStatistics = (status) => {
    return vouchers.filter((v) => v.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-3">
              <Ticket className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Voucher Của Tôi</h1>
            <p className="text-white/90">Quản lý tất cả voucher đã lưu</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = getStatistics(tab.value);
            return (
              <div
                key={tab.value}
                className={`bg-gradient-to-br from-${tab.color}-500 to-${
                  tab.color
                }-600 rounded-lg shadow-md p-6 text-white cursor-pointer transition-transform hover:scale-105 ${
                  activeTab === tab.value ? "ring-4 ring-white" : ""
                }`}
                onClick={() => setActiveTab(tab.value)}
                role="button"
                tabIndex={0}
                aria-label={`Xem voucher ${tab.label}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveTab(tab.value);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-${tab.color}-100 text-sm mb-1`}>
                      {tab.label}
                    </p>
                    <p className="text-3xl font-bold">{count}</p>
                  </div>
                  <Icon className={`w-12 h-12 text-${tab.color}-200`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                    activeTab === tab.value
                      ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  aria-label={`Tab ${tab.label}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      activeTab === tab.value
                        ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {getStatistics(tab.value)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Voucher List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <Ticket className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {activeTab === "ACTIVE" && "Bạn chưa có voucher nào"}
              {activeTab === "USED" && "Bạn chưa sử dụng voucher nào"}
              {activeTab === "EXPIRED" && "Không có voucher hết hạn"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {activeTab === "ACTIVE" &&
                "Hãy đến kho voucher để săn ngay những ưu đãi hấp dẫn!"}
              {activeTab === "USED" &&
                "Hãy sử dụng voucher để nhận ưu đãi nhé!"}
              {activeTab === "EXPIRED" &&
                "Tất cả voucher của bạn vẫn còn hiệu lực"}
            </p>
            {activeTab === "ACTIVE" && (
              <button
                onClick={() => navigate("/vouchers")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium"
                aria-label="Đi săn voucher"
              >
                Đi săn voucher
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVouchers.map((userVoucher) => (
                <VoucherCard
                  key={userVoucher._id}
                  voucher={userVoucher.voucherDetails}
                  userStatus={userVoucher}
                  onUse={activeTab === "ACTIVE" ? handleUseVoucher : null}
                  showActions={true}
                />
              ))}
            </div>

            {/* CTA for active vouchers */}
            {activeTab === "ACTIVE" && filteredVouchers.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Bạn có {filteredVouchers.length} voucher có thể dùng!
                </h3>
                <p className="text-white/90 mb-6">
                  Mua sắm ngay để tận dụng ưu đãi tuyệt vời
                </p>
                <button
                  onClick={() => navigate("/products")}
                  className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                  aria-label="Mua sắm ngay"
                >
                  Mua sắm ngay
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyVouchersPage;
