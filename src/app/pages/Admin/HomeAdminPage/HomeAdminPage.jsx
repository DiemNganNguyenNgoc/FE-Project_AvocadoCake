import React, { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import * as UserService from "../../../services/UserService";
import * as OrderService from "../../../services/OrderService";
import * as ProductService from "../../../services/productServices";
import * as CategoryService from "../../../services/CategoryService";
import * as StatusService from "../../../services/StatusService";
import styles from "./HomeAdminPage.module.css";

// Import chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const HomeAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const [userRes, orderRes, productRes, categoryRes, statusRes] =
          await Promise.all([
            UserService.getAllUser(token),
            OrderService.getAllOrders(token),
            ProductService.getAllProduct(token),
            CategoryService.getAllCategory(),
            StatusService.getAllStatus(token),
          ]);
        setUsers(Array.isArray(userRes.data) ? userRes.data : []);
        setOrders(Array.isArray(orderRes.data) ? orderRes.data : []);
        setProducts(Array.isArray(productRes.data) ? productRes.data : []);
        setCategories(Array.isArray(categoryRes.data) ? categoryRes.data : []);
        setStatuses(Array.isArray(statusRes.data) ? statusRes.data : []);
      } catch (err) {
        setUsers([]);
        setOrders([]);
        setProducts([]);
        setCategories([]);
        setStatuses([]);
      }
    };
    fetchData();
  }, []);

  // Tổng số liệu
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalCoinsUsed = orders.reduce((sum, o) => sum + (o.coinsUsed || 0), 0);
  const totalProductsSold = orders.reduce(
    (sum, o) =>
      sum +
      (Array.isArray(o.orderItems)
        ? o.orderItems.reduce((s, i) => s + (i.quantity || 0), 0)
        : 0),
    0
  );

  // Biểu đồ kết hợp: Doanh thu và Sản phẩm bán theo tháng
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
      const total = order.orderItems.reduce((s, i) => s + (i.quantity || 0), 0);
      productsSoldByMonth[month] += total;
    }
  });

  const comboChartData = {
    labels: months,
    datasets: [
      {
        type: "bar",
        label: "Sản phẩm bán",
        data: productsSoldByMonth,
        backgroundColor: "rgba(108, 99, 255, 0.7)",
        yAxisID: "y1",
      },
      {
        type: "line",
        label: "Doanh thu (VND)",
        data: revenueByMonth,
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        yAxisID: "y2",
      },
    ],
  };

  const comboChartOptions = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y1: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Số lượng sản phẩm" },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        title: { display: true, text: "Doanh thu (VND)" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  // Biểu đồ tròn: Tỷ lệ sản phẩm bán theo loại (FIXED)
  const categoryNameMap = categories.reduce((map, cat) => {
    map[cat._id] = cat.categoryName;
    return map;
  }, {});
  const productToCategoryMap = products.reduce((map, p) => {
    map[p._id] = p.productCategory;
    return map;
  }, {});

  const salesByCategory = {};
  orders.forEach((order) => {
    if (Array.isArray(order.orderItems)) {
      order.orderItems.forEach((item) => {
        const productId = item.product?._id || item.product;
        const categoryId = productToCategoryMap[productId];
        const categoryName = categoryNameMap[categoryId] || "Khác";
        salesByCategory[categoryName] =
          (salesByCategory[categoryName] || 0) + (item.quantity || 0);
      });
    }
  });

  const pieLabels = Object.keys(salesByCategory).filter(
    (cat) => salesByCategory[cat] > 0
  );
  const pieValues = pieLabels.map((cat) => salesByCategory[cat]);
  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieValues,
        backgroundColor: [
          "#6c63ff",
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
          "#c9cbcf",
          "#e7e9ed",
          "#77dd77",
        ],
      },
    ],
  };

  // 1. User Registrations per Month (Line Chart)
  const usersByMonth = Array(12).fill(0);
  users.forEach((user) => {
    const month = new Date(user.createdAt).getMonth();
    usersByMonth[month]++;
  });
  const userLineChartData = {
    labels: months,
    datasets: [
      {
        label: "Người dùng mới",
        data: usersByMonth,
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  // 2. Order Status Distribution (Doughnut Chart) - FIXED
  const statusNameMap = statuses.reduce((map, s) => {
    map[s._id] = s.statusName;
    return map;
  }, {});
  const ordersByStatus = {};
  orders.forEach((order) => {
    let statusName;
    // Handle both populated object and plain ID for status
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
  const doughnutChartData = {
    labels: Object.keys(ordersByStatus),
    datasets: [
      {
        data: Object.values(ordersByStatus),
        backgroundColor: [
          "#ffcd56",
          "#ff6384",
          "#36a2eb",
          "#4bc0c0",
          "#9966ff",
        ],
      },
    ],
  };

  // 3. Top 5 Best-Selling Products (Horizontal Bar Chart)
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
  const topProductsChartData = {
    labels: topProducts.map(([id]) => productNameMap[id] || "Sản phẩm đã xóa"),
    datasets: [
      {
        label: "Số lượng bán",
        data: topProducts.map(([, qty]) => qty),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container-xl">
      <h2 style={{ color: "#3a060e" }}>Thống kê tổng quan</h2>
      <div className={styles.cardContainer}>
        <div className={styles.statCard}>
          <h3>Người dùng</h3>
          <p>{totalUsers}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Sản phẩm đã bán</h3>
          <p>{totalProductsSold}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Đơn hàng</h3>
          <p>{totalOrders}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Tổng doanh thu</h3>
          <p>{totalRevenue.toLocaleString()} VND</p>
        </div>
        <div className={styles.statCard}>
          <h3>Tổng xu đã dùng</h3>
          <p>{totalCoinsUsed.toLocaleString()}</p>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.chartBox}>
          <h4>Doanh thu và sản phẩm bán theo tháng</h4>
          <Bar data={comboChartData} options={comboChartOptions} />
        </div>
        <div className={styles.chartBox}>
          <h4>Tỷ lệ sản phẩm bán theo loại</h4>
          <Pie data={pieData} />
        </div>
        <div className={styles.chartBox}>
          <h4>Top 5 sản phẩm bán chạy</h4>
          <Bar data={topProductsChartData} options={{ indexAxis: "y" }} />
        </div>
        <div className={styles.chartBox}>
          <h4>Tăng trưởng người dùng</h4>
          <Line data={userLineChartData} />
        </div>
        <div className={styles.chartBox}>
          <h4>Phân bổ trạng thái đơn hàng</h4>
          <Doughnut data={doughnutChartData} />
        </div>
      </div>
    </div>
  );
};

export default HomeAdminPage;
