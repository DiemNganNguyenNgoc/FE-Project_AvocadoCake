import axios from "axios";
import { API_URL } from "../constants";

class QuizService {
  // Lấy danh sách quiz
  async getQuizzes() {
    try {
      const response = await axios.get(`${API_URL}/quiz`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách quiz"
      );
    }
  }

  // Lưu câu trả lời của user
  async saveUserResponse(responseData) {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${API_URL}/quiz/response`,
        responseData,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lưu câu trả lời"
      );
    }
  }

  // Lưu nhiều câu trả lời cùng lúc
  async saveMultipleResponses(responses) {
    try {
      console.log("saveMultipleResponses - Request data:", responses);
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${API_URL}/quiz/responses`,
        { responses },
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      console.log("saveMultipleResponses - Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "saveMultipleResponses error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Không thể lưu câu trả lời"
      );
    }
  }

  // Lấy lịch sử quiz của user
  async getUserQuizHistory() {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${API_URL}/quiz/history`, {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy lịch sử quiz"
      );
    }
  }

  // Admin: Tạo quiz mới
  async createQuiz(quizData) {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(`${API_URL}/quiz`, quizData, {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể tạo quiz mới"
      );
    }
  }

  // Admin: Cập nhật quiz
  async updateQuiz(quizId, quizData) {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(`${API_URL}/quiz/${quizId}`, quizData, {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể cập nhật quiz"
      );
    }
  }

  // Admin: Xóa quiz (soft delete)
  async deleteQuiz(quizId) {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.delete(`${API_URL}/quiz/${quizId}`, {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể xóa quiz");
    }
  }

  async getQuizRecommendations(userId, sessionId) {
    try {
      const token = localStorage.getItem("access_token");
      const requestData = { user_id: userId, session_id: sessionId };
      console.log("getQuizRecommendations - Request data:", requestData);

      const response = await axios.post(
        `${API_URL}/recommendation/recommend/quiz`,
        requestData,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      console.log("getQuizRecommendations - Response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "getQuizRecommendations error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.detail || "Không thể lấy gợi ý từ quiz"
      );
    }
  }
}

export default new QuizService();
