import React, { useState, useEffect } from "react";
import { Package, TrendingUp, DollarSign, Star } from "lucide-react";
import { DashboardService } from "../services/dashboardService";

const ProductPerformance = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchProductData();
  }, [selectedCategory]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getProductPerformance(
        selectedCategory
      );
      setProductData(data);
    } catch (error) {
      console.error("Error fetching product data:", error);
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!productData) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Hiệu suất sản phẩm & ngành hàng
          </h3>
          <p className="text-gray-600 mt-1">
            Phân tích hiệu suất theo danh mục sản phẩm
          </p>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả danh mục</option>
          {productData.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {productData.categoryPerformance.map((category, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">{category.name}</h4>
              <Package className="w-5 h-5 text-blue-600" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(category.revenue)}
                </div>
                <div className="text-sm text-gray-600">Doanh thu</div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-800">
                    {formatCurrency(category.averageOrderValue)}
                  </div>
                  <div className="text-xs text-gray-600">AOV</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">
                    {category.totalOrders}
                  </div>
                  <div className="text-xs text-gray-600">Đơn hàng</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    +{category.growth}%
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {category.productsCount} sản phẩm
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performing Products */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Sản phẩm hiệu suất cao
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Sản phẩm
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Danh mục
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Doanh thu
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Đã bán
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Đánh giá
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Tăng trưởng
                </th>
              </tr>
            </thead>
            <tbody>
              {productData.topProducts.map((product, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image || "/LogoAvocado.png"}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/LogoAvocado.png";
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {product.category}
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {product.quantitySold}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-700">
                        {product.rating}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">
                        +{product.growth}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductPerformance;
