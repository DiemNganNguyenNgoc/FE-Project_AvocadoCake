import "./ProductsPage.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllCategory } from "../../../services/CategoryService";
import { getAllDiscount } from "../../../services/DiscountService";
import CardProduct from "../../../components/CardProduct/CardProduct";
import ChatbotComponent from "../../../components/ChatbotComponent/ChatbotComponent";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";
import {
  getAllProduct,
  getProductsByCategory,
} from "../../../services/productServices";
const PAGE_SIZE = 9;

const ProductsPage = () => {
  //State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategoryName, setCurrentCategoryName] =
  useState("Tất cả sản phẩm");
  const [discounts, setDiscounts] = useState([]);
  const [promoPage, setPromoPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [promoGroups, setPromoGroups] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const promoPerPage = 1;

  // Router
  const navigate = useNavigate();
  const location = useLocation();
  const showPromo = location.state?.showPromo || false; 
  const previousCategoryId = location.state?.categoryIds || null;

  //Fetch category and discount
  useEffect(() => {
    (async () => {
      try {
        const [catRes, discRes] = await Promise.all([
          getAllCategory(),
          getAllDiscount(),
        ]);
        setCategories(catRes.data);
        setDiscounts(discRes.data);
      } catch (err) {
        console.error("Error loading init data:", err);
      }
    })();
  }, []);

  /**
   * Fetch Product by category
   * @param categoryId : string, any
   * @param page : number
   * @param limit : number
   */
  const fetchProductsByCategory = async (
    categoryId,
    page = 0,
    limit = PAGE_SIZE
  ) => {
    try {
      const { data } = await getProductsByCategory(categoryId);

      const start = page * limit;
      const end = start + limit;

      setProducts(data.slice(start, end));
      setTotalPages(Math.ceil(data.length / limit));
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  /**
   * Fetch All Products
   * @param page : number,
   * @param limit : number
   */
  const fetchAllProducts = async (page = 0, limit = PAGE_SIZE) => {
    try {
      const { data } = await getAllProduct();

      const start = page * limit;
      const end = start + limit;

      setProducts(data.slice(start, end)); // chỉ giữ phần trang hiện tại
      setTotalPages(Math.ceil(data.length / limit));
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Display discount
  const handlePromoProductsClick = async () => {
    setCurrentCategoryName("Khuyến mãi");
    setCurrentCategory(1);
    setPromoPage(0);
    setCurrentPage(0);

    try {
      const allProducts = (await getAllProduct()).data;
      const now = Date.now();

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

      // pagination for discount
      const totalPromoPages = Math.ceil(groups.length / promoPerPage);
      setTotalPages(totalPromoPages);
      setProducts([]);
    } catch (err) {
      console.error("Error filtering promo products:", err);
      setPromoGroups([]);
      setTotalPages(1);
    }
  };

  /**
   * Handle Category Click
   * @param id: string
   * @param name : string
   */
  const handleCategoryClick = (id, name) => {
    setCurrentCategory(id);
    setCurrentCategoryName(name);
    setCurrentPage(0);
    fetchProductsByCategory(0, 9, id);
  };

  /**
   * Handle All Product Click
   */
  const handleAllProductsClick = () => {
    setCurrentCategory(null);
    setCurrentCategoryName("Tất cả sản phẩm");
    setCurrentPage(0);
    fetchAllProducts();
  };

  
  useEffect(() => {
    if (!categories.length) return; 

    if (showPromo) {
      handlePromoProductsClick();
      return;
    }

    if (previousCategoryId) {
      const cat = categories.find((c) => c._id === previousCategoryId);
      if (cat) {
        setCurrentCategory(previousCategoryId);
        setCurrentCategoryName(cat.categoryName);
        fetchProductsByCategory(0, 9, previousCategoryId);
        return;
      }
    }

    fetchAllProducts(0, 9);
  }, [categories, discounts, showPromo, previousCategoryId]);

  // Pagination and group products by category
  useEffect(() => {
    if (currentCategory && currentCategory !== 1) {
      fetchProductsByCategory(currentPage, 9, currentCategory);
    } else if (currentCategory === null) {
      fetchAllProducts(currentPage, 9);
    }
    // currentCategory === 1
  }, [currentPage, currentCategory]);

  /**
   * 
   * @param  productId : string
   * @param  source : string
   * @returns 
   */
  const handleDetail = (productId, source = products) => {
    const p = source.find((prod) => prod._id === productId);

    if (!p) return alert("Product not found!");

    const {
      productName,
      productSize,
      productImage,
      productCategory,
      productDescription,
      productPrice,
      averageRating,
      totalRatings,
    } = p;

    navigate("/view-product-detail", {
      state: {
        productId,
        productName,
        productSize,
        productImage,
        productDescription,
        productCategory,
        productPrice,
        averageRating,
        totalRatings,
      },
    });
  };

  // Pagination
  const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className="pageNumber"
          style={{ fontWeight: currentPage === i ? "bold" : "normal" }}
          onClick={() => onPageChange(i)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );


  return (
    <div>
      <div className="container-xl product-container">
        <ChatbotComponent />
        <div className="product">
          <div className="product__top">
            <h1 className="product__title">SẢN PHẨM</h1>
            <p className="product__current-category">{currentCategoryName}</p>
          </div>

          <div className="product__bot">
            {/*Side menu */}
            <div className="side-menu__category">
              <SideMenuComponent
                key="all-products"
                value={null}
                isActive={currentCategory === null}
                onClick={handleAllProductsClick}
              >
                Tất cả sản phẩm
              </SideMenuComponent>

              <SideMenuComponent
                key="promo-product"
                value={null}
                isActive={currentCategory === 1}
                onClick={handlePromoProductsClick}
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

            {/* Products list */}
            <div className="container product__list">
              {currentCategory === 1 ? ( 
                promoGroups.length ? (
                  promoGroups
                    .slice(
                      promoPage * promoPerPage,
                      (promoPage + 1) * promoPerPage
                    )
                    .map((g) => (
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
                              <CardProduct
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
                                onClick={() => handleDetail(p._id, g.products)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))
                ) : (
                  <p>Không có khuyến mãi nào</p>
                )
              ) : products.length ? (
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
                    <CardProduct
                      key={p._id}
                      className="col productadmin__item"
                      type="primary"
                      img={imageUrl}
                      title={p.productName}
                      price={p.productPrice}
                      discount={discountPercent}
                      id={p._id}
                      size={p.productSize}
                      averageRating={p.averageRating}
                      totalRatings={p.totalRatings}
                      onClick={() => handleDetail(p._id, products)}
                    />
                  );
                })
              ) : (
                <p>Không có sản phẩm nào</p>
              )}
            </div>
          </div>
        </div>

        {/*Pagination */}
        <div className="PageNumberHolder">
          {currentCategory === 1 ? (
            <Pagination
              currentPage={promoPage}
              totalPages={totalPages}
              onPageChange={setPromoPage}
            />
          ) : (
            
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

export default ProductsPage;
