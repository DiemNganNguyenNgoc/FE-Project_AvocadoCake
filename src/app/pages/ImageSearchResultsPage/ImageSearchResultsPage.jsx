import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardProduct from "../../components/CardProduct/CardProduct";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

const ImageSearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state && location.state.results) {
      setResults(location.state.results);
      setIsLoading(false);
    } else {
      // No results, redirect to products page
      navigate("/products");
    }
  }, [location.state, navigate]);

  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  const handleBackToProducts = () => {
    navigate("/products");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#b1e321] rounded-full animate-spin"></div>
        <p className="text-gray-600">Đang tải kết quả...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 py-10 min-h-[80vh]">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#3a060e] mb-3">
          🔍 Kết quả tìm kiếm bằng hình ảnh
        </h2>
        <p className="text-lg text-gray-600">
          Tìm thấy{" "}
          <strong className="text-[#b1e321] font-semibold">
            {results.length}
          </strong>{" "}
          sản phẩm tương tự
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 px-5 bg-gray-50 rounded-xl my-10">
          <div className="text-6xl md:text-7xl mb-5">📷</div>
          <h3 className="text-2xl font-semibold text-[#3a060e] mb-3">
            Không tìm thấy sản phẩm tương tự
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            Vui lòng thử với ảnh khác hoặc điều chỉnh tiêu chí tìm kiếm
          </p>
          <ButtonComponent onClick={handleBackToProducts}>
            Xem tất cả sản phẩm
          </ButtonComponent>
        </div>
      ) : (
        <>
          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-10">
            {results.map((result, index) => {
              const product = result.product;
              return (
                <div
                  key={index}
                  className="relative transition-transform duration-300 hover:-translate-y-2"
                >
                  {/* Similarity Badge */}
                  <div className="absolute top-2 right-2 z-10 bg-gradient-to-br from-[#b1e321] to-[#8bc34a] text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-[#b1e321]/30">
                    <span className="text-base">✨</span>
                    <span>
                      {(result.similarity_score * 100).toFixed(0)}% tương tự
                    </span>
                  </div>

                  <CardProduct
                    id={product.id || product._id}
                    img={product.productImage}
                    title={product.productName}
                    price={product.productPrice || 0}
                    size={product.productSize}
                    discount={product.discount || 0}
                    averageRating={product.averageRating || 5.0}
                    totalRatings={product.totalRatings || 0}
                    onCardClick={() =>
                      handleProductClick(product.id || product._id)
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex justify-center py-5">
            <ButtonComponent onClick={handleBackToProducts}>
              Xem thêm sản phẩm khác
            </ButtonComponent>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSearchResultsPage;
