import axios from "axios";

/**
 * Process a user query and get a response from the chatbot
 * @param {string} message - The user's message text
 * @param {string} sessionId - Optional session ID for conversation continuity
 * @param {string} userId - Optional user ID for personalized responses
 * @returns {Promise} - The response from the chatbot API
 */
export const processQuery = async (userId = null, query) => {
  try {
    console.log("Sending query to chatbot:", query, "User ID:", userId);
    const res = await axios.post(
      `${process.env.REACT_APP_CHATBOT_API_URL}/chat`,
      {
        message: query,
        session_id: userId,
      },
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
          error.response.data?.message || "Đã xảy ra lỗi khi xử lý tin nhắn.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

/**
 * Get details of a specific article
 * @param {string} productId - The article ID
 * @returns {Promise} - The article details
 */
export const getArticleDetails = async (productId) => {
  try {
    if (!productId) {
      throw new Error("Article ID is required");
    }

    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/chatbot/get-detail-product/${productId}`,
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
          "Đã xảy ra lỗi khi lấy thông tin bài viết.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};
