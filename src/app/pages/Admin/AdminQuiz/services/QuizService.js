import axios from "axios";
import { API_URL } from "../../../../../lib/constants/index";

class QuizService {
  // Get all quizzes
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

  // Get single quiz by ID
  async getQuizById(quizId) {
    try {
      const response = await axios.get(`${API_URL}/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy thông tin quiz"
      );
    }
  }

  // Create new quiz
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

  // Update quiz
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

  // Delete quiz
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

  // Bulk delete quizzes
  async deleteMultipleQuizzes(quizIds) {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.delete(`${API_URL}/quiz/bulk`, {
        data: { quizIds },
        headers: {
          token: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể xóa các quiz đã chọn"
      );
    }
  }

  // Toggle quiz status
  async toggleQuizStatus(quizId, isActive) {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.patch(
        `${API_URL}/quiz/${quizId}/status`,
        { isActive },
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể thay đổi trạng thái quiz"
      );
    }
  }
}

export default new QuizService();
