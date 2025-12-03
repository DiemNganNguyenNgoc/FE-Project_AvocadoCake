import React, { useState, useEffect } from "react";
import { Award, Plus, X as XIcon } from "lucide-react";
import Modal from "../../../../components/AdminLayout/Modal";
import Input from "../../../../components/AdminLayout/Input";
import Textarea from "../../../../components/AdminLayout/Textarea";
import Button from "../../../../components/AdminLayout/Button";
import Checkbox from "../../../../components/AdminLayout/Checkbox";

const RankFormModal = ({ isOpen, onClose, onSave, editingRank, loading }) => {
  const [formData, setFormData] = useState({
    rankName: "",
    rankDisplayName: "",
    rankCode: "",
    discountPercent: 0,
    minSpending: 0,
    maxSpending: null,
    priority: 1,
    color: "#CD7F32",
    icon: "🥉",
    benefits: [],
    description: "",
    isActive: true,
  });

  const [benefitInput, setBenefitInput] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("RankFormModal - editingRank:", editingRank);
    if (editingRank) {
      console.log("Setting form data with:", {
        rankName: editingRank.rankName,
        rankDisplayName: editingRank.rankDisplayName,
        discountPercent: editingRank.discountPercent,
      });
      setFormData({
        rankName: editingRank.rankName || "",
        rankDisplayName: editingRank.rankDisplayName || "",
        rankCode: editingRank.rankCode || "",
        discountPercent: editingRank.discountPercent || 0,
        minSpending: editingRank.minSpending || 0,
        maxSpending: editingRank.maxSpending || null,
        priority: editingRank.priority || 1,
        color: editingRank.color || "#CD7F32",
        icon: editingRank.icon || "🥉",
        benefits: editingRank.benefits || [],
        description: editingRank.description || "",
        isActive:
          editingRank.isActive !== undefined ? editingRank.isActive : true,
      });
    } else {
      // Reset form for new rank
      setFormData({
        rankName: "",
        rankDisplayName: "",
        rankCode: "",
        discountPercent: 0,
        minSpending: 0,
        maxSpending: null,
        priority: 1,
        color: "#CD7F32",
        icon: "🥉",
        benefits: [],
        description: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [editingRank, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput("");
    }
  };

  const handleRemoveBenefit = (index) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.rankName.trim()) {
      newErrors.rankName = "Tên rank (English) là bắt buộc";
    }

    if (!formData.rankDisplayName.trim()) {
      newErrors.rankDisplayName = "Tên hiển thị là bắt buộc";
    }

    if (!formData.rankCode.trim()) {
      newErrors.rankCode = "Mã rank là bắt buộc";
    }

    if (formData.discountPercent < 0 || formData.discountPercent > 100) {
      newErrors.discountPercent = "Giảm giá phải từ 0-100%";
    }

    if (formData.minSpending < 0) {
      newErrors.minSpending = "Chi tiêu tối thiểu không được âm";
    }

    if (
      formData.maxSpending !== null &&
      formData.maxSpending < formData.minSpending
    ) {
      newErrors.maxSpending = "Chi tiêu tối đa phải lớn hơn chi tiêu tối thiểu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      // Convert string numbers to actual numbers
      const submitData = {
        ...formData,
        discountPercent: Number(formData.discountPercent),
        minSpending: Number(formData.minSpending),
        maxSpending: formData.maxSpending ? Number(formData.maxSpending) : null,
        priority: Number(formData.priority),
      };

      await onSave(submitData);
    } catch (error) {
      setErrors({ submit: error.message || "Đã có lỗi xảy ra" });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRank ? "Chỉnh sửa Rank" : "Tạo mới Rank"}
      subtitle={
        editingRank ? "Cập nhật thông tin rank" : "Thêm rank mới vào hệ thống"
      }
      size="xl"
      icon={<Award className="w-6 h-6 text-white" />}
      iconColor="purple"
      actions={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            {editingRank ? "Cập nhật" : "Tạo mới"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Rank Name (English) */}
          <Input
            label={
              <>
                Tên Rank (English) <span className="text-red-500">*</span>
              </>
            }
            name="rankName"
            value={formData.rankName}
            onChange={handleChange}
            placeholder="Bronze, Silver, Gold..."
            error={errors.rankName}
          />

          {/* Rank Display Name */}
          <Input
            label={
              <>
                Tên Hiển Thị <span className="text-red-500">*</span>
              </>
            }
            name="rankDisplayName"
            value={formData.rankDisplayName}
            onChange={handleChange}
            placeholder="Đồng, Bạc, Vàng..."
            error={errors.rankDisplayName}
          />

          {/* Rank Code */}
          <Input
            label={
              <>
                Mã Rank <span className="text-red-500">*</span>
              </>
            }
            name="rankCode"
            value={formData.rankCode}
            onChange={handleChange}
            placeholder="RANK_BRONZE"
            error={errors.rankCode}
            disabled={editingRank}
          />

          {/* Discount Percent */}
          <Input
            label={
              <>
                Giảm Giá (%) <span className="text-red-500">*</span>
              </>
            }
            type="number"
            name="discountPercent"
            value={formData.discountPercent}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.1"
            error={errors.discountPercent}
          />

          {/* Min Spending */}
          <Input
            label={
              <>
                Chi Tiêu Tối Thiểu (VNĐ) <span className="text-red-500">*</span>
              </>
            }
            type="number"
            name="minSpending"
            value={formData.minSpending}
            onChange={handleChange}
            min="0"
            step="1000"
            error={errors.minSpending}
          />

          {/* Max Spending */}
          <Input
            label="Chi Tiêu Tối Đa (VNĐ)"
            helperText="Để trống nếu không giới hạn"
            type="number"
            name="maxSpending"
            value={formData.maxSpending || ""}
            onChange={handleChange}
            min="0"
            step="1000"
            placeholder="Không giới hạn"
            error={errors.maxSpending}
          />

          {/* Priority */}
          <Input
            label="Độ Ưu Tiên"
            helperText="Số càng thấp càng ưu tiên"
            type="number"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            min="1"
          />

          {/* Color */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Màu Sắc
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-16 h-12 border border-stroke rounded-xl cursor-pointer"
              />
              <Input
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="#CD7F32"
                className="flex-1"
              />
            </div>
          </div>

          {/* Icon */}
          <Input
            label="Icon (Emoji)"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="🥉"
          />
        </div>

        {/* Description - Full Width */}
        <div className="mt-6">
          <Textarea
            label="Mô Tả"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Mô tả về rank này..."
          />
        </div>

        {/* Benefits - Full Width */}
        <div className="mt-6">
          <label className="block text-base font-medium text-gray-700 mb-3">
            Đặc Quyền
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddBenefit();
                }
              }}
              placeholder="Nhập đặc quyền và nhấn Enter hoặc nút Thêm"
              className="flex-1"
            />
            <Button
              type="button"
              variant="primary"
              onClick={handleAddBenefit}
              icon={<Plus />}
            >
              Thêm
            </Button>
          </div>
          <div className="space-y-2">
            {formData.benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <span className="text-sm text-gray-700">{benefit}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(index)}
                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Status */}
        <div className="mt-6">
          <Checkbox
            label="Kích hoạt rank này"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
};

export default RankFormModal;
