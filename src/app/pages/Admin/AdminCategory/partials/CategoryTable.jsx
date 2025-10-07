import React from "react";
import { useNavigate } from "react-router-dom";

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
}) => {
  const navigate = useNavigate();

  const {
    categories: paginatedCategories,
    totalPages,
    totalItems,
  } = getPaginatedCategories();

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Table Header with Bulk Actions */}
      {selectedCategories.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-10 py-6 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-blue-700">
              {selectedCategories.length} danh mục được chọn
            </span>
            <div className="flex space-x-4">
              <button
                onClick={clearSelection}
                className="px-6 py-3 text-base font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Bỏ chọn
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-6 py-3 text-base font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Xóa đã chọn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-10 py-6 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedCategories.length === categories.length &&
                    categories.length > 0
                  }
                  onChange={selectAllCategories}
                  className="w-6 h-6 rounded-lg border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                />
              </th>
              <th
                className="px-10 py-6 text-left text-base font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-200/50 transition-colors duration-200 rounded-lg"
                onClick={() => handleSort("_id")}
              >
                <div className="flex items-center space-x-2">
                  <span>No</span>
                  {sortBy === "_id" && (
                    <span className="text-blue-500 text-lg">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-10 py-6 text-left text-base font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-200/50 transition-colors duration-200 rounded-lg"
                onClick={() => handleSort("categoryCode")}
              >
                <div className="flex items-center space-x-2">
                  <span>Code</span>
                  {sortBy === "categoryCode" && (
                    <span className="text-blue-500 text-lg">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-10 py-6 text-left text-base font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-200/50 transition-colors duration-200 rounded-lg"
                onClick={() => handleSort("categoryName")}
              >
                <div className="flex items-center space-x-2">
                  <span>Name</span>
                  {sortBy === "categoryName" && (
                    <span className="text-blue-500 text-lg">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-10 py-6 text-left text-base font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-200/50 transition-colors duration-200 rounded-lg"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center space-x-2">
                  <span>Created at</span>
                  {sortBy === "createdAt" && (
                    <span className="text-blue-500 text-lg">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-10 py-6 text-left text-base font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-200/50 transition-colors duration-200 rounded-lg"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center space-x-2">
                  <span>Status</span>
                  {sortBy === "status" && (
                    <span className="text-blue-500 text-lg">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-10 py-6 text-left text-base font-semibold text-gray-700 uppercase tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCategories.map((category, index) => (
              <tr
                key={category._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-8 py-6 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => toggleCategorySelection(category._id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-lg text-gray-900 font-medium">
                  {(currentPage - 1) * 10 + index + 1}
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-lg font-semibold text-gray-900">
                  {category.categoryCode}
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-lg text-gray-900">
                  {category.categoryName}
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-lg text-gray-500">
                  {formatDate(category.createdAt)}
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  {getStatusBadge(category.status)}
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-lg font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-green-600 hover:text-green-900 border border-green-600 rounded-lg p-2 hover:bg-green-50 transition-all duration-200"
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
                      className="text-red-600 hover:text-red-900 border border-red-600 rounded-lg p-2 hover:bg-red-50 transition-all duration-200"
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
        <div className="bg-white px-8 py-5 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-base text-gray-700">
              Hiển thị {(currentPage - 1) * 10 + 1} đến{" "}
              {Math.min(currentPage * 10, totalItems)} trong tổng số{" "}
              {totalItems} danh mục
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-base border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-base border rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-base border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
