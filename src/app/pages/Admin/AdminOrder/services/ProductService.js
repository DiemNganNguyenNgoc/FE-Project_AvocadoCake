import ProductServiceAdmin from "../../AdminProduct/services/ProductService";

class ProductService {
  static async getAllProduct() {
    try {
      const response = await ProductServiceAdmin.getProducts();
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  static async getProductById(id) {
    try {
      const response = await ProductServiceAdmin.getProductById(id);
      return response;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }
}

export default ProductService;
