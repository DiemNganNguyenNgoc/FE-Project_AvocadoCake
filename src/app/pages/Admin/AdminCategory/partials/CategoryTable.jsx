import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CategoryTable = ({
  categories,
  loading,
  selectedCategories,
  currentPage,
  sortBy,
  sortOrder,
  toggleCategorySelection,
  selectAllCategories,
  clearSelection,
  setCurrentPage,
  deleteCategory,
  deleteMultipleCategories,
  getPaginatedCategories,
  handleSort,
  onNavigate,
  searchTerm = "",
  onSearch,
  itemsPerPage = 10,
  onItemsPerPageChange,
}) => {
  const navigate = useNavigate();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const {
    categories: paginatedCategories,
    totalPages,
    totalItems,
  } = getPaginatedCategories();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleExport = () => {
    // Export to CSV
    const headers = ["No", "Code", "Name", "Created At", "Status"];
    const csvData = paginatedCategories.map((cat, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      cat.categoryCode,
      cat.categoryName,
      formatDate(cat.createdAt),
      cat.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `categories_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleEdit = (category) => {
    if (onNavigate) {
      // Store category data in localStorage or context for UpdateCategory
      localStorage.setItem(
        "editCategoryData",
        JSON.stringify({
          categoryId: category._id,
          categoryCode: category.categoryCode,
          categoryName: category.categoryName,
        })
      );
      onNavigate("update");
    } else {
      navigate("/admin/category/update", {
        state: {
          categoryId: category._id,
          categoryCode: category.categoryCode,
          categoryName: category.categoryName,
        },
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) {
      alert("Vui lòng chọn ít nhất một danh mục để xóa");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedCategories.length} danh mục đã chọn?`
      )
    ) {
      try {
        await deleteMultipleCategories(selectedCategories);
      } catch (error) {
        console.error("Error deleting categories:", error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Hoạt động",
      },
      Inactive: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Không hoạt động",
      },
      Cancel: { bg: "bg-pink-100", text: "text-red-800", label: "Đã hủy" },
    };

    const config = statusConfig[status] || statusConfig["Active"];

    return (
      <span
        className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600">
            Đang tải danh sách danh mục...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2">
      {/* Table Header - Search, Filter, Export */}
      <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={localSearchTerm}
                onChange={handleSearchChange}
                className="pl-12 pr-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-base w-80"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => {}}
              className="flex items-center gap-3 px-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors text-base"
            >
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>

          <div className="flex items-center gap-6">
            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-3 px-5 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-base"
            >
              <Download className="w-5 h-5" />
              Export
            </button>

            {/* Items per page */}
            <div className="flex items-center gap-3">
              <span className="text-base text-gray-600 dark:text-gray-400">
                Show:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  onItemsPerPageChange &&
                  onItemsPerPageChange(parseInt(e.target.value))
                }
                className="px-4 py-2 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-base"
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
      {selectedCategories.length > 0 && (
        <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark bg-blue-light-5 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-dark dark:text-white">
              {selectedCategories.length} danh mục được chọn
            </span>
            <div className="flex gap-4">
              <button
                onClick={clearSelection}
                className="px-5 py-3 text-base font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Bỏ chọn
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-5 py-3 text-base font-medium bg-red text-white rounded-xl hover:bg-red/90 transition-colors"
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
                  type="checkbox"
                  checked={
                    selectedCategories.length === categories.length &&
                    categories.length > 0
                  }
                  onChange={selectAllCategories}
                  className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary"
                />
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("_id")}
              >
                <div className="flex items-center gap-2">
                  <span>No</span>
                  {sortBy === "_id" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("categoryCode")}
              >
                <div className="flex items-center gap-2">
                  <span>Code</span>
                  {sortBy === "categoryCode" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("categoryName")}
              >
                <div className="flex items-center gap-2">
                  <span>Name</span>
                  {sortBy === "categoryName" && (
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
                  <span>Created at</span>
                  {sortBy === "createdAt" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  <span>Status</span>
                  {sortBy === "status" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-dark divide-y divide-stroke dark:divide-stroke-dark">
            {paginatedCategories.map((category, index) => (
              <tr
                key={category._id}
                className="hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors"
              >
                <td className="px-8 py-5 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => toggleCategorySelection(category._id)}
                    className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white font-medium">
                  {(currentPage - 1) * 10 + index + 1}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900 dark:text-white">
                  {category.categoryCode}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white">
                  {category.categoryName}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">
                  {formatDate(category.createdAt)}
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  {getStatusBadge(category.status)}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-base font-medium">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-green hover:text-green-dark border border-green rounded-xl p-2.5 hover:bg-green-light-7 transition-all"
                      title="Chỉnh sửa"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red hover:text-red-dark border border-red rounded-xl p-2.5 hover:bg-red-light-6 transition-all"
                      title="Xóa"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
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
            <div className="text-base text-gray-700 dark:text-gray-300">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số{" "}
              {totalItems} danh mục
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
                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-base rounded-xl transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-2"
                    }`}
                  >
                    {page}
                  </button>
                ))}
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

export default CategoryTable;
