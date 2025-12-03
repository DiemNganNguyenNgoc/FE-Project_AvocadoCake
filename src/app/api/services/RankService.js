import axios from "axios";

export const axiosJWT = axios.create();

/**
 * Tạo rank mới
 */
export const createRank = async (data, access_token) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/rank/create`,
      data,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating rank:", error);
    throw error;
  }
};

/**
 * Lấy tất cả ranks
 */
export const getAllRanks = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/rank/all`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching all ranks:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết rank
 */
export const getRankDetails = async (id, access_token) => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/rank/details/${id}`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching rank details:", error);
    throw error;
  }
};

/**
 * Cập nhật rank
 */
export const updateRank = async (id, access_token, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/rank/update/${id}`,
      data,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating rank:", error);
    throw error;
  }
};

/**
 * Xóa rank
 */
export const deleteRank = async (id, access_token) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL_BACKEND}/rank/delete/${id}`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting rank:", error);
    throw error;
  }
};

/**
 * Lấy rank của user
 */
export const getUserRank = async (userId, access_token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/rank/user/${userId}`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching user rank:", error);
    throw error;
  }
};

/**
 * Lấy lịch sử thăng hạng
 */
export const getUserRankHistory = async (userId, access_token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/rank/user/${userId}/history`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching user rank history:", error);
    throw error;
  }
};

/**
 * Lấy thống kê ranks
 */
export const getRankStatistics = async (access_token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/rank/statistics`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching rank statistics:", error);
    throw error;
  }
};

/**
 * Khởi tạo ranks mặc định
 */
export const initializeDefaultRanks = async (access_token) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/rank/initialize`,
      {},
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error initializing default ranks:", error);
    throw error;
  }
};
