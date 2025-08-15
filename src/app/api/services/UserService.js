import axios from "axios";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/user/log-in`,
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
        status: error.response.status,
        message: error.response.data.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const signupUser = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/user/sign-up`,
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

export const getDetailsUser = async (id, access_token) => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/user/get-detail-user/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
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

export const refreshToken = async () => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/user/refresh-token`,
      {},
      {
        // headers: {
        //   "Content-Type": "application/json",
        //   token: `Bearer ${access_token}`,
        // },
        withCredentials: true, //tự động lấy cookie
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

export const logoutUser = async () => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/user/log-out`
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

export const updateUserInfo = async (id, data, access_token) => {
  try {
    const res = await axiosJWT.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/user/update-user/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
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

export const getAllUser = async (access_token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/user/get-all-user`,
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

export const deleteUser = async (id, access_token) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL_BACKEND}/user/delete-user/${id}`,
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

// Lấy dữ liệu phường/xã cho một quận/huyện cụ thể
export const fetchWards = async (districtCode) => {
  try {
    const res = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    return res.data.wards || [];
  } catch (error) {
    console.error("Error fetching wards:", error);
    return [];
  }
};

// Lấy thông tin xu của user
export const getUserAssets = async (access_token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/user-assets`,
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
        message:
          error.response.data?.message || "Đã xảy ra lỗi khi lấy thông tin xu.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

// Kiểm tra số xu hiện tại
export const checkUserCoins = async (access_token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/user-assets/coins`,
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
        message:
          error.response.data?.message || "Đã xảy ra lỗi khi kiểm tra xu.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};
