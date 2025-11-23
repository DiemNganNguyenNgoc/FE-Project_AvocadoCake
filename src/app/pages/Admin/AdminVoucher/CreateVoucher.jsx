import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save, Calendar, Image as ImageIcon, X } from "lucide-react";
import { createVoucher } from "../../../api/services/VoucherService";
import { toast } from "react-toastify";
import Button from "../../../components/AdminLayout/Button";
import Input from "../../../components/AdminLayout/Input";
import Select from "../../../components/AdminLayout/Select";
import Textarea from "../../../components/AdminLayout/Textarea";

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
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB!");
        return;
      }
      setFormData((prev) => ({ ...prev, voucherImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, voucherImage: null }));
    setImagePreview(null);
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
          const arrayValue = Array.isArray(formData[key]) ? formData[key] : [];
          if (arrayValue.length > 0) {
            data.append(key, JSON.stringify(arrayValue));
          }
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate("/admin/voucher")}
          variant="ghost"
          size="md"
          icon={<ArrowLeft />}
          className="min-h-[48px]"
        />
        <div>
          <h1 className="text-heading-4 font-bold text-dark dark:text-white">
            Tạo voucher mới
          </h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
            Điền thông tin để tạo voucher giảm giá
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            Thông tin cơ bản
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label={
                <>
                  Mã voucher <span className="text-red-500">*</span>
                </>
              }
              name="voucherCode"
              value={formData.voucherCode}
              onChange={handleChange}
              required
              placeholder="VD: SUMMER2024"
              helperText="Viết hoa, không dấu, không khoảng trắng"
              className="uppercase min-h-[48px]"
            />

            <Input
              label={
                <>
                  Tên voucher <span className="text-red-500">*</span>
                </>
              }
              name="voucherName"
              value={formData.voucherName}
              onChange={handleChange}
              required
              placeholder="VD: Giảm giá mùa hè"
              className="min-h-[48px]"
            />

            <div className="lg:col-span-2">
              <Textarea
                label={
                  <>
                    Mô tả <span className="text-red-500">*</span>
                  </>
                }
                name="voucherDescription"
                value={formData.voucherDescription}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Mô tả chi tiết về voucher..."
              />
            </div>

            {/* Image Upload */}
            <div className="lg:col-span-2">
              <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                Hình ảnh voucher
              </label>
              
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-48 h-48 rounded-2xl object-cover shadow-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-stroke dark:border-stroke-dark rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-2 transition-all">
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tải ảnh lên
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG tối đa 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Discount Settings */}
        <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            Cài đặt giảm giá
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Select
              label={
                <>
                  Loại voucher <span className="text-red-500">*</span>
                </>
              }
              name="voucherType"
              value={formData.voucherType}
              onChange={handleChange}
              required
              options={[
                { value: "PERCENTAGE", label: "Giảm theo phần trăm (%)" },
                { value: "FIXED_AMOUNT", label: "Giảm số tiền cố định (₫)" },
                { value: "FREE_SHIPPING", label: "Miễn phí vận chuyển" },
                { value: "COMBO", label: "Combo đặc biệt" },
              ]}
            />

            <Input
              label={
                <>
                  Giá trị giảm <span className="text-red-500">*</span>
                </>
              }
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              required
              min="0"
              placeholder={
                formData.voucherType === "PERCENTAGE" ? "VD: 20" : "VD: 50000"
              }
              helperText={
                formData.voucherType === "PERCENTAGE"
                  ? "Phần trăm giảm giá (0-100)"
                  : "Số tiền giảm (VNĐ)"
              }
              className="min-h-[48px]"
            />

            {formData.voucherType === "PERCENTAGE" && (
              <Input
                label="Giảm tối đa"
                type="number"
                name="maxDiscountAmount"
                value={formData.maxDiscountAmount}
                onChange={handleChange}
                min="0"
                placeholder="VD: 100000"
                helperText="Để trống nếu không giới hạn"
                className="min-h-[48px]"
              />
            )}

            <Input
              label="Đơn hàng tối thiểu"
              type="number"
              name="minOrderValue"
              value={formData.minOrderValue}
              onChange={handleChange}
              min="0"
              placeholder="VD: 200000"
              helperText="Giá trị đơn hàng tối thiểu để áp dụng"
              className="min-h-[48px]"
            />
          </div>
        </div>

        {/* Validity Period */}
        <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-avocado-green-100" />
            Thời hạn sử dụng
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label={
                <>
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </>
              }
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="min-h-[48px]"
            />

            <Input
              label={
                <>
                  Ngày kết thúc <span className="text-red-500">*</span>
                </>
              }
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="min-h-[48px]"
            />
          </div>
        </div>

        {/* Quantity & Usage Limits */}
        <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            Giới hạn số lượng
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label={
                <>
                  Tổng số lượng <span className="text-red-500">*</span>
                </>
              }
              type="number"
              name="totalQuantity"
              value={formData.totalQuantity}
              onChange={handleChange}
              required
              min="1"
              placeholder="VD: 100"
              helperText="Tổng số voucher có thể phát hành"
              className="min-h-[48px]"
            />

            <Input
              label="Giới hạn mỗi user"
              type="number"
              name="usageLimitPerUser"
              value={formData.usageLimitPerUser}
              onChange={handleChange}
              min="1"
              placeholder="VD: 1"
              helperText="Mỗi user có thể sử dụng bao nhiêu lần"
              className="min-h-[48px]"
            />
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-card-2 p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            Cài đặt bổ sung
          </h2>

          <div className="space-y-6">
            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 border border-stroke dark:border-stroke-dark rounded-2xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-all">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="w-5 h-5 text-avocado-green-100 rounded-lg focus:ring-avocado-green-100 cursor-pointer"
                />
                <div>
                  <label className="text-base font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    Hiển thị công khai
                  </label>
                  <p className="text-sm text-gray-500">User có thể tự lưu</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border border-stroke dark:border-stroke-dark rounded-2xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-all">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-avocado-green-100 rounded-lg focus:ring-avocado-green-100 cursor-pointer"
                />
                <div>
                  <label className="text-base font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    Kích hoạt ngay
                  </label>
                  <p className="text-sm text-gray-500">Voucher có thể sử dụng</p>
                </div>
              </div>
            </div>

            {/* Tags and Priority */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Tags (phân cách bằng dấu phẩy)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="VD: NEW_USER, FLASH_SALE, BIRTHDAY"
                className="min-h-[48px]"
              />

              <Input
                label="Độ ưu tiên (0-100)"
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                min="0"
                max="100"
                helperText="Voucher có priority cao sẽ được áp dụng trước khi stack"
                className="min-h-[48px]"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            onClick={() => navigate("/admin/voucher")}
            variant="outline"
            size="lg"
            className="min-h-[56px] px-8"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={<Save />}
            className="min-h-[56px] px-8"
          >
            {loading ? "Đang tạo..." : "Tạo voucher"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateVoucher;
