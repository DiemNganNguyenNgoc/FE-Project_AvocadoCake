import { useState } from "react";
import StratergyService from "../services/StratergyService";

/**
 * Use case: Analyze Products
 * Quản lý logic phân tích sản phẩm
 */
export const useAnalyzeProducts = () => {
  const [productsAnalysis, setProductsAnalysis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyzePeriod, setAnalyzePeriod] = useState(30);

  const analyzeProducts = async () => {
    setIsLoading(true);
    setError("");
    setProductsAnalysis([]);

    try {
      const data = await StratergyService.analyzeProducts(analyzePeriod);
      setProductsAnalysis(data.products || data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Không thể phân tích sản phẩm. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocal = () => {
    localStorage.setItem(
      "strat_analyze_products",
      JSON.stringify(productsAnalysis)
    );
    return true;
  };

  const loadFromLocal = () => {
    const data = localStorage.getItem("strat_analyze_products");
    return data ? JSON.parse(data) : null;
  };

  return {
    productsAnalysis,
    isLoading,
    error,
    analyzePeriod,
    setAnalyzePeriod,
    analyzeProducts,
    saveToLocal,
    loadFromLocal,
  };
};
