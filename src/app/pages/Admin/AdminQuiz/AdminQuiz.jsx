import React, { useEffect } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { QuizProvider, useQuizStore } from "./adminQuizStore";
import QuizService from "./services/QuizService";
import Breadcrumb from "./partials/Breadcrumb";
import QuizTable from "./partials/QuizTable";
import AddQuiz from "./usecases/AddQuiz";
import UpdateQuiz from "./usecases/UpdateQuiz";
import ViewQuiz from "./partials/ViewQuiz";
import AdminButtonComponent from "../../../components/AdminComponents/AdminButtonComponent";
import Button from "../../../components/AdminLayout/Button";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <Button
              onClick={handleAddQuiz}
              className="inline-flex items-center px-4 py-2"
              variant="primary"
              size="md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm Quiz Mới
            </Button>
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

        {/* Quiz Table */}
        <QuizTable />

        {/* Modals */}
        <AddQuiz isOpen={showAddModal} onBack={handleCloseModals} />

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
