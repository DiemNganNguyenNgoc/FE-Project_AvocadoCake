import { useState } from "react";
import StratergyService from "../services/StratergyService";

/**
 * Use case: Event Promotions
 * Quản lý logic lấy AI event promotions
 */
export const useEventPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [daysAhead, setDaysAhead] = useState(60);

  const fetchEventPromotions = async () => {
    setIsLoading(true);
    setError("");
    setPromotions([]);

    try {
      const rawResponse = await StratergyService.getEventPromotions(daysAhead);
      setPromotions(rawResponse);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Không thể kết nối đến AI Strategy API. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocal = () => {
    localStorage.setItem("strat_event_promotions", JSON.stringify(promotions));
    return true;
  };

  const loadFromLocal = () => {
    const data = localStorage.getItem("strat_event_promotions");
    return data ? JSON.parse(data) : null;
  };

  return {
    promotions,
    isLoading,
    error,
    daysAhead,
    setDaysAhead,
    fetchEventPromotions,
    saveToLocal,
    loadFromLocal,
  };
};
