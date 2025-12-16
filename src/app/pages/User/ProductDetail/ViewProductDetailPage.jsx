import { React, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ViewProductDetailPage.css";
import SizeComponent from "../../../components/SizeComponent/SizeComponent";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import img1 from "../../../assets/img/hero_2.jpg";
import QuantityBtn from "../../../components/QuantityBtn/QuantityBtn";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/slides/cartSlide";
import RecommendationCarouselComponent from "../../../components/RecommendationCarouselComponent/RecommendationCarouselComponent";
import {
  getRecommendations,
  getDetailsproduct,
  getProductsByCategory,
} from "../../../api/services/productServices";
import RatingStar from "../../../components/RatingStar/RatingStar";
import { getProductRatings } from "../../../api/services/OrderService";
import { Card, ListGroup } from "react-bootstrap";
import { getAllCategory } from "../../../api/services/CategoryService";

const ViewProductDetailPage = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  console.log("userrr", user.id);

  const { state: productData } = useLocation(); // Nhận dữ liệu từ `state`
  const dispatch = useDispatch();

  console.log("Product Data from location:", productData); // Thêm log này

  const [product, setProduct] = useState(
    productData || {
      productName: "",
      productPrice: "",
      productSize: "",
      productCategory: "",
      productImage: null,
      productDescription: "",
      averageRating: 0,
      totalRatings: 0,
      discount: "",
    }
  );

  useEffect(() => {
    if (productData) {
      setProduct(productData);
      window.scrollTo(0, 0);
    }
  }, [productData]);

  // Thêm useEffect để log khi product thay đổi
  useEffect(() => {
    console.log("Product state changed:", product);
  }, [product]);

  const [imagePreview, setImagePreview] = useState(
    product.productImage || null
  );

  //Lay danh sach Category
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategory();
        // data chính là res.data bạn return trong service

        if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.error("Categories data is not in expected format");
        }
      } catch (error) {
        console.error(error.message || "Lỗi khi lấy danh mục");
      }
    };

    fetchCategories();
  }, []);

  // Lấy sản phẩm cùng category
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const userId = user?.id || null;
        let recommendedProducts = [];

        if (userId) {
          const response = await getRecommendations(userId, product.productId);

          const recommendations = response.data || [];

          if (Array.isArray(recommendations) && recommendations.length > 0) {
            const fetched = await Promise.all(
              recommendations.map(async (id) => {
                const res = await getDetailsproduct(id);
                return res.data;
              })
            );
            recommendedProducts = fetched.filter(Boolean);
          }
        }

        // 👉 Fallback dùng service
        if (recommendedProducts.length === 0 && product.productCategory) {
          const data = await getProductsByCategory(
            product.productCategory,
            0,
            8
          );

          recommendedProducts = Array.isArray(data.data)
            ? data.data.filter((p) => p._id !== product.productId)
            : [];
        }

        setRelatedProducts(recommendedProducts);
      } catch (error) {
        console.error(error.message || "Lỗi khi lấy khuyến nghị hoặc fallback");
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (product.productId) {
      fetchRecommendations();
    }
  }, [product.productId, user]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    const {
      productId,
      productName,
      productPrice,
      productImage,
      productSize,
      productCategory,
    } = product;
    console.log("PRODUCT", product);
    // Dispatch action để thêm vào giỏ hàng
    dispatch(
      addToCart({
        id: productId,
        img: productImage,
        title: productName,
        price: productPrice,
        size: productSize,
        category: productCategory,
      })
    );
    console.log("PRODUCT", productPrice);
  };

  // useEffect(() => {
  //   const fetchRecommendations = async () => {
  //     setIsLoading(true);
  //     try {
  //       const userId = user.id || "guest";
  //       console.log("USER ID", userId);
  //       console.log("PRODUCT ID:", product.productId);
  //       const response = await getRecommendations(userId, product.productId);
  //       console.log("Recommendations response:", response);
  //       const recommendations = response.data || [];

  //       if (!Array.isArray(recommendations)) {
  //         throw new Error("Recommendations is not an array");
  //       }
  //       const recommendedProducts = await Promise.all(
  //         recommendations.map(async (id) => {
  //           const res = await getDetailsproduct(id);
  //           console.log("Product detail:", res.data);
  //           return res.data;
  //         })
  //       );
  //       setRelatedProducts(recommendedProducts.filter(Boolean));
  //     } catch (error) {
  //       console.error("Lỗi khi lấy khuyến nghị:", error);
  //       setRelatedProducts([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (product.productId && user) {
  //     fetchRecommendations();
  //   }
  // }, [product.productId, user]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const userId = user?.id || null;
        console.log("USER ID", userId);
        console.log("PRODUCT ID:", product.productId);

        let recommendedProducts = [];

        if (userId) {
          const response = await getRecommendations(userId, product.productId);

          const recommendations = response.data || [];

          if (Array.isArray(recommendations) && recommendations.length > 0) {
            const fetched = await Promise.all(
              recommendations.map(async (id) => {
                const res = await getDetailsproduct(id);
                return res.data;
              })
            );
            recommendedProducts = fetched.filter(Boolean);
          }
        }

        // 👉 Fallback: dùng service, KHÔNG dùng fetch
        if (recommendedProducts.length === 0 && product.productCategory) {
          console.log("Fallback to category recommendations");

          const data = await getProductsByCategory(
            product.productCategory,
            0,
            8
          );

          recommendedProducts = Array.isArray(data.data)
            ? data.data.filter((p) => p._id !== product.productId)
            : [];
        }

        setRelatedProducts(recommendedProducts);
      } catch (error) {
        console.error(error.message || "Lỗi khi lấy khuyến nghị hoặc fallback");
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (product.productId) {
      fetchRecommendations();
    }
  }, [product.productId, user]);

  const [ratings, setRatings] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(false);

  // Fetch ratings when product changes
  useEffect(() => {
    const fetchRatings = async () => {
      if (product.productId) {
        try {
          setLoadingRatings(true);
          const response = await getProductRatings(product.productId);
          if (response.status === "OK") {
            setRatings(response.data);
          }
        } catch (error) {
          console.error("Error fetching ratings:", error);
        } finally {
          setLoadingRatings(false);
        }
      }
    };

    fetchRatings();
  }, [product.productId]);

  return (
    <div>
      <div className="container-xl mb-3">
        <h1 className="view-product-detail-title">Chi tiết sản phẩm</h1>
        {/* info top */}
        <div className="view__product-info d-flex gap-3">
          {/* top left */}
          <div className="info__left">
            <img
              className="product__image"
              src={product.productImage}
              alt="Product"
            />
          </div>
          {/* top right */}
          <div className="info__right">
            <div className="product__name">{product.productName}</div>
            <div className="product__info">
              <label>Giá:</label>
              <div className="product__price">{`${product.productPrice.toLocaleString(
                "en-US"
              )} VND`}</div>
              <label>Loại:</label>
              {Array.isArray(categories) && categories.length > 0 ? (
                <div>
                  {categories
                    .filter(
                      (category) => category._id === product.productCategory
                    ) // Lọc danh mục có id trùng
                    .map((category) => (
                      <div key={category._id}>{category.categoryName}</div>
                    ))}
                </div>
              ) : (
                <option disabled>Không có loại sản phẩm</option>
              )}
              <label>Kích thước:</label>
              <div className="size">
                <SizeComponent>{product.productSize}</SizeComponent>
              </div>
              <div className="button_area">
                <ButtonComponent
                  style={{ width: "200px", marginRight: "20px" }}
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </ButtonComponent>
                <ButtonComponent onClick={() => navigate("/products")}>
                  Thoát
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>
        {/* info bot */}
        <div className="info__bot">
          <label className="description">Mô Tả</label>
          <textarea
            className="product-description"
            readOnly={true}
            // defaultValue={"Chưa có mô tả"}
          >
            {product.productDescription}
          </textarea>
        </div>

        {/* <div className="btn__update">
          <ButtonComponent onClick={handleEdit}>Sửa</ButtonComponent>
        </div> */}
        <div className="recommendProduct">
          <h3>Có thể bạn sẽ thích</h3>
          {isLoading ? (
            <div>Đang tải khuyến nghị...</div>
          ) : relatedProducts.length === 0 ? (
            <div>Không có khuyến nghị. Khám phá thêm sản phẩm!</div>
          ) : (
            <RecommendationCarouselComponent products={relatedProducts} />
          )}
        </div>

        {/* Ratings Section */}
        <div className="ratings-section mt-4">
          <h3 className="mb-3">Đánh giá sản phẩm</h3>
          <div className="overall-rating mb-4">
            <div className="d-flex align-items-center gap-3">
              <RatingStar
                rating={product.averageRating}
                setRating={() => {}}
                isEditable={false}
                size={24}
                showRating={true}
                showCount={true}
                totalRatings={product.totalRatings || 0}
              />
            </div>
          </div>

          {loadingRatings ? (
            <div>Đang tải đánh giá...</div>
          ) : ratings.length > 0 ? (
            <ListGroup>
              {ratings.map((rating, index) => (
                <ListGroup.Item key={index} className="rating-item">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong>{rating.userName}</strong>
                      <div className="mt-1">
                        <RatingStar
                          rating={rating.rating}
                          setRating={() => {}}
                          isEditable={false}
                          size={16}
                          showRating={false}
                        />
                      </div>
                    </div>
                    <small className="text-muted">
                      {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
                    </small>
                  </div>
                  {rating.comment && (
                    <p className="rating-comment mb-0 mt-2">{rating.comment}</p>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="text-muted">
              Chưa có đánh giá nào từ khách hàng.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetailPage;
