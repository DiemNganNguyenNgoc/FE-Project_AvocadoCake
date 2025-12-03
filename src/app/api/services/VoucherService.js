import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_BACKEND;

export const axiosJWT = axios.create();

// ========== ADMIN SERVICES ==========

// Tạo voucher mới
export const createVoucher = async (data, access_token) => {
  try {
    const res = await axios.post(`${API_URL}/voucher/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// Tạo voucher hàng loạt
export const createBulkVouchers = async (data, access_token) => {
  try {
    const res = await axios.post(`${API_URL}/voucher/create-bulk`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// Cập nhật voucher
export const updateVoucher = async (id, data, access_token) => {
  try {
    const res = await axios.put(`${API_URL}/voucher/update/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// Xóa voucher
export const deleteVoucher = async (id, access_token) => {
  try {
    const res = await axios.delete(`${API_URL}/voucher/delete/${id}`, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// Lấy tất cả voucher (admin)
export const getAllVouchers = async (params, access_token) => {
  try {
    const { limit = 10, page = 0, sort, filter } = params;
    const res = await axios.get(`${API_URL}/voucher/admin/all`, {
      params: { limit, page, sort, filter },
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// Lấy chi tiết voucher
export const getVoucherDetails = async (id, access_token) => {
  try {
    const res = await axiosJWT.get(`${API_URL}/voucher/detail/${id}`, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// Toggle trạng thái voucher
export const toggleVoucherStatus = async (id, access_token) => {
  try {
    const res = await axios.patch(
      `${API_URL}/voucher/toggle-status/${id}`,
      {},
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// Gửi voucher qua email
export const sendVoucherEmail = async (data, access_token) => {
  try {
    const res = await axios.post(`${API_URL}/voucher/send-email`, data, {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// Lấy thống kê voucher
export const getVoucherStatistics = async (access_token) => {
  try {
    const res = await axios.get(`${API_URL}/voucher/statistics`, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// ========== USER SERVICES ==========

// Lấy danh sách voucher công khai
export const getPublicVouchers = async () => {
  try {
    const res = await axios.get(`${API_URL}/voucher/public`);
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// User claim voucher
export const claimVoucher = async (voucherId, access_token) => {
  try {
    const res = await axios.post(
      `${API_URL}/voucher/claim`,
      { voucherId },
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    // Throw error với message và status từ backend
    throw {
      status: error.response?.data?.status || "ERR",
      message:
        error.response?.data?.message || error.message || "Đã xảy ra lỗi.",
    };
  }
};

// Lấy voucher của user
export const getUserVouchers = async (status, access_token) => {
  try {
    const res = await axios.get(`${API_URL}/voucher/my-vouchers`, {
      params: { status },
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// Validate voucher code
export const validateVoucherCode = async (code, access_token) => {
  try {
    const res = await axios.post(
      `${API_URL}/voucher/validate`,
      { code },
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// Áp dụng vouchers vào order
export const applyVouchersToOrder = async (
  voucherIds,
  orderData,
  access_token
) => {
  try {
    const res = await axios.post(
      `${API_URL}/voucher/apply`,
      { voucherIds, orderData },
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Đã xảy ra lỗi.",
    };
  }
};

// ========== HELPER FUNCTIONS ==========

// Format voucher type text
export const getVoucherTypeText = (type) => {
  const types = {
    PERCENTAGE: "Giảm theo %",
    FIXED_AMOUNT: "Giảm giá cố định",
    FREE_SHIPPING: "Miễn phí ship",
    COMBO: "Combo đặc biệt",
  };
  return types[type] || type;
};

// Format voucher value
export const formatVoucherValue = (voucher) => {
  if (voucher.voucherType === "PERCENTAGE") {
    let text = `${voucher.discountValue}%`;
    if (voucher.maxDiscountAmount) {
      text += ` (tối đa ${voucher.maxDiscountAmount.toLocaleString("vi-VN")}₫)`;
    }
    return text;
  } else if (voucher.voucherType === "FIXED_AMOUNT") {
    return `${voucher.discountValue.toLocaleString("vi-VN")}₫`;
  } else if (voucher.voucherType === "FREE_SHIPPING") {
    return "Miễn phí ship";
  }
  return voucher.discountValue;
};

// Check if voucher is expired
export const isVoucherExpired = (endDate) => {
  return new Date() > new Date(endDate);
};

// Check if voucher is available
export const isVoucherAvailable = (voucher) => {
  const now = new Date();
  return (
    voucher.isActive &&
    now >= new Date(voucher.startDate) &&
    now <= new Date(voucher.endDate) &&
    voucher.claimedQuantity < voucher.totalQuantity
  );
};

// Get voucher status badge color
export const getVoucherStatusColor = (status) => {
  const colors = {
    ACTIVE: "bg-green-100 text-green-800",
    USED: "bg-gray-100 text-gray-800",
    EXPIRED: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// Get voucher status text
export const getVoucherStatusText = (status) => {
  const texts = {
    ACTIVE: "Có thể dùng",
    USED: "Đã sử dụng",
    EXPIRED: "Hết hạn",
  };
  return texts[status] || status;
};
