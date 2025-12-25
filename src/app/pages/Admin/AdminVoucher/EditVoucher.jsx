import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Save } from "lucide-react";
import {
  getVoucherDetails,
  updateVoucher,
} from "../../../api/services/VoucherService";
import { toast } from "react-toastify";
import Button from "../../../components/AdminLayout/Button";
import Input from "../../../components/AdminLayout/Input";
import Select from "../../../components/AdminLayout/Select";
import Textarea from "../../../components/AdminLayout/Textarea";

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/voucher")}
          className="min-w-[48px] min-h-[48px] p-0 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-heading-4 font-bold text-dark dark:text-white">
            Chỉnh sửa voucher
          </h1>
          <p className="mt-1 text-body-sm text-dark-6 dark:text-dark-6">
            Cập nhật thông tin voucher
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
          <h2 className="text-heading-5 font-bold mb-6 text-dark dark:text-white">
            Thông tin cơ bản
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Mã voucher"
              name="voucherCode"
              value={formData.voucherCode}
              onChange={handleInputChange}
              placeholder="VD: SUMMER2024"
              required
              helperText="Mã voucher sẽ tự động chuyển thành chữ in hoa"
              className="uppercase"
            />

            <Input
              label="Tên voucher"
              name="voucherName"
              value={formData.voucherName}
              onChange={handleInputChange}
              placeholder="VD: Giảm giá mùa hè"
              required
            />

            <div className="lg:col-span-2">
              <Textarea
                label="Mô tả"
                name="voucherDescription"
                value={formData.voucherDescription}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về voucher..."
                rows={3}
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-body-sm font-semibold text-dark dark:text-white mb-3">
                Hình ảnh voucher
              </label>
              <div className="flex items-start gap-6">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-2xl border-2 border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 min-w-[32px] min-h-[32px] bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-body-xs text-gray-500">
                      Tải ảnh lên
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-body-sm text-dark-7 dark:text-dark-6 mb-1">
                    Chọn ảnh để cập nhật hình voucher
                  </p>
                  <p className="text-body-xs text-dark-6">
                    Định dạng: JPG, PNG. Tối đa 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discount Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
          <h2 className="text-heading-5 font-bold mb-6 text-dark dark:text-white">
            Cài đặt giảm giá
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Select
              label="Loại voucher"
              name="voucherType"
              value={formData.voucherType}
              onChange={handleInputChange}
              required
              options={[
                { value: "PERCENTAGE", label: "Giảm theo phần trăm (%)" },
                { value: "FIXED_AMOUNT", label: "Giảm số tiền cố định (₫)" },
                { value: "FREE_SHIPPING", label: "Miễn phí vận chuyển" },
                { value: "COMBO", label: "Combo ưu đãi" },
              ]}
            />

            <Input
              label="Giá trị giảm"
              name="discountValue"
              type="number"
              value={formData.discountValue}
              onChange={handleInputChange}
              placeholder={
                formData.voucherType === "PERCENTAGE" ? "VD: 20" : "VD: 50000"
              }
              required
              helperText={
                formData.voucherType === "PERCENTAGE"
                  ? "Nhập giá trị % (0-100)"
                  : "Nhập số tiền giảm (VNĐ)"
              }
            />

            {formData.voucherType === "PERCENTAGE" && (
              <Input
                label="Giảm tối đa (VNĐ)"
                name="maxDiscountAmount"
                type="number"
                value={formData.maxDiscountAmount}
                onChange={handleInputChange}
                placeholder="VD: 100000"
                helperText="Số tiền giảm tối đa khi áp dụng % (tùy chọn)"
              />
            )}

            <Input
              label="Giá trị đơn hàng tối thiểu (VNĐ)"
              name="minOrderValue"
              type="number"
              value={formData.minOrderValue}
              onChange={handleInputChange}
              placeholder="VD: 200000"
              helperText="Đơn hàng phải đạt giá trị này mới áp dụng được voucher"
            />
          </div>
        </div>

        {/* Validity Period */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
          <h2 className="text-heading-5 font-bold mb-6 text-dark dark:text-white">
            Thời gian hiệu lực
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Ngày bắt đầu"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Ngày kết thúc"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Quantity Limits */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
          <h2 className="text-heading-5 font-bold mb-6 text-dark dark:text-white">
            Giới hạn số lượng
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Tổng số lượng"
              name="totalQuantity"
              type="number"
              value={formData.totalQuantity}
              onChange={handleInputChange}
              placeholder="VD: 100"
              required
              helperText="Tổng số voucher có thể phát hành"
            />

            <Input
              label="Giới hạn sử dụng/người"
              name="usageLimit"
              type="number"
              value={formData.usageLimit}
              onChange={handleInputChange}
              min="1"
              placeholder="VD: 1"
              required
              helperText="Mỗi người dùng có thể sử dụng voucher này bao nhiêu lần"
            />
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
          <h2 className="text-heading-5 font-bold mb-6 text-dark dark:text-white">
            Cài đặt bổ sung
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-avocado-green-100 dark:hover:border-avocado-green-100 transition-all">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="w-6 h-6 text-avocado-green-100 border-gray-300 rounded-lg focus:ring-avocado-green-100 focus:ring-2"
                />
                <div className="flex-1">
                  <label className="text-body-sm font-semibold text-dark dark:text-white block cursor-pointer">
                    Hiển thị công khai
                  </label>
                  <p className="text-body-xs text-dark-6 mt-0.5">
                    Voucher sẽ xuất hiện trong kho voucher
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-avocado-green-100 dark:hover:border-avocado-green-100 transition-all">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-6 h-6 text-avocado-green-100 border-gray-300 rounded-lg focus:ring-avocado-green-100 focus:ring-2"
                />
                <div className="flex-1">
                  <label className="text-body-sm font-semibold text-dark dark:text-white block cursor-pointer">
                    Kích hoạt
                  </label>
                  <p className="text-body-xs text-dark-6 mt-0.5">
                    Voucher có thể được sử dụng
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Thẻ tag (phân cách bằng dấu phẩy)"
                name="voucherTags"
                value={formData.voucherTags}
                onChange={handleInputChange}
                placeholder="VD: summer, sale, hot"
              />

              <Input
                label="Độ ưu tiên"
                name="priority"
                type="number"
                value={formData.priority}
                onChange={handleInputChange}
                placeholder="0"
                helperText="Số càng cao, voucher càng được ưu tiên áp dụng"
              />

              <Input
                label="ID sản phẩm áp dụng (phân cách bằng dấu phẩy)"
                name="applicableProducts"
                value={formData.applicableProducts}
                onChange={handleInputChange}
                placeholder="VD: 123abc, 456def"
                helperText="Để trống nếu áp dụng cho tất cả sản phẩm"
              />

              <Input
                label="ID danh mục áp dụng (phân cách bằng dấu phẩy)"
                name="applicableCategories"
                value={formData.applicableCategories}
                onChange={handleInputChange}
                placeholder="VD: abc123, def456"
                helperText="Để trống nếu áp dụng cho tất cả danh mục"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                <span>Cập nhật voucher</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/voucher")}
            className="px-8"
          >
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditVoucher;
