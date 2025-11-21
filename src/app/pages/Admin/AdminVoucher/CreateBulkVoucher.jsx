import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save, Copy } from "lucide-react";
import { createBulkVouchers } from "../../../api/services/VoucherService";
import { toast } from "react-toastify";

const CreateBulkVoucher = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    baseCode: "",
    quantity: "",
    voucherName: "",
    voucherDescription: "",
    voucherImage: null,
    voucherType: "PERCENTAGE",
    discountValue: "",
    maxDiscountAmount: "",
    minOrderValue: "0",
    startDate: "",
    endDate: "",
    totalQuantityPerVoucher: "1",
    usageLimitPerUser: "1",
    isPublic: false,
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

    if (formData.quantity > 1000) {
      toast.warning("Số lượng voucher không nên vượt quá 1000!");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

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
        } else {
          data.append(key, formData[key]);
        }
      });

      const accessToken = localStorage.getItem("access_token");
      const response = await createBulkVouchers(data, accessToken);

      if (response.status === "OK") {
        toast.success(response.message);
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

  // Preview example codes
  const getExampleCodes = () => {
    const examples = [];
    for (let i = 1; i <= Math.min(3, formData.quantity || 3); i++) {
      examples.push(
        `${formData.baseCode || "CODE"}${String(i).padStart(4, "0")}`
      );
    }
    return examples;
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
              Tạo voucher hàng loạt
            </h1>
            <p className="mt-1 text-body-sm text-dark-6 dark:text-dark-6">
              Tạo nhiều voucher cùng lúc với mã tự động
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bulk Settings */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-md p-6 border-2 border-purple-200 dark:border-purple-700">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-lg">
              <Copy className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Cấu hình tạo hàng loạt
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Hệ thống sẽ tự động tạo mã voucher với số thứ tự. VD:
                SUMMER0001, SUMMER0002, ...
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mã gốc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="baseCode"
                    value={formData.baseCode}
                    onChange={handleChange}
                    required
                    placeholder="VD: SUMMER"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="2"
                    max="1000"
                    placeholder="VD: 100"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tối đa 1000 voucher
                  </p>
                </div>
              </div>

              {formData.baseCode && formData.quantity && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Xem trước mã voucher:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getExampleCodes().map((code, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-mono"
                      >
                        {code}
                      </span>
                    ))}
                    {formData.quantity > 3 && (
                      <span className="px-3 py-1 text-gray-500 text-sm">
                        ... và {formData.quantity - 3} mã khác
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Thông tin voucher
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="text-xs text-gray-500 mt-1">
                Sẽ thêm số thứ tự vào cuối (VD: Giảm giá mùa hè #1)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số lần dùng mỗi voucher
              </label>
              <input
                type="number"
                name="totalQuantityPerVoucher"
                value={formData.totalQuantityPerVoucher}
                onChange={handleChange}
                min="1"
                placeholder="VD: 1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mỗi voucher có thể dùng bao nhiêu lần
              </p>
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
                  formData.voucherType === "PERCENTAGE" ? "VD: 10" : "VD: 20000"
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
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
                  placeholder="VD: 50000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
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
                placeholder="VD: 100000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Validity Period */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
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
                Hiển thị công khai (Không khuyến nghị cho voucher hàng loạt)
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
                placeholder="VD: BULK, CAMPAIGN, LIMITED"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
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
                <span>Đang tạo {formData.quantity} voucher...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Tạo {formData.quantity || 0} voucher</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBulkVoucher;
