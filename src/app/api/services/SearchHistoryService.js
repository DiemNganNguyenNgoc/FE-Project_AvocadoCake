import axios from "axios";

export const axiosJWT = axios.create();

// Lưu lịch sử tìm kiếm
export const saveSearchHistory = async (query, access_token) => {
  try {
    console.log("🔍 SaveSearchHistory called with:", {
      query,
      tokenExists: !!access_token,
    });

    if (!query || query.trim().length === 0) {
      throw new Error("Query không được để trống");
    }

    if (!access_token) {
      throw new Error("Access token không tồn tại");
    }

    console.log(
      "📡 Making API call to:",
      `${process.env.REACT_APP_API_URL_BACKEND}/search-history/save`
    );

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/search-history/save`,
      { query: query.trim() },
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );

    console.log("✅ Search history save response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error saving search history:", error);
    console.error("❌ Error details:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      data: error.response?.data,
    });

    if (error.response) {
      throw new Error(
        error.response.data?.message || "Không thể lưu lịch sử tìm kiếm"
      );
    } else {
      throw new Error("Không thể kết nối đến máy chủ.");
    }
  }
};

// Lấy lịch sử tìm kiếm
export const getSearchHistory = async (access_token, limit = 10) => {
  try {
    const endpoint = limit
      ? `/search-history/get-history?limit=${limit}`
      : "/search-history/get-history";

    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error getting search history:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Không thể lấy lịch sử tìm kiếm"
      );
    } else {
      throw new Error("Không thể kết nối đến máy chủ.");
    }
  }
};

// Xóa một mục lịch sử tìm kiếm
export const deleteSearchHistory = async (searchHistoryId, access_token) => {
  try {
    if (!searchHistoryId) {
      throw new Error("ID lịch sử tìm kiếm không được để trống");
    }

    const res = await axiosJWT.delete(
      `${process.env.REACT_APP_API_URL_BACKEND}/search-history/delete/${searchHistoryId}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting search history:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Không thể xóa lịch sử tìm kiếm"
      );
    } else {
      throw new Error("Không thể kết nối đến máy chủ.");
    }
  }
};

// Xóa toàn bộ lịch sử tìm kiếm
export const clearAllSearchHistory = async (access_token) => {
  try {
    const res = await axiosJWT.delete(
      `${process.env.REACT_APP_API_URL_BACKEND}/search-history/clear`,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error clearing search history:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Không thể xóa tất cả lịch sử tìm kiếm"
      );
    } else {
      throw new Error("Không thể kết nối đến máy chủ.");
    }
  }
};

// Lấy từ khóa phổ biến (không cần token)
export const getPopularSearches = async (limit = 5) => {
  try {
    const endpoint = limit
      ? `/search-history/popular?limit=${limit}`
      : "/search-history/popular";

    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error getting popular searches:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Không thể lấy từ khóa phổ biến"
      );
    } else {
      throw new Error("Không thể kết nối đến máy chủ.");
    }
  }
};

// Lấy gợi ý tìm kiếm
export const getSearchSuggestions = async (
  partialQuery,
  access_token,
  limit = 5
) => {
  try {
    if (!partialQuery || partialQuery.trim().length === 0) {
      return { success: true, data: [], count: 0 };
    }

    const res = await axiosJWT.get(
      `${
        process.env.REACT_APP_API_URL_BACKEND
      }/search-history/suggestions?q=${encodeURIComponent(
        partialQuery.trim()
      )}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error getting search suggestions:", error);
    // Không throw error cho suggestions để không ảnh hưởng UX
    return { success: false, data: [], count: 0 };
  }
};

// Wrapper method để dễ sử dụng - tự động save và return suggestions
export const searchWithHistory = async (query, access_token) => {
  try {
    // Lưu lịch sử trước
    await saveSearchHistory(query, access_token);

    // Trả về query để component có thể tiếp tục xử lý search
    return {
      success: true,
      query: query.trim(),
    };
  } catch (error) {
    // Ngay cả khi save history thất bại, vẫn cho phép tìm kiếm
    console.warn("Could not save search history:", error.message);
    return {
      success: false,
      query: query.trim(),
      warning: "Không thể lưu lịch sử tìm kiếm",
    };
  }
};
