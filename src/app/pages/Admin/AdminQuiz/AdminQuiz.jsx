import React, { useEffect } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { QuizProvider, useQuizStore } from "./adminQuizStore";
import QuizService from "./services/QuizService";
import Breadcrumb from "./partials/Breadcrumb";
import SearchBar from "./partials/SearchBar";
import FilterBar from "./partials/FilterBar";
import QuizTable from "./partials/QuizTable";
import Pagination from "./partials/Pagination";
import AddQuiz from "./usecases/AddQuiz";
import UpdateQuiz from "./usecases/UpdateQuiz";
import ViewQuiz from "./partials/ViewQuiz";

const AdminQuizContent = ({ onNavigate }) => {
  const {
    loading,
    error,
    showAddModal,
    showEditModal,
    showViewModal,
    setLoading,
    setError,
    setQuizzes,
    setShowAddModal,
    setShowEditModal,
    setShowViewModal,
  } = useQuizStore();

  // Fetch quizzes on component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await QuizService.getQuizzes();
      setQuizzes(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuiz = () => {
    setShowAddModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb currentPage="Quiz" />

        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Quản lý Quiz
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Quản lý các câu hỏi quiz cho hệ thống gợi ý
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={handleAddQuiz}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm Quiz Mới
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <SearchBar />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bộ lọc & Hành động
                </label>
                <FilterBar />
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Table */}
        <div className="bg-white shadow rounded-lg">
          <QuizTable />
          <Pagination />
        </div>

        {/* Modals */}
        {showAddModal && <AddQuiz onBack={handleCloseModals} />}

        {showEditModal && <UpdateQuiz onBack={handleCloseModals} />}

        {showViewModal && <ViewQuiz onBack={handleCloseModals} />}
      </div>
    </div>
  );
};

const AdminQuiz = ({ onNavigate }) => {
  return (
    <QuizProvider>
      <AdminQuizContent onNavigate={onNavigate} />
    </QuizProvider>
  );
};

export default AdminQuiz;
