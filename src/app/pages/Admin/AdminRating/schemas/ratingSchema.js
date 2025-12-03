/**
 * Rating Schema
 * Validation schema for rating data
 */

/**
 * Validate rating data
 */
export const validateRating = (data) => {
  const errors = {};

  // Validate userId
  if (!data.userId || data.userId.trim() === "") {
    errors.userId = "User ID is required";
  }

  // Validate productId
  if (!data.productId || data.productId.trim() === "") {
    errors.productId = "Product ID is required";
  }

  // Validate orderId
  if (!data.orderId || data.orderId.trim() === "") {
    errors.orderId = "Order ID is required";
  }

  // Validate rating
  if (!data.rating) {
    errors.rating = "Rating is required";
  } else if (data.rating < 1 || data.rating > 5) {
    errors.rating = "Rating must be between 1 and 5 stars";
  }

  // Validate userName
  if (!data.userName || data.userName.trim() === "") {
    errors.userName = "User name is required";
  }

  // Validate comment (optional but with max length)
  if (data.comment && data.comment.length > 1000) {
    errors.comment = "Comment must not exceed 1000 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate rating filter data
 */
export const validateRatingFilters = (filters) => {
  const errors = {};

  // Validate sortBy
  const validSortFields = [
    "createdAt",
    "updatedAt",
    "rating",
    "userName",
    "isVisible",
  ];
  if (filters.sortBy && !validSortFields.includes(filters.sortBy)) {
    errors.sortBy = `Invalid sort field. Must be one of: ${validSortFields.join(
      ", "
    )}`;
  }

  // Validate sortOrder
  const validSortOrders = ["asc", "desc"];
  if (filters.sortOrder && !validSortOrders.includes(filters.sortOrder)) {
    errors.sortOrder = "Sort order must be 'asc' or 'desc'";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize rating data for API submission
 */
export const sanitizeRatingData = (data) => {
  return {
    userId:
      typeof data.userId === "object" ? data.userId._id : data.userId || "",
    productId:
      typeof data.productId === "object"
        ? data.productId._id
        : data.productId || "",
    orderId:
      typeof data.orderId === "object" ? data.orderId._id : data.orderId || "",
    rating: parseInt(data.rating) || 0,
    comment: (data.comment || "").trim(),
    userName: (data.userName || "").trim(),
    isVisible: data.isVisible !== undefined ? Boolean(data.isVisible) : true,
  };
};

/**
 * Check if rating data is complete
 */
export const isRatingDataComplete = (data) => {
  return (
    data.userId &&
    data.productId &&
    data.orderId &&
    data.rating >= 1 &&
    data.rating <= 5 &&
    data.userName &&
    data.userName.trim() !== ""
  );
};

/**
 * Get rating color based on score
 */
export const getRatingColor = (rating) => {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 3.5) return "text-blue-600";
  if (rating >= 2.5) return "text-yellow-600";
  if (rating >= 1.5) return "text-orange-600";
  return "text-red-600";
};

/**
 * Get rating background color based on score
 */
export const getRatingBgColor = (rating) => {
  if (rating >= 4.5) return "bg-green-100";
  if (rating >= 3.5) return "bg-blue-100";
  if (rating >= 2.5) return "bg-yellow-100";
  if (rating >= 1.5) return "bg-orange-100";
  return "bg-red-100";
};

const ratingSchema = {
  validateRating,
  validateRatingFilters,
  sanitizeRatingData,
  isRatingDataComplete,
  getRatingColor,
  getRatingBgColor,
};

export default ratingSchema;
