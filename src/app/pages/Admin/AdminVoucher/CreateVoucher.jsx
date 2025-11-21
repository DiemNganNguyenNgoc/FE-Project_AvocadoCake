import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save, Calendar } from "lucide-react";
import { createVoucher } from "../../../api/services/VoucherService";
import { toast } from "react-toastify";

const CreateVoucher = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    voucherCode: "",
    voucherName: "",
    voucherDescription: "",
    voucherImage: null,
    voucherType: "PERCENTAGE",
    discountValue: "",
    maxDiscountAmount: "",
    minOrderValue: "0",
    applicableProducts: [],
    applicableCategories: [],
    startDate: "",
    endDate: "",
    totalQuantity: "",
    usageLimitPerUser: "1",
    isPublic: true,
    isActive: true,
    tags: "",
    priority: "0",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, voucherImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Append all fields
      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          data.append(
            key,
            JSON.stringify(
              formData[key]
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            )
          );
        } else if (key === "voucherImage" && formData[key]) {
          data.append(key, formData[key]);
        } else if (
          key === "applicableProducts" ||
          key === "applicableCategories"
        ) {
          // Chỉ append nếu array có phần tử
          const arrayValue = Array.isArray(formData[key]) ? formData[key] : [];
          if (arrayValue.length > 0) {
            data.append(key, JSON.stringify(arrayValue));
          }
          // Nếu rỗng thì không append, để backend xử lý default value
        } else {
          data.append(key, formData[key]);
        }
      });

      const accessToken = localStorage.getItem("access_token");
      const response = await createVoucher(data, accessToken);

      if (response.status === "OK") {
        toast.success("Tạo voucher thành công!");
        navigate("/admin/voucher");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tạo voucher!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/voucher")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-heading-4 font-bold text-dark dark:text-white">
              Tạo voucher mới
            </h1>
            <p className="mt-1 text-body-sm text-dark-6 dark:text-dark-6">
              Điền thông tin để tạo voucher giảm giá
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Thông tin cơ bản
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã voucher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="voucherCode"
                value={formData.voucherCode}
                onChange={handleChange}
                required
                placeholder="VD: SUMMER2024"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white uppercase"
              />
              <p className="text-xs text-gray-500 mt-1">
                Viết hoa, không dấu, không khoảng trắng
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên voucher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="voucherName"
                value={formData.voucherName}
                onChange={handleChange}
                required
                placeholder="VD: Giảm giá mùa hè"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                name="voucherDescription"
                value={formData.voucherDescription}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Mô tả chi tiết về voucher..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hình ảnh voucher
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Upload className="w-5 h-5 mr-2" />
                  <span>Chọn ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Discount Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Cài đặt giảm giá
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loại voucher <span className="text-red-500">*</span>
              </label>
              <select
                name="voucherType"
                value={formData.voucherType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="PERCENTAGE">Giảm theo phần trăm (%)</option>
                <option value="FIXED_AMOUNT">Giảm số tiền cố định (₫)</option>
                <option value="FREE_SHIPPING">Miễn phí vận chuyển</option>
                <option value="COMBO">Combo đặc biệt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giá trị giảm <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                required
                min="0"
                placeholder={
                  formData.voucherType === "PERCENTAGE" ? "VD: 20" : "VD: 50000"
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.voucherType === "PERCENTAGE"
                  ? "Phần trăm giảm giá (0-100)"
                  : "Số tiền giảm (VNĐ)"}
              </p>
            </div>

            {formData.voucherType === "PERCENTAGE" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Giảm tối đa
                </label>
                <input
                  type="number"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount}
                  onChange={handleChange}
                  min="0"
                  placeholder="VD: 100000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Để trống nếu không giới hạn
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đơn hàng tối thiểu
              </label>
              <input
                type="number"
                name="minOrderValue"
                value={formData.minOrderValue}
                onChange={handleChange}
                min="0"
                placeholder="VD: 200000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Giá trị đơn hàng tối thiểu để áp dụng
              </p>
            </div>
          </div>
        </div>

        {/* Validity Period */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Thời hạn sử dụng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Quantity & Usage Limits */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Giới hạn số lượng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tổng số lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalQuantity"
                value={formData.totalQuantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="VD: 100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tổng số voucher có thể phát hành
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giới hạn mỗi user
              </label>
              <input
                type="number"
                name="usageLimitPerUser"
                value={formData.usageLimitPerUser}
                onChange={handleChange}
                min="1"
                placeholder="VD: 1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mỗi user có thể sử dụng bao nhiêu lần
              </p>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Cài đặt bổ sung
          </h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Hiển thị công khai (User có thể tự lưu)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Kích hoạt ngay
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="VD: NEW_USER, FLASH_SALE, BIRTHDAY"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Độ ưu tiên (0-100)
              </label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Voucher có priority cao sẽ được áp dụng trước khi stack
              </p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/voucher")}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Tạo voucher</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVoucher;
