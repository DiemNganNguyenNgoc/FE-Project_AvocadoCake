import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, Minus, Eye, EyeOff } from "lucide-react";
import { DashboardService } from "../services/dashboardService";

const AdvancedTopProductsChart = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("totalSold");
  const [visibleProducts, setVisibleProducts] = useState(new Set());
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [timeRange, setTimeRange] = useState("6months");
  const svgRef = useRef(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getTopProducts();
        const topProducts = data.slice(0, 10);
        setProducts(topProducts);
        // Mặc định hiển thị tất cả sản phẩm
        setVisibleProducts(new Set(topProducts.map((p) => p.id)));
      } catch (error) {
        console.error("Error fetching top products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const generateAdvancedTrendData = (baseValue, productIndex, range) => {
    const dataPoints = range === "6months" ? 6 : range === "12months" ? 12 : 30;
    const labels = [];

    if (range === "6months") {
      labels.push("Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    } else if (range === "12months") {
      labels.push(
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      );
    } else {
      for (let i = 1; i <= 30; i++) {
        labels.push(`D${i}`);
      }
    }

    const trend = [];
    let currentValue = baseValue * 0.6; // Bắt đầu từ 60% giá trị hiện tại

    for (let i = 0; i < dataPoints; i++) {
      // Tạo xu hướng tăng trưởng tự nhiên với noise
      const growthRate = 1 + (0.05 + Math.random() * 0.1) * (i / dataPoints); // Tăng trưởng từ từ
      const noise = 0.8 + Math.random() * 0.4; // Random noise 80%-120%
      currentValue = currentValue * growthRate * noise;

      trend.push({
        label: labels[i],
        value: Math.floor(currentValue),
        index: i,
      });
    }

    return trend;
  };

  const getMetricValue = (product, metric) => {
    switch (metric) {
      case "totalSold":
        return product.totalSold || 0;
      case "totalRevenue":
        return Math.floor((product.totalRevenue || 0) / 1000);
      case "orderCount":
        return product.orderCount || 0;
      default:
        return 0;
    }
  };

  const getMetricLabel = (metric) => {
    switch (metric) {
      case "totalSold":
        return "Số lượng bán";
      case "totalRevenue":
        return "Doanh thu (K VND)";
      case "orderCount":
        return "Số đơn hàng";
      default:
        return "";
    }
  };

  const chartData = products.map((product, index) => ({
    ...product,
    trendData: generateAdvancedTrendData(
      getMetricValue(product, selectedMetric),
      index,
      timeRange
    ),
    currentValue: getMetricValue(product, selectedMetric),
    color: [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#f97316",
      "#06b6d4",
      "#84cc16",
      "#ec4899",
      "#6366f1",
    ][index % 10],
  }));

  const visibleChartData = chartData.filter((product) =>
    visibleProducts.has(product.id)
  );
  const maxValue = Math.max(
    1,
    ...visibleChartData.flatMap((product) =>
      product.trendData.map((point) => point.value)
    )
  );

  const toggleProductVisibility = (productId) => {
    const newVisible = new Set(visibleProducts);
    if (newVisible.has(productId)) {
      newVisible.delete(productId);
    } else {
      newVisible.add(productId);
    }
    setVisibleProducts(newVisible);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-[2rem] font-semibold text-gray-900 leading-tight">
            Advanced Product Analytics
          </h3>
          <p className="text-[1.6rem] text-gray-600">
            Biểu đồ xu hướng chi tiết sản phẩm bán chạy
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Thời gian:
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="6months">6 tháng</option>
              <option value="12months">12 tháng</option>
              <option value="30days">30 ngày</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Chỉ số:</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="totalSold">Số lượng bán</option>
              <option value="totalRevenue">Doanh thu</option>
              <option value="orderCount">Số đơn hàng</option>
            </select>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu sản phẩm
        </div>
      ) : (
        <div className="space-y-6">
          {/* Chart */}
          <div className="relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
            <div
              className="w-full"
              style={{ height: "auto", aspectRatio: "9/4" }}
            >
              <svg
                ref={svgRef}
                className="w-full h-auto"
                viewBox="0 0 900 400"
                preserveAspectRatio="none"
              >
                {/* Background grid */}
                <defs>
                  <pattern
                    id="grid"
                    width="60"
                    height="30"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 60 0 L 0 0 0 30"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect height="400" width="auto" fill="url(#grid)" />

                {/* Y-axis labels */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <text
                    key={i}
                    x="10"
                    y={360 - i * 60}
                    className="text-xs fill-gray-500"
                    textAnchor="start"
                  >
                    {Math.round((maxValue / 5) * i).toLocaleString()}
                  </text>
                ))}

                {/* Chart area */}
                <g transform="translate(60, 20)">
                  {/* Chart lines */}
                  {visibleChartData.map((product, productIndex) => {
                    const points = product.trendData
                      .map((point, i) => {
                        const x = (i / (product.trendData.length - 1)) * 780;
                        const y = 320 - (point.value / maxValue) * 300;
                        return `${x},${y}`;
                      })
                      .join(" ");

                    const isHovered = hoveredProduct === product.id;

                    return (
                      <g key={product.id}>
                        {/* Area fill */}
                        <path
                          d={`M ${points.split(" ")[0]} 320 L ${points} L ${
                            points.split(" ").slice(-1)[0].split(",")[0]
                          },320 Z`}
                          fill={product.color}
                          fillOpacity={isHovered ? "0.3" : "0.1"}
                          className="transition-all duration-300"
                        />

                        {/* Line */}
                        <polyline
                          points={points}
                          fill="none"
                          stroke={product.color}
                          strokeWidth={isHovered ? "4" : "3"}
                          className="transition-all duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredProduct(product.id)}
                          onMouseLeave={() => setHoveredProduct(null)}
                        />

                        {/* Points */}
                        {product.trendData.map((point, i) => {
                          const x = (i / (product.trendData.length - 1)) * 780;
                          const y = 320 - (point.value / maxValue) * 300;
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r={isHovered ? "6" : "4"}
                              fill={product.color}
                              className="transition-all duration-200 cursor-pointer"
                              onMouseEnter={() => setHoveredProduct(product.id)}
                            >
                              <title>
                                {product.name}: {point.value.toLocaleString()}{" "}
                                {getMetricLabel(selectedMetric)} ({point.label})
                              </title>
                            </circle>
                          );
                        })}
                      </g>
                    );
                  })}

                  {/* X-axis labels */}
                  {chartData[0]?.trendData?.map((point, i) => (
                    <text
                      key={i}
                      x={(i / (chartData[0].trendData.length - 1)) * 780}
                      y="340"
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {point.label}
                    </text>
                  ))}
                </g>
              </svg>
            </div>
          </div>

          {/* Legend with toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {chartData.map((product, index) => {
              const isVisible = visibleProducts.has(product.id);
              const firstValue = product.trendData[0]?.value || 0;
              const lastValue =
                product.trendData[product.trendData.length - 1]?.value || 0;
              const trendPercent =
                firstValue > 0
                  ? ((lastValue - firstValue) / firstValue) * 100
                  : 0;

              return (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isVisible
                      ? "bg-white border-gray-200 shadow-sm"
                      : "bg-gray-50 border-gray-100 opacity-50"
                  } ${
                    hoveredProduct === product.id
                      ? "ring-2 ring-blue-500 ring-opacity-50"
                      : ""
                  }`}
                  onClick={() => toggleProductVisibility(product.id)}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: product.color }}
                    ></div>
                    {isVisible ? (
                      <Eye className="w-4 h-4 text-gray-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {product.currentValue.toLocaleString()}{" "}
                      {getMetricLabel(selectedMetric).toLowerCase()}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {trendPercent > 5 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : trendPercent < -5 ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <Minus className="w-3 h-3 text-gray-400" />
                      )}
                      <span
                        className={`${
                          trendPercent > 5
                            ? "text-green-600"
                            : trendPercent < -5
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {trendPercent > 0 ? "+" : ""}
                        {trendPercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {visibleChartData
                  .reduce((sum, p) => sum + p.currentValue, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">
                Tổng {getMetricLabel(selectedMetric).toLowerCase()}
              </div>
            </div>
            <div className="text-center bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {visibleChartData.length > 0
                  ? Math.round(
                      visibleChartData.reduce(
                        (sum, p) => sum + p.currentValue,
                        0
                      ) / visibleChartData.length
                    ).toLocaleString()
                  : 0}
              </div>
              <div className="text-sm text-green-700">Trung bình</div>
            </div>
            <div className="text-center bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {visibleChartData.length}
              </div>
              <div className="text-sm text-purple-700">Đang hiển thị</div>
            </div>
            <div className="text-center bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {products.length}
              </div>
              <div className="text-sm text-orange-700">Tổng sản phẩm</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedTopProductsChart;
