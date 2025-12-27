import axios from "axios";
import api from "../APIClient";
import { data } from "jquery";

export const axiosJWT = axios.create();

// export const createDiscount = async (data) => {
//   const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/Discount/create-Discount`, data)

//   return res.data
// };
//
export const createCategory = async (data, access_token) => {
  console.log("DATA", data);
  try {
    // Transform data to match backend expectations
    const transformedData = {
      categoryCode: data.categoryCode,
      categoryName: data.categoryName,
      isActive: data.status === "Active", // Convert status to isActive boolean
    };

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/category/create-category`,
      transformedData, // Send JSON directly
      {
        headers: {
          "Content-Type": "application/json", // Use JSON instead of multipart
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      console.log("err", error);
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getDetaillsCategory = async (id, access_token) => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/category/get-detail-category/${id}`,
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
        // Discount: error.response.data?.Discount || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { Discount: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getAllCategory = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/category/get-all-category?limit=1000`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    if (error.response) {
      throw {
        message:
          error.response.data?.message || "Đã xảy ra lỗi khi lấy danh mục.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const updateCategory = async (id, access_token, data) => {
  try {
    // Transform data to match backend expectations
    const transformedData = {
      categoryCode: data.categoryCode,
      categoryName: data.categoryName,
      isActive: data.status === "Active", // Convert status to isActive boolean
    };

    console.log("Update data:", transformedData);

    const res = await axios.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/category/update-category/${id}`,
      transformedData, // Send JSON directly
      {
        headers: {
          "Content-Type": "application/json", // Use JSON instead of multipart
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const deleteCategory = async (id, access_token) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL_BACKEND}/category/delete-category/${id}`, // Fixed: category instead of discount
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

// services/DiscountService.js

// export const searchDiscounts = async (query) => {
//   try {

//     const res = await axiosJWT.get(
//       `${process.env.REACT_APP_API_URL_BACKEND}/Discount/search?search=${encodeURIComponent(query)}`,

//       {
//         headers: {
//           "Content-Type": "application/json",
//           // token: `Bearer ${access_token}`,
//         },
//       }
//     );

//     return res.data; // Trả dữ liệu nếu thành công
//   } catch (error) {
//     // Nếu API trả về lỗi, ném lỗi với thông tin chi tiết
//     if (error.response) {
//       // API trả về response
//       throw {
//         // Discount: error.response.data?.Discount || "ERR",
//         message: error.response.data?.message || "Đã xảy ra lỗi.",
//       };
//     } else {
//       // Lỗi không có response (ví dụ lỗi mạng)
//       throw { Discount: 500, message: "Không thể kết nối đến máy chủ." };
//     }
//   }
// };

// export const getDiscountsByCategory = async (categoryId) => {
//   try {
//     const res = await axiosJWT.get(
//       `${process.env.REACT_APP_API_URL_BACKEND}/discount/get-discount-by-category/${categoryId}`,
//       {
//         headers: {
//           "Content-Type": "application/json",

//         },
//       }
//     );
//     return res.data; // Trả dữ liệu nếu thành công
//   } catch (error) {
//     if (error.response) {
//       throw {
//         message: error.response.data?.message || "Đã xảy ra lỗi.",
//       };
//     } else {
//       throw { Discount: 500, message: "Không thể kết nối đến máy chủ." };
//     }
//   }
// };
