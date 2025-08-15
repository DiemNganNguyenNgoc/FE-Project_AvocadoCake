import React, { useEffect, useState } from "react";
import SliderComponent from "../../../components/SliderComponent/SliderComponent";
import CardProduct from "../../../components/CardProduct/CardProduct";
import ButtonNoBGComponent from "../../../components/ButtonNoBGComponent/ButtonNoBGComponent";
import LinesEllipsis from "react-lines-ellipsis";
import CardNews from "../../../components/CardNews/CardNews";
import news from "../../../assets/img/news.jpg";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { getAllDiscount } from "../../../services/DiscountService";
import { getAllNews } from "../../../services/NewsService";
import img12 from "../../../assets/img/hero_2.jpg";
import ChatbotComponent from "../../../components/ChatbotComponent/ChatbotComponent";
import { getAllCategory } from "../../../services/CategoryService";
import {
  getAllProduct,
  getProductsByCategory,
} from "../../../services/productServices";
import AOS from "aos";
import "aos/dist/aos.css";

const text =
  "Là một hệ thống đội ngũ nhân viên và lãnh đạo chuyên nghiệp, gồm CBCNV và những người thợ đã có kinh nghiệm lâu năm trong các công ty đầu ngành. Mô hình vận hành hoạt động công ty được bố trí theo chiều ngang, làm gia tăng sự thuận tiện trong việc vận hành cỗ máy kinh doanh và gia tăng sự phối hợp thống nhất giữa các bộ phận trong công ty.";

const HomePage = () => {
  const [promoProducts, setPromoProducts] = useState([]);
  const [promos, setPromos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [arrImgs, setArrImg] = useState([]); // State lưu trữ mảng hình ảnh
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm
  const [currentCategory, setCurrentCategory] = useState(null); // State lưu category hiện tại
  const [selectedPromo, setSelectedPromo] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [bestSeller, setBestSeller] = useState([]);
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(path);
  };
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 2000, // thời gian chạy hiệu ứng (ms)
      once: false, // chỉ animate 1 lần khi scroll tới
    });
  }, []);

  // Fetch danh sách khuyến mãi
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const discounts = await getAllDiscount();
        console.log("ALL DISCOUNTS: ", discounts.data);
        if (Array.isArray(discounts.data)) {
          setPromos(discounts.data); // Lưu danh sách khuyến mãi
          const images = Array.isArray(discounts.data)
            ? discounts.data
                .map((discount) => discount?.discountImage)
                .filter(Boolean)
            : [];
          console.log("I<MAD: ", images);
          setArrImg(images);
        } else {
          setError("Dữ liệu trả về không hợp lệ.");
        }
      } catch (err) {
        setError(err.message || "Không thể tải danh sách khuyến mãi.");
      }
    };

    fetchDiscounts();
  }, []);

  // Ví dụ, thay vì dùng promos trong handleSliderImageClick, bạn có thể:
  const handleSliderImageClick = () => {
    navigate("/products", { state: { showPromo: true } });
  };

  //Lấy danh sách tin tức:
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getAllNews();

        if (Array.isArray(response.data)) {
          setNewsList(response.data.slice(0, 4)); // Chỉ lấy 3 tin tức đầu
        } else {
          setError("Dữ liệu trả về không hợp lệ.");
        }
      } catch (err) {
        setError(err.message || "Không thể tải danh sách tin tức.");
      }
    };
    fetchNews();
  }, []);

  //Xem chi tiet
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

  // Lay danh sach category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();

        setCategories(response.data); // Lưu danh sách category vào state

        // Lấy category đầu tiên và fetch sản phẩm tương ứng
        if (response.data.length > 0) {
          const firstCategoryId = response.data[0]._id;
          setCurrentCategory(firstCategoryId); // Lưu category đầu tiên
          fetchProducts(0, 9, firstCategoryId); // Fetch sản phẩm của category đầu tiên
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch danh sách sản phẩm khi component được mount
  const fetchProducts = async (page = 0, limit = 9, categoryId = null) => {
    try {
      const response = await getProductsByCategory(categoryId);

      // setCurrentPage(page); // Cập nhật trang hiện tại
      // setTotalPages(Math.ceil(data.data.lenght / limit)); // Tính tổng số trang

      if (Array.isArray(response.data)) {
        setProducts(response.data.slice(0, 4));
      } else {
        console.error("Products data is not in expected format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Khi nhấn vào sản phẩm
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

  //Click categoryName:
  const handleCategoryClick = (categoryId) => {
    setCurrentCategory(categoryId); // Lưu categoryId để lọc sản phẩm
    setCurrentPage(0); // Reset trang về 0 khi chuyển qua category mới
    fetchProducts(0, 9, categoryId);
  };

  useEffect(() => {
    const fetchBestSellers = async () => {
      const allProduct = await getAllProduct(); // <- chờ fetch hoàn tất
      //console.log("Top 4 sản phẩm đánh giá cao nhất:", allProduct);

      //console.log("Top 4 sản phẩm đánh giá cao nhất:", allProduct);
      if (!Array.isArray(allProduct.data) || allProduct.data.length === 0)
        return;
      console.log("ALL: ", allProduct.data);
      const top4 = allProduct.data
        .sort((a, b) => (b.totalRating || 0) - (a.totalRating || 0))
        .slice(0, 4);

      console.log("Top 4 sản phẩm đánh giá cao nhất:", top4);
      setBestSeller(top4); // <- cập nhật state
      console.log("BEST SELLER: ", bestSeller)
    };

    fetchBestSellers();
  }, []);

  const promoProductList = selectedPromo.discountProduct || [];
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

    // Lấy phần trăm giảm nếu có
    const discountPercent = appliedDiscount?.discountValue || 0;

    return discountPercent;
  };

  return (
    <div>
      {/* Banner quànrg cáo */}
      <div>
        <SliderComponent
          arrImg={arrImgs}
          onImageClick={handleSliderImageClick}
        />
      </div>
      <div
        data-aos="fade-up"
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

        {/* 1 slide  */}
        {/* <Row
          style={{
            maxWidth: 1000,
            margin: 'auto'
          }}>
          <Col >
            <CardProduct type={"secondary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col >
            <CardProduct type={"secondary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col >
            <CardProduct type={"secondary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col>
            <CardProduct type={"secondary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
        </Row> */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            marginLeft: "137px",
            marginRight: "137px",
            gap: "18px",
          }}
          data-aos="fade-up"
          data-aos-duration="2000"
          data-aos-anchor-placement="center-bottom"
        >
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
          style={{
            margin: "auto",
          }}
        >
          Xem thêm{" "}
        </ButtonComponent>
      </div>

      {/* Sản phẩm */}
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
          {categories.map((category) => (
            <ButtonNoBGComponent
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
            >
              {category.categoryName}
            </ButtonNoBGComponent>
          ))}
        </div>
        {/* 1 tab */}
        {/* <Row
          style={{
            maxWidth: 1000,
            margin: 'auto'
            
          }}>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
        </Row> */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            marginLeft: "137px",
            marginRight: "137px",
            gap: "18px",
            paddingBottom: 50,
          }}
          data-aos="fade-up"
          data-aos-duration="2000"
          data-aos-anchor-placement="center-bottom"
        >
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

      {/* Cau chuyen avocado */}
      <div>
        <h1
          style={{
            color: "#3A060E",
            textAlign: "center",
            marginTop: "50px",
            fontSize: "4rem",
            paddingBottom: 10,
            fontWeight: 700,
          }}
        >
          {" "}
          CÂU CHUYỆN AVOCADO
        </h1>
        <h3
          style={{
            color: "#3A060E",
            textAlign: "center",
            fontSize: "16px ",
            paddingBottom: 25,
          }}
        >
          Avocado tự hào là tiệm bánh Việt chất lượng được xây dựng từ tình yêu
          dành trọn cho khách hàng
        </h3>
        <div
          style={{
            display: "flex",
            marginRight: "137px",
          }}
        >
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

          <div
            style={{
              maxWidth: "56rem",
              maxHeight: "30rem",
              borderRadius: 15,
              background: "#b1e3214d",
              marginLeft: "10rem",
              flexShrink: 0,

              marginTop: "45px",
            }}
          >
            <h3
              style={{
                color: "#3A060E",
                textAlign: "center",
                marginTop: "80px",
                fontSize: "1.8rem",
                fontWeight: 700,
                marginTop: 45,
                paddingBottom: 25,
              }}
            >
              {" "}
              Câu chuyện thương hiệu{" "}
            </h3>
            <LinesEllipsis
              text={text}
              maxLine="4" // Số dòng tối đa
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
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            marginLeft: "137px",
            marginRight: "137px",
            gap: "25px",
            paddingBottom: 25,
          }}
          data-aos="fade-up"
          data-aos-duration="2000"
        >
          {newsList.map((newsItem, index) => (
            <CardNews
              key={index}
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
