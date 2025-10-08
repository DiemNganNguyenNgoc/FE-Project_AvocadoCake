import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Edit3, Save, AlertCircle, Hash, Type } from "lucide-react";
import {
  updateStatus,
  getAllStatus,
} from "../../../../api/services/StatusService";
import { setAllStatus } from "../../../../redux/slides/statusSlide";

const UpdateStatus = ({ onBack, onSuccess }) => {
  const dispatch = useDispatch();
  const { selectedStatus } = useSelector((state) => state.status);
  const [formData, setFormData] = useState({
    statusCode: "",
    statusName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("UpdateStatus received selectedStatus:", selectedStatus); // Debug log
    if (selectedStatus) {
      setFormData({
        statusCode: selectedStatus.statusCode || "",
        statusName: selectedStatus.statusName || "",
      });
    }
  }, [selectedStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.statusCode.trim() || !formData.statusName.trim()) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const access_token = localStorage.getItem("access_token");
      await updateStatus(selectedStatus._id, formData, access_token);

      const allStatusResponse = await getAllStatus(access_token);
      dispatch(setAllStatus(allStatusResponse.data || []));

      alert("Cập nhật trạng thái thành công!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError(error.message || "Không thể cập nhật trạng thái");
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!selectedStatus) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center border border-gray-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Lỗi dữ liệu</h3>
          <p className="text-gray-600 mb-8 text-lg">
            Không tìm thấy thông tin trạng thái
          </p>
          <button
            onClick={handleCancel}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay - Gestalt: Figure/Ground Principle */}
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
        onClick={handleOverlayClick}
      >
        {/* Modal Container - Gestalt: Closure & Proximity */}
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100 border border-gray-100">
          {/* Header - Gestalt: Similarity & Continuity */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-10 py-8 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Fixed icon container với nền trắng đặc và icon màu xanh */}
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Edit3 className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Cập Nhật Trạng Thái</h2>
                  <p className="text-blue-100 text-lg">
                    Chỉnh sửa thông tin trạng thái
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

          {/* Current Status Info - Gestalt: Common Region */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-10 py-6 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-600 mb-4">
              THÔNG TIN HIỆN TẠI
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Hash className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mã trạng thái</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {selectedStatus.statusCode}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Type className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tên trạng thái</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {selectedStatus.statusName}
                  </p>
                </div>
              </div>
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
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-xl font-medium placeholder:text-gray-400"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-6 flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
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
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-xl font-medium placeholder:text-gray-400"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-6 flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
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
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl text-lg"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang cập nhật...</span>
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  <span>Cập nhật trạng thái</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateStatus;
