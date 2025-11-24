import axios from "axios";

// Base URL của Image Search API
const IMAGE_SEARCH_API_URL =
  process.env.REACT_APP_IMAGE_SEARCH_API_URL || "http://localhost:8001";

/**
 * Search for similar products by uploading an image
 * @param {File} imageFile - The image file to search
 * @param {number} topK - Number of results to return (default: 10)
 * @param {number} threshold - Minimum similarity threshold (default: 0.5)
 * @returns {Promise} - Promise containing search results
 */
export const searchByImage = async (imageFile, topK = 10, threshold = 0.5) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await axios.post(
      `${IMAGE_SEARCH_API_URL}/api/v1/search/image`,
      formData,
      {
        params: {
          top_k: topK,
          threshold: threshold,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    return {
      success: true,
      data: response.data,
      message: "Tìm kiếm thành công",
    };
  } catch (error) {
    console.error("Error searching by image:", error);

    if (error.response) {
      // Server responded with error
      return {
        success: false,
        error: error.response.data.detail || "Lỗi từ server",
        status: error.response.status,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: "Không thể kết nối đến server tìm kiếm hình ảnh",
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: error.message || "Có lỗi xảy ra",
      };
    }
  }
};

/**
 * Search for similar products by image URL
 * @param {string} imageUrl - The URL of the image to search
 * @param {number} topK - Number of results to return
 * @param {number} threshold - Minimum similarity threshold
 * @returns {Promise} - Promise containing search results
 */
export const searchByImageUrl = async (
  imageUrl,
  topK = 10,
  threshold = 0.5
) => {
  try {
    const response = await axios.post(
      `${IMAGE_SEARCH_API_URL}/api/v1/search/url`,
      null,
      {
        params: {
          image_url: imageUrl,
          top_k: topK,
          threshold: threshold,
        },
        timeout: 30000,
      }
    );

    return {
      success: true,
      data: response.data,
      message: "Tìm kiếm thành công",
    };
  } catch (error) {
    console.error("Error searching by image URL:", error);

    if (error.response) {
      return {
        success: false,
        error: error.response.data.detail || "Lỗi từ server",
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "Không thể kết nối đến server tìm kiếm hình ảnh",
      };
    } else {
      return {
        success: false,
        error: error.message || "Có lỗi xảy ra",
      };
    }
  }
};

/**
 * Check health status of Image Search API
 * @returns {Promise} - Promise containing health status
 */
export const checkImageSearchHealth = async () => {
  try {
    const response = await axios.get(`${IMAGE_SEARCH_API_URL}/api/v1/health`, {
      timeout: 5000,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error checking image search health:", error);
    return {
      success: false,
      error: "Image Search API không khả dụng",
    };
  }
};
