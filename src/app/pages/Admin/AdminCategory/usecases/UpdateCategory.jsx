import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { validateCategory } from "../schemas/categorySchema";
import { CategoryService } from "../services/CategoryService";
import Breadcrumb from "../partials/Breadcrumb";

const UpdateCategory = ({ onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    categoryCode: "",
    categoryName: "",
    status: "Active",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get category data from navigation state or fetch from API
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Try to get data from localStorage first (for AdminTab navigation)
        const storedData = localStorage.getItem("editCategoryData");
        if (storedData) {
          const categoryData = JSON.parse(storedData);
          setFormData({
            categoryCode: categoryData.categoryCode,
            categoryName: categoryData.categoryName,
            status: "Active", // Default status
          });
          localStorage.removeItem("editCategoryData"); // Clean up
          setInitialLoading(false);
          return;
        }

        // Fallback to location.state (for direct navigation)
        if (location.state?.categoryId) {
          const category = await CategoryService.fetchCategoryById(
            location.state.categoryId
          );
          setFormData({
            categoryCode: category.categoryCode,
            categoryName: category.categoryName,
            status: category.status,
          });
        } else {
          // If no state, redirect back to category list
          if (onBack) {
            onBack();
          } else {
            navigate("/admin/category");
          }
          return;
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        alert("Không thể tải thông tin danh mục");
        if (onBack) {
          onBack();
        } else {
          navigate("/admin/category");
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategoryData();
  }, [location.state, navigate, onBack]);

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
      // Get categoryId from localStorage or location.state
      const storedData = localStorage.getItem("editCategoryData");
      const categoryId = storedData
        ? JSON.parse(storedData).categoryId
        : location.state?.categoryId;

      if (!categoryId) {
        throw new Error("Không tìm thấy ID danh mục");
      }

      await CategoryService.updateExistingCategory(categoryId, formData);
      alert("Cập nhật danh mục thành công!");
      if (onBack) {
        onBack();
      } else {
        navigate("/admin/category");
      }
    } catch (error) {
      setError(error.message || "Không thể cập nhật danh mục");
      console.error("Error updating category:", error);
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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin danh mục...</p>
        </div>
      </div>
    );
  }

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
              Cập Nhật Danh Mục
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
                {loading ? "Đang cập nhật..." : "Cập Nhật Danh Mục"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
