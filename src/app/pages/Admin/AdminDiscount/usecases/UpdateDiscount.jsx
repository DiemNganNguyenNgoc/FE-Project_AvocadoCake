import React, { useState, useEffect } from "react";
import { useAdminDiscount } from "../adminDiscountStore";
import {
  getAllProducts,
  getDetailsDiscount,
} from "../services/DiscountService";

const UpdateDiscount = ({ discountId, onSubmit, onCancel }) => {
  const { isLoading } = useAdminDiscount();
  const [formData, setFormData] = useState({
    discountCode: "",
    discountName: "",
    discountValue: "",
    discountProduct: [],
    discountImage: null,
    discountStartDate: "",
    discountEndDate: "",
  });
  const [products, setProducts] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsResponse = await getAllProducts();
        if (Array.isArray(productsResponse.data)) {
          setProducts(productsResponse.data);
        }

        // Set form data từ discount được truyền vào
        if (discountId) {
          // Fetch discount details từ API
          const accessToken = localStorage.getItem("access_token");
          const discountResponse = await getDetailsDiscount(
            discountId,
            accessToken
          );
          console.log("[DEBUG] discountResponse:", discountResponse);

          if (discountResponse && discountResponse.data) {
            const discount = discountResponse.data;

            // Format ngày tháng cho input date
            const formatDateForInput = (dateString) => {
              if (!dateString) return "";
              const date = new Date(dateString);
              return date.toISOString().split("T")[0];
            };

            setFormData({
              discountCode: discount.discountCode || "",
              discountName: discount.discountName || "",
              discountValue: discount.discountValue || "",
              discountProduct:
                discount.discountProduct?.map((p) => p._id || p) || [],
              discountImage: null, // Keep null for new uploads
              discountStartDate: formatDateForInput(discount.discountStartDate),
              discountEndDate: formatDateForInput(discount.discountEndDate),
            });

            // Set preview image if exists
            if (discount.discountImage) {
              setPreviewImage(discount.discountImage);
            }
          } else {
            console.warn(
              "[DEBUG] Không có data trả về từ API getDetailsDiscount"
            );
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (discountId) {
      fetchData();
    }
  }, [discountId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.discountCode.trim()) {
      newErrors.discountCode = "Mã khuyến mãi không được để trống";
    }

    if (!formData.discountName.trim()) {
      newErrors.discountName = "Tên khuyến mãi không được để trống";
    }

    if (
      !formData.discountValue ||
      formData.discountValue <= 0 ||
      formData.discountValue > 100
    ) {
      newErrors.discountValue = "Giá trị khuyến mãi phải từ 1-100%";
    }

    if (formData.discountProduct.length === 0) {
      newErrors.discountProduct = "Phải chọn ít nhất 1 sản phẩm";
    }

    if (!formData.discountStartDate) {
      newErrors.discountStartDate = "Phải chọn ngày bắt đầu";
    }

    if (!formData.discountEndDate) {
      newErrors.discountEndDate = "Phải chọn ngày kết thúc";
    }

    if (formData.discountStartDate && formData.discountEndDate) {
      if (
        new Date(formData.discountStartDate) >=
        new Date(formData.discountEndDate)
      ) {
        newErrors.discountEndDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, discountImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProductChange = (productId) => {
    setFormData((prev) => {
      const isSelected = prev.discountProduct.includes(productId);
      const newProducts = isSelected
        ? prev.discountProduct.filter((id) => id !== productId)
        : [...prev.discountProduct, productId];

      return { ...prev, discountProduct: newProducts };
    });

    if (errors.discountProduct) {
      setErrors((prev) => ({ ...prev, discountProduct: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "discountProduct") {
        submitData.append(key, JSON.stringify(formData[key]));
      } else if (key === "discountImage" && formData[key]) {
        // Only append image if a new one is selected
        submitData.append(key, formData[key]);
      } else if (key !== "discountImage") {
        submitData.append(key, formData[key]);
      }
    });

    try {
      await onSubmit(discountId, submitData);
    } catch (error) {
      console.error("Lỗi khi cập nhật khuyến mãi:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-5 w-5 text-brand-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Cập nhật khuyến mãi
        </h2>
        <p className="text-gray-600 text-sm">Chỉnh sửa thông tin khuyến mãi</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Upload */}
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200 hover:border-brand-300 transition-colors">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Banner khuyến mãi
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className="cursor-pointer flex flex-col items-center justify-center h-32 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="h-full w-auto rounded-lg object-cover"
              />
            ) : (
              <div className="text-center">
                <svg
                  className="w-8 h-8 text-gray-400 mb-2 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  Click để chọn hình ảnh mới
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Discount Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã khuyến mãi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="discountCode"
              value={formData.discountCode}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.discountCode
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500"
              } focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors`}
              placeholder="Nhập mã khuyến mãi"
            />
            {errors.discountCode && (
              <p className="text-red-500 text-xs mt-1">{errors.discountCode}</p>
            )}
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá trị khuyến mãi (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleInputChange}
              min="1"
              max="100"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.discountValue
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500"
              } focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors`}
              placeholder="Nhập giá trị khuyến mãi"
            />
            {errors.discountValue && (
              <p className="text-red-500 text-xs mt-1">
                {errors.discountValue}
              </p>
            )}
          </div>
        </div>

        {/* Discount Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên khuyến mãi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="discountName"
            value={formData.discountName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.discountName
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-brand-500"
            } focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors`}
            placeholder="Nhập tên khuyến mãi"
          />
          {errors.discountName && (
            <p className="text-red-500 text-xs mt-1">{errors.discountName}</p>
          )}
        </div>

        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Chọn sản phẩm áp dụng <span className="text-red-500">*</span>
          </label>
          <div
            className={`max-h-48 overflow-y-auto bg-white border ${
              errors.discountProduct ? "border-red-300" : "border-gray-200"
            } rounded-lg p-4 space-y-2`}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <label
                  key={product._id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.discountProduct.includes(product._id)}
                    onChange={() => handleProductChange(product._id)}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    {product.productName}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Không có sản phẩm nào</p>
            )}
          </div>
          {errors.discountProduct && (
            <p className="text-red-500 text-xs mt-1">
              {errors.discountProduct}
            </p>
          )}
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="discountStartDate"
              value={formData.discountStartDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.discountStartDate
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500"
              } focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors`}
            />
            {errors.discountStartDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.discountStartDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày kết thúc <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="discountEndDate"
              value={formData.discountEndDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.discountEndDate
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500"
              } focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors`}
            />
            {errors.discountEndDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.discountEndDate}
              </p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-brand-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang cập nhật...
              </div>
            ) : (
              "Cập nhật khuyến mãi"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDiscount;
