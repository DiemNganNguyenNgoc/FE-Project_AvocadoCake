export class Category {
  constructor(data = {}) {
    this._id = data._id || "";
    this.categoryCode = data.categoryCode || "";
    this.categoryName = data.categoryName || "";
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.status = data.status || "Active";
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  static fromApiResponse(apiData) {
    return new Category(apiData);
  }

  toApiRequest() {
    return {
      categoryCode: this.categoryCode,
      categoryName: this.categoryName,
      status: this.status,
    };
  }

  isValid() {
    return this.categoryCode && this.categoryName;
  }
}
