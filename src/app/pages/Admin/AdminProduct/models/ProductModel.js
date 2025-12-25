/**
 * Product Model
 * Defines the data structure and validation for products
 */

export class Product {
  constructor(data = {}) {
    this._id = data._id || "";
    this.productName = data.productName || "";
    this.productPrice = data.productPrice || "";
    this.productCategory = data.productCategory || "";
    this.productSize = data.productSize || "";
    this.productImage = data.productImage || "";
    this.productDescription = data.productDescription || "";
    this.averageRating = data.averageRating || 0;
    this.totalRatings = data.totalRatings || 0;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Getters
  get id() {
    return this._id;
  }

  get name() {
    return this.productName;
  }

  get price() {
    return this.productPrice;
  }

  get category() {
    return this.productCategory;
  }

  get size() {
    return this.productSize;
  }

  get image() {
    return this.productImage;
  }

  get description() {
    return this.productDescription;
  }

  get rating() {
    return this.averageRating;
  }

  get totalRatingCount() {
    return this.totalRatings;
  }

  get isProductActive() {
    return this.isActive;
  }

  get createdDate() {
    return new Date(this.createdAt);
  }

  get updatedDate() {
    return new Date(this.updatedAt);
  }

  // Setters
  set name(value) {
    this.productName = value;
  }

  set price(value) {
    this.productPrice = value;
  }

  set category(value) {
    this.productCategory = value;
  }

  set size(value) {
    this.productSize = value;
  }

  set image(value) {
    this.productImage = value;
  }

  set description(value) {
    this.productDescription = value;
  }

  set isProductActive(value) {
    this.isActive = value;
  }

  // Methods
  toJSON() {
    return {
      _id: this._id,
      productName: this.productName,
      productPrice: this.productPrice,
      productCategory: this.productCategory,
      productSize: this.productSize,
      productImage: this.productImage,
      productDescription: this.productDescription,
      averageRating: this.averageRating,
      totalRatings: this.totalRatings,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toFormData() {
    const formData = new FormData();

    if (this._id) formData.append("_id", this._id);
    if (this.productName) formData.append("productName", this.productName);
    if (this.productPrice) formData.append("productPrice", this.productPrice);
    if (this.productCategory)
      formData.append("productCategory", this.productCategory);
    if (this.productSize) formData.append("productSize", this.productSize);
    if (this.productImage) formData.append("productImage", this.productImage);
    if (this.productDescription)
      formData.append("productDescription", this.productDescription);
    if (this.isActive !== undefined) formData.append("isActive", this.isActive);

    return formData;
  }

  // Validation methods
  isValid() {
    return (
      this.productName.trim() !== "" &&
      this.productPrice > 0 &&
      this.productCategory !== "" &&
      this.productSize.trim() !== "" &&
      this.productDescription.trim() !== ""
    );
  }

  getValidationErrors() {
    const errors = [];

    if (!this.productName.trim()) {
      errors.push("Product name is required");
    }

    if (!this.productPrice || this.productPrice <= 0) {
      errors.push("Product price must be greater than 0");
    }

    if (!this.productCategory) {
      errors.push("Product category is required");
    }

    if (!this.productSize.trim()) {
      errors.push("Product size is required");
    }

    if (!this.productDescription.trim()) {
      errors.push("Product description is required");
    }

    return errors;
  }

  // Utility methods
  getFormattedPrice() {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(this.productPrice);
  }

  getImageUrl() {
    if (!this.productImage) return "";

    // If it's already a full URL, return as is
    if (this.productImage.startsWith("http")) {
      return this.productImage;
    }

    // If it's a Cloudinary path, construct the full URL
    if (this.productImage.includes("cloudinary")) {
      return `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${this.productImage.replace(
        "\\",
        "/"
      )}`;
    }

    // Otherwise, assume it's a relative path
    return this.productImage;
  }

  getShortDescription(maxLength = 100) {
    if (this.productDescription.length <= maxLength) {
      return this.productDescription;
    }
    return this.productDescription.substring(0, maxLength) + "...";
  }

  getRatingStars() {
    const rating = Math.round(this.averageRating);
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  }

  // Clone method
  clone() {
    return new Product(this.toJSON());
  }

  // Update method
  update(updates) {
    Object.keys(updates).forEach((key) => {
      if (key in this) {
        this[key] = updates[key];
      }
    });
    this.updatedAt = new Date().toISOString();
    return this;
  }
}

// Factory function to create Product instances
export const createProduct = (data) => new Product(data);

// Default product template
export const getDefaultProduct = () =>
  new Product({
    productName: "",
    productPrice: "",
    productCategory: "",
    productSize: "",
    productImage: null,
    productDescription: "",
    isActive: true,
  });

// Product status constants
export const PRODUCT_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

// Product validation rules
export const PRODUCT_VALIDATION_RULES = {
  productName: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  productPrice: {
    required: true,
    min: 0,
    type: "number",
  },
  productCategory: {
    required: true,
  },
  productSize: {
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  productDescription: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
};

export default Product;
