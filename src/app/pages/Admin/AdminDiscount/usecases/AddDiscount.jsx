import React, { useState, useEffect } from "react";
import { useAdminDiscount } from "../adminDiscountStore";
import { getAllProducts } from "../services/DiscountService";

const AddDiscount = ({ onSubmit }) => {
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  // Load AI promotion data from sessionStorage
  useEffect(() => {
    const aiDraft = sessionStorage.getItem("ai_promotion_draft");
    if (aiDraft) {
      try {
        const data = JSON.parse(aiDraft);

        // Pre-fill form with AI data
        setFormData((prev) => ({
          ...prev,
          discountName: data.eventName || "",
          discountStartDate: data.startDate || "",
          discountEndDate: data.endDate || "",
          // Set first product's discount as default value
          discountValue: data.products?.[0]?.discountPercent || "",
        }));

        // If products have IDs, pre-select them
        if (data.products && Array.isArray(data.products)) {
          const productIds = data.products
            .map((p) => p.id || p.product_id)
            .filter(Boolean);

          if (productIds.length > 0) {
            setFormData((prev) => ({
              ...prev,
              discountProduct: productIds,
            }));
          }
        }

        // Clear sessionStorage after loading
        sessionStorage.removeItem("ai_promotion_draft");
      } catch (error) {
        console.error("Error loading AI promotion data:", error);
      }
    }
  }, []);

  // Cleanup preview image URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

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
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, WebP)");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, discountImage: file }));

      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
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
      } else {
        submitData.append(key, formData[key]);
      }
    });

    try {
      await onSubmit(submitData);
      // Reset form
      // Cleanup old preview URL
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setFormData({
        discountCode: "",
        discountName: "",
        discountValue: "",
        discountProduct: [],
        discountImage: null,
        discountStartDate: "",
        discountEndDate: "",
      });
      setPreviewImage(null);
      setErrors({});
    } catch (error) {
      console.error("Lỗi khi thêm khuyến mãi:", error);
    }
  };

  return (
    <div className="p-8">
      {/* Header Section - Gestalt: Figure/Ground */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Thêm khuyến mãi mới
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Tạo chương trình khuyến mãi hấp dẫn để thu hút khách hàng
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full mx-auto space-y-8">
        {/* Banner Upload Section - Gestalt: Closure & Proximity */}
        <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
          <div className="text-center">
            <label className="block text-lg font-bold text-gray-800 mb-4 group-hover:text-blue-700 transition-colors">
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
              className="cursor-pointer flex flex-col items-center justify-center h-100 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md group relative overflow-hidden"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full rounded-2xl object-cover"
                  onLoad={() => console.log("Image loaded successfully")}
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    setPreviewImage(null);
                  }}
                />
              ) : (
                <div className="text-center py-8 pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                    Click để chọn hình ảnh
                  </p>
                  <p className="text-lg text-gray-500 mt-2">
                    PNG, JPG, GIF, WebP tối đa 5MB
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Primary Information Section - Gestalt: Similarity & Grouping */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            {/* <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold mr-3">
              1
            </span> */}
            Thông tin cơ bản
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Discount Code */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                Mã khuyến mãi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="discountCode"
                value={formData.discountCode}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-300 ${
                  errors.discountCode
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                } focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-sm hover:shadow-md`}
                placeholder="VD: SALE50, NEWUSER..."
              />
              {errors.discountCode && (
                <div className="flex items-center text-red-600 text-lg font-medium bg-red-50 p-3 rounded-xl">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.discountCode}
                </div>
              )}
            </div>

            {/* Discount Value */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                Giá trị khuyến mãi (%) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className={`w-full px-6 py-4 text-lg rounded-2xl border-2 pr-12 transition-all duration-300 ${
                    errors.discountValue
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  } focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-sm hover:shadow-md`}
                  placeholder="50"
                />
                <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-lg font-bold text-gray-500">
                  %
                </span>
              </div>
              {errors.discountValue && (
                <div className="flex items-center text-red-600 text-lg font-medium bg-red-50 p-3 rounded-xl">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.discountValue}
                </div>
              )}
            </div>
          </div>

          {/* Discount Name */}
          <div className="mt-8 space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              Tên khuyến mãi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="discountName"
              value={formData.discountName}
              onChange={handleInputChange}
              className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-300 ${
                errors.discountName
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
              } focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-sm hover:shadow-md`}
              placeholder="VD: Flash Sale cuối tuần, Ưu đãi khách hàng mới..."
            />
            {errors.discountName && (
              <div className="flex items-center text-red-600 text-lg font-medium bg-red-50 p-3 rounded-xl">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.discountName}
              </div>
            )}
          </div>
        </div>

        {/* Product Selection Section - Gestalt: Proximity & Common Region */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            {/* <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold mr-3">
              2
            </span> */}
            Sản phẩm áp dụng
          </h3>

          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              Chọn sản phẩm <span className="text-red-500">*</span>
            </label>
            <div
              className={`max-h-80 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 border-2 rounded-2xl p-6 space-y-3 transition-all duration-300 ${
                errors.discountProduct
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {products.length > 0 ? (
                products.map((product) => (
                  <label
                    key={product._id}
                    className="group flex items-center space-x-4 p-4 hover:bg-white rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-md border border-transparent hover:border-blue-200"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.discountProduct.includes(product._id)}
                        onChange={() => handleProductChange(product._id)}
                        className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500 border-2 border-gray-300 transition-all duration-200"
                      />
                      {formData.discountProduct.includes(product._id) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-300">
                        {product.productImage ? (
                          <img
                            src={product.productImage}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            display: product.productImage ? "none" : "flex",
                          }}
                        >
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors truncate">
                            {product.productName}
                          </h4>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-lg font-bold text-green-600">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(product.productPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </label>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-500">
                    Không có sản phẩm nào
                  </p>
                </div>
              )}
            </div>
            {errors.discountProduct && (
              <div className="flex items-center text-red-600 text-lg font-medium bg-red-50 p-3 rounded-xl">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.discountProduct}
              </div>
            )}
          </div>
        </div>

        {/* Date Selection Section - Gestalt: Symmetry & Balance */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            {/* <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold mr-3">
              3
            </span> */}
            Thời gian áp dụng
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="discountStartDate"
                value={formData.discountStartDate}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-300 ${
                  errors.discountStartDate
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                } focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-sm hover:shadow-md`}
              />
              {errors.discountStartDate && (
                <div className="flex items-center text-red-600 text-lg font-medium bg-red-50 p-3 rounded-xl">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.discountStartDate}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="discountEndDate"
                value={formData.discountEndDate}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-300 ${
                  errors.discountEndDate
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                } focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-sm hover:shadow-md`}
              />
              {errors.discountEndDate && (
                <div className="flex items-center text-red-600 text-lg font-medium bg-red-50 p-3 rounded-xl">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.discountEndDate}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Gestalt: Common Fate & Good Continuation */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group flex-1 relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {isLoading ? (
                <div className="flex items-center justify-center relative z-10">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                  <span className="relative z-10">Đang tạo khuyến mãi...</span>
                </div>
              ) : (
                <span className="relative z-10 flex items-center justify-center">
                  Tạo khuyến mãi
                </span>
              )}
            </button>

            <button
              type="button"
              className="group px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:scale-95"
              onClick={() => {
                // Cleanup old preview URL
                if (previewImage) {
                  URL.revokeObjectURL(previewImage);
                }
                setFormData({
                  discountCode: "",
                  discountName: "",
                  discountValue: "",
                  discountProduct: [],
                  discountImage: null,
                  discountStartDate: "",
                  discountEndDate: "",
                });
                setPreviewImage(null);
                setErrors({});
              }}
            >
              <span className="flex items-center justify-center">
                Đặt lại form
              </span>
            </button>
          </div>

          {/* Help Text */}
          {/* <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-blue-800 font-semibold text-lg">
                  💡 Mẹo tạo khuyến mãi hiệu quả:
                </p>
                <ul className="text-blue-700 text-lg mt-2 space-y-1">
                  <li>• Mã khuyến mãi nên ngắn gọn, dễ nhớ</li>
                  <li>• Tên khuyến mãi nên hấp dẫn và mô tả rõ ưu đãi</li>
                  <li>• Chọn sản phẩm phù hợp với mục tiêu bán hàng</li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      </form>
    </div>
  );
};

export default AddDiscount;
