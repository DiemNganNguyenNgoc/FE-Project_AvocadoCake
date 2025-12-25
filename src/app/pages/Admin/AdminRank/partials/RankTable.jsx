import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const RankTable = ({
  ranks,
  loading,
  selectedRanks,
  currentPage,
  sortBy,
  sortOrder,
  toggleRankSelection,
  selectAllRanks,
  clearSelection,
  setCurrentPage,
  deleteRank,
  deleteMultipleRanks,
  getPaginatedRanks,
  handleSort,
  onNavigate,
  searchTerm = "",
  onSearch,
  itemsPerPage = 10,
  onItemsPerPageChange,
  onEdit,
}) => {
  const navigate = useNavigate();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const checkboxRef = useRef(null);

  const { ranks: paginatedRanks, totalPages, totalItems } = getPaginatedRanks();

  const isAllSelected =
    selectedRanks.length === ranks.length && ranks.length > 0;
  const isSomeSelected =
    selectedRanks.length > 0 && selectedRanks.length < ranks.length;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const handleSelectAllClick = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllRanks();
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
      "Rank",
      "Tên hiển thị",
      "Giảm giá (%)",
      "Hạn mức",
      "Trạng thái",
    ];
    const csvData = paginatedRanks.map((rank, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      rank.rankName,
      rank.rankDisplayName,
      rank.discountPercent,
      rank.getSpendingRange(),
      rank.isActive ? "Hoạt động" : "Tắt",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ranks_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleEdit = (rank) => {
    // Use onEdit prop if available (passed from AdminRank for modal editing)
    if (onEdit) {
      onEdit(rank);
    } else if (onNavigate) {
      localStorage.setItem("editRankData", JSON.stringify(rank));
      onNavigate("update");
    } else {
      navigate("/admin/rank/update", { state: rank });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa rank này?")) {
      try {
        await deleteRank(id);
      } catch (error) {
        console.error("Error deleting rank:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRanks.length === 0) {
      alert("Vui lòng chọn ít nhất một rank để xóa");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedRanks.length} ranks đã chọn?`
      )
    ) {
      try {
        await deleteMultipleRanks(selectedRanks);
      } catch (error) {
        console.error("Error deleting ranks:", error);
      }
    }
  };

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        {isActive ? "Hoạt động" : "Tắt"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600">
            Đang tải danh sách ranks...
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
                placeholder="Tìm kiếm rank..."
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
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Header */}
      {selectedRanks.length > 0 && (
        <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark bg-blue-light-5 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-dark dark:text-white">
              {selectedRanks.length} ranks được chọn
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
                  ref={checkboxRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllClick}
                  className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                  title={isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                />
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("priority")}
              >
                <div className="flex items-center gap-2">
                  <span>Thứ tự</span>
                  {sortBy === "priority" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("rankDisplayName")}
              >
                <div className="flex items-center gap-2">
                  <span>Tên Rank</span>
                  {sortBy === "rankDisplayName" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("discountPercent")}
              >
                <div className="flex items-center gap-2">
                  <span>Giảm giá</span>
                  {sortBy === "discountPercent" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Hạn mức
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Đặc quyền
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center gap-2">
                  <span>Trạng thái</span>
                  {sortBy === "isActive" && (
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
            {paginatedRanks.map((rank) => (
              <tr
                key={rank._id}
                className="hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors"
              >
                <td className="px-8 py-5 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRanks.includes(rank._id)}
                    onChange={() => toggleRankSelection(rank._id)}
                    className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-primary cursor-pointer"
                  />
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white font-medium">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "1.5rem" }}>{rank.icon}</span>
                    <span>{rank.priority}</span>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: rank.color }}
                    />
                    <div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {rank.rankDisplayName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {rank.rankCode}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className="text-base font-bold text-green-600">
                    {rank.discountPercent}%
                  </span>
                </td>
                <td className="px-8 py-5 text-base text-gray-900 dark:text-white">
                  {rank.getSpendingRange()}
                </td>
                <td className="px-8 py-5">
                  <div className="text-sm text-gray-600 max-w-xs">
                    {rank.benefits.slice(0, 2).join(", ")}
                    {rank.benefits.length > 2 && "..."}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  {getStatusBadge(rank.isActive)}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-base font-medium">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(rank)}
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
                      onClick={() => handleDelete(rank._id)}
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
              {totalItems} ranks
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

export default RankTable;
