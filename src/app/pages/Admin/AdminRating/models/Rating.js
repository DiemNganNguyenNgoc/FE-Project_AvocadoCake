/**
 * Rating Model
 * Represents a product rating/review entity in the admin panel
 */
export class Rating {
  constructor(data = {}) {
    this._id = data._id || "";
    this.userId = data.userId || null;
    this.productId = data.productId || null;
    this.orderId = data.orderId || null;
    this.rating = data.rating || 0;
    this.comment = data.comment || "";
    this.userName = data.userName || "";
    this.isVisible = data.isVisible !== undefined ? data.isVisible : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Create a Rating instance from API response
   */
  static fromApiResponse(data) {
    return new Rating({
      _id: data._id,
      userId: data.userId,
      productId: data.productId,
      orderId: data.orderId,
      rating: data.rating,
      comment: data.comment,
      userName: data.userName,
      isVisible: data.isVisible,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  /**
   * Convert Rating instance to API payload format
   */
  toApiPayload() {
    return {
      userId: this.userId?._id || this.userId,
      productId: this.productId?._id || this.productId,
      orderId: this.orderId?._id || this.orderId,
      rating: this.rating,
      comment: this.comment,
      userName: this.userName,
      isVisible: this.isVisible,
    };
  }

  /**
   * Get display name (user name from populated data or fallback)
   */
  getDisplayUserName() {
    if (this.userId && typeof this.userId === "object") {
      return this.userId.userName || this.userName;
    }
    return this.userName;
  }

  /**
   * Get product name (from populated data)
   */
  getProductName() {
    if (this.productId && typeof this.productId === "object") {
      return this.productId.productName || "N/A";
    }
    return "N/A";
  }

  /**
   * Get product code (from populated data)
   */
  getProductCode() {
    if (this.productId && typeof this.productId === "object") {
      return this.productId.productCode || "N/A";
    }
    return "N/A";
  }

  /**
   * Get order code (from populated data)
   */
  getOrderCode() {
    // Case 1: orderId is populated object with orderCode
    if (
      this.orderId &&
      typeof this.orderId === "object" &&
      this.orderId.orderCode
    ) {
      return this.orderId.orderCode;
    }

    // Case 2: orderId is populated object but no orderCode (show _id)
    if (this.orderId && typeof this.orderId === "object" && this.orderId._id) {
      return `#${this.orderId._id.slice(-8)}`;
    }

    // Case 3: orderId is a string (ObjectId not populated)
    if (this.orderId && typeof this.orderId === "string") {
      return `#${this.orderId.slice(-8)}`;
    }

    // Case 4: No orderId at all
    return "Chưa có đơn";
  }

  /**
   * Get formatted rating with stars
   */
  getFormattedRating() {
    return "⭐".repeat(this.rating);
  }

  /**
   * Get visibility status text
   */
  getVisibilityStatus() {
    return this.isVisible ? "Hiển thị" : "Ẩn";
  }

  /**
   * Check if rating has comment
   */
  hasComment() {
    return this.comment && this.comment.trim().length > 0;
  }

  /**
   * Get comment preview (truncated)
   */
  getCommentPreview(maxLength = 100) {
    if (!this.hasComment()) return "Không có bình luận";
    if (this.comment.length <= maxLength) return this.comment;
    return this.comment.substring(0, maxLength) + "...";
  }

  /**
   * Validate rating data
   */
  validate() {
    const errors = [];

    if (!this.userId) {
      errors.push("User ID is required");
    }

    if (!this.productId) {
      errors.push("Product ID is required");
    }

    if (!this.orderId) {
      errors.push("Order ID is required");
    }

    if (this.rating < 1 || this.rating > 5) {
      errors.push("Rating must be between 1 and 5");
    }

    if (!this.userName || this.userName.trim() === "") {
      errors.push("User name is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default Rating;
