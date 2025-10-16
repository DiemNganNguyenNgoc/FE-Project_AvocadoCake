import React from "react";
import {
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useQuizStore } from "../adminQuizStore";

const QuizTable = () => {
  const {
    paginatedQuizzes,
    selectedQuizzes,
    sortField,
    sortDirection,
    toggleQuizSelection,
    toggleSelectAll,
    setCurrentQuiz,
    setShowEditModal,
    setShowViewModal,
    deleteQuiz,
    setLoading,
    setError,
    setSort,
    toggleQuizStatus,
  } = useQuizStore();

  const quizzes = paginatedQuizzes();
  const allSelected =
    quizzes.length > 0 &&
    quizzes.every((quiz) => selectedQuizzes.includes(quiz._id));
  const someSelected = selectedQuizzes.length > 0 && !allSelected;

  const handleSelectAll = () => {
    toggleSelectAll();
  };

  const handleSelectQuiz = (quizId) => {
    toggleQuizSelection(quizId);
  };

  const handleSort = (field) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSort(field, direction);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <div className="flex flex-col">
          <ChevronUp className="w-3 h-3 text-gray-400" />
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUp
          className={`w-3 h-3 ${
            sortDirection === "asc" ? "text-blue-600" : "text-gray-400"
          }`}
        />
        <ChevronDown
          className={`w-3 h-3 ${
            sortDirection === "desc" ? "text-blue-600" : "text-gray-400"
          }`}
        />
      </div>
    );
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
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}
      >
        {typeInfo.label}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Hoạt động
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Ẩn
      </span>
    );
  };

  if (quizzes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có quiz
          </h3>
          <p className="text-gray-500">Chưa có quiz nào được tìm thấy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2">
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
                  className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary"
                />
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>No</span>
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("question")}
              >
                <div className="flex items-center gap-2">
                  <span>Câu hỏi</span>
                  {getSortIcon("question")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center gap-2">
                  <span>Loại</span>
                  {getSortIcon("type")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("order")}
              >
                <div className="flex items-center gap-2">
                  <span>Thứ tự</span>
                  {getSortIcon("order")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center gap-2">
                  <span>Trạng thái</span>
                  {getSortIcon("isActive")}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Lựa chọn
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-2">
                  <span>Ngày tạo</span>
                  {getSortIcon("createdAt")}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-dark divide-y divide-stroke dark:divide-stroke-dark">
            {quizzes.map((quiz, index) => {
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
                      className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white font-medium">
                    {index + 1}
                  </td>
                  <td className="px-8 py-5 text-base text-gray-900 dark:text-white max-w-xs">
                    <div className="truncate" title={quiz.question}>
                      {quiz.question}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    {getTypeBadge(quiz.type)}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white">
                    {quiz.order}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    {getStatusBadge(quiz.isActive)}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white">
                    {quiz.options.length} lựa chọn
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">
                    {formatDate(quiz.createdAt)}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base font-medium">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewQuiz(quiz)}
                        className="text-green hover:text-green-dark hover:bg-green-light-7 dark:hover:bg-dark-3 p-2.5 rounded-xl transition-all"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditQuiz(quiz)}
                        className="text-primary hover:text-primary/80 hover:bg-blue-light-5 dark:hover:bg-dark-3 p-2.5 rounded-xl transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(quiz)}
                        className={`p-2.5 rounded-xl transition-all ${
                          quiz.isActive
                            ? "text-yellow hover:text-yellow-dark hover:bg-yellow-light-4 dark:hover:bg-dark-3"
                            : "text-green hover:text-green-dark hover:bg-green-light-7 dark:hover:bg-dark-3"
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
                        className="text-red hover:text-red-dark hover:bg-red-light-6 dark:hover:bg-dark-3 p-2.5 rounded-xl transition-all"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizTable;
