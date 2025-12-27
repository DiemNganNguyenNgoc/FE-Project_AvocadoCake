import "./ProductsPage.css";
import { useTranslation } from "react-i18next";
import i18n from "../../../../lib/i18n/config";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardProduct from "../../../components/CardProduct/CardProduct";
import { getAllCategory } from "../../../api/services/CategoryService";
import { getAllDiscount } from "../../../api/services/DiscountService";
import {
  getAllProduct,
  getProductsByCategory,
} from "../../../api/services/productServices";
import ChatbotComponent from "../../../components/ChatbotComponent/ChatbotComponent";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";

const PAGE_SIZE = 12;
const PROMO_PER_PAGE = 1;

const ProductsPage = () => {
  //Hook
  const { t } = useTranslation();

  //State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [promoGroups, setPromoGroups] = useState([]);
  const [currentCategoryName, setCurrentCategoryName] = useState(
    t("product_page.all_products")
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [promoPage, setPromoPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [priceRanges, setPriceRanges] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const showPromo = location.state?.showPromo || false;
  const previousCategoryId = location.state?.categoryIds || null;

  // Fetch categories & discounts
  useEffect(() => {
    (async () => {
      try {
        const [catRes, discRes] = await Promise.all([
          getAllCategory(),
          getAllDiscount(),
        ]);
        // Filter only active categories
        const activeCategories = catRes.data.filter(
          (cat) => cat.isActive !== false
        );
        setCategories(activeCategories);
        setDiscounts(discRes.data);
      } catch (err) {
        console.error("Error loading init data:", err);
      }
    })();
  }, []);

  // Filter and sort products
  const filterAndSortProducts = (productList) => {
    let filtered = [...productList];

    // Apply price filter
    if (priceRanges.length > 0) {
      filtered = filtered.filter((p) => {
        const price = p.productPrice;
        return priceRanges.some((range) => {
          switch (range) {
            case "under_10k":
              return price < 10000;
            case "from_10k_to_50k":
              return price >= 10000 && price < 50000;
            case "from_50k_to_100k":
              return price >= 50000 && price < 100000;
            case "from_100k_to_200k":
              return price >= 100000 && price < 200000;
            case "from_200k_to_500k":
              return price >= 200000 && price < 500000;
            case "above_500k":
              return price >= 500000;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "name_asc":
        filtered.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "price_high":
        filtered.sort((a, b) => b.productPrice - a.productPrice);
        break;
      case "price_low":
        filtered.sort((a, b) => a.productPrice - b.productPrice);
        break;
      default:
        break;
    }

    return filtered;
  };

  const fetchProductsByCategory = async (
    categoryId,
    page = 0,
    limit = PAGE_SIZE
  ) => {
    try {
      const { data } = await getProductsByCategory(categoryId);
      console.log("Fetched products for category:", categoryId, data);
      // Filter ra sản phẩm bị ẩn (thêm lớp bảo vệ)
      const visibleProducts = data?.filter((p) => !p.isHidden) || [];
      setAllProducts(visibleProducts);
      const filtered = filterAndSortProducts(visibleProducts);
      setProducts(filtered.slice(page * limit, (page + 1) * limit));
      setTotalPages(Math.ceil(filtered.length / limit) || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching products:", err);
      setAllProducts([]);
      setProducts([]);
      setTotalPages(1);
    }
  };

  const fetchAllProducts = async (page = 0, limit = PAGE_SIZE) => {
    try {
      const { data } = await getAllProduct();
      // Filter ra sản phẩm bị ẩn (thêm lớp bảo vệ)
      const visibleProducts = data.filter((p) => !p.isHidden);
      setAllProducts(visibleProducts);
      const filtered = filterAndSortProducts(visibleProducts);
      setProducts(filtered.slice(page * limit, (page + 1) * limit));
      setTotalPages(Math.ceil(filtered.length / limit));
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching all products:", err);
    }
  };

  const handlePromoProductsClick = async () => {
    setCurrentCategory(1);
    setCurrentCategoryName(t("product_page.discount"));
    setPromoPage(0);
    setCurrentPage(0);

    try {
      const allProducts = (await getAllProduct()).data;
      // Filter ra sản phẩm bị ẩn
      const visibleProducts = allProducts.filter((p) => !p.isHidden);
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
            products: visibleProducts.filter((p) => ids.includes(p._id)),
          };
        });

      setPromoGroups(groups);
      setTotalPages(Math.ceil(groups.length / PROMO_PER_PAGE));
      setProducts([]);
    } catch (err) {
      console.error("Error filtering promo products:", err);
      setPromoGroups([]);
      setTotalPages(1);
    }
  };

  const handleCategoryClick = (id, name) => {
    setCurrentCategory(id);
    setCurrentCategoryName(name);
    setCurrentPage(0);
    fetchProductsByCategory(id, 0, PAGE_SIZE);
  };

  const handleAllProductsClick = () => {
    setCurrentCategory(null);
    setCurrentCategoryName(t("product_page.all_products"));
    setCurrentPage(0);
    fetchAllProducts();
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const handlePriceRangeToggle = (range) => {
    setPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const getImageUrl = (url) => {
    if (!url) return "/fallback.png";
    return url.startsWith("http")
      ? url
      : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${url.replace(
          "\\",
          "/"
        )}`;
  };

  const getDiscountPercent = (productId) => {
    const now = Date.now();
    const discount = discounts.find((d) => {
      const st = new Date(d.discountStartDate).getTime();
      const ed = new Date(d.discountEndDate).getTime();
      return (
        st <= now &&
        ed >= now &&
        d.discountProduct?.some((x) =>
          typeof x === "string" ? x === productId : x._id === productId
        )
      );
    });
    return discount?.discountValue || 0;
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
        fetchProductsByCategory(previousCategoryId, 0, PAGE_SIZE);
        return;
      }
    }

    fetchAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, discounts, showPromo, previousCategoryId]);

  useEffect(() => {
    if (currentCategory === null) fetchAllProducts(currentPage);
    else if (currentCategory !== 1)
      fetchProductsByCategory(currentCategory, currentPage);
    // currentCategory === 1 => promo handled by promoPage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentCategory]);

  // Re-apply filters when sorting or price ranges change
  useEffect(() => {
    if (currentCategory === 1 || allProducts.length === 0) return;

    const filtered = filterAndSortProducts(allProducts);
    setProducts(filtered.slice(0, PAGE_SIZE));
    setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
    setCurrentPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, priceRanges]);

  const handleDetail = (productId, source = products) => {
    const p = source.find((prod) => prod._id === productId);
    if (!p) return alert("Product not found!");

    navigate("/view-product-detail", {
      state: { ...p },
    });
  };

  // Render products list
  const renderProductsList = () => {
    if (currentCategory === 1) {
      if (!promoGroups.length)
        return (
          <div className="empty-products-message">
            <svg
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            <h3>{t("product_page.no_products_title")}</h3>
            <p>
              {t("product_page.unavailable", {
                data: t("product_page.discount").toLowerCase(),
              })}
            </p>
          </div>
        );

      return promoGroups
        .slice(promoPage * PROMO_PER_PAGE, (promoPage + 1) * PROMO_PER_PAGE)
        .map((g) => (
          <div key={g._id} className="promo-group">
            <h2 className="promo-group__label">
              {g.discountName} – Giảm {g.discountValue}%
            </h2>
            <div className="promo-group__products">
              {g.products.map((p) => (
                <CardProduct
                  key={p._id}
                  className="col productadmin__item"
                  type="primary"
                  img={getImageUrl(p.productImage)}
                  title={p.productName}
                  price={p.productPrice}
                  discount={g.discountValue}
                  id={p._id}
                  size={p.productSize}
                  averageRating={p.averageRating}
                  totalRatings={p.totalRatings}
                  onCardClick={handleDetail(p._id, g.products)}
                />
              ))}
            </div>
          </div>
        ));
    } else {
      if (!products.length)
        return (
          <div className="empty-products-message">
            <svg
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            <h3>{t("product_page.no_products_title")}</h3>
            <p>
              {t("product_page.unavailable", {
                data: t("product").toLowerCase(),
              })}
            </p>
          </div>
        );

      return products.map((p) => (
        <CardProduct
          key={p._id}
          className="col productadmin__item"
          type="primary"
          img={getImageUrl(p.productImage)}
          title={p.productName}
          price={p.productPrice}
          discount={getDiscountPercent(p._id)}
          id={p._id}
          size={p.productSize}
          averageRating={p.averageRating}
          totalRatings={p.totalRatings}
          onCardClick={() => handleDetail(p._id, products)}
        />
      ));
    }
  };

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

  useEffect(() => {
    console.log("RESOURCES pages (vi):", i18n.getResourceBundle("vi", "pages"));
  }, []);
  return (
    <div className="container-xl product-container">
      <ChatbotComponent />
      <div className="product">
        <div className="product__top">
          <h1 className="product__title">
            {t("product_page.title").toUpperCase()}
          </h1>
          <p className="text-xl mt-4 text-gray-700 font-bold">
            {currentCategoryName}
          </p>
        </div>

        <div className="flex flex-row gap-4">
          {/* Sidebar with filters */}
          <div className="flex flex-col" style={{ minWidth: "250px" }}>
            {/* Category dropdown */}
            <div className="category-dropdown">
              <div
                className="category-dropdown__header"
                onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
              >
                <h3 className="category-dropdown__title">
                  {t("product_page.category_filter")}
                </h3>
                <span
                  className={`category-dropdown__icon ${
                    isCategoryExpanded ? "expanded" : ""
                  }`}
                >
                  ▼
                </span>
              </div>
              <div
                className={`category-dropdown__content ${
                  isCategoryExpanded ? "expanded" : ""
                }`}
              >
                <SideMenuComponent
                  key="all-products"
                  value={null}
                  isActive={currentCategory === null}
                  onClick={handleAllProductsClick}
                >
                  {t("product_page.all_products")}
                </SideMenuComponent>

                <SideMenuComponent
                  key="promo-product"
                  value={null}
                  isActive={currentCategory === 1}
                  onClick={handlePromoProductsClick}
                >
                  {t("product_page.discount")}
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
            </div>

            {/* Price filter */}
            <div className="price-filter">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h3 className="price-filter__title" style={{ margin: 0 }}>
                  {t("product_page.price_filter")}
                </h3>
                {priceRanges.length > 0 && (
                  <button
                    onClick={() => setPriceRanges([])}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#d32f2f",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      padding: "4px 8px",
                      textDecoration: "underline",
                    }}
                    title="Đặt lại tất cả bộ lọc giá"
                  >
                    Đặt lại
                  </button>
                )}
              </div>
              {[
                "under_10k",
                "from_10k_to_50k",
                "from_50k_to_100k",
                "from_100k_to_200k",
                "from_200k_to_500k",
                "above_500k",
              ].map((range) => (
                <label
                  key={range}
                  className="price-filter__option"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    className="price-filter__checkbox"
                    checked={priceRanges.includes(range)}
                    onChange={() => handlePriceRangeToggle(range)}
                  />
                  <span className="price-filter__label">
                    {t(`product_page.${range}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Products area */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="product__sort-bar">
              <span className="product__sort-label">
                {t("product_page.sort_by")}
              </span>
              <div className="product__sort-buttons">
                <button
                  className={`product__sort-btn ${
                    sortBy === "name_asc" ? "active" : ""
                  }`}
                  onClick={() => handleSortChange("name_asc")}
                >
                  {t("product_page.sort_name_asc")}
                </button>
                <button
                  className={`product__sort-btn ${
                    sortBy === "name_desc" ? "active" : ""
                  }`}
                  onClick={() => handleSortChange("name_desc")}
                >
                  {t("product_page.sort_name_desc")}
                </button>
                <button
                  className={`product__sort-btn ${
                    sortBy === "newest" ? "active" : ""
                  }`}
                  onClick={() => handleSortChange("newest")}
                >
                  {t("product_page.sort_newest")}
                </button>
                <button
                  className={`product__sort-btn ${
                    sortBy === "price_high" ? "active" : ""
                  }`}
                  onClick={() => handleSortChange("price_high")}
                >
                  {t("product_page.sort_price_high")}
                </button>
                <button
                  className={`product__sort-btn ${
                    sortBy === "price_low" ? "active" : ""
                  }`}
                  onClick={() => handleSortChange("price_low")}
                >
                  {t("product_page.sort_price_low")}
                </button>
              </div>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {renderProductsList()}
            </div>
          </div>
        </div>
      </div>

      <div className="PageNumberHolder">
        <Pagination
          currentPage={currentCategory === 1 ? promoPage : currentPage}
          totalPages={totalPages}
          onPageChange={currentCategory === 1 ? setPromoPage : setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
