import axios from "axios";

class AIService {
  static async generateCake(sketchData) {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/ai/generate-cake`,
        { sketch: sketchData },
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      throw error.response?.data || error;
    }
  }

  static async getGenerationHistory(page = 1, limit = 10) {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/ai/history`,
        {
          params: { page, limit },
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      throw error.response?.data || error;
    }
  }
}

export default AIService;
