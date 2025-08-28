export const categorySchema = {
  categoryCode: {
    required: true,
    minLength: 2,
    maxLength: 10,
    pattern: /^[A-Z0-9]+$/,
    message: "Mã danh mục phải từ 2-10 ký tự, chỉ chứa chữ hoa và số",
  },
  categoryName: {
    required: true,
    minLength: 3,
    maxLength: 50,
    message: "Tên danh mục phải từ 3-50 ký tự",
  },
  status: {
    required: true,
    enum: ["Active", "Inactive", "Cancel"],
    message: "Trạng thái không hợp lệ",
  },
};

export const validateCategory = (data) => {
  const errors = {};

  Object.keys(categorySchema).forEach((field) => {
    const value = data[field];
    const rules = categorySchema[field];

    if (rules.required && !value) {
      errors[field] = rules.message;
      return;
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      errors[field] = rules.message;
      return;
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors[field] = rules.message;
      return;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message;
      return;
    }

    if (value && rules.enum && !rules.enum.includes(value)) {
      errors[field] = rules.message;
      return;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
