import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import SliderComponent from "../../../components/SliderComponent/SliderComponent";
import CardProduct from "../../../components/CardProduct/CardProduct";
import ButtonNoBGComponent from "../../../components/ButtonNoBGComponent/ButtonNoBGComponent";
import LinesEllipsis from "react-lines-ellipsis";
import CardNews from "../../../components/CardNews/CardNews";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import ChatbotComponent from "../../../components/ChatbotComponent/ChatbotComponent";
import news from "../../../assets/img/news.jpg";
import img12 from "../../../assets/img/hero_2.jpg";
import { getAllDiscount } from "../../../api/services/DiscountService";
import { getAllNews } from "../../../api/services/NewsService";
import { getAllCategory } from "../../../api/services/CategoryService";
import {
  getAllProduct,
  getProductsByCategory,
} from "../../../api/services/productServices";

const text =
  "Là một hệ thống đội ngũ nhân viên và lãnh đạo chuyên nghiệp, gồm CBCNV và những người thợ đã có kinh nghiệm lâu năm trong các công ty đầu ngành. Mô hình vận hành hoạt động công ty được bố trí theo chiều ngang, làm gia tăng sự thuận tiện trong việc vận hành cỗ máy kinh doanh và gia tăng sự phối hợp thống nhất giữa các bộ phận trong công ty.";

const HomePage = () => {
  //Hooks
  const [promos, setPromos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [displayCategories, setDisplayCategories] = useState([]); // 5 random categories to display
  const [error, setError] = useState("");
  const [arrImgs, setArrImg] = useState([]); // promo images
  const [products, setProducts] = useState([]); // product list
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bestSeller, setBestSeller] = useState([]);
  const [newsList, setNewsList] = useState([]);

  const navigate = useNavigate();

  /**
   * Handle Click
   * @param  path
   */
  const handleClick = (path) => {
    navigate(path);
  };

  /** Handle click on slider image */
  const handleSliderImageClick = () => {
    navigate("/products", { state: { showPromo: true } });
  };

  /** Handle view product detail */
  const handleDetailProduct = (productId) => {
    const selectedProduct =
      products.find((p) => p._id === productId) ||
      bestSeller.find((p) => p._id === productId);

    if (selectedProduct) {
      const {
        productName,
        productSize,
        productImage,
        productCategory,
        productDescription,
        productPrice,
      } = selectedProduct;

      navigate("/view-product-detail", {
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

  /** Handle click on category */
  const handleCategoryClick = (categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentPage(0);
    fetchProducts(0, 9, categoryId);
  };

  /** Handle view news detail */
  const handleDetailNews = (newsId) => {
    const selectedNews = newsList.find((item) => item._id === newsId);

    if (selectedNews) {
      const { newsImage, newsTitle, newsContent } = selectedNews;
      navigate("/news-detail", {
        state: { newsImage, newsTitle, newsContent },
      });
    } else {
      alert("News not found!");
    }
  };

  /** Fetch products by category */
  const fetchProducts = async (page = 0, limit = 9, categoryId = null) => {
    try {
      const response = await getProductsByCategory(categoryId);
      if (Array.isArray(response.data)) {
        setProducts(response.data.slice(0, 4));
      } else {
        console.error("Products data is not in expected format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  /** Find discount applied to a product */
  const findPromoApplied = (productId) => {
    if (!Array.isArray(promos) || promos.length === 0) return 0;

    const now = Date.now();

    const appliedDiscount = promos.find((discount) => {
      const start = new Date(discount.discountStartDate).getTime();
      const end = new Date(discount.discountEndDate).getTime();

      const isInTimeRange = start <= now && now <= end;
      const isProductIncluded = discount.discountProduct?.some(
        (pro) => pro._id === productId
      );

      return isInTimeRange && isProductIncluded;
    });

    return appliedDiscount?.discountValue || 0;
  };

  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: false,
    });
  }, []);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const discounts = await getAllDiscount();
        if (Array.isArray(discounts.data)) {
          setPromos(discounts.data);
          const images = discounts.data
            .map((discount) => discount?.discountImage)
            .filter(Boolean);
          setArrImg(images);
        } else {
          setError("Invalid discount data.");
        }
      } catch (err) {
        setError(err.message || "Unable to load discounts.");
      }
    };
    fetchDiscounts();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getAllNews();
        if (Array.isArray(response.data)) {
          setNewsList(response.data.slice(0, 4));
        } else {
          setError("Invalid news data.");
        }
      } catch (err) {
        setError(err.message || "Unable to load news.");
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        setCategories(response.data);

        // Shuffle and get 5 random categories for display
        const shuffled = [...response.data].sort(() => Math.random() - 0.5);
        const randomFive = shuffled.slice(0, 5);
        setDisplayCategories(randomFive);

        if (response.data.length > 0) {
          const firstCategoryId = randomFive[0]._id;
          setCurrentCategory(firstCategoryId);
          fetchProducts(0, 9, firstCategoryId);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBestSellers = async () => {
      const allProduct = await getAllProduct();
      if (!Array.isArray(allProduct.data) || allProduct.data.length === 0)
        return;

      const top4 = allProduct.data
        .sort((a, b) => (b.totalRating || 0) - (a.totalRating || 0))
        .slice(0, 4);

      setBestSeller(top4);
    };
    fetchBestSellers();
  }, []);

  return (
    <div className=" mx-auto mt-4">
      <SliderComponent arrImg={arrImgs} onImageClick={handleSliderImageClick} />

      <div
        style={{
          marginTop: 100,
          paddingTop: 50,
          paddingBottom: 60,
          backgroundColor: "#3A060E",
          width: "100%",
        }}
      >
        <h1
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "50px",
            fontSize: "4rem",
            fontWeight: 700,
          }}
        >
          SẢN PHẨM NỔI BẬT
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 50,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="79"
            height="90"
            viewBox="0 0 111 127"
            fill="none"
          >
            <g clipPath="url(#clip0_261_214)">
              <path
                d="M39.4694 1.33946C41.402 -0.47128 44.4 -0.446476 46.3326 1.36427C53.171 7.78868 59.5882 14.7092 65.5842 22.2002C68.3096 18.6283 71.4067 14.734 74.7516 11.559C76.7089 9.72345 79.7317 9.72345 81.6891 11.5838C90.2618 19.7693 97.5214 30.5842 102.625 40.8533C107.655 50.9736 111 61.3172 111 68.6098C111 100.261 86.2728 127 55.5 127C24.3804 127 0 100.236 0 68.585C0 59.06 4.41027 47.4266 11.2487 35.9172C18.1614 24.2342 27.9234 12.0551 39.4694 1.33946ZM55.9212 103.188C62.1897 103.188 67.7397 101.451 72.9676 97.9785C83.3987 90.686 86.1984 76.1008 79.9299 64.641C78.815 62.4086 75.9656 62.2598 74.3551 64.1449L68.1114 71.4127C66.4761 73.2979 63.5277 73.2483 61.9915 71.2887C57.9033 66.0797 50.5942 56.7779 46.4317 51.4945C44.8708 49.5102 41.8975 49.4854 40.3118 51.4697C31.9373 62.0117 27.7252 68.6594 27.7252 76.1256C27.75 93.1168 40.2871 103.188 55.9212 103.188Z"
                fill="#B1E321"
              />
            </g>
            <defs>
              <clipPath id="clip0_261_214">
                <rect width="111" height="127" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 mx-[137px] gap-[18px] mb-6">
          {bestSeller.map((product) => (
            <CardProduct
              key={product._id}
              id={product._id}
              type={"secondary"}
              img={product.productImage}
              title={product.productName}
              price={product.productPrice}
              discount={findPromoApplied(product._id)}
              averageRating={product.averageRating}
              size={product.productSize}
              onClick={() => handleDetailProduct(product._id)}
            />
          ))}
        </div>

        <ButtonComponent
          onClick={() => handleClick("/products")}
          className="m-auto hover:bg-green-800  "
        >
          Xem thêm{" "}
        </ButtonComponent>
      </div>

      <div style={{ width: "100%", marginTop: 50 }}>
        <h1
          style={{
            color: "#3A060E",
            textAlign: "center",
            marginTop: "80px",
            fontSize: "4rem",
            paddingBottom: 10,
            fontWeight: 700,
          }}
        >
          SẢN PHẨM
        </h1>
        <h3
          style={{
            color: "#3A060E",
            textAlign: "center",
            fontSize: "16px ",
            paddingBottom: 25,
          }}
        >
          Chào mừng đến với bộ sưu tập bánh của Avocado
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 25,
          }}
        >
          {displayCategories.map((category) => (
            <ButtonNoBGComponent
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
            >
              {category.categoryName}
            </ButtonNoBGComponent>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 ml-[137px] mr-[137px] gap-[18px] pb-[50px]">
          {products.map((product) => (
            <CardProduct
              key={product._id}
              id={product._id}
              type={"primary"}
              img={product.productImage}
              title={product.productName}
              price={product.productPrice}
              discount={findPromoApplied(product._id)}
              averageRating={product.averageRating}
              onClick={() => handleDetailProduct(product._id)}
            />
          ))}
        </div>

        <div
          style={{
            marginBottom: 50,
          }}
        >
          <ButtonComponent
            onClick={() => handleClick("/products")}
            style={{
              margin: "auto",
            }}
          >
            Xem thêm{" "}
          </ButtonComponent>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-[#3A060E] text-center mt-[50px] text-5xl pb-[10px] font-bold">
          CÂU CHUYỆN AVOCADO
        </h1>
        <h3 className="text-[#3A060E] text-center text-[16px] pb-[25px]">
          Avocado tự hào là tiệm bánh Việt chất lượng được xây dựng từ tình yêu
          dành trọn cho khách hàng
        </h3>
        <div className="flex flex-col md:flex-row">
          <div
            style={{
              position: "absolute",
              backgroundColor: "#b3e42150",
              width: 577,
              height: 406,
              marginLeft: 105,
              marginTop: 17,
              borderRadius: 15,
            }}
          />
          <img
            src={img12}
            style={{
              position: "relative",
              width: "550px",
              height: "400px",
              marginLeft: 137,
              borderRadius: 15,
              flexShrink: 0,
              objectFit: "cover",
            }}
          ></img>

          <div className="max-w-[59rem] max-h-[40rem] rounded-[15px] bg-[#b1e3214d] ml-[10rem] flex-shrink-0 mt-[45px]">
            <h3
              style={{
                color: "#3A060E",
                textAlign: "center",
                marginTop: "80px",
                fontSize: "1.8rem",
                fontWeight: 700,
                paddingBottom: 25,
              }}
            >
              {" "}
              Câu chuyện thương hiệu{" "}
            </h3>
            <LinesEllipsis
              text={text}
              maxLine="5"
              ellipsis="..."
              trimRight
              basedOn="words"
              style={{
                fontSize: 16,
                marginLeft: 45,
                marginRight: 45,
                marginTop: 20,
                marginBottom: 25,
                color: "#3A060E",
                lineHeight: 1.5,
              }}
            />
            <div>
              <a
                style={{
                  color: "#3A060E",
                  textAlign: "center",
                  marginTop: "80px",
                  fontSize: "16px",
                  fontStyle: "italic",
                  textDecoration: "underline",
                  marginLeft: 45,
                  cursor: "pointer",
                }}
                onClick={() => handleClick("/introduce")}
              >
                Xem thêm{" "}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 50 }}>
        <h1
          style={{
            color: "#3A060E",
            textAlign: "center",
            marginTop: "80px",
            fontSize: "4rem",
            paddingBottom: 10,
            fontWeight: 700,
          }}
        >
          TIN TỨC{" "}
        </h1>
        <h3
          style={{
            color: "#3A060E",
            textAlign: "center",
            fontSize: "16px ",
            paddingBottom: 25,
          }}
        >
          Cập nhật thông tin mới nhất về các hoạt động của Avocado
        </h3>

        <div
          className="
    grid 
    grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
    gap-6 
    px-6 md:px-12 lg:px-[137px] 
    pb-6
  "
          data-aos="fade-up"
          data-aos-duration="2000"
        >
          {newsList.map((newsItem, index) => (
            <CardNews
              key={`${index}-${newsItem.id}`}
              id={newsItem._id}
              img={newsItem.newsImage || news}
              title={newsItem.newsTitle}
              detail={newsItem.newsContent}
              onClick={handleDetailNews}
            />
          ))}
        </div>

        <div
          style={{
            marginBottom: 50,
          }}
        >
          <ButtonComponent
            onClick={() => handleClick("/news")}
            style={{
              margin: "auto",
            }}
          >
            Xem thêm
          </ButtonComponent>
          <ChatbotComponent />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
