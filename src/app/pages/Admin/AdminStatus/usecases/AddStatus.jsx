import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Plus, Save, AlertCircle } from "lucide-react";
import {
  createStatus,
  getAllStatus,
} from "../../../../api/services/StatusService";
import { setAllStatus } from "../../../../redux/slides/statusSlide";

const AddStatus = ({ onBack, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    statusCode: "",
    statusName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form data
    if (!formData.statusCode.trim() || !formData.statusName.trim()) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const access_token = localStorage.getItem("access_token");
      await createStatus(formData, access_token);

      // Refresh danh sách status
      const allStatusResponse = await getAllStatus(access_token);
      dispatch(setAllStatus(allStatusResponse.data || []));

      alert("Tạo trạng thái thành công!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError(error.message || "Không thể tạo trạng thái");
      console.error("Error creating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <>
      {/* Overlay - Gestalt: Figure/Ground Principle */}
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
        onClick={handleOverlayClick}
      >
        {/* Modal Container - Gestalt: Closure & Proximity - UPDATED SIZE */}
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100 border border-gray-100">
          {/* Header - Gestalt: Similarity & Continuity */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-8 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Fixed icon container với nền trắng đặc và icon màu xanh */}
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Tạo Trạng Thái Mới</h2>
                  <p className="text-green-100 text-lg">
                    Thêm trạng thái đơn hàng
                  </p>
                </div>
              </div>

              {/* Fixed close button với nền đen mờ */}
              <button
                onClick={handleCancel}
                className="w-12 h-12 bg-black bg-opacity-10 hover:bg-black hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-200 group"
              >
                <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Content Area - Gestalt: Common Region */}
          <div className="p-10">
            {/* Error Message - Gestalt: Proximity */}
            {error && (
              <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-6 h-6 text-red-400 mr-4" />
                  <p className="text-red-700 font-medium text-lg">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Status Code Field - Gestalt: Similarity */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-700">
                  Mã Trạng Thái
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="statusCode"
                    value={formData.statusCode}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: PAID, PENDING, CANCELLED"
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 transition-all duration-200 text-xl font-medium placeholder:text-gray-400"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-6 flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <p className="text-base text-gray-500">
                  Mã định danh duy nhất cho trạng thái
                </p>
              </div>

              {/* Status Name Field - Gestalt: Similarity */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-700">
                  Tên Trạng Thái
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="statusName"
                    value={formData.statusName}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Đã thanh toán, Đang xử lý, Đã hủy"
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 transition-all duration-200 text-xl font-medium placeholder:text-gray-400"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-6 flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
                <p className="text-base text-gray-500">
                  Tên hiển thị cho người dùng
                </p>
              </div>
            </form>
          </div>

          {/* Footer Actions - Gestalt: Common Fate */}
          <div className="bg-gray-50 px-10 py-8 flex justify-end space-x-5 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 text-lg"
            >
              Hủy bỏ
            </button>

            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !formData.statusCode.trim() ||
                !formData.statusName.trim()
              }
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl text-lg"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  <span>Lưu trạng thái</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStatus;
