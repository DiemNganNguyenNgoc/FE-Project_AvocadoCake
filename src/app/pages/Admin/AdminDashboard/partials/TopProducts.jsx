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
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="animate-pulse">
          <div className="mb-6 h-6 w-1/4 rounded bg-gray-2 dark:bg-dark-3"></div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-48 flex-shrink-0 rounded-[10px] bg-gray-1 p-4 dark:bg-dark-2"
              >
                <div className="mb-3 h-20 rounded-lg bg-gray-2 dark:bg-dark-3"></div>
                <div className="mb-2 h-4 rounded bg-gray-2 dark:bg-dark-3"></div>
                <div className="mb-2 h-3 rounded bg-gray-2 dark:bg-dark-3"></div>
                <div className="h-3 rounded bg-gray-2 dark:bg-dark-3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-6 xl:px-7.5">
        <h2 className="font-medium text-dark dark:text-white text-body-2xlg">
          Sản phẩm bán chạy
        </h2>
        <p className="mt-1 text-body-sm text-dark-6 dark:text-dark-6">
          Top sản phẩm có doanh số cao nhất
        </p>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 xl:p-7.5 overflow-hidden">
        {products.length === 0 ? (
          <div className="py-8 text-center text-dark-6 dark:text-dark-6">
            Không có dữ liệu sản phẩm
          </div>
        ) : (
          <div
            className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 xl:-mx-7.5 xl:px-7.5"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 #f1f5f9",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="relative flex-shrink-0 w-48 min-w-[12rem] rounded-[10px] bg-gray-1 p-4 shadow-card transition-all hover:shadow-card-2 dark:bg-dark-2"
              >
                {/* Discount badge */}
                {product.discount !== "0%" && (
                  <div className="absolute left-2 top-2 rounded bg-red px-2 py-1 text-xs font-bold text-white">
                    {product.discount}
                  </div>
                )}

                {/* Heart icon */}
                <button className="absolute right-2 top-2 text-red transition-colors hover:text-red-dark">
                  <Heart className="h-5 w-5" />
                </button>

                {/* Product image */}
                <div className="mb-3 flex justify-center">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="h-20 w-20 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/LogoAvocado.png";
                    }}
                  />
                </div>

                {/* Product info */}
                <div className="text-center">
                  <h4 className="mb-2 text-sm font-medium text-dark dark:text-white">
                    {product.name}
                  </h4>

                  <div className="mb-2 flex items-center justify-center gap-2">
                    {product.discount !== "0%" && (
                      <span className="text-xs text-dark-5 line-through dark:text-dark-5">
                        {product.originalPrice}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-dark dark:text-white">
                      {product.currentPrice}
                    </span>
                  </div>

                  <div className="mb-1 flex items-center justify-center gap-1">
                    <span className="text-yellow-dark">★</span>
                    <span className="text-sm text-dark-4 dark:text-dark-6">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Sales info from new API */}
                  {product.totalSold && (
                    <div className="space-y-1 text-body-xs text-dark-5 dark:text-dark-5">
                      <div>Đã bán: {product.totalSold}</div>
                      <div>
                        Doanh thu:{" "}
                        {(product.totalRevenue || 0).toLocaleString()} ₫
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
