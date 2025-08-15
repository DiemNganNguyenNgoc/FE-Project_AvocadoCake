import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuizRecommendationService from "../../services/QuizRecommendationService";
import CardProduct from "../CardProduct/CardProduct";
import styles from "./QuizRecommendationHistory.module.css";

const QuizRecommendationHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response =
        await QuizRecommendationService.getUserRecommendationHistory(page, 5);

      if (response.success) {
        if (page === 1) {
          setHistory(response.data.history);
        } else {
          setHistory((prev) => [...prev, ...response.data.history]);
        }
        setHasMore(response.data.history.length === 5);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && page === 1) {
    return <div className={styles.loading}>Đang tải lịch sử gợi ý...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lịch sử gợi ý sản phẩm</h2>

      {history.length === 0 ? (
        <div className={styles.empty}>
          <p>Bạn chưa có lịch sử gợi ý nào.</p>
          <button
            className={styles.takeQuizButton}
            onClick={() => navigate("/quiz")}
          >
            Tham gia quiz ngay
          </button>
        </div>
      ) : (
        <div className={styles.historyList}>
          {history.map((session, index) => (
            <div key={session.sessionId} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <h3>Lần gợi ý #{history.length - index}</h3>
                <span className={styles.date}>
                  {formatDate(session.createdAt)}
                </span>
              </div>

              <div className={styles.productsGrid}>
                {session.recommendations.map((product) => (
                  <div key={product._id} className={styles.productCard}>
                    <CardProduct
                      id={product._id}
                      type="secondary"
                      img={product.imageUrl}
                      title={product.name}
                      price={product.price}
                      discount={product.productDiscount || 0}
                      averageRating={product.averageRating}
                      totalRatings={product.totalRatings}
                      onClick={() => handleProductClick(product._id)}
                    />
                  </div>
                ))}
              </div>

              {session.totalRecommendations > 5 && (
                <div className={styles.moreProducts}>
                  <p>Và {session.totalRecommendations - 5} sản phẩm khác...</p>
                </div>
              )}
            </div>
          ))}

          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button
                className={styles.loadMoreButton}
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Đang tải..." : "Tải thêm"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizRecommendationHistory;
