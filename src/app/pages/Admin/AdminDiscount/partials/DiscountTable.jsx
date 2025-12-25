import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useAdminDiscount } from "../adminDiscountStore";
import ViewDiscount from "./ViewDiscount";

const DiscountTable = ({ onEdit }) => {
  const { discounts, isLoading, error, removeDiscountById, refreshDiscounts } =
    useAdminDiscount();
  const [viewDiscountId, setViewDiscountId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleView = (discountId) => {
    setViewDiscountId(discountId);
  };

  const handleCloseView = () => {
    setViewDiscountId(null);
  };

  const handleEdit = (discount) => {
    onEdit?.(discount);
  };

  const handleDelete = async (discountId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      try {
        await removeDiscountById(discountId);
      } catch (e) {
        alert(e?.message || "Xóa khuyến mãi thất bại");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!date) return "Không có";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Filter data based on search term
  const filteredData = discounts.filter((discount) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      discount.discountCode?.toLowerCase().includes(searchLower) ||
      discount.discountName?.toLowerCase().includes(searchLower) ||
      discount.discountValue?.toString().includes(searchLower) ||
      discount.discountProduct?.some((p) =>
        (p.productName || p).toLowerCase().includes(searchLower)
      ) ||
      formatDate(discount.discountStartDate).includes(searchLower) ||
      formatDate(discount.discountEndDate).includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleExport = () => {
    // Export functionality - convert to CSV
    const headers = [
      "STT",
      "Mã khuyến mãi",
      "Tên khuyến mãi",
      "Giá trị",
      "Sản phẩm áp dụng",
      "Ngày bắt đầu",
      "Ngày kết thúc",
    ];
    const csvData = filteredData.map((discount, index) => [
      index + 1,
      discount.discountCode || "N/A",
      discount.discountName || "N/A",
      `${discount.discountValue}%`,
      Array.isArray(discount.discountProduct) &&
      discount.discountProduct.length > 0
        ? discount.discountProduct.map((p) => p.productName || p).join("; ")
        : "Không có sản phẩm",
      formatDate(discount.discountStartDate),
      formatDate(discount.discountEndDate),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `discounts_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2 p-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <span className="ml-4 text-lg text-gray-600 dark:text-gray-400 font-medium">
            Đang tải dữ liệu...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2">
        {/* Table Header with Search, Filter, Export */}
        <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khuyến mãi..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-12 pr-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl w-80"
                />
              </div>

              {/* Filter Button */}
              <button className="flex items-center gap-3 px-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors text-xl">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>

            <div className="flex items-center gap-6">
              {/* Refresh Button */}
              <button
                onClick={refreshDiscounts}
                className="flex items-center gap-3 px-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors text-xl"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Làm mới
              </button>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="flex items-center gap-3 px-5 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-xl"
              >
                <Download className="w-5 h-5" />
                Export
              </button>

              {/* Items per page */}
              <div className="flex items-center gap-3">
                <span className="text-xl text-gray-600 dark:text-gray-400">
                  Show:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(e.target.value)}
                  className="px-4 py-2 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-8 py-4 border-b border-stroke dark:border-stroke-dark">
            <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-2">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                  STT
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mã khuyến mãi
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tên khuyến mãi
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sản phẩm áp dụng
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày bắt đầu
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày kết thúc
                </th>
                <th className="px-8 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-dark divide-y divide-stroke dark:divide-stroke-dark">
              {currentData?.length ? (
                currentData.map((discount, idx) => (
                  <tr
                    key={discount._id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors"
                  >
                    <td className="px-8 py-5 text-xl text-gray-700 dark:text-gray-300 font-medium">
                      {startIndex + idx + 1}
                    </td>
                    <td className="px-8 py-5 text-xl font-semibold text-primary">
                      {discount.discountCode}
                    </td>
                    <td className="px-8 py-5 text-xl text-gray-900 dark:text-white font-bold">
                      {discount.discountName}
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-light-7 text-green-dark">
                        {discount.discountValue}%
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xl text-gray-700 dark:text-gray-300 max-w-xs truncate">
                      {Array.isArray(discount.discountProduct) &&
                      discount.discountProduct.length > 0
                        ? discount.discountProduct
                            .map((p) => p.productName || p)
                            .join(", ")
                        : "Không có sản phẩm"}
                    </td>
                    <td className="px-8 py-5 text-xl text-gray-500 dark:text-gray-400 font-medium">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{formatDate(discount.discountStartDate)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xl text-gray-500 dark:text-gray-400 font-medium">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{formatDate(discount.discountEndDate)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-3 justify-center">
                        {/* View button */}
                        <button
                          onClick={() => handleView(discount._id)}
                          className="inline-flex items-center justify-center w-11 h-11 bg-blue-light-5 dark:bg-dark-3 text-blue hover:text-blue-dark rounded-xl hover:scale-105 transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {/* Edit button */}
                        <button
                          onClick={() => handleEdit(discount)}
                          className="inline-flex items-center justify-center w-11 h-11 bg-green-light-7 dark:bg-dark-3 text-green hover:text-green-dark rounded-xl hover:scale-105 transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(discount._id)}
                          className="inline-flex items-center justify-center w-11 h-11 bg-red-light-6 dark:bg-dark-3 text-red hover:text-red-dark rounded-xl hover:scale-105 transition-all"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-1 dark:bg-dark-2 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        Chưa có khuyến mãi nào
                      </p>
                      <p className="text-xl text-gray-400 dark:text-gray-500">
                        Hãy thêm khuyến mãi mới để bắt đầu
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-stroke dark:border-stroke-dark">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="text-xl text-gray-700 dark:text-gray-300">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
              results
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-xl text-xl transition-colors ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-2"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ViewDiscount Modal */}
      {viewDiscountId && (
        <ViewDiscount
          discountId={viewDiscountId}
          onClose={handleCloseView}
          onEdit={(discount) => {
            handleCloseView();
            handleEdit(discount);
          }}
        />
      )}
    </>
  );
};

export default DiscountTable;
