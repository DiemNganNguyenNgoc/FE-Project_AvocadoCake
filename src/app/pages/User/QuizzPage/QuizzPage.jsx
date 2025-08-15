import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import styles from "./QuizzPage.module.css";
import QuizService from "../../../services/QuizService";
import { getDetailsproduct } from "../../../services/productServices";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import CardProduct from "../../../components/CardProduct/CardProduct";
import Loading from "../../../components/LoadingComponent/Loading";

const QuizzPage = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [customAnswer, setCustomAnswer] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(crypto.randomUUID()); // Generate unique session ID
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Vui lòng đăng nhập để tham gia quiz");
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await QuizService.getQuizzes();
        setQuestions(data);
        setCurrentQuestion(data[0]);
        setError(null);
      } catch (error) {
        if (error.message.includes("401")) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setError(error.message);
        }
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [navigate]);

  const handleAnswer = async (answer) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Vui lòng đăng nhập để tham gia quiz");
        return;
      }

      const newAnswers = [
        ...answers,
        {
          questionId: currentQuestion._id,
          answer,
          customAnswer: answer === "custom" ? customAnswer : null,
          
          sessionId: sessionId,
        },
      ];
      setAnswers(newAnswers);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentQuestion(questions[currentIndex + 1]);
        setCustomAnswer("");
      } else {
        setLoadingRecommendation(true);
        try {
          // Lưu câu trả lời
          await QuizService.saveMultipleResponses(newAnswers);
          console.log("Answers saved successfully");

          // Lấy userId từ JWT token
          const tokenData = jwtDecode(token);
          console.log("JWT Token data:", tokenData);
          const userId = tokenData.id; // Sử dụng trường 'id' từ JWT token
          console.log("Extracted userId:", userId);

          if (!userId) {
            setError(
              "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
            );
            setLoadingRecommendation(false);
            return;
          }

          // Lấy gợi ý
          const recs = await QuizService.getQuizRecommendations(
            userId,
            sessionId
          );
          console.log("Recommendations received:", recs);

          // Fetch thông tin chi tiết của từng sản phẩm
          const productDetails = await Promise.all(
            recs.map(async (productId) => {
              try {
                const token = localStorage.getItem("access_token");
                const response = await getDetailsproduct(productId, token);
                return response.data; // Chỉ lấy phần data
              } catch (error) {
                console.error(`Error fetching product ${productId}:`, error);
                return null;
              }
            })
          );

          // Lọc bỏ các sản phẩm null
          const validProducts = productDetails.filter(
            (product) => product !== null
          );
          console.log("Product details:", validProducts);

          setRecommendations(validProducts);
          setShowResults(true);
        } catch (error) {
          console.error("Error in final step:", error);
          setError(error.message);
        } finally {
          setLoadingRecommendation(false);
        }
      }
    } catch (error) {
      console.error("Full error object:", error);
      if (error.message.includes("401")) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError(error.message);
      }
      console.error("Error handling answer:", error);
    }
  };

  const handleProductClick = (product) => {
    navigate("/view-product-detail", {
      state: {
        productId: product._id,
        productName: product.productName,
        productSize: product.productSize,
        productImage: product.productImage,
        productDescription: product.productDescription,
        productCategory: product.productCategory,
        productPrice: product.productPrice,
      },
    });
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải câu hỏi...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (showResults) {
    return (
      <div className={styles.resultsContainer}>
        <h2>Gợi ý bánh dành cho bạn</h2>
        {recommendations.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              marginLeft: "auto",
              marginRight: "auto",
              gap: "30px",
              paddingBottom: 50,
              maxWidth: "1200px",
              justifyContent: "center",
            }}
          >
            {recommendations.map((product) => (
              <CardProduct
                key={product._id}
                id={product._id}
                type="primary"
                img={product.productImage}
                title={product.productName}
                price={product.productPrice}
                discount={product.productDiscount}
                averageRating={product.averageRating}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        ) : (
          <p>Chúng tôi đang cập nhật gợi ý cho bạn...</p>
        )}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <ButtonComponent onClick={() => navigate("/")}>
            Về trang chủ
          </ButtonComponent>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className={styles.error}>Không tìm thấy câu hỏi</div>;
  }

  if (loadingRecommendation) {
    return <Loading isLoading={true} />;
  }

  return (
    <div className="container-xl">
      <div className={styles.quizContainer}>
        <div className={styles.progress}>
          Câu hỏi {currentIndex + 1}/{questions.length}
        </div>
        <div className={styles.questionCard}>
          <h2>{currentQuestion.question}</h2>
          <div className={styles.options}>
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={styles.optionButton}
              >
                {option.imageUrl && (
                  <img src={option.imageUrl} alt={option.text} />
                )}
                <span>{option.text}</span>
              </button>
            ))}
            {currentQuestion.allowCustomAnswer && (
              <div className={styles.customAnswer}>
                <input
                  type="text"
                  value={customAnswer}
                  onChange={(e) => setCustomAnswer(e.target.value)}
                  placeholder="Nhập câu trả lời của bạn..."
                />
                <ButtonComponent
                  onClick={() => handleAnswer("custom")}
                  disabled={!customAnswer.trim()}
                >
                  Gửi
                </ButtonComponent>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzPage;
