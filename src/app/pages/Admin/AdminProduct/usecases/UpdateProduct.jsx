import React, { useState, useEffect } from "react";
import { X, Upload, Package, Edit } from "lucide-react";
import { useAdminProductStore } from "../AdminProductContext";
import ProductService from "../services/ProductService";

const UpdateProduct = ({ onBack }) => {
  const {
    currentProduct,
    updateProduct,
    setLoading,
    setError,
    categories,
    setCategories,
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
        productSize: currentProduct.productSize || "",
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
        setError("Không thể tải danh sách loại sản phẩm");
      }
    };

    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, setCategories, setError]);

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
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Tên sản phẩm là bắt buộc";
    }

    if (!formData.productPrice || formData.productPrice <= 0) {
      newErrors.productPrice = "Giá sản phẩm phải lớn hơn 0";
    }

    if (!formData.productCategory) {
      newErrors.productCategory = "Vui lòng chọn loại sản phẩm";
    }

    if (!formData.productSize.trim()) {
      newErrors.productSize = "Kích thước sản phẩm là bắt buộc";
    }

    if (!formData.productDescription.trim()) {
      newErrors.productDescription = "Mô tả sản phẩm là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);
      setError(null);

      // Prepare form data
      const submitData = new FormData();
      submitData.append("productName", formData.productName);
      submitData.append("productPrice", formData.productPrice);
      submitData.append("productCategory", formData.productCategory);
      submitData.append("productSize", formData.productSize);
      submitData.append("productDescription", formData.productDescription);
      submitData.append("isActive", formData.isActive);

      // Only append new image if one was selected
      if (imageFile) {
        submitData.append("productImage", imageFile);
      }

      // Update product
      const response = await ProductService.updateProduct(
        currentProduct._id,
        submitData
      );

      if (response.status === "OK") {
        // Update local state
        updateProduct(currentProduct._id, response.data);

        // Close modal
        onBack();

        // Show success message
        alert("Cập nhật sản phẩm thành công!");
      } else {
        throw new Error(
          response.message || "Có lỗi xảy ra khi cập nhật sản phẩm"
        );
      }
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi cập nhật sản phẩm");
      console.error("Error updating product:", error);
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <p className="text-gray-600">Không tìm thấy thông tin sản phẩm</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Cập nhật sản phẩm
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh sản phẩm
              </label>
              <div className="space-y-4">
                {/* Current Image or Upload */}
                <div className="relative">
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="productImage"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Edit className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Click để chọn hình ảnh mới
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF (MAX. 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                {errors.productImage && (
                  <p className="text-sm text-red-600">{errors.productImage}</p>
                )}
                <p className="text-xs text-gray-500">
                  Để trống nếu không muốn thay đổi hình ảnh
                </p>
              </div>
            </div>

            {/* Right Column - Basic Info */}
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.productName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Nhập tên sản phẩm"
                />
                {errors.productName && (
                  <p className="text-sm text-red-600">{errors.productName}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá sản phẩm *
                </label>
                <input
                  type="number"
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.productPrice ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Nhập giá sản phẩm"
                  min="0"
                  step="1000"
                />
                {errors.productPrice && (
                  <p className="text-sm text-red-600">{errors.productPrice}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại sản phẩm *
                </label>
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.productCategory
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Chọn loại sản phẩm</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {errors.productCategory && (
                  <p className="text-sm text-red-600">
                    {errors.productCategory}
                  </p>
                )}
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kích thước *
                </label>
                <input
                  type="text"
                  name="productSize"
                  value={formData.productSize}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.productSize ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Nhập kích thước sản phẩm"
                />
                {errors.productSize && (
                  <p className="text-sm text-red-600">{errors.productSize}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả sản phẩm *
            </label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                errors.productDescription ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Nhập mô tả chi tiết về sản phẩm"
            />
            {errors.productDescription && (
              <p className="text-sm text-red-600">
                {errors.productDescription}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Sản phẩm đang hoạt động
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Cập nhật sản phẩm
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
