import { useState, useCallback, useEffect } from "react";
import { Order } from "./models/Order";
import { OrderService } from "./services/OrderService";

export const useAdminOrderStore = () => {
  // State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: "", // No status filter
    category: "", // No category filter
    value: "", // No value filter
  });

  // Actions
  const clearError = useCallback(() => setError(null), []);

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const orders = await OrderService.fetchAllOrders();
      console.log("orders in store", orders);
      // Map raw data to Order model
      const mappedOrders = orders.map((order) => new Order(order));
      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch order by ID
  const fetchOrderById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const order = await OrderService.fetchOrderById(id);
      setCurrentOrder(order);
      return order;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId, statusId) => {
    try {
      setLoading(true);
      setError(null);
      const updatedOrder = await OrderService.updateOrderStatusById(
        orderId,
        statusId
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );
      return updatedOrder;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update multiple order statuses
  const updateMultipleOrderStatuses = useCallback(
    async (orderIds, statusId) => {
      try {
        setLoading(true);
        setError(null);
        const updatedOrders = await OrderService.updateMultipleOrderStatuses(
          orderIds,
          statusId
        );
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            const updatedOrder = updatedOrders.find(
              (updated) => updated._id === order._id
            );
            return updatedOrder || order;
          })
        );
        setSelectedOrders([]);
        return updatedOrders;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete order
  const deleteOrder = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await OrderService.removeOrder(id);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      setSelectedOrders((prevSelected) =>
        prevSelected.filter((orderId) => orderId !== id)
      );
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete multiple orders
  const deleteMultipleOrders = useCallback(async (ids) => {
    try {
      setLoading(true);
      setError(null);
      await OrderService.removeMultipleOrders(ids);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => !ids.includes(order._id))
      );
      setSelectedOrders([]);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search and filter
  const handleSetSearchTerm = useCallback((searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  }, []);

  const handleSetSortBy = useCallback((sortBy) => {
    setSortBy(sortBy);
    setCurrentPage(1);
  }, []);

  const handleSetSortOrder = useCallback((sortOrder) => {
    setSortOrder(sortOrder);
    setCurrentPage(1);
  }, []);

  const handleSetFilters = useCallback((filters) => {
    setFilters(filters);
    setCurrentPage(1);
  }, []);

  // Get filtered and sorted orders
  // Add logs to debug filtering logic
  const getFilteredOrders = useCallback(() => {
    console.log("getFilteredOrders called with orders:", orders);
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (
            order.userName ||
            order.userId?.userName ||
            order.shippingAddress?.userName ||
            ""
          )
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (
            order.userEmail ||
            order.userId?.userEmail ||
            order.shippingAddress?.userEmail ||
            ""
          )
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      console.log("After search filter:", filtered);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(
        (order) =>
          order.status?.statusName?.toLowerCase() ===
          filters.status.toLowerCase()
      );
      console.log("After status filter:", filtered);
    }

    // Category filter (based on order items)
    if (filters.category) {
      filtered = filtered.filter((order) =>
        order.orderItems?.some(
          (item) =>
            item.product?.productCategory?.toLowerCase() ===
            filters.category.toLowerCase()
        )
      );
      console.log("After category filter:", filtered);
    }

    // Value filter
    if (filters.value) {
      filtered = filtered.filter((order) => {
        const finalPrice = order.finalPrice;
        switch (filters.value) {
          case "low":
            return finalPrice < 100000;
          case "medium":
            return finalPrice >= 100000 && finalPrice <= 500000;
          case "high":
            return finalPrice > 500000;
          default:
            return true;
        }
      });
      console.log("After value filter:", filtered);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (
        sortBy === "createdAt" ||
        sortBy === "updatedAt" ||
        sortBy === "deadline" ||
        sortBy === "deliveryDate"
      ) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    console.log("filtered orders:", filtered);
    return filtered;
  }, [orders, searchTerm, filters, sortBy, sortOrder]);

  // Get paginated orders
  const getPaginatedOrders = useCallback(() => {
    const filteredOrders = getFilteredOrders();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [getFilteredOrders, currentPage, itemsPerPage]);

  // Get total pages
  const getTotalPages = useCallback(() => {
    const filteredOrders = getFilteredOrders();
    return Math.ceil(filteredOrders.length / itemsPerPage);
  }, [getFilteredOrders, itemsPerPage]);

  // Selection actions
  const selectOrder = useCallback((orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  }, []);

  const selectAllOrders = useCallback(() => {
    setSelectedOrders((prevSelected) => {
      // Tính toán paginated orders trực tiếp thay vì gọi getPaginatedOrders
      const filteredOrders = getFilteredOrders();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentPageOrders = filteredOrders.slice(startIndex, endIndex);

      const currentPageOrderIds = currentPageOrders.map((order) => order._id);
      const allSelected = currentPageOrderIds.every((id) =>
        prevSelected.includes(id)
      );

      if (allSelected) {
        // Nếu tất cả orders trong trang hiện tại đã được chọn, bỏ chọn tất cả
        return prevSelected.filter((id) => !currentPageOrderIds.includes(id));
      } else {
        // Nếu chưa chọn hết, chọn tất cả orders trong trang hiện tại
        const newSelected = [...prevSelected];
        currentPageOrderIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      }
    });
  }, [getFilteredOrders, currentPage, itemsPerPage]);

  const clearSelection = useCallback(() => setSelectedOrders([]), []);

  // Ensure orders are fetched when the component mounts
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    // State
    orders,
    loading,
    error,
    selectedOrders,
    currentOrder,
    searchTerm,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    filters,

    // Actions
    setLoading,
    setError,
    clearError,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    updateMultipleOrderStatuses,
    deleteOrder,
    deleteMultipleOrders,
    selectOrder,
    selectAllOrders,
    clearSelection,
    setSearchTerm: handleSetSearchTerm,
    setSortBy: handleSetSortBy,
    setSortOrder: handleSetSortOrder,
    setCurrentPage,
    setFilters: handleSetFilters,
    getFilteredOrders,
    getPaginatedOrders,
    getTotalPages,
  };
};
