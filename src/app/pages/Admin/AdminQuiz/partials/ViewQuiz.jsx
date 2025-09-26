import React from "react";
import { X, Calendar, Tag, Hash, ToggleLeft, ToggleRight } from "lucide-react";
import { useQuizStore } from "../adminQuizStore";

const ViewQuiz = ({ onBack }) => {
  const { currentQuiz } = useQuizStore();

  if (!currentQuiz) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <p className="text-gray-600">Không tìm thấy thông tin quiz</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const getTypeLabel = (type) => {
    const types = {
      mood: "Tâm trạng",
      memory: "Ký ức",
      preference: "Sở thích",
    };
    return types[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết Quiz</h2>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Question */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Câu hỏi</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800">{currentQuiz.question}</p>
            </div>
          </div>

          {/* Quiz Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Loại quiz</p>
                  <p className="text-gray-900">
                    {getTypeLabel(currentQuiz.type)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Thứ tự hiển thị
                  </p>
                  <p className="text-gray-900">{currentQuiz.order}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {currentQuiz.isActive ? (
                  <ToggleRight className="w-5 h-5 text-green-500" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Trạng thái
                  </p>
                  <p
                    className={`${
                      currentQuiz.isActive ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {currentQuiz.isActive ? "Đang hoạt động" : "Đã ẩn"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
                  <p className="text-gray-900">
                    {formatDate(currentQuiz.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Cập nhật lần cuối
                  </p>
                  <p className="text-gray-900">
                    {formatDate(currentQuiz.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ToggleRight className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Cho phép câu trả lời tùy chỉnh
                  </p>
                  <p
                    className={`${
                      currentQuiz.allowCustomAnswer
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {currentQuiz.allowCustomAnswer ? "Có" : "Không"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Các lựa chọn ({currentQuiz.options.length})
            </h3>
            <div className="space-y-3">
              {currentQuiz.options.map((option, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{option.text}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Giá trị: {option.value}
                      </p>
                      {option.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={option.imageUrl}
                            alt={`Option ${index + 1}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewQuiz;
