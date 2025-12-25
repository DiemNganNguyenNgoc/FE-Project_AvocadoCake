import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import Modal from "../../../../components/AdminLayout/Modal";
import {
  getAllProducts,
  createDiscount,
} from "../../AdminDiscount/services/DiscountService";

/**
 * AddDiscountModal - Modal thêm khuyến mãi nhanh từ AI Strategy
 * Design: Sử dụng Modal component + Style giống AddDiscount
 * Auto-fill data từ AI recommendations
 */
const AddDiscountModal = ({ isOpen, onClose, promotionData }) => {
  const [products, setProducts] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    discountCode: "",
    discountName: "",
    discountValue: "",
    discountProduct: [],
    discountImage: null,
    discountStartDate: "",
    discountEndDate: "",
  });

  // Fetch products
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

  // Auto-fill form với AI data
  useEffect(() => {
    if (promotionData && isOpen) {
      const aiProducts =
        promotionData.products || promotionData.target_products || [];
      const productIds = aiProducts
        .map((p) => p.id || p.product_id || p._id)
        .filter(Boolean);

      // Get discount value from first product
      const firstProduct = aiProducts[0];
      const discountValue = firstProduct
        ? firstProduct.discountPercent ?? firstProduct.discount_percent ?? ""
        : "";

      // Convert dates to YYYY-MM-DD format
      const startDate =
        promotionData.startDate || promotionData.start_date || "";
      const endDate = promotionData.endDate || promotionData.end_date || "";

      console.log("🤖 Auto-filling form with AI data:", {
        promotionData: promotionData,
        eventName: promotionData.eventName,
        firstProduct: firstProduct,
        discountValue,
        startDate,
        endDate,
        productCount: productIds.length,
      });

      setFormData({
        discountCode: generateDiscountCode(promotionData.eventName),
        discountName: promotionData.eventName || "",
        discountValue: discountValue,
        discountProduct: productIds,
        discountImage: null,
        discountStartDate: convertToInputDateFormat(startDate),
        discountEndDate: convertToInputDateFormat(endDate),
      });
    }
  }, [promotionData, isOpen]);

  // Generate discount code từ event name
  const generateDiscountCode = (eventName) => {
    if (!eventName) return "";
    const prefix = eventName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .substring(0, 6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${random}`;
  };

  // Convert date to YYYY-MM-DD format for input[type="date"]
  const convertToInputDateFormat = (dateString) => {
    if (!dateString) return "";

    try {
      let date;

      // Try parsing DD/MM/YYYY format
      if (typeof dateString === "string" && dateString.includes("/")) {
        const parts = dateString.split("/");
        if (parts.length === 3) {
          // DD/MM/YYYY or MM/DD/YYYY
          const [part1, part2, part3] = parts;
          if (part1.length <= 2 && part2.length <= 2 && part3.length === 4) {
            // Assume DD/MM/YYYY
            date = new Date(part3, part2 - 1, part1);
          }
        }
      }

      // If not parsed yet, try standard Date parsing (handles ISO, timestamps, etc.)
      if (!date || isNaN(date.getTime())) {
        date = new Date(dateString);
      }

      // Check if valid date
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "";
      }

      // Format to YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error converting date:", dateString, error);
      return "";
    }
  };

  // Cleanup preview image
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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          discountImage: "Chỉ chấp nhận file ảnh (JPEG, PNG, WEBP)",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          discountImage: "Kích thước file không được vượt quá 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, discountImage: file }));
      setPreviewImage(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, discountImage: "" }));
    }
  };

  const handleProductChange = (productId) => {
    setFormData((prev) => ({
      ...prev,
      discountProduct: prev.discountProduct.includes(productId)
        ? prev.discountProduct.filter((id) => id !== productId)
        : [...prev.discountProduct, productId],
    }));

    if (errors.discountProduct) {
      setErrors((prev) => ({ ...prev, discountProduct: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("discountCode", formData.discountCode);
      formDataToSend.append("discountName", formData.discountName);
      formDataToSend.append("discountValue", formData.discountValue);
      formDataToSend.append("discountStartDate", formData.discountStartDate);
      formDataToSend.append("discountEndDate", formData.discountEndDate);

      formData.discountProduct.forEach((productId) => {
        formDataToSend.append("discountProduct[]", productId);
      });

      if (formData.discountImage) {
        formDataToSend.append("discountImage", formData.discountImage);
      }

      await createDiscount(formDataToSend);

      setSuccessMessage("Thêm khuyến mãi thành công!");

      setTimeout(() => {
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
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error adding discount:", error);
      setErrors({
        submit:
          error.response?.data?.message || "Có lỗi xảy ra khi thêm khuyến mãi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm khuyến mãi từ AI"
      subtitle="Chương trình khuyến mãi được đề xuất bởi AI Strategy Assistant"
      size="xl"
      icon={<Sparkles className="w-6 h-6" />}
      iconColor="green"
      closeOnBackdrop={false}
      actions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="add-discount-form"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang thêm..." : "Thêm khuyến mãi"}
          </button>
        </>
      }
    >
      <form
        id="add-discount-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-3 bg-green-50 border-2 border-green-200 rounded-2xl p-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-green-700 font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="text-red-700 font-semibold">{errors.submit}</p>
          </div>
        )}

        {/* AI Info Banner */}
        {promotionData && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">
                  🤖 Đề xuất từ AI Strategy
                </p>
                <p className="text-sm text-gray-700">
                  {promotionData.description || promotionData.eventName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Banner Upload */}
        <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
          <label className="block text-lg font-bold text-gray-800 mb-4 group-hover:text-blue-700 transition-colors text-center">
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
            className="cursor-pointer flex flex-col items-center justify-center h-64 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                <p className="text-lg font-semibold text-gray-700">
                  Click để chọn hình ảnh
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, GIF, WebP tối đa 5MB
                </p>
              </div>
            )}
          </label>
          {errors.discountImage && (
            <p className="text-red-600 text-sm mt-2 text-center">
              {errors.discountImage}
            </p>
          )}
        </div>

        {/* Primary Information */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Thông tin cơ bản
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Discount Code */}
            <div className="space-y-2">
              <label className="block text-xl font-semibold text-gray-800">
                Mã khuyến mãi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="discountCode"
                value={formData.discountCode}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-xl rounded-2xl border-2 transition-all ${
                  errors.discountCode
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500"
                } focus:outline-none focus:ring-4 focus:ring-blue-200`}
                placeholder="VD: SALE50, NEWUSER..."
              />
              {errors.discountCode && (
                <p className="text-red-600 text-sm">{errors.discountCode}</p>
              )}
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <label className="block text-xl font-semibold text-gray-800">
                Giá trị (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleInputChange}
                min="1"
                max="100"
                className={`w-full px-4 py-3 text-xl rounded-2xl border-2 transition-all ${
                  errors.discountValue
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500"
                } focus:outline-none focus:ring-4 focus:ring-blue-200`}
                placeholder="50"
              />
              {errors.discountValue && (
                <p className="text-red-600 text-sm">{errors.discountValue}</p>
              )}
            </div>
          </div>

          {/* Discount Name - Full width */}
          <div className="space-y-2 mt-6">
            <label className="block text-xl font-semibold text-gray-800">
              Tên khuyến mãi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="discountName"
              value={formData.discountName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 text-xl rounded-2xl border-2 transition-all ${
                errors.discountName
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-blue-500"
              } focus:outline-none focus:ring-4 focus:ring-blue-200`}
              placeholder="VD: Khuyến mãi mùa hè..."
            />
            {errors.discountName && (
              <p className="text-red-600 text-sm">{errors.discountName}</p>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Thời gian áp dụng
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="block text-xl font-semibold text-gray-800">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="discountStartDate"
                value={formData.discountStartDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-xl rounded-2xl border-2 transition-all ${
                  errors.discountStartDate
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500"
                } focus:outline-none focus:ring-4 focus:ring-blue-200`}
              />
              {errors.discountStartDate && (
                <p className="text-red-600 text-sm">
                  {errors.discountStartDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="block text-xl font-semibold text-gray-800">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="discountEndDate"
                value={formData.discountEndDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-xl rounded-2xl border-2 transition-all ${
                  errors.discountEndDate
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500"
                } focus:outline-none focus:ring-4 focus:ring-blue-200`}
              />
              {errors.discountEndDate && (
                <p className="text-red-600 text-sm">{errors.discountEndDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Products Selection */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Sản phẩm áp dụng <span className="text-red-500">*</span>
          </h3>

          <div className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-2xl p-4">
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Đang tải danh sách sản phẩm...
              </p>
            ) : (
              <div className="space-y-2">
                {products.map((product) => (
                  <label
                    key={product._id}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border-2 border-transparent hover:border-blue-200"
                  >
                    <input
                      type="checkbox"
                      checked={formData.discountProduct.includes(product._id)}
                      onChange={() => handleProductChange(product._id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {product.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.productPrice)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {errors.discountProduct && (
            <p className="text-red-600 text-sm mt-2">
              {errors.discountProduct}
            </p>
          )}

          {formData.discountProduct.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
              <p className="text-green-700 font-semibold text-center">
                ✓ Đã chọn {formData.discountProduct.length} sản phẩm
              </p>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AddDiscountModal;
