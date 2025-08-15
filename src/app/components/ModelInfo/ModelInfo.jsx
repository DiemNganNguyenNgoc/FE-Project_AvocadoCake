import React, { useState, useEffect } from "react";
import QuizRecommendationService from "../../services/QuizRecommendationService";
import styles from "./ModelInfo.module.css";

const ModelInfo = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      setLoading(true);
      const response = await QuizRecommendationService.getModelInfo();
      setModelInfo(response.data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score) => {
    return (score * 100).toFixed(2) + "%";
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải thông tin model...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Thông tin Hệ thống Gợi ý</h3>

      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <span className={styles.statusLabel}>
            Trạng thái Python ML Model:
          </span>
          <span
            className={`${styles.status} ${
              modelInfo.pythonApiAvailable
                ? styles.available
                : styles.unavailable
            }`}
          >
            {modelInfo.pythonApiAvailable
              ? "🟢 Hoạt động"
              : "🔴 Không khả dụng"}
          </span>
        </div>

        {modelInfo.pythonApiAvailable && modelInfo.modelEvaluation && (
          <div className={styles.metrics}>
            <h4>Đánh giá Model:</h4>
            <div className={styles.metricGrid}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Precision:</span>
                <span className={styles.metricValue}>
                  {formatScore(modelInfo.modelEvaluation.precision)}
                </span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Recall:</span>
                <span className={styles.metricValue}>
                  {formatScore(modelInfo.modelEvaluation.recall)}
                </span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>F1-Score:</span>
                <span className={styles.metricValue}>
                  {formatScore(modelInfo.modelEvaluation.f1_score)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.info}>
          <p>
            <strong>Hệ thống gợi ý:</strong>{" "}
            {modelInfo.pythonApiAvailable
              ? "Sử dụng Machine Learning (LightFM) + Logic Quiz"
              : "Sử dụng Logic Quiz (Fallback)"}
          </p>
          <p>
            <strong>Cập nhật lần cuối:</strong>{" "}
            {new Date(modelInfo.timestamp).toLocaleString("vi-VN")}
          </p>
        </div>

        <button className={styles.refreshButton} onClick={fetchModelInfo}>
          🔄 Làm mới
        </button>
      </div>

      {!modelInfo.pythonApiAvailable && (
        <div className={styles.warning}>
          <h4>⚠️ Lưu ý</h4>
          <p>
            Python ML Model hiện không khả dụng. Hệ thống đang sử dụng
            logic-based fallback. Để có gợi ý tốt hơn, vui lòng khởi động Python
            Recommendation Server.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModelInfo;
