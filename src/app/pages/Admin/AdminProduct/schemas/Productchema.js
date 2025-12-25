import * as Yup from "yup";

// Product validation schema
export const productSchema = Yup.object().shape({
  productName: Yup.string()
    .required("Tên sản phẩm là bắt buộc")
    .min(2, "Tên sản phẩm phải có ít nhất 2 ký tự")
    .max(100, "Tên sản phẩm không được vượt quá 100 ký tự")
    .trim(),

  productPrice: Yup.number()
    .required("Giá sản phẩm là bắt buộc")
    .min(0, "Giá sản phẩm phải lớn hơn hoặc bằng 0")
    .max(10000000, "Giá sản phẩm không được vượt quá 10,000,000 VND")
    .typeError("Giá sản phẩm phải là số"),

  productCategory: Yup.string()
    .required("Loại sản phẩm là bắt buộc")
    .test(
      "not-empty",
      "Vui lòng chọn loại sản phẩm",
      (value) => value && value.trim() !== ""
    ),

  productSize: Yup.string()
    .required("Kích thước sản phẩm là bắt buộc")
    .min(1, "Kích thước sản phẩm không được để trống")
    .max(50, "Kích thước sản phẩm không được vượt quá 50 ký tự")
    .trim(),

  productDescription: Yup.string()
    .required("Mô tả sản phẩm là bắt buộc")
    .min(10, "Mô tả sản phẩm phải có ít nhất 10 ký tự")
    .max(1000, "Mô tả sản phẩm không được vượt quá 1000 ký tự")
    .trim(),

  productImage: Yup.mixed()
    .test("file-type", "Chỉ chấp nhận file hình ảnh", (value) => {
      if (!value) return true; // Allow empty for updates
      if (typeof value === "string") return true; // Allow URL strings
      return (
        value &&
        [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ].includes(value.type)
      );
    })
    .test("file-size", "Kích thước file không được vượt quá 5MB", (value) => {
      if (!value) return true; // Allow empty for updates
      if (typeof value === "string") return true; // Allow URL strings
      return value && value.size <= 5 * 1024 * 1024; // 5MB
    }),

  isActive: Yup.boolean().default(true),
});

// Schema for creating new product (image is required)
export const createProductSchema = productSchema.shape({
  productImage: Yup.mixed()
    .required("Hình ảnh sản phẩm là bắt buộc")
    .test("file-type", "Chỉ chấp nhận file hình ảnh", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true; // Allow URL strings
      return [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ].includes(value.type);
    })
    .test("file-size", "Kích thước file không được vượt quá 5MB", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true; // Allow URL strings
      return value.size <= 5 * 1024 * 1024; // 5MB
    }),
});

// Schema for updating product (image is optional)
export const updateProductSchema = productSchema;

// Schema for product search/filter
export const productFilterSchema = Yup.object().shape({
  searchTerm: Yup.string()
    .max(100, "Từ khóa tìm kiếm không được vượt quá 100 ký tự")
    .trim(),

  filterCategory: Yup.string().oneOf(
    ["all", "mood", "memory", "preference"],
    "Loại bộ lọc không hợp lệ"
  ),

  sortField: Yup.string().oneOf(
    ["productName", "productPrice", "createdAt", "updatedAt"],
    "Trường sắp xếp không hợp lệ"
  ),

  sortDirection: Yup.string().oneOf(
    ["asc", "desc"],
    "Hướng sắp xếp không hợp lệ"
  ),

  currentPage: Yup.number()
    .min(1, "Trang phải lớn hơn 0")
    .integer("Trang phải là số nguyên"),

  itemsPerPage: Yup.number()
    .oneOf([10, 25, 50, 100], "Số mục mỗi trang không hợp lệ")
    .integer("Số mục mỗi trang phải là số nguyên"),
});

// Validation helper functions
export const validateProduct = async (productData, isUpdate = false) => {
  try {
    const schema = isUpdate ? updateProductSchema : createProductSchema;
    await schema.validate(productData, { abortEarly: false });
    return { isValid: true, errors: [] };
  } catch (error) {
    const errors = error.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    return { isValid: false, errors };
  }
};

export const validateProductField = async (
  field,
  value,
  schema = productSchema
) => {
  try {
    await schema.validateAt(field, { [field]: value });
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

// Form validation helpers
export const getFieldError = (errors, fieldName) => {
  const fieldError = errors.find((error) => error.field === fieldName);
  return fieldError ? fieldError.message : null;
};

export const hasFieldError = (errors, fieldName) => {
  return errors.some((error) => error.field === fieldName);
};

// Default values for forms
export const getDefaultProductValues = () => ({
  productName: "",
  productPrice: "",
  productCategory: "",
  productSize: "",
  productImage: null,
  productDescription: "",
  isActive: true,
});

export const getDefaultFilterValues = () => ({
  searchTerm: "",
  filterCategory: "all",
  sortField: "createdAt",
  sortDirection: "desc",
  currentPage: 1,
  itemsPerPage: 10,
});

// Custom validation rules
export const customValidationRules = {
  // Check if product name is unique (for create)
  uniqueProductName: (existingProducts, currentId = null) =>
    Yup.string().test(
      "unique-name",
      "Tên sản phẩm đã tồn tại",
      function (value) {
        if (!value) return true;
        const isDuplicate = existingProducts.some(
          (product) =>
            product.productName.toLowerCase() === value.toLowerCase() &&
            product._id !== currentId
        );
        return !isDuplicate;
      }
    ),

  // Check if price is reasonable
  reasonablePrice: Yup.number().test(
    "reasonable-price",
    "Giá sản phẩm không hợp lý",
    function (value) {
      if (!value) return true;
      return value >= 1000 && value <= 10000000; // Between 1,000 and 10,000,000 VND
    }
  ),

  // Check if description has minimum word count
  minimumWords: (minWords = 5) =>
    Yup.string().test(
      "min-words",
      `Mô tả phải có ít nhất ${minWords} từ`,
      function (value) {
        if (!value) return true;
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount >= minWords;
      }
    ),
};

// Export all schemas
export default {
  productSchema,
  createProductSchema,
  updateProductSchema,
  productFilterSchema,
  validateProduct,
  validateProductField,
  getFieldError,
  hasFieldError,
  getDefaultProductValues,
  getDefaultFilterValues,
  customValidationRules,
};
