import React from "react";
import { Ticket, TrendingUp } from "lucide-react";

const VoucherStatistics = ({
  totalVouchers,
  savedVouchers,
  availableVouchers,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border-l-4 border-[#b1e321]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
              Tổng voucher
            </p>
            <p className="text-3xl font-bold text-[#3a060e] dark:text-white">
              {totalVouchers}
            </p>
          </div>
          <div className="w-12 h-12 bg-[#b1e321]/10 rounded-xl flex items-center justify-center">
            <Ticket className="w-6 h-6 text-[#b1e321]" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border-l-4 border-[#3a060e]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
              Đã lưu
            </p>
            <p className="text-3xl font-bold text-[#3a060e] dark:text-white">
              {savedVouchers}
            </p>
          </div>
          <div className="w-12 h-12 bg-[#3a060e]/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[#3a060e]" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
              Có thể dùng
            </p>
            <p className="text-3xl font-bold text-[#3a060e] dark:text-white">
              {availableVouchers}
            </p>
          </div>
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <Ticket className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherStatistics;
