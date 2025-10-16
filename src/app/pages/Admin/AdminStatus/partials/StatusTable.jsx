import React, { useState } from "react";
import {
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
} from "lucide-react";

const StatusTable = ({ statuses, loading, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const formatDate = (dateString) => {
    if (!dateString) return "05/01/2025";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Filter data based on search term
  const filteredData = statuses.filter((status) => {
    if (!searchTerm) return true;
    return (
      status.statusCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.statusName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(status.createdAt)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
    const headers = ["No", "Code", "Name", "Created at"];
    const csvData = filteredData.map((status, index) => [
      index + 1,
      status.statusCode || "N/A",
      status.statusName || "N/A",
      formatDate(status.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `status_data_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (loading) {
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
                placeholder="Tìm kiếm trạng thái..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-12 pr-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-base w-80"
              />
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-3 px-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors text-base">
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
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-2">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                No
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Code
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created at
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-dark divide-y divide-stroke dark:divide-stroke-dark">
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-8 py-12 text-center text-gray-500 dark:text-gray-400"
                >
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
                      Không có dữ liệu trạng thái
                    </p>
                    <p className="text-base text-gray-400 dark:text-gray-500">
                      Hãy thêm trạng thái mới để bắt đầu
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((status, index) => (
                <tr
                  key={status._id || index}
                  className="hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors"
                >
                  <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full text-dark dark:text-white font-bold">
                      {startIndex + index + 1}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base font-bold text-primary">
                    {status.statusCode || "N/A"}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base font-bold text-gray-900 dark:text-white">
                    {status.statusName || "N/A"}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base text-gray-500 dark:text-gray-400 font-medium">
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
                      <span>{formatDate(status.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base font-medium">
                    <div className="flex gap-3">
                      <button
                        onClick={() => onEdit(status)}
                        className="inline-flex items-center justify-center w-11 h-11 bg-green-light-7 dark:bg-dark-3 text-green hover:text-green-dark rounded-xl hover:scale-105 transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Bạn có chắc chắn muốn xóa trạng thái này?"
                            )
                          ) {
                            onDelete(status._id);
                          }
                        }}
                        className="inline-flex items-center justify-center w-11 h-11 bg-red-light-6 dark:bg-dark-3 text-red hover:text-red-dark rounded-xl hover:scale-105 transition-all"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-6 border-t border-stroke dark:border-stroke-dark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-base text-gray-700 dark:text-gray-300">
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
                    className={`px-4 py-2 rounded-xl text-base transition-colors ${
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
  );
};

export default StatusTable;
