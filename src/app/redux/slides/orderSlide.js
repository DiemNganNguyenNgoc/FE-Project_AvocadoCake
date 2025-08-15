import { createSlice } from "@reduxjs/toolkit";

// Hàm lưu trạng thái vào localStorage
const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem("orders", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving orders to localStorage:", error);
  }
};

// Hàm tải trạng thái từ localStorage
const loadFromLocalStorage = () => {
  try {
    const orders = localStorage.getItem("orders");
    return orders
      ? JSON.parse(orders)
      : {
          orders: [],
          selectedProductDetails: [], // Khởi tạo selectedProductDetails
          shippingAddress: {},
          totalPrice: 0,
        };
  } catch (error) {
    console.error("Error loading orders from localStorage:", error);
    return {
      orders: [],
      selectedProductDetails: [],
      shippingAddress: {},
      totalPrice: 0,
    };
  }
};

// Trạng thái ban đầu
const initialState = loadFromLocalStorage();

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Thêm đơn hàng mới
    addOrder: (state, action) => {
      state.orders.push(action.payload);
      saveToLocalStorage(state); // Lưu vào localStorage
    },

    // Cập nhật trạng thái đơn hàng
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((o) => o.orderId === orderId); // Sử dụng orderId thay vì _id
      if (order) {
        order.status = status;
        saveToLocalStorage(state); // Lưu vào localStorage
      }
    },

    // Cập nhật thông tin đơn hàng (bao gồm totalPrice sau khi áp dụng xu)
    updateOrder: (state, action) => {
      const { orderId, updatedData } = action.payload;
      const order = state.orders.find((o) => o.orderId === orderId);
      if (order) {
        Object.assign(order, updatedData);
        saveToLocalStorage(state); // Lưu vào localStorage
      }
    },

    // Xóa đơn hàng
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.orderId !== action.payload // Sử dụng orderId
      );
      saveToLocalStorage(state); // Lưu vào localStorage
    },

    // Xóa tất cả đơn hàng
    clearOrders: (state) => {
      state.orders = [];
      saveToLocalStorage(state); // Lưu vào localStorage
    },

    // Thêm danh sách đơn hàng (dành cho khi load từ API)
    setOrders: (state, action) => {
      state.orders = action.payload;
      saveToLocalStorage(state); // Lưu vào localStorage
    },

    // Cập nhật chi tiết đơn hàng, bao gồm selectedProductDetails
    setOrderDetails: (state, action) => {
      state.selectedProductDetails =
        action.payload.selectedProductDetails || [];
      state.shippingAddress = action.payload.shippingAddress || {};
      state.totalPrice = action.payload.totalPrice || 0;
      saveToLocalStorage(state); // Lưu vào localStorage
    },

    // Xóa selectedProductDetails khi cần
    clearSelectedProductDetails: (state) => {
      state.selectedProductDetails = [];
      saveToLocalStorage(state); // Lưu vào localStorage
    },

    // Xóa toàn bộ chi tiết đơn hàng
    clearOrder: (state) => {
      state.selectedProductDetails = [];
      state.shippingAddress = {};
      state.totalPrice = 0;
      saveToLocalStorage(state); // Lưu vào localStorage
    },
  },
});

// Xuất các action
export const {
  addOrder,
  updateOrderStatus,
  updateOrder,
  removeOrder,
  clearOrders,
  setOrders,
  setOrderDetails,
  clearSelectedProductDetails,
  clearOrder,
} = orderSlice.actions;

// Xuất reducer
export default orderSlice.reducer;
