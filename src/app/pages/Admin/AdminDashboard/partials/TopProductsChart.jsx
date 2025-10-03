import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { DashboardService } from "../services/dashboardService";

const TopProductsChart = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("totalSold");

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getTopProducts();
        setProducts(data.slice(0, 8)); // Lấy top 8 sản phẩm để chart không quá dày
      } catch (error) {
        console.error("Error fetching top products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  // Tạo dữ liệu mock cho trend (thực tế nên lấy từ API historical data)
  const generateTrendData = (baseValue, productIndex) => {
    const trend = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    for (let i = 0; i < 6; i++) {
      // Tạo dữ liệu trend dựa trên baseValue với một chút random
      const variation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
      const monthlyValue = Math.floor(baseValue * variation * (0.5 + i * 0.1));
      trend.push({
        month: months[i],
        value: monthlyValue,
      });
    }
    return trend;
  };

  const getMetricValue = (product, metric) => {
    switch (metric) {
      case "totalSold":
        return product.totalSold || 0;
      case "totalRevenue":
        return Math.floor((product.totalRevenue || 0) / 1000); // Chia 1000 để số không quá lớn
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

  const maxValue = Math.max(
    1,
    ...products.map((product) => getMetricValue(product, selectedMetric))
  );

  const chartData = products.map((product, index) => ({
    ...product,
    trendData: generateTrendData(
      getMetricValue(product, selectedMetric),
      index
    ),
    currentValue: getMetricValue(product, selectedMetric),
  }));

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[2rem] font-semibold text-gray-900 leading-tight">
            Top Products Ranking
          </h3>
          <p className="text-[1.6rem] text-gray-600">
            Bảng xếp hạng sản phẩm bán chạy với xu hướng
          </p>
        </div>

        {/* Metric Selector */}
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

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu sản phẩm
        </div>
      ) : (
        <div className="space-y-6">
          {/* Horizontal Bar Chart */}
          <div className="relative">
            <div className="space-y-4 border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white">
              {chartData.map((product, productIndex) => {
                const color = [
                  "#3b82f6",
                  "#ef4444",
                  "#10b981",
                  "#f59e0b",
                  "#8b5cf6",
                  "#f97316",
                  "#06b6d4",
                  "#84cc16",
                ][productIndex % 8];

                const percentage = (product.currentValue / maxValue) * 100;

                // Tính trend
                const firstValue = product.trendData[0]?.value || 0;
                const lastValue =
                  product.trendData[product.trendData.length - 1]?.value || 0;
                const trendPercent =
                  firstValue > 0
                    ? ((lastValue - firstValue) / firstValue) * 100
                    : 0;

                return (
                  <div key={product.id} className="group">
                    {/* Product Info Row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: color }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            Rank #{productIndex + 1}
                          </div>
                        </div>
                      </div>

                      {/* Value and Trend */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {product.currentValue.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {getMetricLabel(selectedMetric).toLowerCase()}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {trendPercent > 5 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : trendPercent < -5 ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : (
                            <Minus className="w-4 h-4 text-gray-400" />
                          )}
                          <span
                            className={`text-xs font-medium ${
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

                    {/* Horizontal Bar */}
                    <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300"></div>

                      {/* Progress bar with animation */}
                      <div
                        className="h-full rounded-full relative transition-all duration-1000 ease-out group-hover:shadow-md"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}bb 100%)`,
                        }}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-transparent rounded-full"></div>

                        {/* Animated pulse on hover */}
                        <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Percentage label inside bar */}
                      {percentage > 15 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-xs font-medium">
                          {percentage.toFixed(1)}%
                        </div>
                      )}

                      {/* Percentage label outside bar for small values */}
                      {percentage <= 15 && (
                        <div
                          className="absolute top-1/2 transform -translate-y-1/2 text-gray-700 text-xs font-medium"
                          style={{ left: `${percentage + 2}%` }}
                        >
                          {percentage.toFixed(1)}%
                        </div>
                      )}
                    </div>

                    {/* Mini trend sparkline */}
                    <div className="mt-2 h-6">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 120 20"
                        preserveAspectRatio="none"
                      >
                        {/* Trend line */}
                        <polyline
                          points={product.trendData
                            .map((point, i) => {
                              const x =
                                (i / (product.trendData.length - 1)) * 120;
                              const maxTrendValue = Math.max(
                                ...product.trendData.map((p) => p.value)
                              );
                              const y = 20 - (point.value / maxTrendValue) * 18;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          opacity="0.6"
                          className="transition-opacity duration-200 group-hover:opacity-100"
                        />

                        {/* Trend points */}
                        {product.trendData.map((point, i) => {
                          const x = (i / (product.trendData.length - 1)) * 120;
                          const maxTrendValue = Math.max(
                            ...product.trendData.map((p) => p.value)
                          );
                          const y = 20 - (point.value / maxTrendValue) * 18;
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="1.5"
                              fill={color}
                              opacity="0.8"
                              className="transition-all duration-200 group-hover:r-2 group-hover:opacity-100"
                            >
                              <title>
                                {point.month}: {point.value}
                              </title>
                            </circle>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Top Performer */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h4 className="text-sm font-semibold text-green-800">
                  Top Performer
                </h4>
              </div>
              {chartData[0] && (
                <div>
                  <div className="text-lg font-bold text-green-900">
                    {chartData[0].name}
                  </div>
                  <div className="text-sm text-green-700">
                    {chartData[0].currentValue.toLocaleString()}{" "}
                    {getMetricLabel(selectedMetric).toLowerCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Fastest Growing */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-blue-800">
                  Fastest Growing
                </h4>
              </div>
              {(() => {
                const fastestGrowing = chartData.reduce((best, current) => {
                  const currentTrend = current.trendData[0]?.value || 0;
                  const currentLast =
                    current.trendData[current.trendData.length - 1]?.value || 0;
                  const currentGrowth =
                    currentTrend > 0
                      ? ((currentLast - currentTrend) / currentTrend) * 100
                      : 0;

                  const bestTrend = best.trendData[0]?.value || 0;
                  const bestLast =
                    best.trendData[best.trendData.length - 1]?.value || 0;
                  const bestGrowth =
                    bestTrend > 0
                      ? ((bestLast - bestTrend) / bestTrend) * 100
                      : 0;

                  return currentGrowth > bestGrowth ? current : best;
                }, chartData[0]);

                const growth = fastestGrowing?.trendData[0]?.value || 0;
                const latest =
                  fastestGrowing?.trendData[fastestGrowing.trendData.length - 1]
                    ?.value || 0;
                const growthPercent =
                  growth > 0 ? ((latest - growth) / growth) * 100 : 0;

                return (
                  <div>
                    <div className="text-lg font-bold text-blue-900">
                      {fastestGrowing?.name}
                    </div>
                    <div className="text-sm text-blue-700">
                      +{growthPercent.toFixed(1)}% growth
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Market Share Leader */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <h4 className="text-sm font-semibold text-purple-800">
                  Market Share
                </h4>
              </div>
              {chartData[0] && (
                <div>
                  <div className="text-lg font-bold text-purple-900">
                    {(
                      (chartData[0].currentValue /
                        products.reduce(
                          (sum, p) => sum + getMetricValue(p, selectedMetric),
                          0
                        )) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm text-purple-700">
                    of total {getMetricLabel(selectedMetric).toLowerCase()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {products
                  .reduce(
                    (sum, p) => sum + getMetricValue(p, selectedMetric),
                    0
                  )
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Tổng {getMetricLabel(selectedMetric).toLowerCase()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(
                  products.reduce(
                    (sum, p) => sum + getMetricValue(p, selectedMetric),
                    0
                  ) / products.length
                ).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Trung bình</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {products.length}
              </div>
              <div className="text-sm text-gray-600">Sản phẩm top</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopProductsChart;
