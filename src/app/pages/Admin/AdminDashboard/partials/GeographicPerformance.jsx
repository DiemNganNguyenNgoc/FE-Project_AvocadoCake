import React, { useState, useEffect } from "react";
import { MapPin, TrendingUp, TrendingDown, Target } from "lucide-react";
import { DashboardService } from "../services/dashboardService";

const GeographicPerformance = () => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("growth"); // 'growth' or 'revenue'

  useEffect(() => {
    fetchGeographicData();
  }, []);

  const fetchGeographicData = async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getGeographicPerformance();
      setGeoData(data);
    } catch (error) {
      console.error("Error fetching geographic data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getGrowthColor = (growth) => {
    if (growth > 10) return "text-green-600 bg-green-100";
    if (growth > 0) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getHeatmapIntensity = (value, max) => {
    const intensity = (value / max) * 100;
    if (intensity > 80) return "bg-green-600";
    if (intensity > 60) return "bg-green-500";
    if (intensity > 40) return "bg-green-400";
    if (intensity > 20) return "bg-green-300";
    return "bg-green-200";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!geoData) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Hiệu suất theo địa lý
          </h3>
          <p className="text-gray-600 mt-1">
            Phân tích tăng trưởng theo khu vực
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("growth")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "growth"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Tăng trưởng
          </button>
          <button
            onClick={() => setViewMode("revenue")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "revenue"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Doanh thu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Hiệu suất theo tỉnh/thành
          </h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {geoData.regions.map((region, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-800">
                      {region.name}
                    </span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getGrowthColor(
                      region.growth
                    )}`}
                  >
                    {region.growth > 0 ? "+" : ""}
                    {region.growth.toFixed(1)}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(region.revenue)}
                    </div>
                    <div className="text-sm text-gray-600">Doanh thu</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {region.orders}
                    </div>
                    <div className="text-sm text-gray-600">Đơn hàng</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Market Share</span>
                    <span>{region.marketShare}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={getHeatmapIntensity(
                        region.revenue,
                        geoData.maxRevenue
                      )}
                      style={{ width: `${region.marketShare}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Opportunities */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Cơ hội tăng trưởng
          </h4>

          {/* High Growth Areas */}
          <div className="mb-6">
            <h5 className="font-medium text-green-700 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Khu vực tăng trưởng cao
            </h5>
            <div className="space-y-2">
              {geoData.highGrowthAreas.map((area, index) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-200 rounded-lg p-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">
                      {area.name}
                    </span>
                    <span className="text-green-600 font-semibold">
                      +{area.growth}%
                    </span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {formatCurrency(area.revenue)} • {area.orders} đơn hàng
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Declining Areas */}
          <div className="mb-6">
            <h5 className="font-medium text-red-700 mb-3 flex items-center">
              <TrendingDown className="w-4 h-4 mr-2" />
              Khu vực cần chú ý
            </h5>
            <div className="space-y-2">
              {geoData.decliningAreas.map((area, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-red-800">
                      {area.name}
                    </span>
                    <span className="text-red-600 font-semibold">
                      {area.growth}%
                    </span>
                  </div>
                  <div className="text-sm text-red-600 mt-1">
                    {formatCurrency(area.revenue)} • {area.orders} đơn hàng
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Opportunities */}
          <div>
            <h5 className="font-medium text-blue-700 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Cơ hội đầu tư
            </h5>
            <div className="space-y-2">
              {geoData.opportunities.map((opportunity, index) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-800">
                      {opportunity.name}
                    </span>
                    <span className="text-blue-600 font-semibold">
                      Tiềm năng: {opportunity.potential}%
                    </span>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    {opportunity.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicPerformance;
