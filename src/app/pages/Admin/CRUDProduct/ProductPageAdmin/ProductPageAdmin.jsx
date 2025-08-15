import { useState, useEffect } from "react";
import "./ProductPageAdmin.css";
import CardProductAdmin from "../../../../components/CardProductAdmin/CardProductAdmin";
import AddBtn from "../../../../components/AddBtn(+)/AddBtn";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import * as productService from "../../../../services/productServices";
import axios from 'axios'; // For making API calls
import { Button, Modal } from "react-bootstrap";
import { getAllCategory } from "../../../../services/CategoryService";
import { useNavigate, useLocation } from "react-router-dom";
import { getProductsByCategory, getAllProduct } from "../../../../services/productServices";
import { getAllDiscount } from "../../../../services/DiscountService";

const ProductPageAdmin = () => {
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm
  const [categories, setCategories] = useState([]); // State lưu danh sách category
  const [currentCategory, setCurrentCategory] = useState(null); // State lưu category hiện tại
  const [currentCategoryName, setCurrentCategoryName] = useState("Tất cả sản phẩm"); // State lưu tên category hiện tại
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [error, setError] = useState(""); // State lưu lỗi
  const [discounts, setDiscounts] = useState([]);
  const [promoGroups, setPromoGroups] = useState([]); 
  const [promoPage, setPromoPage] = useState(0);   // trang hiện tại của tab KM
  const promoPerPage = 1;                          // mỗi trang hiển thị 2 khuyến mãi

  const navigate = useNavigate();
  const location = useLocation();

  const previousCategoryId = location.state?.categoryIds || null;

   useEffect(() => {
      const fetchCategories = async () => {
        try {
          const data = await getAllCategory();
          console.log("RES", data)
          setCategories(data.data); // Lưu danh sách category vào state
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }, []);

    useEffect(() => {
      const fetchDiscounts = async () => {
        try {
          const data = await getAllDiscount();
          setDiscounts(data.data);
        } catch (error) {
          console.error("Error fetching discounts:", error);
        }
      };
      fetchDiscounts();
    }, []);
  
    // Fetch danh sách sản phẩm theo category
    const fetchProductsByCategory = async (page = 0, limit = 9, categoryId = null) => {
      try {
        const queryParams = new URLSearchParams({ page, limit }).toString();
  
        const data = await getProductsByCategory(categoryId);
        console.log ("DATA", data)
        setCurrentPage(page);
        setTotalPages(Math.ceil(data.total / limit));
  
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error("Products data is not in expected format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    // fetch danh sach san pham
    const fetchAllProducts = async (page = 0, limit = 9, categoryId = null) => {
      try {
        const queryParams = new URLSearchParams({ page, limit }).toString();
  
        const data = await getAllProduct();
        setCurrentPage(page);
        setTotalPages(Math.ceil(data.total / limit));
  
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error("Products data is not in expected format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
 // Khi component được mount
  useEffect(() => {
    if (previousCategoryId) {
      setCurrentCategory(previousCategoryId);
      const selectedCategory = categories.find(cat => cat._id === previousCategoryId);
      setCurrentCategoryName(selectedCategory?.categoryName || "Tất cả sản phẩm");
      setCurrentPage(0);
      fetchProductsByCategory(0, 9, previousCategoryId);
    } else {
      setCurrentCategoryName("Tất cả sản phẩm");
      fetchAllProducts(0, 9);
    }
  }, [previousCategoryId, categories]);

  // Khi nhấn vào category
  const handleCategoryClick = (categoryId, categoryName) => {
    setCurrentCategory(categoryId);
    setCurrentCategoryName(categoryName);
    console.log("Current", currentCategoryName)
    setCurrentPage(0);
    fetchProductsByCategory(0, 9, categoryId);
  };

  // Khi click promo:
 const handlePromoProductsClick = async () => {
  setCurrentCategoryName("Khuyến mãi");
  setCurrentCategory(1);
  setPromoPage(0);

  try {
    // lấy toàn bộ sản phẩm
    const allProducts = (await getAllProduct()).data;
    const now = Date.now();

    // gom theo từng discount
    const groups = discounts
      .filter((d) => {
        const st = new Date(d.discountStartDate).getTime();
        const ed = new Date(d.discountEndDate).getTime();
        return st <= now && ed >= now;
      })
      .map((d) => {
        const ids = d.discountProduct.map((x) =>
          typeof x === "string" ? x : x._id
        );
        return {
          ...d,
          products: allProducts.filter((p) => ids.includes(p._id)),
        };
      });

    setPromoGroups(groups);
    setTotalPages(Math.ceil(groups.length / promoPerPage));
  } catch (err) {
    console.error("Lỗi khi lọc KM:", err);
    setPromoGroups([]);
    setTotalPages(1);
  }
};


  // Khi nhấn vào Tất cả sản phẩm
  const handleAllProductsClick = () => {
    setCurrentCategory(null);
    setCurrentCategoryName("Tất cả sản phẩm");
    console.log("Current", currentCategoryName)
    setCurrentPage(0);
    fetchAllProducts();
  };
  // Phân trang
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index);
    return (
      <div>
        {pages.map((page) => (
          <button
            className="pageNumber"
            key={page}
            onClick={() => onPageChange(page)}
            style={{ fontWeight: currentPage === page ? "bold" : "normal" }}
          >
            {page + 1}
          </button>
        ))}
      </div>
    );
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdate = (productId, source) => {
    const selectedProduct = source.find((product) => product._id === productId);
    console.log("SDSDSF: ", selectedProduct)
    if (selectedProduct) {
      const { productName, productSize, productImage, productCategory, productDescription, productPrice } = selectedProduct;
      console.log("SDSDSF")
      navigate("/admin/update-product", {
        state: { productId, productName, productSize, productImage, productDescription, productCategory, productPrice },
      });
    } else {
      alert("Product not found!");
    }
    console.log("SDSDSF")
  };

  
  return (
    <div className="container-xl productadmin-container">
      <div className="productadmin">
        {/* productadmin top */}
        <div className="product__top">
          <h1 className="product__title">SẢN PHẨM</h1>
          {/* Hiển thị tên category nếu có */}
          {currentCategory ? (
            <p className="product__current-category">
              {categories.find((cat) => cat._id === currentCategory)?.categoryName}
            </p>
          ) : (
            <p className="product__current-category">Tất cả sản phẩm</p>
          )}
        </div>
        <div style={{ marginLeft: 1222 }}>
          <AddBtn path={"/admin/add-product"} />
        </div>
        {/* productadmin bot */}
        <div className="productadmin__bot">
          {/* side menu */}
          <div className="side-menu__category">
            {/* Thêm "Tất cả sản phẩm" */}
            <SideMenuComponent
                key="all-products"
                value={null}
                onClick={handleAllProductsClick}
                isActive={currentCategory=== null}
              >
                Tất cả sản phẩm
              </SideMenuComponent>
              <SideMenuComponent
                key="promo-product"
                value={null}
                onClick={handlePromoProductsClick}
                isActive={currentCategory === 1}
              >
                Khuyến mãi
              </SideMenuComponent>
              {categories.map((c) => (
                              <SideMenuComponent
                                key={c._id}
                                value={c._id}
                                isActive={currentCategory === c._id}
                                onClick={() => handleCategoryClick(c._id, c.categoryName)}
                              >
                                {c.categoryName}
                              </SideMenuComponent>
                            ))}
                          </div>
              
                          {/* ─────────────── Danh sách sản phẩm */}
              <div className="container product__list">
                {currentCategory === 1 ? (          // 👉 Tab Khuyến mãi
                  promoGroups.length ? (
                    promoGroups
                    .slice(promoPage*promoPerPage, (promoPage+1)*promoPerPage).map((g) => (
                      <div key={g._id} className="promo-group">
                        <h2 className="promo-group__label">
                          {g.discountName} – Giảm {g.discountValue}%
                        </h2>
              
                        <div className="promo-group__products">
                          {g.products.map((p) => {
                            const imageUrl = p.productImage.startsWith("http")
                              ? p.productImage
                              : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${p.productImage.replace(
                                  "\\",
                                  "/"
                                )}`;
              
                            return (
                              <CardProductAdmin
                                key={p._id}
                                className="col productadmin__item"
                                type="primary"
                                img={imageUrl}
                                title={p.productName}
                                price={p.productPrice}
                                discount={g.discountValue}
                                id={p._id}
                                size={p.productSize}
                                averageRating={p.averageRating}
                                totalRatings={p.totalRatings}
                                onClick={() => handleUpdate(p._id, g.products)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Không có khuyến mãi nào</p>
                  )
                ) : (
                  products.length ? (
                    products.map((p) => {
                      const imageUrl = p.productImage.startsWith("http")
                        ? p.productImage
                        : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${p.productImage.replace(
                            "\\",
                            "/"
                          )}`;
              
                      const now = Date.now();
                      const discount = discounts.find((d) => {
                        const st = new Date(d.discountStartDate).getTime();
                        const ed = new Date(d.discountEndDate).getTime();
                        return (
                          st <= now &&
                          ed >= now &&
                          d.discountProduct?.some((x) =>
                            typeof x === "string" ? x === p._id : x._id === p._id
                          )
                        );
                      });
                      const discountPercent = discount?.discountValue || 0;

                  return (
                    <CardProductAdmin
                      key={p._id}
                      className="col productadmin__item"
                      type="primary"
                      img={imageUrl}
                      title={p.productName}
                      price={p.productPrice}
                      discount={discountPercent}
                      id={p._id}
                      size={p.productSize}
                      onClick={() => handleUpdate(p._id,products)}
                      averageRating={p.averageRating}
                      totalRatings={p.totalRatings}
                     
                    />
                  );
                })
              ) : (
                <p>Không có sản phẩm nào</p>
              )
              )}
            </div>
        </div>

         {/* Pagination */}
         <div className="PageNumberHolder">
  {currentCategory === 1 ? (
    /* 👉 Pagination cho tab Khuyến mãi */
    <Pagination
      currentPage={promoPage}
      totalPages={totalPages}
      onPageChange={setPromoPage}
    />
  ) : (
    /* 👉 Pagination cho tất cả các tab còn lại */
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  )}
</div>
      </div>
    </div>
  );
};

export default ProductPageAdmin;
