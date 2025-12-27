import {
  getAllProduct,
  getDetailsproduct,
  createProduct as createProductAPI,
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI,
  searchProducts as searchProductsAPI,
  getProductsByCategory as getProductsByCategoryAPI,
} from "../../../../api/services/productServices";
import { getAllCategory } from "../../../../api/services/CategoryService";

/**
 * Product Service for Admin Panel
 * Wrapper around existing API services with consistent interface
 */
class ProductService {
  // Helper to get access token
  static getAccessToken() {
    return localStorage.getItem("access_token");
  }

  // Get all products
  static async getProducts() {
    try {
      const token = this.getAccessToken();
      const response = await getAllProduct(token);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch products");
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      const token = this.getAccessToken();
      const response = await getDetailsproduct(id, token);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch product");
    }
  }

  // Create new product
  static async createProduct(productData) {
    try {
      const token = this.getAccessToken();
      const response = await createProductAPI(productData, token);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to create product");
    }
  }

  // Update product
  static async updateProduct(id, productData) {
    try {
      const token = this.getAccessToken();
      const response = await updateProductAPI(id, token, productData);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to update product");
    }
  }

  // Delete product
  static async deleteProduct(id) {
    try {
      const token = this.getAccessToken();
      const response = await deleteProductAPI(id, token);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to delete product");
    }
  }

  // Delete multiple products
  static async deleteMultipleProducts(ids) {
    try {
      const deletePromises = ids.map((id) => this.deleteProduct(id));
      const results = await Promise.allSettled(deletePromises);

      const failed = results.filter((result) => result.status === "rejected");
      if (failed.length > 0) {
        throw new Error(`Failed to delete ${failed.length} products`);
      }

      return { success: true, deletedCount: ids.length };
    } catch (error) {
      throw new Error(error.message || "Failed to delete products");
    }
  }

  // Search products
  static async searchProducts(query) {
    try {
      const response = await searchProductsAPI(query);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to search products");
    }
  }

  // Get products by category
  static async getProductsByCategory(categoryId) {
    try {
      const response = await getProductsByCategoryAPI(categoryId);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch products by category");
    }
  }

  // Get all categories
  static async getCategories() {
    try {
      const response = await getAllCategory();
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch categories");
    }
  }

  // Upload product image (kept as-is, not in productServices)
  static async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = this.getAccessToken();

      const response = await fetch(
        `${process.env.REACT_APP_API_URL_BACKEND}/upload/image`,
        {
          method: "POST",
          headers: {
            token: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to upload image");
    }
  }

  // Toggle product status (kept for future use)
  static async toggleProductStatus(id, isActive) {
    try {
      const token = this.getAccessToken();
      // This would need to be added to productServices if needed
      const response = await fetch(
        `${process.env.REACT_APP_API_URL_BACKEND}/product/toggle-status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle product status");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to toggle product status");
    }
  }

  // Toggle product visibility (kept for future use)
  static async toggleProductVisibility(id) {
    try {
      const token = this.getAccessToken();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL_BACKEND}/product/toggle-visibility/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle product visibility");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to toggle product visibility");
    }
  }

  // Fetch category by ID (already using existing API)
  static async fetchCategoryById(id) {
    try {
      const token = this.getAccessToken();
      // Already using the shared service from api/services
      const { getDetaillsCategory } = await import(
        "../../../../api/services/CategoryService"
      );
      const response = await getDetaillsCategory(id, token);
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  }
}

export default ProductService;
