import axios from "axios";

/**
 * Process a user query and get a response from the chatbot
 * @param {string} message - The user's message text
 * @param {string} sessionId - Optional session ID for conversation continuity
 * @param {string} userId - Optional user ID for personalized responses
 * @returns {Promise} - The response from the chatbot API
 */
export const chatbot = async (message, sessionId = null, userId = null) => {
  try {
    const requestBody = {
      message,
      platform: "web",
    };

    // Add optional fields if provided
    if (sessionId) {
      requestBody.session_id = sessionId;
    }
    if (userId) {
      requestBody.user_id = userId;
    }

    const res = await axios.post(
      `${process.env.REACT_APP_CHATBOT_API_URL}/chat`,
      requestBody,
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
          error.response.data?.detail ||
          error.response.data?.message ||
          "Đã xảy ra lỗi khi xử lý tin nhắn.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

/**
 * Send feedback for a chatbot conversation
 * @param {string} sessionId - The session ID
 * @param {number} rating - Rating from 1-5
 * @param {string} comment - Optional comment
 * @returns {Promise} - The response from the API
 */
export const sendFeedback = async (sessionId, rating, comment = null) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_CHATBOT_API_URL}/feedback`,
      { session_id: sessionId, rating, comment },
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
          error.response.data?.detail || "Đã xảy ra lỗi khi gửi đánh giá.",
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
