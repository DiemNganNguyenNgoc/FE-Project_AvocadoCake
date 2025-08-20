import "./ProductsPage.css";
import { useTranslation } from "react-i18next";
import  i18n from "../../../../lib/i18n/config"
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
  const {t} = useTranslation();

  //State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [promoGroups, setPromoGroups] = useState([]);
  const [currentCategoryName, setCurrentCategoryName] =
  useState(t("product_page.all_products"));
  const [currentPage, setCurrentPage] = useState(0);
  const [promoPage, setPromoPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(null);
  
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
        setCategories(catRes.data);
        setDiscounts(discRes.data);
      } catch (err) {
        console.error("Error loading init data:", err);
      }
    })();
  }, []);

  const fetchProductsByCategory = async (
    categoryId,
    page = 0,
    limit = PAGE_SIZE
  ) => {
    try {
      const { data } = await getProductsByCategory(categoryId);
      setProducts(data.slice(page * limit, (page + 1) * limit));
      setTotalPages(Math.ceil(data.length / limit));
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchAllProducts = async (page = 0, limit = PAGE_SIZE) => {
    try {
      const { data } = await getAllProduct();
      setProducts(data.slice(page * limit, (page + 1) * limit));
      setTotalPages(Math.ceil(data.length / limit));
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
  }, [categories, discounts, showPromo, previousCategoryId]);

  useEffect(() => {
    if (currentCategory === null) fetchAllProducts(currentPage);
    else if (currentCategory !== 1)
      fetchProductsByCategory(currentCategory, currentPage);
    // currentCategory === 1 => promo handled by promoPage
  }, [currentPage, currentCategory]);

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
      if (!promoGroups.length) return <p>{t("product_page.unavailable", {data:t("product_page.discount").toLowerCase()})}</p>;

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
      if (!products.length) return <p>{t("product_page.unavailable", {data:t("product").toLowerCase()})}</p>;

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
          <h1 className="product__title">{t("product_page.title")}</h1>
          <p className="product__current-category">{currentCategoryName}</p>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex flex-col">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {renderProductsList()}
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
