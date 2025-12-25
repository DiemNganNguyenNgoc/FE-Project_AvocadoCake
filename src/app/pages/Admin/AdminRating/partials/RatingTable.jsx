import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Trash2,
  Star,
  MessageSquare,
} from "lucide-react";
import { getRatingColor, getRatingBgColor } from "../schemas/ratingSchema";

const RatingTable = ({
  ratings,
  loading,
  selectedRatings,
  currentPage,
  sortBy,
  sortOrder,
  toggleRatingSelection,
  selectAllRatings,
  clearSelection,
  setCurrentPage,
  deleteRating,
  deleteMultipleRatings,
  toggleVisibility,
  getPaginatedRatings,
  handleSort,
  searchTerm = "",
  onSearch,
  itemsPerPage = 10,
  onItemsPerPageChange,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const checkboxRef = useRef(null);

  const {
    ratings: paginatedRatings,
    totalPages,
    totalItems,
  } = getPaginatedRatings();

  const isAllSelected =
    selectedRatings.length === ratings.length && ratings.length > 0;
  const isSomeSelected =
    selectedRatings.length > 0 && selectedRatings.length < ratings.length;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const handleSelectAllClick = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllRatings();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleExport = () => {
    const headers = [
      "No",
      "User",
      "Product",
      "Order",
      "Rating",
      "Comment",
      "Visibility",
      "Date",
    ];
    const csvData = paginatedRatings.map((rating, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      rating.getDisplayUserName(),
      rating.getProductName(),
      rating.getOrderCode(),
      rating.rating,
      rating.comment || "No comment",
      rating.isVisible ? "Visible" : "Hidden",
      formatDate(rating.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ratings_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      try {
        await deleteRating(id);
      } catch (error) {
        console.error("Error deleting rating:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRatings.length === 0) {
      alert("Vui lòng chọn ít nhất một đánh giá để xóa");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedRatings.length} đánh giá đã chọn?`
      )
    ) {
      try {
        await deleteMultipleRatings(selectedRatings);
      } catch (error) {
        console.error("Error deleting ratings:", error);
      }
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleVisibility(id);
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getVisibilityBadge = (isVisible) => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
          isVisible
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {isVisible ? "Hiển thị" : "Ẩn"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600">
            Đang tải danh sách đánh giá...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-dark rounded-2xl border border-stroke dark:border-stroke-dark shadow-card-2 overflow-hidden">
      {/* Table Header - Search, Filter, Export */}
      <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm đánh giá..."
                value={localSearchTerm}
                onChange={handleSearchChange}
                className="pl-12 pr-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl w-80"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => {}}
              className="flex items-center gap-3 px-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors text-xl"
            >
              <Filter className="w-5 h-5" />
              Lọc
            </button>
          </div>

          <div className="flex items-center gap-6">
            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-3 px-5 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-xl"
            >
              <Download className="w-5 h-5" />
              Xuất file
            </button>

            {/* Items per page */}
            <div className="flex items-center gap-3">
              <span className="text-xl text-gray-600 dark:text-gray-400">
                Hiển thị:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  onItemsPerPageChange &&
                  onItemsPerPageChange(parseInt(e.target.value))
                }
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

      {/* Bulk Actions Header */}
      {selectedRatings.length > 0 && (
        <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark bg-blue-light-5 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-dark dark:text-white">
              {selectedRatings.length} đánh giá được chọn
            </span>
            <div className="flex gap-4">
              <button
                onClick={clearSelection}
                className="px-5 py-3 text-xl font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Bỏ chọn
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-5 py-3 text-xl font-medium bg-red text-white rounded-xl hover:bg-red/90 transition-colors"
              >
                Xóa đã chọn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-2">
            <tr>
              <th className="px-8 py-4 text-left">
                <input
                  ref={checkboxRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllClick}
                  className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                  title={
                    isAllSelected
                      ? "Bỏ chọn tất cả"
                      : isSomeSelected
                      ? "Chọn tất cả"
                      : "Chọn tất cả"
                  }
                />
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("_id")}
              >
                <div className="flex items-center gap-2">
                  <span>STT</span>
                  {sortBy === "_id" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("userName")}
              >
                <div className="flex items-center gap-2">
                  <span>Người dùng</span>
                  {sortBy === "userName" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Đơn hàng
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("rating")}
              >
                <div className="flex items-center gap-2">
                  <span>Đánh giá</span>
                  {sortBy === "rating" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Bình luận
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("isVisible")}
              >
                <div className="flex items-center gap-2">
                  <span>Trạng thái</span>
                  {sortBy === "isVisible" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-2">
                  <span>Ngày tạo</span>
                  {sortBy === "createdAt" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-dark divide-y divide-stroke dark:divide-stroke-dark">
            {paginatedRatings.map((rating, index) => (
              <tr
                key={rating._id}
                className="hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors"
              >
                <td className="px-8 py-5 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(rating._id)}
                    onChange={() => toggleRatingSelection(rating._id)}
                    className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-primary cursor-pointer"
                  />
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-xl text-gray-900 dark:text-white font-medium">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    {rating.getDisplayUserName()}
                  </div>
                  {rating.userId?.email && (
                    <div className="text-sm text-gray-500">
                      {rating.userId.email}
                    </div>
                  )}
                </td>
                <td className="px-8 py-5">
                  <div className="text-xl text-gray-900 dark:text-white">
                    {rating.getProductName()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {rating.getProductCode()}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-xl text-gray-900 dark:text-white">
                  {rating.getOrderCode()}
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xl font-bold ${getRatingColor(
                          rating.rating
                        )}`}
                      >
                        {rating.rating}.0
                      </span>
                      {renderStars(rating.rating)}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 max-w-xs">
                  {rating.hasComment() ? (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {rating.comment}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm italic text-gray-400">
                      Không có bình luận
                    </span>
                  )}
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  {getVisibilityBadge(rating.isVisible)}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-xl text-gray-500 dark:text-gray-400">
                  {formatDate(rating.createdAt)}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-xl font-medium">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleToggleVisibility(rating._id)}
                      className={`border rounded-xl p-2.5 transition-all ${
                        rating.isVisible
                          ? "text-gray-600 border-gray-300 hover:bg-gray-100"
                          : "text-green-600 border-green-300 hover:bg-green-50"
                      }`}
                      title={rating.isVisible ? "Ẩn đánh giá" : "Hiện đánh giá"}
                    >
                      {rating.isVisible ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(rating._id)}
                      className="text-red hover:text-red-dark border border-red rounded-xl p-2.5 hover:bg-red-light-6 transition-all"
                      title="Xóa"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-8 py-6 border-t border-stroke dark:border-stroke-dark">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="text-xl text-gray-700 dark:text-gray-300">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số{" "}
              {totalItems} đánh giá
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="px-4 py-2 text-xl rounded-xl transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-2"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                  </>
                )}

                {/* Pages around current page */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show current page and 2 pages before and after
                    return Math.abs(page - currentPage) <= 2;
                  })
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 text-xl rounded-xl transition-colors ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-2"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-4 py-2 text-xl rounded-xl transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-2"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingTable;
