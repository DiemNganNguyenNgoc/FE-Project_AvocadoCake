export const orderSchema = {
  orderCode: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[A-Z0-9#]+$/,
    message: "Mã đơn hàng phải từ 3-20 ký tự, chỉ chứa chữ hoa, số và #",
  },
  statusId: {
    required: true,
    message: "Trạng thái đơn hàng là bắt buộc",
  },
  totalPrice: {
    required: true,
    min: 0,
    message: "Tổng tiền phải lớn hơn hoặc bằng 0",
  },
  finalPrice: {
    required: true,
    min: 0,
    message: "Giá cuối cùng phải lớn hơn hoặc bằng 0",
  },
};

export const validateOrder = (data) => {
  const errors = {};

  Object.keys(orderSchema).forEach((field) => {
    const value = data[field];
    const rules = orderSchema[field];

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

    if (value && rules.min !== undefined && value < rules.min) {
      errors[field] = rules.message;
      return;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateOrderStatusUpdate = (data) => {
  const errors = {};

  if (!data.statusId) {
    errors.statusId = "Trạng thái đơn hàng là bắt buộc";
  }

  if (
    !data.orderIds ||
    !Array.isArray(data.orderIds) ||
    data.orderIds.length === 0
  ) {
    errors.orderIds = "Phải chọn ít nhất một đơn hàng";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
