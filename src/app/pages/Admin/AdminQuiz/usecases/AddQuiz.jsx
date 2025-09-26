import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { QuizModel, QuizOptionModel } from "../models/QuizModel";
import { validateQuiz } from "../schemas/QuizSchema";
import QuizService from "../services/QuizService";
import { useQuizStore } from "../adminQuizStore";

const AddQuiz = ({ onBack }) => {
  const { addQuiz, setError, quizzes } = useQuizStore(); // Removed unused setLoading
  const [quizData, setQuizData] = useState(new QuizModel());
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Automatically set the order based on the number of quizzes
  useEffect(() => {
    setQuizData((prev) => ({
      ...prev,
      order: quizzes.length + 1, // Increment order based on the number of quizzes
    }));
  }, [quizzes]);

  const handleInputChange = (field, value) => {
    setQuizData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...quizData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setQuizData((prev) => ({ ...prev, options: newOptions }));

    // Clear option errors
    if (errors.options) {
      setErrors((prev) => ({
        ...prev,
        options: null,
      }));
    }
  };

  const addOption = () => {
    const newOption = new QuizOptionModel();
    setQuizData((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  const removeOption = (index) => {
    if (quizData.options.length > 1) {
      const newOptions = quizData.options.filter((_, i) => i !== index);
      setQuizData((prev) => ({ ...prev, options: newOptions }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate quiz data
    const validationErrors = validateQuiz(quizData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await QuizService.createQuiz(
        new QuizModel(quizData).toAPI()
      ); // Ensure quizData is a QuizModel instance
      addQuiz(response);

      // Reset form
      setQuizData(new QuizModel());
      setErrors({});

      // Close modal or navigate back
      if (onBack) {
        onBack();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Thêm Quiz Mới</h2>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Câu hỏi *
            </label>
            <textarea
              value={quizData.question}
              onChange={(e) => handleInputChange("question", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.question ? "border-red-500" : "border-gray-300"
              }`}
              rows={3}
              placeholder="Nhập câu hỏi..."
            />
            {errors.question && (
              <p className="mt-1 text-sm text-red-600">{errors.question}</p>
            )}
          </div>

          {/* Type and Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại quiz *
              </label>
              <select
                value={quizData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="mood">Tâm trạng</option>
                <option value="memory">Ký ức</option>
                <option value="preference">Sở thích</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thứ tự hiển thị *
              </label>
              <input
                type="number"
                value={quizData.order}
                onChange={(e) =>
                  handleInputChange("order", parseInt(e.target.value) || 0)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.order ? "border-red-500" : "border-gray-300"
                }`}
                min="0"
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-600">{errors.order}</p>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={quizData.allowCustomAnswer}
                onChange={(e) =>
                  handleInputChange("allowCustomAnswer", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Cho phép câu trả lời tùy chỉnh
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={quizData.isActive}
                onChange={(e) =>
                  handleInputChange("isActive", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Hiển thị quiz</span>
            </label>
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Các lựa chọn *
              </h3>
              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm lựa chọn
              </button>
            </div>

            {errors.options && (
              <p className="mb-4 text-sm text-red-600">{errors.options}</p>
            )}

            <div className="space-y-4">
              {quizData.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nội dung lựa chọn"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(index, "text", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Giá trị"
                      value={option.value}
                      onChange={(e) =>
                        handleOptionChange(index, "value", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    disabled={quizData.options.length === 1}
                    className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Đang lưu..." : "Lưu Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuiz;
