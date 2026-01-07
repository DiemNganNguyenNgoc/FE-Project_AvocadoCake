import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProducts } from "../../api/services/productServices"; // Giả sử bạn có một dịch vụ để gọi API
import CardProduct from "../../components/CardProduct/CardProduct";

const SearchResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = new URLSearchParams(location.search).get("search"); // Lấy từ khóa tìm kiếm từ URL

  const handleDetail = (productId) => {
    const selectedProduct = products.find(
      (product) => product._id === productId
    );

    if (selectedProduct) {
      const {
        productName,
        productSize,
        productImage,
        productCategory,
        productDescription,
        productPrice,
      } = selectedProduct;
      navigate(`/view-product-detail/${productId}`, {
        state: {
          productId,
          productName,
          productSize,
          productImage,
          productDescription,
          productCategory,
          productPrice,
        },
      });
    } else {
      alert("Product not found!");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await searchProducts(query);
        // Đảm bảo `response.data` luôn là mảng
        const productList = Array.isArray(response.data) ? response.data : [];
        setProducts(productList);
      } catch (err) {
        setError("Đã có lỗi xảy ra khi tìm kiếm sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="container-xl">
      <div className="products-page">
        <h2>Kết quả tìm kiếm cho {query}</h2>
        <div className="container product__list">
          {products.length > 0 ? (
            products.map((product) => {
              const imageUrl = product.productImage.startsWith("http")
                ? product.productImage
                : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${product.productImage.replace(
                  "\\",
                  "/"
                )}`;
              console.log("Product ID in ProductsPage:", product._id);
              return (
                <CardProduct
                  key={product._id} // Dùng _id làm key cho mỗi sản phẩm
                  className="col productadmin__item"
                  type={"primary"}
                  img={imageUrl} // Sử dụng URL ảnh đã xử lý
                  title={product.productName} // Hiển thị tên sản phẩm
                  price={product.productPrice} // Hiển thị giá sản phẩm
                  id={product._id}
                  // discount={findPromoApplied(product._id)}
                  averageRating={product.averageRating}
                  size={product.productSize}
                  onCardClick={() => handleDetail(product._id, products)}
                />
              );
            })
          ) : (
            <p>Không có sản phẩm nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
