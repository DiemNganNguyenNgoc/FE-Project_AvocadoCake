export class Category {
  constructor(data = {}) {
    this._id = data._id || "";
    this.categoryCode = data.categoryCode || "";
    this.categoryName = data.categoryName || "";
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    // Convert isActive from MongoDB to status for frontend
    this.status =
      data.isActive !== undefined
        ? data.isActive
          ? "Active"
          : "Inactive"
        : data.status || "Active";
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  static fromApiResponse(apiData) {
    return new Category(apiData);
  }

  toApiRequest() {
    return {
      categoryCode: this.categoryCode,
      categoryName: this.categoryName,
      isActive: this.status === "Active", // Convert status back to isActive for API
    };
  }

  isValid() {
    return this.categoryCode && this.categoryName;
  }
}
