import React from "react";
import { Search } from "lucide-react";

const VoucherFilters = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
}) => {
  const voucherTypes = [
    { value: "ALL", label: "Tất cả" },
    { value: "PERCENTAGE", label: "Giảm %" },
    { value: "FIXED_AMOUNT", label: "Giảm tiền" },
    { value: "FREE_SHIPPING", label: "Miễn ship" },
    { value: "COMBO", label: "Combo" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm voucher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#b1e321] focus:border-[#b1e321] dark:bg-gray-700 dark:text-white"
            aria-label="Tìm kiếm voucher"
          />
        </div>

        {/* Filter by Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#b1e321] focus:border-[#b1e321] dark:bg-gray-700 dark:text-white"
          aria-label="Lọc theo loại voucher"
        >
          {voucherTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#b1e321] focus:border-[#b1e321] dark:bg-gray-700 dark:text-white"
          aria-label="Sắp xếp voucher"
        >
          <option value="priority">Ưu tiên</option>
          <option value="discount">Giảm giá cao</option>
          <option value="endDate">Sắp hết hạn</option>
        </select>
      </div>
    </div>
  );
};

export default VoucherFilters;
