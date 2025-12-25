import { useState } from "react";
import StratergyService from "../services/StratergyService";

/**
 * Use case: Smart Promotion
 * Quản lý logic tạo khuyến mãi thông minh
 */
export const useSmartPromotion = () => {
  const [smartPromotion, setSmartPromotion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [smartFocus, setSmartFocus] = useState("balanced");

  const generateSmartPromotion = async () => {
    setIsLoading(true);
    setError("");
    setSmartPromotion(null);

    try {
      const data = await StratergyService.generateSmartPromotion(smartFocus);
      setSmartPromotion(data.promotion || data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Không thể tạo khuyến mãi thông minh. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocal = () => {
    localStorage.setItem(
      "strat_smart_promotion",
      JSON.stringify(smartPromotion)
    );
    return true;
  };

  const loadFromLocal = () => {
    const data = localStorage.getItem("strat_smart_promotion");
    return data ? JSON.parse(data) : null;
  };

  return {
    smartPromotion,
    isLoading,
    error,
    smartFocus,
    setSmartFocus,
    generateSmartPromotion,
    saveToLocal,
    loadFromLocal,
  };
};
