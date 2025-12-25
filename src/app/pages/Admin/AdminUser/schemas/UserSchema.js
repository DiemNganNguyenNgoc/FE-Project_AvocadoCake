// User validation schemas
export const UserValidationSchema = {
  // Create user schema
  create: {
    familyName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
      message: "Họ phải có từ 2-50 ký tự và chỉ chứa chữ cái",
    },
    userName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
      message: "Tên phải có từ 2-50 ký tự và chỉ chứa chữ cái",
    },
    userPhone: {
      required: true,
      pattern: /^[0-9]{10,11}$/,
      message: "Số điện thoại phải có 10-11 chữ số",
    },
    userEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email không hợp lệ",
    },
    userPassword: {
      required: true,
      minLength: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    },
    userConfirmPassword: {
      required: true,
      message: "Vui lòng xác nhận mật khẩu",
    },
    userAddress: {
      required: false,
      maxLength: 200,
      message: "Địa chỉ không được quá 200 ký tự",
    },
    isAdmin: {
      required: true,
      type: "boolean",
      acceptString: true,
      message: "Vai trò không hợp lệ",
    },
  },

  // Update user schema
  update: {
    familyName: {
      required: false,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
      message: "Họ phải có từ 2-50 ký tự và chỉ chứa chữ cái",
    },
    userName: {
      required: false,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
      message: "Tên phải có từ 2-50 ký tự và chỉ chứa chữ cái",
    },
    userPhone: {
      required: false,
      pattern: /^[0-9]{10,11}$/,
      message: "Số điện thoại phải có 10-11 chữ số",
    },
    userEmail: {
      required: false,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email không hợp lệ",
    },
    userPassword: {
      required: false,
      minLength: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    },
    userAddress: {
      required: false,
      maxLength: 200,
      message: "Địa chỉ không được quá 200 ký tự",
    },
    isAdmin: {
      required: false,
      type: "boolean",
      acceptString: true,
      message: "Vai trò không hợp lệ",
    },
  },
};

// Validation helper functions
export class UserValidator {
  static validateField(value, rules) {
    const errors = [];

    // Required validation
    if (rules.required && (!value || value.toString().trim() === "")) {
      errors.push(`${rules.message || "Trường này là bắt buộc"}`);
      return errors;
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === "") {
      return errors;
    }

    // Min length validation
    if (rules.minLength && value.toString().length < rules.minLength) {
      errors.push(`${rules.message || `Tối thiểu ${rules.minLength} ký tự`}`);
    }

    // Max length validation
    if (rules.maxLength && value.toString().length > rules.maxLength) {
      errors.push(`${rules.message || `Tối đa ${rules.maxLength} ký tự`}`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value.toString())) {
      errors.push(rules.message || "Định dạng không hợp lệ");
    }

    // Type validation
    if (rules.type === "boolean") {
      // Accept string "true"/"false" if acceptString is enabled
      if (rules.acceptString && typeof value === "string") {
        if (value !== "true" && value !== "false") {
          errors.push(rules.message || "Giá trị phải là true hoặc false");
        }
      } else if (typeof value !== "boolean") {
        errors.push(rules.message || "Giá trị phải là true hoặc false");
      }
    }

    return errors;
  }

  static validateForm(data, schema) {
    const errors = {};
    let isValid = true;

    Object.keys(schema).forEach((field) => {
      const fieldErrors = this.validateField(data[field], schema[field]);
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors[0]; // Take first error
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  static validatePasswordMatch(password, confirmPassword) {
    if (password !== confirmPassword) {
      return "Mật khẩu xác nhận không khớp";
    }
    return null;
  }
}

// User data transformation helpers
export class UserDataTransformer {
  static toFormData(user) {
    return {
      familyName: user.familyName || "",
      userName: user.userName || "",
      userPhone: user.userPhone || "",
      userEmail: user.userEmail || "",
      userPassword: "",
      userConfirmPassword: "",
      userAddress: user.userAddress || "",
      userImage: user.userImage || "",
      isAdmin: user.isAdmin ? "true" : "false",
    };
  }

  static fromFormData(formData) {
    return {
      familyName: formData.familyName?.trim(),
      userName: formData.userName?.trim(),
      userPhone: formData.userPhone?.trim(),
      userEmail: formData.userEmail?.trim(),
      userPassword: formData.userPassword,
      userAddress: formData.userAddress?.trim(),
      userImage: formData.userImage?.trim(),
      isAdmin: formData.isAdmin === "true",
    };
  }

  static formatUserForDisplay(user) {
    return {
      ...user,
      fullName: `${user.familyName || ""} ${user.userName || ""}`.trim(),
      roleDisplay: user.isAdmin ? "Admin" : "User",
      roleColor: user.isAdmin
        ? "bg-red-100 text-red-800"
        : "bg-green-100 text-green-800",
      joinDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
        : "N/A",
      lastUpdate: user.updatedAt
        ? new Date(user.updatedAt).toLocaleDateString("vi-VN")
        : "N/A",
    };
  }
}
