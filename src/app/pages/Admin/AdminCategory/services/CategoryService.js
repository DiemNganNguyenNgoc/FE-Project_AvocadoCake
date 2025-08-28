import { Category } from "../models/Category";
import {
  createCategory,
  getAllCategory,
  getDetaillsCategory,
  updateCategory,
  deleteCategory,
} from "../../../../api/services/CategoryService";

export class CategoryService {
  static async fetchAllCategories() {
    try {
      const response = await getAllCategory();
      if (response.status === "OK" && Array.isArray(response.data)) {
        return response.data.map((cat) => Category.fromApiResponse(cat));
      }
      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  static async fetchCategoryById(id) {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await getDetaillsCategory(id, accessToken);
      if (response.status === "OK") {
        return Category.fromApiResponse(response.data);
      }
      throw new Error(response.message || "Failed to fetch category");
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  }

  static async createNewCategory(categoryData) {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await createCategory(categoryData, accessToken);
      if (response.status === "OK") {
        return Category.fromApiResponse(response.data);
      }
      throw new Error(response.message || "Failed to create category");
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  static async updateExistingCategory(id, categoryData) {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await updateCategory(id, accessToken, categoryData);
      if (response.status === "OK") {
        return Category.fromApiResponse(response.data);
      }
      throw new Error(response.message || "Failed to update category");
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  static async removeCategory(id) {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await deleteCategory(id, accessToken);
      if (response.status === "OK") {
        return true;
      }
      throw new Error(response.message || "Failed to delete category");
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}
