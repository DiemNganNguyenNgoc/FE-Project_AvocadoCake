export class Rank {
  constructor(
    id,
    rankName,
    rankDisplayName,
    rankCode,
    discountPercent,
    minSpending,
    maxSpending,
    priority,
    color,
    icon,
    benefits,
    description,
    isActive,
    createdAt,
    updatedAt
  ) {
    this._id = id;
    this.rankName = rankName;
    this.rankDisplayName = rankDisplayName;
    this.rankCode = rankCode;
    this.discountPercent = discountPercent;
    this.minSpending = minSpending;
    this.maxSpending = maxSpending;
    this.priority = priority;
    this.color = color;
    this.icon = icon;
    this.benefits = benefits || [];
    this.description = description;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromApiResponse(apiData) {
    return new Rank(
      apiData._id,
      apiData.rankName,
      apiData.rankDisplayName,
      apiData.rankCode,
      apiData.discountPercent,
      apiData.minSpending,
      apiData.maxSpending,
      apiData.priority,
      apiData.color,
      apiData.icon,
      apiData.benefits,
      apiData.description,
      apiData.isActive,
      apiData.createdAt,
      apiData.updatedAt
    );
  }

  toApiPayload() {
    return {
      rankName: this.rankName,
      rankDisplayName: this.rankDisplayName,
      rankCode: this.rankCode,
      discountPercent: this.discountPercent,
      minSpending: this.minSpending,
      maxSpending: this.maxSpending,
      priority: this.priority,
      color: this.color,
      icon: this.icon,
      benefits: this.benefits,
      description: this.description,
      isActive: this.isActive,
    };
  }

  // Helpers
  getFormattedMinSpending() {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(this.minSpending);
  }

  getFormattedMaxSpending() {
    if (this.maxSpending === null) {
      return "Không giới hạn";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(this.maxSpending);
  }

  getSpendingRange() {
    if (this.maxSpending === null) {
      return `Từ ${this.getFormattedMinSpending()}`;
    }
    return `${this.getFormattedMinSpending()} - ${this.getFormattedMaxSpending()}`;
  }
}
