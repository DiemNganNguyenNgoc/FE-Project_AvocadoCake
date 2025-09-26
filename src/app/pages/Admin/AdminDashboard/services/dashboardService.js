// Service để quản lý dữ liệu dashboard
import * as UserService from "../../../../api/services/UserService";
import * as OrderService from "../../../../api/services/OrderService";
import * as ProductService from "../../../../api/services/productServices";
import * as CategoryService from "../../../../api/services/CategoryService";
import * as StatusService from "../../../../api/services/StatusService";

export const DashboardService = {
  // Lấy dữ liệu tổng quan dashboard
  async getDashboardData() {
    try {
      const token = localStorage.getItem("access_token");

      // Gọi các API song song để lấy dữ liệu
      const [
        userRes,
        orderRes,
        productRes,
        categoryRes,
        statusRes,
        weeklyNewUsersRes,
        weeklyNewOrdersRes,
        prevWeeklyNewUsersRes,
        prevWeeklyNewOrdersRes,
        weeklyNewProductsRes,
        prevWeeklyNewProductsRes,
      ] = await Promise.all([
        UserService.getAllUser(token),
        OrderService.getAllOrders(token),
        ProductService.getAllProduct(token),
        CategoryService.getAllCategory(),
        StatusService.getAllStatus(token),
        UserService.getWeeklyNewUsers(token),
        OrderService.getWeeklyNewOrders(token),
        UserService.getPreviousWeekNewUsers(token),
        OrderService.getPreviousWeekNewOrders(token),
        ProductService.getWeeklyNewProducts(token),
        ProductService.getPreviousWeekNewProducts(token),
      ]);

      const users = Array.isArray(userRes.data) ? userRes.data : [];
      const orders = Array.isArray(orderRes.data) ? orderRes.data : [];
      const products = Array.isArray(productRes.data) ? productRes.data : [];
      const categories = Array.isArray(categoryRes.data)
        ? categoryRes.data
        : [];
      const statuses = Array.isArray(statusRes.data) ? statusRes.data : [];
      const weeklyNewOrders = Array.isArray(weeklyNewOrdersRes.data)
        ? weeklyNewOrdersRes.data
        : [];
      const weeklyNewProducts = Array.isArray(weeklyNewProductsRes.data)
        ? weeklyNewProductsRes.data
        : [];
      const prevWeeklyNewProducts = Array.isArray(prevWeeklyNewProductsRes.data)
        ? prevWeeklyNewProductsRes.data
        : [];

      // Tính toán các chỉ số
      const totalUsers = users.length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (sum, o) => sum + (o.totalPrice || 0),
        0
      );
      const totalCoinsUsed = orders.reduce(
        (sum, o) => sum + (o.coinsUsed || 0),
        0
      );
      const totalProductsSold = orders.reduce(
        (sum, o) =>
          sum +
          (Array.isArray(o.orderItems)
            ? o.orderItems.reduce((s, i) => s + (i.quantity || 0), 0)
            : 0),
        0
      );

      // Tuần này vs tuần trước: Đơn hàng và Khách hàng mới
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Tuần này vs tuần trước: Đơn hàng mới
      const newOrdersThisWeek = Number(weeklyNewOrdersRes?.total || 0);
      const prevOrders = Number(prevWeeklyNewOrdersRes?.total || 0);

      // Tuần này vs tuần trước: Khách hàng mới
      const newCustomersThisWeek = Number(weeklyNewUsersRes?.total || 0);
      const prevCustomers = Number(prevWeeklyNewUsersRes?.total || 0);

      // Tuần này vs tuần trước: Sản phẩm mới
      const newProductsThisWeek = Number(weeklyNewProductsRes?.total || 0);
      const prevProducts = Number(prevWeeklyNewProductsRes?.total || 0);
      const calcChangePct = (prev, curr) => {
        if (prev === 0) return curr > 0 ? 100 : 0;
        return ((curr - prev) / prev) * 100;
      };
      const calcProgress = (prev, curr) => {
        if (prev === 0) return curr > 0 ? 100 : 0;
        return Math.min((curr / prev) * 100, 100);
      };

      const newOrdersChangePct = calcChangePct(prevOrders, newOrdersThisWeek);
      const newCustomersChangePct = calcChangePct(
        prevCustomers,
        newCustomersThisWeek
      );
      const newOrdersProgress = calcProgress(prevOrders, newOrdersThisWeek);
      const newCustomersProgress = calcProgress(
        prevCustomers,
        newCustomersThisWeek
      );
      const newProductsChangePct = calcChangePct(
        prevProducts,
        newProductsThisWeek
      );
      const newProductsProgress = calcProgress(
        prevProducts,
        newProductsThisWeek
      );

      // Tính toán doanh thu theo tháng
      const months = [
        "Th1",
        "Th2",
        "Th3",
        "Th4",
        "Th5",
        "Th6",
        "Th7",
        "Th8",
        "Th9",
        "Th10",
        "Th11",
        "Th12",
      ];
      const revenueByMonth = Array(12).fill(0);
      const productsSoldByMonth = Array(12).fill(0);

      orders.forEach((order) => {
        const date = new Date(order.createdAt);
        const month = date.getMonth();
        revenueByMonth[month] += order.totalPrice || 0;
        if (Array.isArray(order.orderItems)) {
          const total = order.orderItems.reduce(
            (s, i) => s + (i.quantity || 0),
            0
          );
          productsSoldByMonth[month] += total;
        }
      });

      // Tính toán phân bổ trạng thái đơn hàng
      const statusNameMap = statuses.reduce((map, s) => {
        map[s._id] = s.statusName;
        return map;
      }, {});

      const ordersByStatus = {};
      orders.forEach((order) => {
        let statusName;
        if (
          typeof order.status === "object" &&
          order.status !== null &&
          order.status.statusName
        ) {
          statusName = order.status.statusName;
        } else {
          statusName = statusNameMap[order.status];
        }
        const finalStatusName = statusName || "Không xác định";
        ordersByStatus[finalStatusName] =
          (ordersByStatus[finalStatusName] || 0) + 1;
      });

      // Tính toán doanh thu theo tuần (Chủ nhật → Thứ bảy)
      const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const revenueByWeekday = Array(7).fill(0);
      const itemsByWeekday = Array(7).fill(0);

      orders.forEach((order) => {
        const date = new Date(order.createdAt);
        const dow = date.getDay();
        revenueByWeekday[dow] += order.totalPrice || 0;
        if (Array.isArray(order.orderItems)) {
          const total = order.orderItems.reduce(
            (s, i) => s + (i.quantity || 0),
            0
          );
          itemsByWeekday[dow] += total;
        }
      });

      const weeklyRevenue = weekdayLabels.map((day, idx) => ({
        day,
        revenue: revenueByWeekday[idx],
        pipeline: itemsByWeekday[idx],
      }));

      // Tính toán top sản phẩm bán chạy
      const productSales = {};
      orders.forEach((order) => {
        if (Array.isArray(order.orderItems)) {
          order.orderItems.forEach((item) => {
            const productId = item.product?._id || item.product;
            productSales[productId] =
              (productSales[productId] || 0) + (item.quantity || 0);
          });
        }
      });

      const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      const productNameMap = products.reduce((map, p) => {
        map[p._id] = p.productName;
        return map;
      }, {});

      return {
        stats: {
          newOrders: newOrdersThisWeek,
          newCustomers: newCustomersThisWeek,
          newOrdersPrev: prevOrders,
          newCustomersPrev: prevCustomers,
          newOrdersChangePct,
          newCustomersChangePct,
          newOrdersProgress,
          newCustomersProgress,
          newProducts: newProductsThisWeek,
          newProductsPrev: prevProducts,
          newProductsChangePct,
          newProductsProgress,
          totalRevenue: totalRevenue,
          totalUsers: totalUsers,
          totalOrders: totalOrders,
          totalProductsSold: totalProductsSold,
          totalCoinsUsed: totalCoinsUsed,
        },
        monthlyTarget: {
          progress: Math.min((totalRevenue / 20000000) * 100, 100), // Giả sử mục tiêu 20M VND
          target: 20000000,
          revenue: totalRevenue,
          today: orders
            .filter((order) => {
              const today = new Date();
              const orderDate = new Date(order.createdAt);
              return orderDate.toDateString() === today.toDateString();
            })
            .reduce((sum, order) => sum + (order.totalPrice || 0), 0),
        },
        visitors: {
          total: 2548, // Mock data - có thể thay bằng Google Analytics
          desktop: 65,
          mobile: 45,
          tablet: 34,
          unknown: 12,
        },
        revenue: {
          weekly: weeklyRevenue,
          monthly: revenueByMonth,
        },
        ordersByStatus: ordersByStatus,
        topProducts: topProducts.map(([id, qty]) => ({
          id: id,
          name: productNameMap[id] || "Sản phẩm đã xóa",
          quantity: qty,
        })),
        revenueByMonth: revenueByMonth,
        productsSoldByMonth: productsSoldByMonth,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  // Lấy dữ liệu đơn hàng gần đây
  async getRecentOrders() {
    try {
      const token = localStorage.getItem("access_token");
      const response = await OrderService.getRecentOrders(token, 5);

      if (response.status !== "OK") {
        throw new Error(response.message || "Failed to fetch recent orders");
      }

      const orders = Array.isArray(response.data) ? response.data : [];

      return orders.map((order) => ({
        id: order._id,
        orderCode: order.orderCode,
        customerName:
          order.userId?.name ||
          order.shippingAddress?.userName ||
          "Khách vãng lai",
        product: {
          name:
            order.orderItems?.[0]?.product?.name || "Sản phẩm không xác định",
          variants: `${order.orderItems?.length || 0} sản phẩm`,
          image:
            order.orderItems?.[0]?.product?.images?.[0] || "/LogoAvocado.png",
        },
        category: order.orderItems?.[0]?.product?.type || "Không xác định",
        price: `${(order.totalPrice || 0).toLocaleString()} VND`,
        status: order.status?.statusName || "Không xác định",
      }));
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      throw error;
    }
  },

  // Lấy sản phẩm bán chạy nhất
  async getTopProducts() {
    try {
      const token = localStorage.getItem("access_token");
      const response = await OrderService.getBestSellingProducts(token, 10);

      if (response.status !== "OK") {
        throw new Error(
          response.message || "Failed to fetch best selling products"
        );
      }

      const bestSellingData = Array.isArray(response.data) ? response.data : [];

      // Fetch product details for each best-selling product
      const productsWithDetails = await Promise.all(
        bestSellingData.map(async (item) => {
          try {
            const productDetailResponse =
              await ProductService.getDetailsproduct(item._id, token);

            if (productDetailResponse.status === "OK") {
              const productDetail = productDetailResponse.data;

              return {
                id: item._id,
                name: productDetail.productName,
                originalPrice: `${(
                  productDetail.productPrice || 0
                ).toLocaleString()} VND`,
                currentPrice: `${(
                  productDetail.productPrice || 0
                ).toLocaleString()} VND`,
                discount: "0%", // Có thể tính discount dựa trên dữ liệu thực
                rating: productDetail.averageRating || 4.5,
                image: Array.isArray(productDetail.productImage)
                  ? productDetail.productImage[0]
                  : productDetail.productImage || "/LogoAvocado.png",
                totalSold: item.totalQuantitySold,
                totalRevenue: item.totalRevenue,
                orderCount: item.orderCount,
                totalRatings: productDetail.totalRatings || 0,
                description: productDetail.productDescription || "",
                size: productDetail.productSize || 0,
              };
            } else {
              // Fallback if product details fetch fails
              return {
                id: item._id,
                name: "Sản phẩm không xác định",
                originalPrice: "0 VND",
                currentPrice: "0 VND",
                discount: "0%",
                rating: 4.5,
                image: "/LogoAvocado.png",
                totalSold: item.totalQuantitySold,
                totalRevenue: item.totalRevenue,
                orderCount: item.orderCount,
                totalRatings: 0,
                description: "",
                size: 0,
              };
            }
          } catch (error) {
            console.error(
              `Error fetching product details for ${item._id}:`,
              error
            );
            // Return fallback data if individual product fetch fails
            return {
              id: item._id,
              name: "Sản phẩm không xác định",
              originalPrice: "0 VND",
              currentPrice: "0 VND",
              discount: "0%",
              rating: 4.5,
              image: "/LogoAvocado.png",
              totalSold: item.totalQuantitySold,
              totalRevenue: item.totalRevenue,
              orderCount: item.orderCount,
              totalRatings: 0,
              description: "",
              size: 0,
            };
          }
        })
      );

      return productsWithDetails;
    } catch (error) {
      console.error("Error fetching best selling products:", error);
      throw error;
    }
  },

  // Business Overview Analytics
  async getBusinessOverview(viewType = "month") {
    try {
      const token = localStorage.getItem("access_token");
      const [currentData, previousData] = await Promise.all([
        OrderService.getAllOrders(token),
        // For simplicity, using the same data - in real app, you'd fetch previous period data
        OrderService.getAllOrders(token),
      ]);

      const currentOrders = Array.isArray(currentData.data)
        ? currentData.data
        : [];
      const previousOrders = Array.isArray(previousData.data)
        ? previousData.data
        : [];

      // Calculate current period metrics
      const totalSales = currentOrders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );
      const totalQuantity = currentOrders.reduce(
        (sum, order) =>
          sum +
          (Array.isArray(order.orderItems)
            ? order.orderItems.reduce((s, item) => s + (item.quantity || 0), 0)
            : 0),
        0
      );
      const totalProfit = totalSales * 0.3; // Assuming 30% profit margin
      const totalOrders = currentOrders.length;

      // Calculate previous period metrics (mock calculation)
      const prevTotalSales = totalSales * 0.85; // Simulate growth
      const prevTotalQuantity = totalQuantity * 0.9;
      const prevTotalProfit = totalProfit * 0.8;
      const prevTotalOrders = totalOrders * 0.95;

      return {
        totalSales,
        totalQuantity,
        totalProfit,
        totalOrders,
        salesChange: ((totalSales - prevTotalSales) / prevTotalSales) * 100,
        quantityChange:
          ((totalQuantity - prevTotalQuantity) / prevTotalQuantity) * 100,
        profitChange: ((totalProfit - prevTotalProfit) / prevTotalProfit) * 100,
        ordersChange: ((totalOrders - prevTotalOrders) / prevTotalOrders) * 100,
      };
    } catch (error) {
      console.error("Error fetching business overview:", error);
      throw error;
    }
  },

  // Customer Profile Analytics
  async getCustomerProfile() {
    try {
      const token = localStorage.getItem("access_token");
      const [orderRes, userRes] = await Promise.all([
        OrderService.getAllOrders(token),
        UserService.getAllUser(token),
      ]);

      const orders = Array.isArray(orderRes.data) ? orderRes.data : [];
      const users = Array.isArray(userRes.data) ? userRes.data : [];

      // Mock customer segmentation data
      const customerTypes = [
        {
          name: "Khách hàng cá nhân",
          count: 120,
          percentage: 60,
          averageOrderValue: 250000,
        },
        {
          name: "Khách hàng doanh nghiệp",
          count: 50,
          percentage: 25,
          averageOrderValue: 800000,
        },
        {
          name: "Khách hàng gia đình",
          count: 30,
          percentage: 15,
          averageOrderValue: 400000,
        },
      ];

      // Calculate new vs repeat customers
      const userOrderCounts = {};
      orders.forEach((order) => {
        if (order.userId) {
          userOrderCounts[order.userId] =
            (userOrderCounts[order.userId] || 0) + 1;
        }
      });

      const repeatCustomers = Object.values(userOrderCounts).filter(
        (count) => count > 1
      ).length;
      const newCustomers = Object.values(userOrderCounts).filter(
        (count) => count === 1
      ).length;

      const repeatCustomerData = {
        count: repeatCustomers,
        percentage: ((repeatCustomers / users.length) * 100).toFixed(1),
        averageOrderValue: 350000,
      };

      const newCustomerData = {
        count: newCustomers,
        percentage: ((newCustomers / users.length) * 100).toFixed(1),
        averageOrderValue: 200000,
      };

      const topSegments = [
        {
          name: "Premium",
          revenue: 15000000,
          orders: 45,
          customers: 20,
          growth: 25,
        },
        {
          name: "Regular",
          revenue: 8000000,
          orders: 120,
          customers: 80,
          growth: 15,
        },
        {
          name: "Budget",
          revenue: 3000000,
          orders: 80,
          customers: 60,
          growth: 8,
        },
      ];

      return {
        customerTypes,
        repeatCustomers: repeatCustomerData,
        newCustomers: newCustomerData,
        topSegments,
      };
    } catch (error) {
      console.error("Error fetching customer profile:", error);
      throw error;
    }
  },

  // Product Performance Analytics
  async getProductPerformance(categoryId = "all") {
    try {
      const token = localStorage.getItem("access_token");
      const [orderRes, productRes, categoryRes] = await Promise.all([
        OrderService.getAllOrders(token),
        ProductService.getAllProduct(token),
        CategoryService.getAllCategory(),
      ]);

      const orders = Array.isArray(orderRes.data) ? orderRes.data : [];
      const products = Array.isArray(productRes.data) ? productRes.data : [];
      const categories = Array.isArray(categoryRes.data)
        ? categoryRes.data
        : [];

      // Mock category performance data
      const categoryPerformance = [
        {
          name: "Bánh ngọt",
          revenue: 12000000,
          averageOrderValue: 280000,
          totalOrders: 43,
          growth: 18,
          productsCount: 15,
        },
        {
          name: "Bánh mặn",
          revenue: 8500000,
          averageOrderValue: 320000,
          totalOrders: 27,
          growth: 12,
          productsCount: 10,
        },
        {
          name: "Bánh kem",
          revenue: 15000000,
          averageOrderValue: 450000,
          totalOrders: 33,
          growth: 25,
          productsCount: 12,
        },
      ];

      // Get top products from existing method
      const topProductsData = await this.getTopProducts();
      const topProducts = topProductsData.slice(0, 10).map((product) => ({
        ...product,
        category: "Bánh ngọt", // Mock category
        revenue: product.totalRevenue,
        quantitySold: product.totalSold,
        growth: Math.floor(Math.random() * 30) + 5, // Mock growth
      }));

      return {
        categories,
        categoryPerformance,
        topProducts,
      };
    } catch (error) {
      console.error("Error fetching product performance:", error);
      throw error;
    }
  },

  // Geographic Performance Analytics
  async getGeographicPerformance() {
    try {
      const token = localStorage.getItem("access_token");
      const orderRes = await OrderService.getAllOrders(token);
      const orders = Array.isArray(orderRes.data) ? orderRes.data : [];

      // Mock geographic data - in real app, you'd analyze shippingAddress data
      const regions = [
        {
          name: "Hồ Chí Minh",
          revenue: 25000000,
          orders: 180,
          growth: 22,
          marketShare: 35,
        },
        {
          name: "Hà Nội",
          revenue: 18000000,
          orders: 125,
          growth: 15,
          marketShare: 25,
        },
        {
          name: "Đà Nẵng",
          revenue: 8000000,
          orders: 65,
          growth: 8,
          marketShare: 12,
        },
        {
          name: "Cần Thơ",
          revenue: 6000000,
          orders: 45,
          growth: -5,
          marketShare: 8,
        },
        {
          name: "Hải Phòng",
          revenue: 5000000,
          orders: 38,
          growth: 12,
          marketShare: 7,
        },
        {
          name: "Khác",
          revenue: 9000000,
          orders: 67,
          growth: 5,
          marketShare: 13,
        },
      ];

      const maxRevenue = Math.max(...regions.map((r) => r.revenue));

      const highGrowthAreas = regions.filter((r) => r.growth > 15);
      const decliningAreas = regions.filter((r) => r.growth < 0);

      const opportunities = [
        {
          name: "Vũng Tàu",
          potential: 85,
          reason: "Thị trường du lịch phát triển mạnh",
        },
        {
          name: "Nha Trang",
          potential: 75,
          reason: "Nhu cầu bánh ngọt cao từ khách sạn",
        },
        {
          name: "Phú Quốc",
          potential: 65,
          reason: "Khu vực nghỉ dưỡng mới nổi",
        },
      ];

      return {
        regions,
        maxRevenue,
        highGrowthAreas,
        decliningAreas,
        opportunities,
      };
    } catch (error) {
      console.error("Error fetching geographic performance:", error);
      throw error;
    }
  },
};
//         map[p._id] = p;
//         return map;
//       }, {});

//       return topProducts
//         .map(([id, qty]) => {
//           const product = productMap[id];
//           if (!product) return null;

//           const imageValue = Array.isArray(product.productImage)
//             ? product.productImage[0]
//             : product.productImage;

//           return {
//             id: product._id,
//             name: product.productName,
//             originalPrice: `${(
//               product.productPrice || 0
//             ).toLocaleString()} VND`,
//             currentPrice: `${(product.productPrice || 0).toLocaleString()} VND`,
//             discount: product.productDiscount
//               ? `-${product.productDiscount}%`
//               : "0%",
//             rating: 4.5 + Math.random() * 0.5, // Mock rating
//             image:
//               imageValue ||
//               "https://via.placeholder.com/120x120/fbbf24/ffffff?text=🍰",
//           };
//         })
//         .filter(Boolean);
//     } catch (error) {
//       console.error("Error fetching top products:", error);
//       throw error;
//     }
//   },
// };
