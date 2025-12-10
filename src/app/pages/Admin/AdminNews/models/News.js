export class News {
  constructor(data = {}) {
    this._id = data._id || "";
    this.newsTitle = data.newsTitle || "";
    this.newsContent = data.newsContent || "";
    this.newsImage = data.newsImage || "";
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    this.status = data.status || "Active";
  }

  static fromApiResponse(apiData) {
    return new News(apiData);
  }

  toApiRequest() {
    return {
      newsTitle: this.newsTitle,
      newsContent: this.newsContent,
      newsImage: this.newsImage,
      status: this.status,
    };
  }

  isValid() {
    return this.newsTitle && this.newsContent;
  }

  // Format image URL for display
  getImageUrl() {
    if (!this.newsImage) return "";

    if (this.newsImage.startsWith("http")) {
      return this.newsImage;
    }

    return `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${this.newsImage.replace(
      "\\",
      "/"
    )}`;
  }

  // Get formatted date
  getFormattedDate() {
    return this.createdAt.toLocaleDateString("vi-VN");
  }

  // Get excerpt of content
  getExcerpt(length = 100) {
    if (this.newsContent.length <= length) {
      return this.newsContent;
    }
    return this.newsContent.substring(0, length) + "...";
  }
}
