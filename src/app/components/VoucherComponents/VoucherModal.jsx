import React, { useState, useEffect, useCallback } from "react";
import { X, Search, Ticket } from "lucide-react";
import VoucherCard from "./VoucherCard";
import { getUserVouchers } from "../../api/services/VoucherService";
import { toast } from "react-toastify";

const VoucherModal = ({
  isOpen,
  onClose,
  onSelectVoucher,
  selectedVouchers = [],
}) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ACTIVE");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUserVouchers = useCallback(async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        toast.error("Vui lòng đăng nhập để xem voucher!");
        setVouchers([]);
        return;
      }

      const response = await getUserVouchers(filter, accessToken);

      if (response.status === "OK") {
        setVouchers(response.data || []);
      } else {
        toast.error(response.message || "Không thể tải danh sách voucher");
        setVouchers([]);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast.error(error.message || "Lỗi khi tải danh sách voucher");
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (isOpen) {
      fetchUserVouchers();
    }
  }, [isOpen, fetchUserVouchers]);

  const filteredVouchers = vouchers.filter((uv) => {
    const voucher = uv.voucherId;
    const matchesSearch =
      voucher.voucherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const isSelected = (voucherId) => {
    return selectedVouchers.some((v) => v._id === voucherId);
  };

  const handleSelectVoucher = (userVoucher) => {
    const voucher = userVoucher.voucherId;
    if (isSelected(voucher._id)) {
      // Deselect
      onSelectVoucher(selectedVouchers.filter((v) => v._id !== voucher._id));
    } else {
      // Check if same type exists
      const sameTypeExists = selectedVouchers.some(
        (v) => v.voucherType === voucher.voucherType
      );
      if (sameTypeExists) {
        alert("Chỉ được áp dụng 1 voucher mỗi loại!");
        return;
      }
      onSelectVoucher([
        ...selectedVouchers,
        { ...voucher, userVoucherId: userVoucher._id },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b-4 border-[#b1e321] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-[#b1e321]/10 p-3 rounded-[16px]">
                <Ticket className="w-6 h-6 text-[#b1e321]" />
              </div>
              <h2 className="text-2xl font-bold text-[#3a060e] dark:text-white">
                Voucher của bạn
              </h2>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 p-2 rounded-[16px] transition-colors"
            >
              <X className="w-6 h-6 text-[#3a060e] dark:text-white" />
            </button>
          </div>

          {/* Search & Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b1e321]" />
              <input
                type="text"
                placeholder="Tìm kiếm voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#b1e321]/5 border-2 border-[#b1e321]/30 rounded-[24px] text-[#3a060e] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b1e321] focus:border-[#b1e321]"
              />
            </div>

            <div className="flex space-x-2">
              {["ACTIVE", "USED", "EXPIRED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-2 rounded-[24px] font-medium transition-all ${
                    filter === status
                      ? "bg-[#b1e321] text-[#3a060e] shadow-sm"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {status === "ACTIVE" && "Có thể dùng"}
                  {status === "USED" && "Đã dùng"}
                  {status === "EXPIRED" && "Hết hạn"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vouchers List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b1e321]"></div>
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <Ticket className="w-16 h-16 mb-4 opacity-50 text-[#b1e321]" />
              <p className="text-lg font-medium text-[#3a060e] dark:text-white">
                Không có voucher
              </p>
              <p className="text-sm">Hãy đến trang voucher để lưu thêm!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVouchers.map((userVoucher) => (
                <div key={userVoucher._id} className="relative">
                  {filter === "ACTIVE" && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected(userVoucher.voucherId._id)}
                        onChange={() => handleSelectVoucher(userVoucher)}
                        className="w-6 h-6 text-[#b1e321] bg-white border-gray-300 rounded-lg focus:ring-[#b1e321] cursor-pointer accent-[#b1e321]"
                      />
                    </div>
                  )}
                  <VoucherCard
                    voucher={userVoucher.voucherId}
                    userStatus={userVoucher.status}
                    showActions={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filter === "ACTIVE" && (
          <div className="border-t-2 border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đã chọn:{" "}
                <span className="font-bold text-[#b1e321]">
                  {selectedVouchers.length}
                </span>{" "}
                voucher
              </p>
              {selectedVouchers.length > 0 && (
                <button
                  onClick={() => onSelectVoucher([])}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Bỏ chọn tất cả
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-full bg-[#b1e321] text-[#3a060e] font-semibold py-4 rounded-[24px] hover:bg-[#b1e321]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Áp dụng voucher
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherModal;
