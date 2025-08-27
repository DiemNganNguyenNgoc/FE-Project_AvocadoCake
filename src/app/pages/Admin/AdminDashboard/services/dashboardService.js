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
      const [userRes, orderRes, productRes, categoryRes, statusRes] =
        await Promise.all([
          UserService.getAllUser(token),
          OrderService.getAllOrders(token),
          ProductService.getAllProduct(token),
          CategoryService.getAllCategory(),
          StatusService.getAllStatus(token),
        ]);

      const users = Array.isArray(userRes.data) ? userRes.data : [];
      const orders = Array.isArray(orderRes.data) ? orderRes.data : [];
      const products = Array.isArray(productRes.data) ? productRes.data : [];
      const categories = Array.isArray(categoryRes.data)
        ? categoryRes.data
        : [];
      const statuses = Array.isArray(statusRes.data) ? statusRes.data : [];

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

      // Tính toán đơn hàng mới trong tuần này
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newOrdersThisWeek = orders.filter(
        (order) => new Date(order.createdAt) >= oneWeekAgo
      ).length;

      // Tính toán khách hàng mới trong tuần này
      const newCustomersThisWeek = users.filter(
        (user) => new Date(user.createdAt) >= oneWeekAgo
      ).length;

      // Tính toán sản phẩm mới trong tuần này
      const newProductsThisWeek = products.filter(
        (product) => new Date(product.createdAt) >= oneWeekAgo
      ).length;

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
          newProducts: newProductsThisWeek,
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
          weekly: [
            { day: "Sun", revenue: 120, pipeline: 180 },
            { day: "Mon", revenue: 150, pipeline: 200 },
            { day: "Tue", revenue: 180, pipeline: 220 },
            { day: "Wed", revenue: 200, pipeline: 240 },
            { day: "Thu", revenue: 160, pipeline: 190 },
            { day: "Fri", revenue: 220, pipeline: 260 },
            { day: "Sat", revenue: 190, pipeline: 230 },
          ],
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
      const orderRes = await OrderService.getAllOrders(token);
      const orders = Array.isArray(orderRes.data) ? orderRes.data : [];

      // Lấy 5 đơn hàng gần nhất
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      return recentOrders.map((order) => ({
        id: order._id,
        product: {
          name:
            order.orderItems?.[0]?.product?.productName ||
            "Sản phẩm không xác định",
          variants: `${order.orderItems?.length || 0} sản phẩm`,
          image:
            order.orderItems?.[0]?.product?.productImage?.[0] ||
            "https://via.placeholder.com/40x40/8b5cf6/ffffff?text=SP",
        },
        category:
          order.orderItems?.[0]?.product?.productCategory?.categoryName ||
          "Không xác định",
        price: `${(order.totalPrice || 0).toLocaleString()} VND`,
        status: order.status?.statusName || "Không xác định",
      }));
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      throw error;
    }
  },

  // Lấy sản phẩm hàng đầu
  async getTopProducts() {
    try {
      const token = localStorage.getItem("access_token");
      const [orderRes, productRes] = await Promise.all([
        OrderService.getAllOrders(token),
        ProductService.getAllProduct(token),
      ]);

      const orders = Array.isArray(orderRes.data) ? orderRes.data : [];
      const products = Array.isArray(productRes.data) ? productRes.data : [];

      // Tính toán sản phẩm bán chạy
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
        .slice(0, 3);

      const productMap = products.reduce((map, p) => {
        map[p._id] = p;
        return map;
      }, {});

      return topProducts
        .map(([id, qty]) => {
          const product = productMap[id];
          if (!product) return null;

          return {
            id: product._id,
            name: product.productName,
            originalPrice: `${(
              product.productPrice || 0
            ).toLocaleString()} VND`,
            currentPrice: `${(product.productPrice || 0).toLocaleString()} VND`,
            discount: product.productDiscount
              ? `-${product.productDiscount}%`
              : "0%",
            rating: 4.5 + Math.random() * 0.5, // Mock rating
            image:
              product.productImage?.[0] ||
              "https://via.placeholder.com/120x120/fbbf24/ffffff?text=🍰",
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Error fetching top products:", error);
      throw error;
    }
  },
};
