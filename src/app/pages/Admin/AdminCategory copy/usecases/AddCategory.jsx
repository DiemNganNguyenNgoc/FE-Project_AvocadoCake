import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateCategory } from "../schemas/categorySchema";
import { CategoryService } from "../services/CategoryService";
import Breadcrumb from "../partials/Breadcrumb";

const AddCategory = ({ onBack }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryCode: "",
    categoryName: "",
    status: "Active",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form data
    const validation = validateCategory(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      const newCategory = await CategoryService.createNewCategory(formData);
      alert("Thêm danh mục thành công!");
      if (onBack) {
        onBack();
      } else {
        navigate("/admin/category");
      }
    } catch (error) {
      setError(error.message || "Không thể tạo danh mục");
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/admin/category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Breadcrumb */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 border-b border-gray-100">
            <Breadcrumb />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Thêm Danh Mục Mới
            </h1>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã Danh Mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="categoryCode"
                value={formData.categoryCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.categoryCode
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="VD: C1, C2, C3..."
              />
              {validationErrors.categoryCode && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.categoryCode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Danh Mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.categoryName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="VD: Bánh sinh nhật, Bánh mùa đông..."
              />
              {validationErrors.categoryName && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.categoryName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng Thái <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Không hoạt động</option>
                <option value="Cancel">Đã hủy</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang tạo..." : "Tạo Danh Mục"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
