import React, { useState, useEffect } from "react";
import { Upload, Package, Edit, AlertCircle, Check } from "lucide-react";
import { useAdminProductStore } from "../AdminProductContext";
import ProductService from "../services/ProductService";
import Modal from "../../../../components/AdminLayout/Modal";
import Input from "../../../../components/AdminLayout/Input";
import Textarea from "../../../../components/AdminLayout/Textarea";
import Select from "../../../../components/AdminLayout/Select";
import Button from "../../../../components/AdminLayout/Button";
import Checkbox from "../../../../components/AdminLayout/Checkbox";
import { toast } from "react-toastify";

const UpdateProduct = ({ onBack }) => {
  const {
    currentProduct,
    updateProduct,
    setLoading,
    setError,
    categories,
    setCategories,
    setProducts,
  } = useAdminProductStore();

  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productCategory: "",
    productSize: "",
    productDescription: "",
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with current product data
  useEffect(() => {
    if (currentProduct) {
      setFormData({
        productName: currentProduct.productName || "",
        productPrice: currentProduct.productPrice || "",
        productCategory: currentProduct.productCategory || "",
        productSize:
          typeof currentProduct.productSize === "string"
            ? currentProduct.productSize
            : Array.isArray(currentProduct.productSize)
            ? currentProduct.productSize.join(", ")
            : String(currentProduct.productSize || ""),
        productDescription: currentProduct.productDescription || "",
        isActive:
          currentProduct.isActive !== undefined
            ? currentProduct.isActive
            : true,
      });

      // Set image preview if product has existing image
      if (currentProduct.productImage) {
        setImagePreview(getImageUrl(currentProduct.productImage));
      }
    }
  }, [currentProduct]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ProductService.getCategories();
        setCategories(response.data);
      } catch (error) {
        toast.error("Không thể tải danh sách loại sản phẩm");
      }
    };

    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, setCategories]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${imagePath.replace(
      "\\",
      "/"
    )}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh");
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName || !formData.productName.trim()) {
      newErrors.productName = "Tên sản phẩm là bắt buộc";
    }

    if (!formData.productPrice || parseFloat(formData.productPrice) <= 0) {
      newErrors.productPrice = "Giá sản phẩm phải lớn hơn 0";
    }

    if (!formData.productCategory) {
      newErrors.productCategory = "Vui lòng chọn loại sản phẩm";
    }

    // Fix: Handle productSize validation properly for string/array/object
    const sizeValue =
      typeof formData.productSize === "string"
        ? formData.productSize.trim()
        : String(formData.productSize || "").trim();

    if (!sizeValue) {
      newErrors.productSize = "Kích thước sản phẩm là bắt buộc";
    }

    if (!formData.productDescription || !formData.productDescription.trim()) {
      newErrors.productDescription = "Mô tả sản phẩm là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);
      setError(null);

      // Prepare form data for submission
      const submitData = new FormData();
      submitData.append("productName", formData.productName.trim());
      submitData.append("productPrice", parseFloat(formData.productPrice));
      submitData.append("productCategory", formData.productCategory);
      submitData.append("productSize", formData.productSize.trim());
      submitData.append(
        "productDescription",
        formData.productDescription.trim()
      );
      submitData.append("isActive", formData.isActive);

      // Only append new image if one was selected
      if (imageFile) {
        submitData.append("productImage", imageFile);
      }

      // Log for debugging
      console.log("Updating product with ID:", currentProduct._id);
      console.log("Form data:", {
        productName: formData.productName,
        productPrice: formData.productPrice,
        productCategory: formData.productCategory,
        productSize: formData.productSize,
        isActive: formData.isActive,
        hasNewImage: !!imageFile,
      });

      // Update product via API
      const response = await ProductService.updateProduct(
        currentProduct._id,
        submitData
      );

      console.log("Update response:", response);

      if (response.status === "OK" || response.status === "SUCCESS") {
        // Success! Now fetch fresh data to refresh the list
        const refreshResponse = await ProductService.getProducts();
        setProducts(refreshResponse.data);

        toast.success("✅ Cập nhật sản phẩm thành công!");

        // Close modal after short delay to show toast
        setTimeout(() => {
          onBack();
        }, 500);
      } else {
        throw new Error(
          response.message || "Có lỗi xảy ra khi cập nhật sản phẩm"
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi cập nhật sản phẩm";
      toast.error(`❌ ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onBack();
  };

  if (!currentProduct) {
    return (
      <Modal
        isOpen={true}
        onClose={onBack}
        title="Lỗi"
        icon={<AlertCircle className="w-6 h-6 text-white" />}
        iconColor="red"
        size="sm"
      >
        <div className="text-center py-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600">
            Không tìm thấy thông tin sản phẩm
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleCancel}
      title="Cập nhật sản phẩm"
      subtitle={`Chỉnh sửa thông tin sản phẩm: ${currentProduct.productName}`}
      icon={<Edit className="w-6 h-6 text-white" />}
      iconColor="blue"
      size="xl"
      closeOnBackdrop={false}
      closeOnEscape={!isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Image Upload */}
          <div className="space-y-4">
            <label className="block text-xl font-medium text-gray-700">
              Hình ảnh sản phẩm
            </label>

            <div className="relative">
              <input
                type="file"
                id="productImage-update"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isSubmitting}
              />

              <label
                htmlFor="productImage-update"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  imagePreview
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-2xl p-2"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                      <div className="text-center text-white">
                        <Edit className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Đổi hình ảnh</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="w-12 h-12 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm font-semibold text-gray-700">
                      Click để tải hình ảnh mới
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF (MAX. 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>

            <p className="text-xs text-gray-500 italic flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Để trống nếu không muốn thay đổi hình ảnh
            </p>

            {errors.productImage && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.productImage}
              </p>
            )}
          </div>

          {/* Right Column - Basic Info */}
          <div className="space-y-5">
            {/* Product Name */}
            <Input
              label="Tên sản phẩm *"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              error={errors.productName}
              placeholder="Nhập tên sản phẩm"
              leftIcon={<Package className="w-5 h-5" />}
              disabled={isSubmitting}
            />

            {/* Price */}
            <Input
              label="Giá sản phẩm (VNĐ) *"
              type="number"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleInputChange}
              error={errors.productPrice}
              placeholder="Nhập giá sản phẩm"
              min="0"
              step="1000"
              disabled={isSubmitting}
            />

            {/* Category */}
            <Select
              label="Loại sản phẩm *"
              name="productCategory"
              value={formData.productCategory}
              onChange={handleInputChange}
              error={errors.productCategory}
              disabled={isSubmitting}
            >
              <option value="">Chọn loại sản phẩm</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </Select>

            {/* Size */}
            <Input
              label="Kích thước *"
              name="productSize"
              value={formData.productSize}
              onChange={handleInputChange}
              error={errors.productSize}
              placeholder="VD: 20cm, 500g, M, L, XL..."
              helperText="Có thể nhập nhiều size cách nhau bằng dấu phẩy"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Description - Full Width */}
        <Textarea
          label="Mô tả sản phẩm *"
          name="productDescription"
          value={formData.productDescription}
          onChange={handleInputChange}
          error={errors.productDescription}
          rows={6}
          placeholder="Nhập mô tả chi tiết về sản phẩm..."
          helperText="Mô tả càng chi tiết càng giúp khách hàng hiểu rõ về sản phẩm"
          disabled={isSubmitting}
        />

        {/* Status Checkbox */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <Checkbox
            label="Sản phẩm đang hoạt động"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            helperText="Bỏ check nếu muốn tạm ẩn sản phẩm khỏi danh sách"
            disabled={isSubmitting}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
            disabled={isSubmitting}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            leftIcon={
              isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )
            }
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateProduct;
