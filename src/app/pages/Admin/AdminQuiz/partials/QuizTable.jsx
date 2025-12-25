import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useQuizStore } from "../adminQuizStore";

const QuizTable = () => {
  const {
    quizzes,
    selectedQuizzes,
    toggleQuizSelection,
    toggleSelectAll,
    setCurrentQuiz,
    setShowEditModal,
    setShowViewModal,
    deleteQuiz,
    setLoading,
    setError,
    toggleQuizStatus,
    filterType,
    setFilterType,
    clearSelection,
    deleteMultipleQuizzes,
  } = useQuizStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter data based on search term and filter type
  const filteredData = quizzes.filter((quiz) => {
    // Filter by type
    if (filterType && filterType !== "all" && quiz.type !== filterType) {
      return false;
    }

    // Filter by search term
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      quiz.question?.toLowerCase().includes(searchLower) ||
      quiz.type?.toLowerCase().includes(searchLower) ||
      quiz.order?.toString().includes(searchLower) ||
      quiz.options?.some((opt) => opt.text?.toLowerCase().includes(searchLower))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const allSelected =
    currentData.length > 0 &&
    currentData.every((quiz) => selectedQuizzes.includes(quiz._id));
  const someSelected = selectedQuizzes.length > 0 && !allSelected;

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
      "No",
      "Câu hỏi",
      "Loại",
      "Thứ tự",
      "Trạng thái",
      "Số lựa chọn",
      "Ngày tạo",
    ];
    const csvData = filteredData.map((quiz, index) => [
      index + 1,
      quiz.question || "N/A",
      quiz.type || "N/A",
      quiz.order || "N/A",
      quiz.isActive ? "Hoạt động" : "Ẩn",
      quiz.options?.length || 0,
      formatDate(quiz.createdAt),
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
    link.download = `quizzes_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleBulkDelete = async () => {
    if (selectedQuizzes.length === 0) {
      alert("Vui lòng chọn ít nhất một quiz để xóa");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedQuizzes.length} quiz đã chọn?`
      )
    ) {
      try {
        setLoading(true);
        await deleteMultipleQuizzes(selectedQuizzes);
        clearSelection();
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectAll = () => {
    toggleSelectAll();
  };

  const handleSelectQuiz = (quizId) => {
    toggleQuizSelection(quizId);
  };

  const handleEditQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setShowEditModal(true);
  };

  const handleViewQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setShowViewModal(true);
  };

  const handleDeleteQuiz = async (quiz) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa quiz "${quiz.question}"?`)) {
      try {
        setLoading(true);
        await deleteQuiz(quiz._id);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (quiz) => {
    try {
      setLoading(true);
      await toggleQuizStatus(quiz._id, !quiz.isActive);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getTypeBadge = (type) => {
    const types = {
      mood: { label: "Tâm trạng", color: "bg-purple-100 text-purple-800" },
      memory: { label: "Ký ức", color: "bg-blue-100 text-blue-800" },
      preference: { label: "Sở thích", color: "bg-green-100 text-green-800" },
    };
    const typeInfo = types[type] || {
      label: type,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}
      >
        {typeInfo.label}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-light-7 text-green-dark">
        Hoạt động
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-light-6 text-red-dark">
        Ẩn
      </span>
    );
  };

  if (currentData.length === 0 && !searchTerm) {
    return (
      <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-1 dark:bg-dark-2 rounded-full flex items-center justify-center">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Không có quiz
          </h3>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Chưa có quiz nào được tìm thấy.
          </p>
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
                placeholder="Tìm kiếm quiz..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-12 pr-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl w-80"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterType || "all"}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl"
            >
              <option value="all">Tất cả loại</option>
              <option value="mood">Tâm trạng</option>
              <option value="memory">Ký ức</option>
              <option value="preference">Sở thích</option>
            </select>
          </div>

          <div className="flex items-center gap-6">
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

      {/* Bulk Actions Header */}
      {selectedQuizzes.length > 0 && (
        <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark bg-blue-light-5 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-dark dark:text-white">
              {selectedQuizzes.length} quiz được chọn
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
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-2">
            <tr>
              <th className="px-8 py-4 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded-lg border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                />
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                No
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Câu hỏi
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Thứ tự
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Lựa chọn
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-8 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-52">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-dark divide-y divide-stroke dark:divide-stroke-dark">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-8 py-12 text-center">
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
                      Không tìm thấy quiz
                    </p>
                    <p className="text-xl text-gray-400 dark:text-gray-500">
                      Thử tìm kiếm với từ khóa khác
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((quiz, index) => {
                const isSelected = selectedQuizzes.includes(quiz._id);

                return (
                  <tr
                    key={quiz._id}
                    className={`hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors ${
                      isSelected ? "bg-blue-light-5 dark:bg-dark-2" : ""
                    }`}
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectQuiz(quiz._id)}
                        className="w-5 h-5 rounded-lg border-stroke dark:border-stroke-dark text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xl text-gray-900 dark:text-white font-semibold">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-8 py-5 text-xl text-gray-900 dark:text-white font-bold max-w-xs">
                      <div className="truncate" title={quiz.question}>
                        {quiz.question}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      {getTypeBadge(quiz.type)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xl text-gray-900 dark:text-white font-medium">
                      {quiz.order}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      {getStatusBadge(quiz.isActive)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xl text-gray-900 dark:text-white font-medium">
                      {quiz.options.length} lựa chọn
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xl text-gray-500 dark:text-gray-400 font-medium">
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
                        <span>{formatDate(quiz.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => handleViewQuiz(quiz)}
                          className="inline-flex items-center justify-center w-11 h-11 bg-green-light-7 dark:bg-dark-3 text-green hover:text-green-dark rounded-xl hover:scale-105 transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditQuiz(quiz)}
                          className="inline-flex items-center justify-center w-11 h-11 bg-blue-light-5 dark:bg-dark-3 text-primary hover:text-primary/80 rounded-xl hover:scale-105 transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(quiz)}
                          className={`inline-flex items-center justify-center w-11 h-11 rounded-xl hover:scale-105 transition-all ${
                            quiz.isActive
                              ? "bg-yellow-light-4 dark:bg-dark-3 text-yellow hover:text-yellow-dark"
                              : "bg-green-light-7 dark:bg-dark-3 text-green hover:text-green-dark"
                          }`}
                          title={quiz.isActive ? "Ẩn quiz" : "Hiện quiz"}
                        >
                          {quiz.isActive ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz)}
                          className="inline-flex items-center justify-center w-11 h-11 bg-red-light-6 dark:bg-dark-3 text-red hover:text-red-dark rounded-xl hover:scale-105 transition-all"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
  );
};

export default QuizTable;
