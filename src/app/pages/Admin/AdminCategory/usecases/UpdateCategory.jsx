import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { validateCategory } from "../schemas/categorySchema";
import { CategoryService } from "../services/CategoryService";

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
          // Don't remove localStorage here, remove it after successful update
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
      let categoryId;

      if (storedData) {
        const categoryData = JSON.parse(storedData);
        categoryId = categoryData.categoryId;
        localStorage.removeItem("editCategoryData"); // Clean up after use
      } else {
        categoryId = location.state?.categoryId;
      }

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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Đang tải thông tin danh mục...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
        {/* Modal Container */}
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Cập Nhật Danh Mục
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Chỉnh sửa thông tin danh mục
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="px-8 py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Code Field */}
              <div className="group">
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Mã Danh Mục <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="categoryCode"
                    value={formData.categoryCode}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 text-base border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                      validationErrors.categoryCode
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-gray-50 focus:bg-white"
                    }`}
                    placeholder="VD: C1, C2, C3..."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                {validationErrors.categoryCode && (
                  <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {validationErrors.categoryCode}
                  </p>
                )}
              </div>

              {/* Category Name Field */}
              <div className="group">
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Tên Danh Mục <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 text-base border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                      validationErrors.categoryName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 bg-gray-50 focus:bg-white"
                    }`}
                    placeholder="VD: Bánh sinh nhật, Bánh mùa đông..."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                {validationErrors.categoryName && (
                  <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {validationErrors.categoryName}
                  </p>
                )}
              </div>

              {/* Status Field */}
              <div className="group">
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Trạng Thái <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 text-base border-2 border-gray-200 bg-gray-50 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 focus:bg-white transition-all duration-200 appearance-none"
                  >
                    <option value="Active">🟢 Hoạt động</option>
                    <option value="Inactive">⚪ Không hoạt động</option>
                    <option value="Cancel">🔴 Đã hủy</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 text-base font-semibold bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang cập nhật...
                </div>
              ) : (
                "Cập Nhật Danh Mục"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateCategory;
