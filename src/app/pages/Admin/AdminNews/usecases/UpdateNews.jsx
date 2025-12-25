// Similar to AddNews but for updating
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { validateNews } from "../schemas/newsSchema";
import { NewsService } from "../services/NewsService";

const UpdateNews = ({ onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const newsData =
    location.state || JSON.parse(localStorage.getItem("editNewsData") || "{}");

  const [formData, setFormData] = useState({
    newsTitle: newsData.newsTitle || "",
    newsContent: newsData.newsContent || "",
    newsImage: null,
    status: newsData.status || "Active",
  });
  const [previewImage, setPreviewImage] = useState(newsData.newsImage || null);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
      localStorage.removeItem("editNewsData");
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, newsImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validation = validateNews({ ...formData, isCreating: false });
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      await NewsService.updateExistingNews(newsData.newsId, formData);
      alert("Cập nhật tin tức thành công!");
      if (onBack) {
        onBack();
      } else {
        navigate("/admin/newss");
      }
    } catch (error) {
      setError(error.message || "Không thể cập nhật tin tức");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/admin/newss");
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={handleCancel} />
      <div
        className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
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
                  Cập Nhật Tin Tức
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Chỉnh sửa thông tin tin tức
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
            >
              <svg
                className="w-5 h-5 text-gray-500"
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

        <div className="px-8 py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-3">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="newsTitle"
                value={formData.newsTitle}
                onChange={handleInputChange}
                className={`w-full px-5 py-4 text-base border-2 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all ${
                  validationErrors.newsTitle
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50 focus:bg-white"
                }`}
                placeholder="Nhập tiêu đề tin tức..."
              />
              {validationErrors.newsTitle && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {validationErrors.newsTitle}
                </p>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-800 mb-3">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <textarea
                name="newsContent"
                value={formData.newsContent}
                onChange={handleInputChange}
                rows={8}
                className={`w-full px-5 py-4 text-base border-2 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all ${
                  validationErrors.newsContent
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50 focus:bg-white"
                }`}
                placeholder="Nhập nội dung tin tức..."
              />
              {validationErrors.newsContent && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {validationErrors.newsContent}
                </p>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-800 mb-3">
                Ảnh tin tức
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200"
                  />
                )}
              </div>
              {validationErrors.newsImage && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {validationErrors.newsImage}
                </p>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-800 mb-3">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-gray-50 focus:bg-white"
              >
                <option value="Active">Xuất bản</option>
                <option value="Draft">Bản nháp</option>
                <option value="Inactive">Ẩn</option>
              </select>
            </div>
          </form>
        </div>

        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Cập nhật"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UpdateNews;
