export class Order {
  constructor(data = {}) {
    this._id = data._id || "";
    this.orderCode = data.orderCode || "";
    this.userId = data.userId || {};
    // Lấy thông tin user từ userId hoặc shippingAddress
    this.userName =
      data.userId?.userName || data.shippingAddress?.userName || "";
    this.userEmail =
      data.userId?.userEmail || data.shippingAddress?.userEmail || "";
    this.userPhone =
      data.userId?.userPhone || data.shippingAddress?.userPhone || "";
    this.shippingAddress = data.shippingAddress || {};
    this.orderItems = data.orderItems || [];
    this.totalItemPrice = data.totalItemPrice || 0;
    this.shippingPrice = data.shippingPrice || 0;
    this.totalPrice = data.totalPrice || 0;
    this.coinsUsed = data.coinsUsed || 0;
    this.finalPrice = data.totalPrice || 0; // Sử dụng totalPrice làm finalPrice
    this.status = data.status || {};
    this.paymentMethod = data.paymentMethod || "";
    this.paymentStatus = data.paymentStatus || "";
    this.orderNote = data.orderNote || "";
    this.deliveryDate = data.deliveryDate
      ? new Date(data.deliveryDate)
      : new Date();
    this.deliveryTime = data.deliveryTime || "";
    this.isDelivered = data.isDelivered || false;
    this.isPaid = data.isPaid || false;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    this.deadline = data.deliveryDate
      ? new Date(data.deliveryDate)
      : new Date();
  }

  static fromApiResponse(apiData) {
    console.log("fromApiResponse called with:", apiData);
    const order = new Order(apiData);
    console.log("created order:", order);
    return order;
  }

  toApiRequest() {
    return {
      orderCode: this.orderCode,
      userId: this.userId,
      shippingAddress: this.shippingAddress,
      orderItems: this.orderItems,
      totalPrice: this.totalPrice,
      coinsUsed: this.coinsUsed,
      finalPrice: this.finalPrice,
      statusId: this.status._id,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
    };
  }

  isValid() {
    return this.orderCode && this.userId && this.orderItems.length > 0;
  }

  getStatusColor() {
    const statusName = this.status?.statusName?.toLowerCase();
    switch (statusName) {
      case "đã giao":
        return "bg-green-100 text-green-800";
      case "đang giao":
        return "bg-yellow-100 text-yellow-800";
      case "đã hủy":
        return "bg-red-100 text-red-800";
      case "đã nhận":
        return "bg-blue-100 text-blue-800";
      case "đang làm":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString("vi-VN");
  }
}
