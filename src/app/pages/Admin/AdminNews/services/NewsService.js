import * as NewsAPI from "../../../../api/services/NewsService";
import { News } from "../models/News";

export class NewsService {
  // Fetch all news
  static async fetchAllNews() {
    try {
      const response = await NewsAPI.getAllNews();

      if (response.status === "OK" && Array.isArray(response.data)) {
        return response.data.map((newsData) => News.fromApiResponse(newsData));
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error fetching news:", error);
      throw new Error(error.message || "Không thể tải danh sách tin tức");
    }
  }

  // Fetch paginated news
  static async fetchPaginatedNews(page = 0, limit = 15) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL_BACKEND}/news/get-all-news?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();

      return {
        news: Array.isArray(data.data)
          ? data.data.map((newsData) => News.fromApiResponse(newsData))
          : [],
        total: data.total || 0,
        currentPage: page,
        totalPages: Math.ceil((data.total || 0) / limit),
      };
    } catch (error) {
      console.error("Error fetching paginated news:", error);
      throw new Error(error.message || "Không thể tải danh sách tin tức");
    }
  }

  // Get news by ID
  static async getNewsById(id) {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await NewsAPI.getDetailsNews(id, accessToken);

      if (response.status === "OK" && response.data) {
        return News.fromApiResponse(response.data);
      }

      throw new Error("News not found");
    } catch (error) {
      console.error("Error fetching news details:", error);
      throw new Error(error.message || "Không thể tải thông tin tin tức");
    }
  }

  // Create new news
  static async createNewNews(newsData) {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        throw new Error("Vui lòng đăng nhập để tiếp tục");
      }

      const formData = new FormData();
      formData.append("newsTitle", newsData.newsTitle);
      formData.append("newsContent", newsData.newsContent);

      if (newsData.newsImage) {
        formData.append("newsImage", newsData.newsImage);
      }

      if (newsData.status) {
        formData.append("status", newsData.status);
      }

      const response = await NewsAPI.createNews(formData, accessToken);

      if (response.status === "OK" && response.data) {
        return News.fromApiResponse(response.data);
      }

      throw new Error(response.message || "Không thể tạo tin tức");
    } catch (error) {
      console.error("Error creating news:", error);
      throw new Error(error.message || "Không thể tạo tin tức");
    }
  }

  // Update news
  static async updateExistingNews(id, newsData) {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        throw new Error("Vui lòng đăng nhập để tiếp tục");
      }

      const formData = new FormData();
      formData.append("newsTitle", newsData.newsTitle);
      formData.append("newsContent", newsData.newsContent);

      if (newsData.newsImage && typeof newsData.newsImage !== "string") {
        formData.append("newsImage", newsData.newsImage);
      }

      if (newsData.status) {
        formData.append("status", newsData.status);
      }

      const response = await NewsAPI.updateNews(id, accessToken, formData);

      if (response.status === "OK" && response.data) {
        return News.fromApiResponse(response.data);
      }

      throw new Error(response.message || "Không thể cập nhật tin tức");
    } catch (error) {
      console.error("Error updating news:", error);
      throw new Error(error.message || "Không thể cập nhật tin tức");
    }
  }

  // Delete news
  static async removeNews(id) {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        throw new Error("Vui lòng đăng nhập để tiếp tục");
      }

      const response = await NewsAPI.deleteNews(id, accessToken);

      if (response.status === "OK") {
        return true;
      }

      throw new Error(response.message || "Không thể xóa tin tức");
    } catch (error) {
      console.error("Error deleting news:", error);
      throw new Error(error.message || "Không thể xóa tin tức");
    }
  }

  // Delete multiple news
  static async removeMultipleNews(ids) {
    try {
      const results = await Promise.allSettled(
        ids.map((id) => this.removeNews(id))
      );

      const failedDeletions = results.filter(
        (result) => result.status === "rejected"
      );

      if (failedDeletions.length > 0) {
        throw new Error(`Không thể xóa ${failedDeletions.length} tin tức`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting multiple news:", error);
      throw new Error(error.message || "Không thể xóa tin tức");
    }
  }
}
