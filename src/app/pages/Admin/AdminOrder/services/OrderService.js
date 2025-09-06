import { Order } from "../models/Order";
import {
  getAllOrders,
  getDetailsOrder,
  updateOrderStatus,
  deleteOrder,
} from "../../../../api/services/OrderService";

export class OrderService {
  static async fetchAllOrders() {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await getAllOrders(accessToken);
      // Trả về trực tiếp response.data nếu có, hoặc response nếu không có data
      const ordersData = response.data || response;
      console.log("ordersData", ordersData);
      if (Array.isArray(ordersData)) {
        // Trả về dữ liệu gốc để test
        console.log("Returning original data for testing");
        return ordersData;
        // const mappedOrders = ordersData.map((order) => Order.fromApiResponse(order));
        // console.log("mappedOrders", mappedOrders);
        // return mappedOrders;
      }
      return [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async fetchOrderById(id) {
    try {
      const response = await getDetailsOrder(id);
      // Trả về trực tiếp response.data nếu có, hoặc response nếu không có data
      const orderData = response.data || response;
      if (orderData) {
        return Order.fromApiResponse(orderData);
      }
      throw new Error(response.message || "Failed to fetch order");
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  static async updateOrderStatusById(orderId, statusId) {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await updateOrderStatus(orderId, statusId, accessToken);
      if (response.status === "OK") {
        return Order.fromApiResponse(response.data);
      }
      throw new Error(response.message || "Failed to update order status");
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  static async updateMultipleOrderStatuses(orderIds, statusId) {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const promises = orderIds.map((orderId) =>
        updateOrderStatus(orderId, statusId, accessToken)
      );
      const responses = await Promise.all(promises);

      return responses.map((response) => {
        if (response.status === "OK") {
          return Order.fromApiResponse(response.data);
        }
        throw new Error(response.message || "Failed to update order status");
      });
    } catch (error) {
      console.error("Error updating multiple order statuses:", error);
      throw error;
    }
  }

  static async removeOrder(id) {
    try {
      const response = await deleteOrder(id);
      if (response.status === "OK") {
        return true;
      }
      throw new Error(response.message || "Failed to delete order");
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }

  static async removeMultipleOrders(ids) {
    try {
      const promises = ids.map((id) => deleteOrder(id));
      const responses = await Promise.all(promises);

      return responses.every((response) => response.status === "OK");
    } catch (error) {
      console.error("Error deleting multiple orders:", error);
      throw error;
    }
  }
}
