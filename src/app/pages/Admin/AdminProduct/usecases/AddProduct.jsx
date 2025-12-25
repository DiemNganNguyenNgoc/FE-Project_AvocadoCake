import React, { useState, useEffect } from "react";
import { Upload, Package } from "lucide-react";
import { useAdminProductStore } from "../AdminProductContext";
import ProductService from "../services/ProductService";
import Modal from "../../../../components/AdminLayout/Modal";
import Input from "../../../../components/AdminLayout/Input";
import Select from "../../../../components/AdminLayout/Select";
import Textarea from "../../../../components/AdminLayout/Textarea";
import Checkbox from "../../../../components/AdminLayout/Checkbox";

const AddProduct = ({ onBack }) => {
  const { addProduct, setLoading, setError, categories, setCategories } =
    useAdminProductStore();

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

    if (!imageFile) {
      newErrors.productImage = "Hình ảnh sản phẩm là bắt buộc";
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

      // Prepare product data object (let ProductService handle FormData creation)
      const submitData = {
        productName: formData.productName,
        productPrice: formData.productPrice,
        productCategory: formData.productCategory,
        productSize: formData.productSize,
        productDescription: formData.productDescription,
        isActive: formData.isActive,
        productImage: imageFile, // Pass the File object directly
      };

      // Create product
      const response = await ProductService.createProduct(submitData);

      if (response.status === "OK") {
        // Add to local state
        addProduct(response.data);

        // Reset form
        setFormData({
          productName: "",
          productPrice: "",
          productCategory: "",
          productSize: "",
          productDescription: "",
          isActive: true,
        });
        setImageFile(null);
        setImagePreview(null);
        setErrors({});

        // Close modal
        onBack();

        // Show success message
        alert("Thêm sản phẩm thành công!");
      } else {
        throw new Error(response.message || "Có lỗi xảy ra khi thêm sản phẩm");
      }
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi thêm sản phẩm");
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      productName: "",
      productPrice: "",
      productCategory: "",
      productSize: "",
      productDescription: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    onBack();
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleCancel}
      title="Thêm sản phẩm mới"
      subtitle="Điền thông tin để thêm sản phẩm vào hệ thống"
      size="xl"
      icon={<Package className="w-6 h-6 text-white" />}
      iconColor="blue"
      showCloseButton={true}
      closeOnBackdrop={false}
      closeOnEscape={true}
      actions={
        <>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-3 text-xl font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 text-xl font-medium text-white bg-blue-600 border-2 border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang thêm...
              </>
            ) : (
              <>
                <Package className="w-5 h-5 mr-2" />
                Thêm sản phẩm
              </>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh sản phẩm *
            </label>
            <div className="space-y-4">
              {/* Image Upload */}
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
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">
                          Click để chọn hình ảnh
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
            </div>
          </div>

          {/* Right Column - Basic Info */}
          <div className="space-y-4">
            {/* Product Name */}
            <Input
              label="Tên sản phẩm *"
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder="Nhập tên sản phẩm"
              error={errors.productName}
            />

            {/* Price */}
            <Input
              label="Giá sản phẩm *"
              type="number"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleInputChange}
              placeholder="Nhập giá sản phẩm"
              min="0"
              step="1000"
              error={errors.productPrice}
            />

            {/* Category */}
            <Select
              label="Loại sản phẩm *"
              name="productCategory"
              value={formData.productCategory}
              onChange={handleInputChange}
              placeholder="Chọn loại sản phẩm"
              error={errors.productCategory}
              options={categories.map((category) => ({
                value: category._id,
                label: category.categoryName,
              }))}
            />

            {/* Size */}
            <Input
              label="Kích thước *"
              type="text"
              name="productSize"
              value={formData.productSize}
              onChange={handleInputChange}
              placeholder="Nhập kích thước sản phẩm"
              error={errors.productSize}
            />
          </div>
        </div>

        {/* Description */}
        <Textarea
          label="Mô tả sản phẩm *"
          name="productDescription"
          value={formData.productDescription}
          onChange={handleInputChange}
          rows={4}
          placeholder="Nhập mô tả chi tiết về sản phẩm"
          error={errors.productDescription}
        />

        {/* Status */}
        <Checkbox
          id="productActive"
          checked={formData.isActive}
          onChange={handleInputChange}
          name="isActive"
          label="Sản phẩm đang hoạt động"
        />

        {/* Note: Actions moved to Modal footer */}
      </form>
    </Modal>
  );
};

export default AddProduct;
