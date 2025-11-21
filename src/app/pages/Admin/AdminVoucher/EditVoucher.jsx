import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Save } from "lucide-react";
import {
  getVoucherDetails,
  updateVoucher,
} from "../../../api/services/VoucherService";
import { toast } from "react-toastify";

const EditVoucher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    voucherCode: "",
    voucherName: "",
    voucherDescription: "",
    voucherType: "PERCENTAGE",
    discountValue: "",
    maxDiscountAmount: "",
    minOrderValue: "",
    startDate: "",
    endDate: "",
    totalQuantity: "",
    usageLimit: 1,
    isPublic: true,
    isActive: true,
    voucherTags: "",
    priority: 0,
    applicableProducts: "",
    applicableCategories: "",
  });

  const fetchVoucherData = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await getVoucherDetails(id, accessToken);

      if (response.status === "OK") {
        const voucher = response.data;
        setFormData({
          voucherCode: voucher.voucherCode || "",
          voucherName: voucher.voucherName || "",
          voucherDescription: voucher.voucherDescription || "",
          voucherType: voucher.voucherType || "PERCENTAGE",
          discountValue: voucher.discountValue || "",
          maxDiscountAmount: voucher.maxDiscountAmount || "",
          minOrderValue: voucher.minOrderValue || "",
          startDate: voucher.startDate
            ? new Date(voucher.startDate).toISOString().slice(0, 16)
            : "",
          endDate: voucher.endDate
            ? new Date(voucher.endDate).toISOString().slice(0, 16)
            : "",
          totalQuantity: voucher.totalQuantity || "",
          usageLimit: voucher.usageLimit || 1,
          isPublic: voucher.isPublic ?? true,
          isActive: voucher.isActive ?? true,
          voucherTags: voucher.voucherTags?.join(", ") || "",
          priority: voucher.priority || 0,
          applicableProducts: voucher.applicableProducts?.join(", ") || "",
          applicableCategories: voucher.applicableCategories?.join(", ") || "",
        });

        if (voucher.voucherImage) {
          setImagePreview(voucher.voucherImage);
        }
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin voucher!");
    }
  }, [id]);

  useEffect(() => {
    fetchVoucherData();
  }, [fetchVoucherData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB!");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.voucherCode.trim()) {
      toast.error("Vui lòng nhập mã voucher!");
      return;
    }
    if (!formData.voucherName.trim()) {
      toast.error("Vui lòng nhập tên voucher!");
      return;
    }
    if (!formData.discountValue || formData.discountValue <= 0) {
      toast.error("Vui lòng nhập giá trị giảm giá hợp lệ!");
      return;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu!");
      return;
    }

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const data = new FormData();

      // Append all form fields
      data.append("voucherCode", formData.voucherCode.toUpperCase().trim());
      data.append("voucherName", formData.voucherName.trim());
      data.append("voucherDescription", formData.voucherDescription.trim());
      data.append("voucherType", formData.voucherType);
      data.append("discountValue", formData.discountValue);

      if (formData.voucherType === "PERCENTAGE" && formData.maxDiscountAmount) {
        data.append("maxDiscountAmount", formData.maxDiscountAmount);
      }

      data.append("minOrderValue", formData.minOrderValue || 0);
      data.append("startDate", new Date(formData.startDate).toISOString());
      data.append("endDate", new Date(formData.endDate).toISOString());
      data.append("totalQuantity", formData.totalQuantity);
      data.append("usageLimit", formData.usageLimit);
      data.append("isPublic", formData.isPublic);
      data.append("isActive", formData.isActive);
      data.append("priority", formData.priority);

      // Process tags
      if (formData.voucherTags.trim()) {
        const tags = formData.voucherTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
        data.append("voucherTags", JSON.stringify(tags));
      }

      // Process applicable products
      if (formData.applicableProducts.trim()) {
        const products = formData.applicableProducts
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
        data.append("applicableProducts", JSON.stringify(products));
      }

      // Process applicable categories
      if (formData.applicableCategories.trim()) {
        const categories = formData.applicableCategories
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
        data.append("applicableCategories", JSON.stringify(categories));
      }

      // Append image if changed
      if (imageFile) {
        data.append("voucherImage", imageFile);
      }

      const response = await updateVoucher(id, data, accessToken);

      if (response.status === "OK") {
        toast.success("Cập nhật voucher thành công!");
        navigate("/admin/voucher");
      } else {
        toast.error(response.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi cập nhật voucher!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/admin/voucher")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-heading-4 font-bold text-dark dark:text-white">
            Chỉnh sửa voucher
          </h1>
          <p className="mt-1 text-body-sm text-dark-6 dark:text-dark-6">
            Cập nhật thông tin voucher
          </p>
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
                onChange={handleInputChange}
                placeholder="VD: SUMMER2024"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white uppercase"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mã voucher sẽ tự động chuyển thành chữ in hoa
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
                onChange={handleInputChange}
                placeholder="VD: Giảm giá mùa hè"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mô tả
              </label>
              <textarea
                name="voucherDescription"
                value={formData.voucherDescription}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về voucher..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hình ảnh voucher
              </label>
              <div className="flex items-start space-x-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Tải ảnh lên</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Chọn ảnh để cập nhật hình voucher
                  </p>
                  <p className="text-xs text-gray-500">
                    Định dạng: JPG, PNG. Tối đa 5MB
                  </p>
                </div>
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
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="PERCENTAGE">Giảm theo phần trăm (%)</option>
                <option value="FIXED_AMOUNT">Giảm số tiền cố định (₫)</option>
                <option value="FREE_SHIPPING">Miễn phí vận chuyển</option>
                <option value="COMBO">Combo ưu đãi</option>
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
                onChange={handleInputChange}
                placeholder={
                  formData.voucherType === "PERCENTAGE" ? "VD: 20" : "VD: 50000"
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.voucherType === "PERCENTAGE"
                  ? "Nhập giá trị % (0-100)"
                  : "Nhập số tiền giảm (VNĐ)"}
              </p>
            </div>

            {formData.voucherType === "PERCENTAGE" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Giảm tối đa (VNĐ)
                </label>
                <input
                  type="number"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount}
                  onChange={handleInputChange}
                  placeholder="VD: 100000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Số tiền giảm tối đa khi áp dụng % (tùy chọn)
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giá trị đơn hàng tối thiểu (VNĐ)
              </label>
              <input
                type="number"
                name="minOrderValue"
                value={formData.minOrderValue}
                onChange={handleInputChange}
                placeholder="VD: 200000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Đơn hàng phải đạt giá trị này mới áp dụng được voucher
              </p>
            </div>
          </div>
        </div>

        {/* Validity Period */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Thời gian hiệu lực
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
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                required
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
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Quantity Limits */}
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
                onChange={handleInputChange}
                placeholder="VD: 100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tổng số voucher có thể phát hành
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giới hạn sử dụng/người <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleInputChange}
                min="1"
                placeholder="VD: 1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mỗi người dùng có thể sử dụng voucher này bao nhiêu lần
              </p>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Cài đặt bổ sung
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hiển thị công khai
                  </label>
                  <p className="text-xs text-gray-500">
                    Voucher sẽ xuất hiện trong kho voucher
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kích hoạt
                  </label>
                  <p className="text-xs text-gray-500">
                    Voucher có thể được sử dụng
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thẻ tag (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="voucherTags"
                  value={formData.voucherTags}
                  onChange={handleInputChange}
                  placeholder="VD: summer, sale, hot"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Độ ưu tiên
                </label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Số càng cao, voucher càng được ưu tiên áp dụng
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID sản phẩm áp dụng (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="applicableProducts"
                  value={formData.applicableProducts}
                  onChange={handleInputChange}
                  placeholder="VD: 123abc, 456def"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Để trống nếu áp dụng cho tất cả sản phẩm
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID danh mục áp dụng (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="applicableCategories"
                  value={formData.applicableCategories}
                  onChange={handleInputChange}
                  placeholder="VD: abc123, def456"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Để trống nếu áp dụng cho tất cả danh mục
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Cập nhật voucher</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/voucher")}
            className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVoucher;
