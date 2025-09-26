import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { DashboardService } from "../services/dashboardService";

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getTopProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching top products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    const raw = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (!raw) return "";

    const cleaned = String(raw).replace(/\\/g, "/").replace(/^\/+/, "");

    // Nếu đã là full URL (http/https) hoặc đã chứa domain Cloudinary thì dùng luôn
    if (
      /^https?:\/\//i.test(cleaned) ||
      cleaned.includes("res.cloudinary.com")
    ) {
      return cleaned;
    }

    // Nếu path đã bao gồm prefix 'image/upload/...'
    if (cleaned.startsWith("image/upload/")) {
      return `https://res.cloudinary.com/dlyl41lgq/${cleaned}`;
    }

    // Nếu path đã bắt đầu bằng version (v12345/..), gắn ngay sau image/upload/
    if (/^v\d+\//.test(cleaned)) {
      return `https://res.cloudinary.com/dlyl41lgq/image/upload/${cleaned}`;
    }

    // Mặc định: coi như là đường dẫn thư mục (ví dụ: products/xxx.jpg)
    return `https://res.cloudinary.com/dlyl41lgq/image/upload/${cleaned}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-48 bg-gray-50 rounded-xl p-4"
              >
                <div className="h-20 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-[2rem] font-semibold text-gray-900 leading-tight">
          Top Products
        </h3>
        <p className="text-[1.6rem] text-gray-600">Sản phẩm bán chạy</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu sản phẩm
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-48 bg-gray-50 rounded-xl p-4 relative"
            >
              {/* Discount badge */}
              {product.discount !== "0%" && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discount}
                </div>
              )}

              {/* Heart icon */}
              <button className="absolute top-2 right-2 text-red-500 hover:text-red-600">
                <Heart className="w-5 h-5" />
              </button>

              {/* Product image */}
              <div className="flex justify-center mb-3">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/LogoAvocado.png";
                  }}
                />
              </div>

              {/* Product info */}
              <div className="text-center">
                <h4 className="font-medium text-gray-900 text-sm mb-2">
                  {product.name}
                </h4>

                <div className="flex items-center justify-center gap-2 mb-2">
                  {product.discount !== "0%" && (
                    <span className="text-xs text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-gray-900">
                    {product.currentPrice}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-700">
                    {product.rating.toFixed(1)}
                  </span>
                </div>

                {/* Sales info from new API */}
                {product.totalSold && (
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Đã bán: {product.totalSold}</div>
                    <div>
                      Doanh thu: {(product.totalRevenue || 0).toLocaleString()}{" "}
                      VND
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProducts;
