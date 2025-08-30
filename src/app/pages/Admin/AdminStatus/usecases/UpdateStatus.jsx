import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  updateStatus,
  getAllStatus,
} from "../../../../api/services/StatusService";
import { setAllStatus } from "../../../../redux/slides/statusSlide";

const UpdateStatus = ({ status, onBack, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    statusCode: "",
    statusName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status) {
      setFormData({
        statusCode: status.statusCode || "",
        statusName: status.statusName || "",
      });
    }
  }, [status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const access_token = localStorage.getItem("token");
      await updateStatus(status._id, formData, access_token);

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

  if (!status) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Không tìm thấy thông tin trạng thái</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-500">
            Update-order-status
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

      <div className="max-w-2xl mx-auto px-6">
        <form className="space-y-6">
          {error && (
            <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

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

export default UpdateStatus;
