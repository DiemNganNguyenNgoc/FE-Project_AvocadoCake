import axios from "axios";
import { API_URL } from "../constants/index"; // Đường dẫn đến file constant

const GameService = {
  getDailyPuzzle: async () => {
    try {
      const response = await axios.get(`${API_URL}/puzzle`);
      return response.data;
    } catch (error) {
      console.error("Error fetching daily puzzle:", error);
      throw error;
    }
  },

  submitAnswer: async (answer) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${API_URL}/puzzle/submit`,
        { answer },
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting answer:", error);
      throw error;
    }
  },

  getProductInfo: async () => {
    try {
      const response = await axios.get(`${API_URL}/puzzle/product`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product info:", error);
      throw error;
    }
  },

  // Lấy trạng thái chơi của user
  getUserPuzzleProgress: async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${API_URL}/puzzle/progress`, {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user puzzle progress:", error);
      throw error;
    }
  },

  // API xu
  getUserAssets: async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${API_URL}/user-assets`, {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user assets:", error);
      throw error;
    }
  },

  checkCoins: async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${API_URL}/user-assets/coins`, {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      // Chuyển đổi response format để khớp với MiniGame
      return {
        success: response.data.status === "OK",
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error checking coins:", error);
      throw error;
    }
  },

  // Trừ xu khi thanh toán
  deductCoins: async (amount) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${API_URL}/order/deduct-coins`,
        { amount },
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deducting coins:", error);
      throw error;
    }
  },
};

export default GameService;
