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
import { ListGroup } from "react-bootstrap";
import StratergyService from "../../Admin/AdminStratergy/services/StratergyService";
import CardProduct from "../../../components/CardProduct/CardProduct";

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
      // Map _id thành productId để đồng nhất với code cũ
      const mappedProduct = {
        ...productData,
        productId: productData._id || productData.productId,
      };
      console.log("🔍 Mapped product data:", mappedProduct);
      setProduct(mappedProduct);
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
  const [categories, setCategories] = useState([]); // State lưu danh sách category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/category/get-all-category",
          {
            method: "GET", // Phương thức GET để lấy danh sách category
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json(); // Chuyển đổi dữ liệu từ JSON
        console.log("Categories data:", categories);

        // Kiểm tra và gán mảng categories từ data.data
        if (Array.isArray(data.data)) {
          setCategories(data.data); // Lưu danh sách category vào state
        } else {
          console.error("Categories data is not in expected format");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ĐÃ BỎ QUEN useEffect này vì đã merge logic vào useEffect recommendations phía dưới
  // useEffect(() => {
  //   const fetchRelatedProducts = async () => {
  //     try {
  //       console.log("Current product:", product);
  //       console.log("Product Category:", product.productCategory);
  //       console.log("Product ID:", product.productId);

  //       // Kiểm tra xem product có đầy đủ thông tin không
  //       if (!product.productCategory || !product.productId) {
  //         console.log("Product data is incomplete");
  //         return;
  //       }

  //       const queryParams = new URLSearchParams({
  //         page: 0,
  //         limit: 8,
  //       }).toString();

  //       const url = `http://localhost:3001/api/product/get-product-by-category/${product.productCategory}?${queryParams}`;
  //       console.log("Fetching URL:", url);

  //       const response = await fetch(url, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch products");
  //       }

  //       const data = await response.json();
  //       console.log("Category products response:", data);

  //       if (Array.isArray(data.data)) {
  //         // Lọc bỏ sản phẩm hiện tại khỏi danh sách
  //         const filteredProducts = data.data.filter(
  //           (p) => p._id !== product.productId
  //         );
  //         console.log("Filtered products:", filteredProducts);
  //         setRelatedProducts(filteredProducts);
  //       } else {
  //         console.log("No products found in category");
  //         setRelatedProducts([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching related products:", error);
  //       setRelatedProducts([]);
  //     }
  //   };

  //   // Chỉ gọi fetchRelatedProducts khi product có đầy đủ thông tin
  //   if (product.productCategory && product.productId) {
  //     fetchRelatedProducts();
  //   }
  // }, [product]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    const {
      productId,
      _id,
      productName,
      productPrice,
      productImage,
      productSize,
      productCategory,
    } = product;
    console.log("PRODUCT", product);
    // Dispatch action để thêm vào giỏ hàng - dùng productId hoặc _id
    dispatch(
      addToCart({
        id: productId || _id,
        img: productImage,
        title: productName,
        price: productPrice,
        size: productSize,
        category: productCategory,
      })
    );
    console.log("PRODUCT PRICE", productPrice);
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
    console.log("🚀 useEffect recommendations triggered");
    console.log("📦 Current product:", product);
    console.log("👤 Current user:", user);

    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const userId = user?.id || null;
        console.log("✅ USER ID:", userId);
        console.log("✅ PRODUCT ID:", product.productId);

        let recommendedProducts = [];

        // Nếu có userId, lấy recommendations từ AI
        if (userId && product.productId) {
          try {
            const response = await getRecommendations(
              userId,
              product.productId
            );
            console.log("Recommendations response:", response);
            const recommendations = response.data || [];

            if (Array.isArray(recommendations) && recommendations.length > 0) {
              console.log("Fetching product details for:", recommendations);
              const fetched = await Promise.all(
                recommendations.map(async (id) => {
                  try {
                    const res = await getDetailsproduct(id);
                    console.log("Product detail for", id, ":", res.data);
                    return res.data;
                  } catch (err) {
                    console.error(`Error fetching product ${id}:`, err);
                    return null;
                  }
                })
              );
              recommendedProducts = fetched.filter(Boolean);
              console.log(
                "Successfully fetched recommended products:",
                recommendedProducts
              );
            } else {
              console.log("No recommendations returned from API");
            }
          } catch (error) {
            console.error("Error getting recommendations from API:", error);
          }
        } else {
          console.log("No userId or productId, skipping AI recommendations");
        }

        // Nếu không có AI recommendations, fallback sang sản phẩm cùng category
        if (recommendedProducts.length === 0 && product.productCategory) {
          console.log("Fallback to category recommendations");
          const queryParams = new URLSearchParams({
            page: 0,
            limit: 8,
          }).toString();

          const url = `http://localhost:3001/api/product/get-product-by-category/${product.productCategory}?${queryParams}`;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          const currentProductId = product.productId || product._id;
          const fallbackProducts = Array.isArray(data.data)
            ? data.data.filter((p) => p._id !== currentProductId)
            : [];

          console.log("Category fallback products:", fallbackProducts);
          recommendedProducts = fallbackProducts;
        }

        console.log("Final recommended products:", recommendedProducts);

        // Random 5 sản phẩm để hiển thị (nếu có nhiều hơn 5)
        let displayProducts = recommendedProducts;
        if (recommendedProducts.length > 5) {
          // Shuffle array và lấy 5 sản phẩm đầu tiên
          const shuffled = [...recommendedProducts].sort(
            () => Math.random() - 0.5
          );
          displayProducts = shuffled.slice(0, 5);
          console.log(
            "Randomly selected 5 products from",
            recommendedProducts.length,
            "products"
          );
        }

        setRelatedProducts(displayProducts);
      } catch (error) {
        console.error("Lỗi khi lấy khuyến nghị hoặc fallback:", error);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (product.productId) {
      console.log(
        "🎯 Calling fetchRecommendations with productId:",
        product.productId
      );
      fetchRecommendations();
    } else {
      console.log("⚠️ No productId found, skipping recommendations");
      console.log("⚠️ Product object:", product);
    }
  }, [product.productId, user]);

  const [ratings, setRatings] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [visibleRatingsCount, setVisibleRatingsCount] = useState(10); // Hiển thị 10 comments đầu tiên
  const RATINGS_PER_PAGE = 10;

  // State cho combo products
  const [comboProducts, setComboProducts] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(false);

  // Fetch ratings when product changes
  useEffect(() => {
    const fetchRatings = async () => {
      if (product.productId) {
        try {
          setLoadingRatings(true);
          const response = await getProductRatings(product.productId);
          if (response.status === "OK") {
            setRatings(response.data);
            // Reset visible count khi product thay đổi
            setVisibleRatingsCount(10);
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

  // Fetch combo products when product changes
  useEffect(() => {
    const fetchCombos = async () => {
      if (product.productId) {
        try {
          setLoadingCombos(true);
          console.log("Fetching combos for product:", product.productId);

          const response = await StratergyService.getProductCombos(
            product.productId
          );
          console.log("Combo response:", response);

          if (Array.isArray(response) && response.length > 0) {
            // Lấy tất cả product IDs từ combos (loại bỏ product hiện tại)
            const comboProductIds = new Set();
            response.forEach((combo) => {
              // Mỗi combo có product_1_id và product_2_id
              if (combo.product_1_id !== product.productId) {
                comboProductIds.add(combo.product_1_id);
              }
              if (combo.product_2_id !== product.productId) {
                comboProductIds.add(combo.product_2_id);
              }
            });

            console.log("Combo product IDs:", Array.from(comboProductIds));

            // Fetch chi tiết các sản phẩm combo
            const comboProductsData = await Promise.all(
              Array.from(comboProductIds).map(async (id) => {
                try {
                  const res = await getDetailsproduct(id);
                  return res.data;
                } catch (err) {
                  console.error(`Error fetching combo product ${id}:`, err);
                  return null;
                }
              })
            );

            const validComboProducts = comboProductsData.filter(Boolean);
            console.log("Valid combo products:", validComboProducts);
            setComboProducts(validComboProducts.slice(0, 5)); // Giới hạn 5 sản phẩm
          } else {
            console.log("No combos found for this product");
            setComboProducts([]);
          }
        } catch (error) {
          console.error("Error fetching combos:", error);
          setComboProducts([]);
        } finally {
          setLoadingCombos(false);
        }
      }
    };

    fetchCombos();
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

        {/* Combo Products Section */}
        {comboProducts.length > 0 && (
          <div className="combo-section mt-4 mb-4">
            <h3 className="mb-3">🎁 Thường mua cùng nhau</h3>
            {loadingCombos ? (
              <div>Đang tải combo sản phẩm...</div>
            ) : (
              <div className="combo-products-grid">
                {comboProducts.map((comboProduct) => (
                  <CardProduct
                    key={comboProduct._id}
                    id={comboProduct._id}
                    type={comboProduct.productCategory}
                    img={comboProduct.productImage}
                    title={comboProduct.productName}
                    price={comboProduct.productPrice}
                    size={comboProduct.productSize}
                    discount={comboProduct.discount || 0}
                    averageRating={comboProduct.averageRating || 5.0}
                    totalRatings={comboProduct.totalRatings || 0}
                    onCardClick={() =>
                      navigate("/product-detail", { state: comboProduct })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

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
            <>
              <ListGroup>
                {ratings.slice(0, visibleRatingsCount).map((rating, index) => (
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
                      <p className="rating-comment mb-0 mt-2">
                        {rating.comment}
                      </p>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* Nút "Xem thêm" */}
              {visibleRatingsCount < ratings.length && (
                <div className="text-center mt-3">
                  <ButtonComponent
                    onClick={() =>
                      setVisibleRatingsCount((prev) => prev + RATINGS_PER_PAGE)
                    }
                    style={{ minWidth: "150px" }}
                  >
                    Xem thêm ({ratings.length - visibleRatingsCount} đánh giá)
                  </ButtonComponent>
                </div>
              )}

              {/* Nút "Thu gọn" khi đã xem nhiều hơn 10 */}
              {visibleRatingsCount > RATINGS_PER_PAGE && (
                <div className="text-center mt-2">
                  <ButtonComponent
                    onClick={() => setVisibleRatingsCount(RATINGS_PER_PAGE)}
                    style={{ minWidth: "150px" }}
                  >
                    Thu gọn
                  </ButtonComponent>
                </div>
              )}
            </>
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
