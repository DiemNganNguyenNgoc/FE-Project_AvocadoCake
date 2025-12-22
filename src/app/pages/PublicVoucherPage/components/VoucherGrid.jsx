import React from "react";
import { Ticket } from "lucide-react";
import VoucherCard from "../../../components/VoucherComponents/VoucherCard";

const VoucherGrid = ({
  loading,
  filteredVouchers,
  getUserVoucherStatus,
  handleClaimVoucher,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b1e321]"></div>
      </div>
    );
  }

  if (filteredVouchers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center">
        <Ticket className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Không tìm thấy voucher
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Thử thay đổi bộ lọc hoặc quay lại sau nhé!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVouchers.map((voucher) => (
        <VoucherCard
          key={voucher._id}
          voucher={voucher}
          userStatus={getUserVoucherStatus(voucher._id)}
          onClaim={() => handleClaimVoucher(voucher._id)}
          showActions={true}
        />
      ))}
    </div>
  );
};

export default VoucherGrid;
