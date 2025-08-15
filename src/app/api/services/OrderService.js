import axios from "axios";

export const axiosJWT = axios.create();

export const createOrder = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/order/create-order`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        // status: error.response.data?.status || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getDetailsOrder = async (id) => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/order/get-detail-order/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          //   token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data; // Trả dữ liệu nếu thành công
  } catch (error) {
    // Nếu API trả về lỗi, ném lỗi với thông tin chi tiết
    if (error.response) {
      // API trả về response
      throw {
        // status: error.response.data?.status || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const updateOrderInfo = async (id, data) => {
  try {
    const res = await axiosJWT.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/order/update-order/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data; // Trả dữ liệu nếu thành công
  } catch (error) {
    // Nếu API trả về lỗi, ném lỗi với thông tin chi tiết
    if (error.response) {
      // API trả về response
      throw {
        // status: error.response.data?.status || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const updateOrderStatus = async (orderId, statusId, access_token) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/order/update-order-status/${orderId}`,
      { statusId }, // Gửi đúng `statusId`
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        status: error.response.data?.status || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getAllOrders = async (access_token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/order/get-all-orders`,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        // status: error.response.data?.status || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const deleteOrder = async (id) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL_BACKEND}/order/delete-order/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          //   token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        // status: error.response.data?.status || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const fetchCities = async () => {
  try {
    const res = await axios.get("https://provinces.open-api.vn/api/?depth=2");
    // console.log("res", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

export const getOrdersByUser = async (access_token, userId) => {
  try {
    console.log("SERVICE");
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/order/get-orders-by-user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    console.log("SERVICE1", res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        // status: error.response.data?.status || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const createProductRating = async (data, access_token) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/rating/create`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          "Đã xảy ra lỗi khi đánh giá sản phẩm.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getProductRatings = async (productId) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/rating/product/${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          "Đã xảy ra lỗi khi lấy đánh giá sản phẩm.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getUserProductRating = async (
  productId,
  orderId,
  access_token
) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/rating/user/${productId}/${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          "Đã xảy ra lỗi khi lấy đánh giá của người dùng.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const updateProductRating = async (ratingId, data, access_token) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/rating/update/${ratingId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Đổi xu thành tiền cho đơn hàng
export const applyCoinsToOrder = async (orderId, coinsToUse, access_token) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/order/apply-coins`,
      { orderId, coinsToUse },
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        status: error.response.data?.status || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi khi đổi xu.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};
