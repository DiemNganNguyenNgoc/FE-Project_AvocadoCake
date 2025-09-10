import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL_BACKEND || "http://localhost:3001/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.token = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

class ProductService {
  // Get all products
  static async getProducts() {
    try {
      const response = await apiClient.get("/product/get-all-product");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      const response = await apiClient.get(`/product/get-detail-product/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }

  // Create new product
  static async createProduct(productData) {
    try {
      const formData = new FormData();

      // Append all product fields to FormData
      Object.keys(productData).forEach((key) => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await apiClient.post(
        "/product/create-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }

  // Update product
  static async updateProduct(id, productData) {
    try {
      const formData = new FormData();

      // Append all product fields to FormData
      Object.keys(productData).forEach((key) => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await apiClient.put(
        `/product/update-product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }

  // Delete product
  static async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/product/delete-product/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete product"
      );
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
      const response = await apiClient.get(
        `/product/search?search=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to search products"
      );
    }
  }

  // Get products by category
  static async getProductsByCategory(categoryId) {
    try {
      const response = await apiClient.get(
        `/product/get-product-by-category/${categoryId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products by category"
      );
    }
  }

  // Get all categories
  static async getCategories() {
    try {
      const response = await apiClient.get("/category/get-all-category");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }

  // Upload product image
  static async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiClient.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to upload image"
      );
    }
  }

  // Toggle product status (if backend supports it)
  static async toggleProductStatus(id, isActive) {
    try {
      const response = await apiClient.patch(`/product/toggle-status/${id}`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to toggle product status"
      );
    }
  }
}

export default ProductService;
