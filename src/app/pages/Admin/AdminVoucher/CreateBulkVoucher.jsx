import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save, Copy, X } from "lucide-react";
import { createBulkVouchers } from "../../../api/services/VoucherService";
import { toast } from "react-toastify";
import Button from "../../../components/AdminLayout/Button";
import Input from "../../../components/AdminLayout/Input";
import Select from "../../../components/AdminLayout/Select";
import Textarea from "../../../components/AdminLayout/Textarea";

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              Tạo voucher hàng loạt
            </h1>
            <p className="mt-1 text-body-sm text-dark-6 dark:text-dark-6">
              Tạo nhiều voucher cùng lúc với mã tự động
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bulk Settings */}
        <div className="bg-gradient-to-br to-avocado-green-100 dark:from-avocado-green-900/20 dark:to-avocado-green-800/20 rounded-2xl shadow-card-3 p-8 border-2 border-avocado-green-200 dark:border-avocado-green-700">
          <div className="flex items-start gap-6">
            <div className="bg-avocado-green-100 dark:bg-avocado-green-800 p-4 rounded-2xl shadow-md">
              <Copy className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-heading-5 font-bold mb-3 text-dark dark:text-white">
                Cấu hình tạo hàng loạt
              </h2>
              <p className="text-body-sm text-dark-7 dark:text-dark-6 mb-6">
                Hệ thống sẽ tự động tạo mã voucher với số thứ tự. VD:
                SUMMER0001, SUMMER0002, ...
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input
                  label="Mã gốc"
                  name="baseCode"
                  value={formData.baseCode}
                  onChange={handleChange}
                  required
                  placeholder="VD: SUMMER"
                  className="uppercase"
                />

                <Input
                  label="Số lượng"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="2"
                  max="1000"
                  placeholder="VD: 100"
                  helperText="Tối đa 1000 voucher"
                />
              </div>

              {formData.baseCode && formData.quantity && (
                <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-avocado-green-200 dark:border-avocado-green-700">
                  <p className="text-body-sm font-semibold text-dark dark:text-white mb-3">
                    Xem trước mã voucher:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getExampleCodes().map((code, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-avocado-green-100 text-white rounded-xl text-body-sm font-mono font-semibold shadow-sm"
                      >
                        {code}
                      </span>
                    ))}
                    {formData.quantity > 3 && (
                      <span className="px-4 py-2 text-dark-6 text-body-sm font-medium">
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
          <h2 className="text-heading-5 font-bold mb-6 text-dark dark:text-white">
            Thông tin voucher
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Tên voucher"
              name="voucherName"
              value={formData.voucherName}
              onChange={handleChange}
              required
              placeholder="VD: Giảm giá mùa hè"
              helperText="Sẽ thêm số thứ tự vào cuối (VD: Giảm giá mùa hè #1)"
            />

            <Input
              label="Số lần dùng mỗi voucher"
              name="totalQuantityPerVoucher"
              type="number"
              value={formData.totalQuantityPerVoucher}
              onChange={handleChange}
              min="1"
              placeholder="VD: 1"
              helperText="Mỗi voucher có thể dùng bao nhiêu lần"
            />

            <div className="lg:col-span-2">
              <Textarea
                label="Mô tả"
                name="voucherDescription"
                value={formData.voucherDescription}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Mô tả chi tiết về voucher..."
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
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({
                          ...prev,
                          voucherImage: null,
                        }));
                      }}
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
                    Chọn ảnh để thêm hình voucher
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
              label="Giá trị giảm"
              name="discountValue"
              type="number"
              value={formData.discountValue}
              onChange={handleChange}
              required
              min="0"
              placeholder={
                formData.voucherType === "PERCENTAGE" ? "VD: 10" : "VD: 20000"
              }
            />

            {formData.voucherType === "PERCENTAGE" && (
              <Input
                label="Giảm tối đa"
                name="maxDiscountAmount"
                type="number"
                value={formData.maxDiscountAmount}
                onChange={handleChange}
                min="0"
                placeholder="VD: 50000"
              />
            )}

            <Input
              label="Đơn hàng tối thiểu"
              name="minOrderValue"
              type="number"
              value={formData.minOrderValue}
              onChange={handleChange}
              min="0"
              placeholder="VD: 100000"
            />
          </div>
        </div>

        {/* Validity Period */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
          <h2 className="text-heading-5 font-bold mb-6 text-dark dark:text-white">
            Thời hạn sử dụng
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Ngày bắt đầu"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <Input
              label="Ngày kết thúc"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
              required
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
                  onChange={handleChange}
                  className="w-6 h-6 text-avocado-green-100 border-gray-300 rounded-lg focus:ring-avocado-green-100 focus:ring-2"
                />
                <div className="flex-1">
                  <label className="text-body-sm font-semibold text-dark dark:text-white block cursor-pointer">
                    Hiển thị công khai
                  </label>
                  <p className="text-body-xs text-dark-6 mt-0.5">
                    Không khuyến nghị cho voucher hàng loạt
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-avocado-green-100 dark:hover:border-avocado-green-100 transition-all">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-6 h-6 text-avocado-green-100 border-gray-300 rounded-lg focus:ring-avocado-green-100 focus:ring-2"
                />
                <div className="flex-1">
                  <label className="text-body-sm font-semibold text-dark dark:text-white block cursor-pointer">
                    Kích hoạt ngay
                  </label>
                  <p className="text-body-xs text-dark-6 mt-0.5">
                    Voucher có thể được sử dụng ngay
                  </p>
                </div>
              </div>
            </div>

            <Input
              label="Tags (phân cách bằng dấu phẩy)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="VD: BULK, CAMPAIGN, LIMITED"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/voucher")}
            className="px-8"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="px-8"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Đang tạo {formData.quantity} voucher...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                <span>Tạo {formData.quantity || 0} voucher</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBulkVoucher;
