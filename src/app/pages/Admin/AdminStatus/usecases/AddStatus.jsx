import React, { useState } from "react";
import { useDispatch } from "react-redux";
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
      const access_token = localStorage.getItem("token");
      const response = await createStatus(formData, access_token);

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-500">
            Create-order-status
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6">
        <form className="space-y-6">
          {error && (
            <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Status Code */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Mã trạng thái
            </label>
            <input
              type="text"
              name="statusCode"
              value={formData.statusCode}
              onChange={handleInputChange}
              placeholder="Ví dụ: PAID"
              className="block w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Status Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tên trạng thái
            </label>
            <input
              type="text"
              name="statusName"
              value={formData.statusName}
              onChange={handleInputChange}
              placeholder="Ví dụ: Đã thanh toán"
              className="block w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </form>

        {/* Bottom buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStatus;
