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

      const response = await getUserVouchers(null, accessToken);
      console.log("Vouchers response:", response);
      if (response.status === "OK") {
        setVouchers(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
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
    <div className="min-h-screen">
      {/* Header */}
      <div className=" border-b-2 border-avocado-brown-30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-avocado-brown-100 border-2 border-white rounded-2xl mb-4">
              <Ticket className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Voucher Của Tôi</h1>
            <p className="text-avocado-brown-100/95 text-lg">
              Quản lý tất cả voucher đã lưu
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = getStatistics(tab.value);
            const isActive = activeTab === tab.value;
            return (
              <div
                key={tab.value}
                className={`bg-white rounded-2xl p-8 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "border-3 border-avocado-green-100"
                    : "border-2 border-gray-3 hover:border-avocado-green-100"
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
                    <p className="text-sm text-avocado-brown-100/60 mb-2 font-medium">
                      {tab.label}
                    </p>
                    <p className="text-4xl font-bold text-avocado-brown-100">
                      {count}
                    </p>
                  </div>
                  <Icon className="w-14 h-14 text-avocado-green-100" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border-2 border-gray-3 mb-8">
          <div className="flex border-b-2 border-gray-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex-1 flex items-center justify-center space-x-3 py-5 px-6 font-semibold text-base transition-colors ${
                    isActive
                      ? "text-avocado-brown-100 border-b-3 border-avocado-green-80 bg-avocado-green-10"
                      : "text-gray-5 hover:text-avocado-brown-100 hover:bg-gray-1"
                  }`}
                  aria-label={`Tab ${tab.label}`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full ${
                      isActive
                        ? "bg-avocado-green-80 text-white"
                        : "bg-gray-3 text-gray-6"
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
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-3 border-t-avocado-green-100"></div>
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-gray-3 p-16 text-center">
            <Ticket className="w-20 h-20 mx-auto text-gray-4 mb-6" />
            <h3 className="text-2xl font-bold text-avocado-brown-100 mb-3">
              {activeTab === "ACTIVE" && "Bạn chưa có voucher nào"}
              {activeTab === "USED" && "Bạn chưa sử dụng voucher nào"}
              {activeTab === "EXPIRED" && "Không có voucher hết hạn"}
            </h3>
            <p className="text-gray-6 text-lg mb-8">
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
                className="px-8 py-4 bg-avocado-green-80 text-white rounded-xl hover:bg-avocado-green-80/90 font-bold text-lg border-2 border-avocado-green-80 transition-colors"
                aria-label="Đi săn voucher"
              >
                Đi săn voucher
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVouchers.map((userVoucher) => {
                // Handle both possible data structures
                const voucherData =
                  userVoucher.voucherDetails ||
                  userVoucher.voucher ||
                  userVoucher;

                if (!voucherData || !voucherData.endDate) {
                  console.warn("Invalid voucher data:", userVoucher);
                  return null;
                }

                return (
                  <VoucherCard
                    key={userVoucher._id}
                    voucher={voucherData}
                    userStatus={userVoucher.status || userVoucher}
                    onUse={activeTab === "ACTIVE" ? handleUseVoucher : null}
                    showActions={true}
                  />
                );
              })}
            </div>

            {/* CTA for active vouchers */}
            {activeTab === "ACTIVE" && filteredVouchers.length > 0 && (
              <div className="mt-10 bg-avocado-green-80 rounded-2xl border-2 border-avocado-brown-30 p-10 text-center text-white">
                <h3 className="text-3xl font-bold mb-3">
                  Bạn có {filteredVouchers.length} voucher có thể dùng!
                </h3>
                <p className="text-white/95 text-lg mb-8">
                  Mua sắm ngay để tận dụng ưu đãi tuyệt vời
                </p>
                <button
                  onClick={() => navigate("/products")}
                  className="px-10 py-4 bg-avocado-brown-100 text-white rounded-xl hover:bg-avocado-brown-100/90 font-bold text-lg border-2 border-avocado-brown-100 transition-colors"
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
