import axios from "axios";
import { Rating } from "../models/Rating";

export const axiosJWT = axios.create();

/**
 * Rating Service
 * Handles all API calls related to rating management
 */
export class RatingService {
  /**
   * Fetch all ratings (Admin only)
   */
  static async fetchAllRatings(filters = {}) {
    try {
      const { search = "", sortBy = "createdAt", sortOrder = "desc" } = filters;
      const access_token = localStorage.getItem("access_token");

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);

      const res = await axios.get(
        `${
          process.env.REACT_APP_API_URL_BACKEND
        }/rating/admin/all?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${access_token}`,
          },
        }
      );

      if (res.data.status === "OK") {
        return res.data.data.map((rating) => Rating.fromApiResponse(rating));
      }

      throw new Error(res.data.message || "Đã xảy ra lỗi khi lấy đánh giá");
    } catch (error) {
      console.error("Error fetching ratings:", error);
      if (error.response) {
        throw new Error(error.response.data?.message || "Đã xảy ra lỗi.");
      } else {
        throw new Error("Không thể kết nối đến máy chủ.");
      }
    }
  }

  /**
   * Get ratings for a specific product (Public)
   */
  static async fetchProductRatings(productId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/rating/product/${productId}`
      );

      if (res.data.status === "OK") {
        return res.data.data.map((rating) => Rating.fromApiResponse(rating));
      }

      throw new Error(res.data.message || "Đã xảy ra lỗi khi lấy đánh giá");
    } catch (error) {
      console.error("Error fetching product ratings:", error);
      if (error.response) {
        throw new Error(error.response.data?.message || "Đã xảy ra lỗi.");
      } else {
        throw new Error("Không thể kết nối đến máy chủ.");
      }
    }
  }

  /**
   * Delete a rating (Admin only)
   */
  static async removeRating(ratingId) {
    try {
      const access_token = localStorage.getItem("access_token");

      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL_BACKEND}/rating/admin/delete/${ratingId}`,
        {
          headers: {
            token: `Bearer ${access_token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error deleting rating:", error);
      if (error.response) {
        throw new Error(error.response.data?.message || "Đã xảy ra lỗi.");
      } else {
        throw new Error("Không thể kết nối đến máy chủ.");
      }
    }
  }

  /**
   * Toggle rating visibility (Admin only)
   */
  static async toggleVisibility(ratingId) {
    try {
      const access_token = localStorage.getItem("access_token");

      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL_BACKEND}/rating/admin/toggle-visibility/${ratingId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${access_token}`,
          },
        }
      );

      if (res.data.status === "OK") {
        return Rating.fromApiResponse(res.data.data);
      }

      throw new Error(res.data.message || "Đã xảy ra lỗi");
    } catch (error) {
      console.error("Error toggling rating visibility:", error);
      if (error.response) {
        throw new Error(error.response.data?.message || "Đã xảy ra lỗi.");
      } else {
        throw new Error("Không thể kết nối đến máy chủ.");
      }
    }
  }

  /**
   * Delete multiple ratings (Admin only)
   */
  static async deleteMultipleRatings(ratingIds) {
    try {
      const access_token = localStorage.getItem("access_token");

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/rating/admin/delete-multiple`,
        { ratingIds },
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${access_token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error deleting multiple ratings:", error);
      if (error.response) {
        throw new Error(error.response.data?.message || "Đã xảy ra lỗi.");
      } else {
        throw new Error("Không thể kết nối đến máy chủ.");
      }
    }
  }

  /**
   * Get rating statistics
   */
  static getRatingStats(ratings) {
    if (!ratings || ratings.length === 0) {
      return {
        total: 0,
        average: 0,
        visible: 0,
        hidden: 0,
        byRating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        withComments: 0,
      };
    }

    const stats = {
      total: ratings.length,
      average: 0,
      visible: 0,
      hidden: 0,
      byRating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      withComments: 0,
    };

    let totalRating = 0;

    ratings.forEach((rating) => {
      totalRating += rating.rating;
      stats.byRating[rating.rating]++;

      if (rating.isVisible) {
        stats.visible++;
      } else {
        stats.hidden++;
      }

      if (rating.hasComment && rating.hasComment()) {
        stats.withComments++;
      }
    });

    stats.average = (totalRating / ratings.length).toFixed(1);

    return stats;
  }
}

export default RatingService;
