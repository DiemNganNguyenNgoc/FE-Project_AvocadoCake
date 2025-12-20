import { useState } from "react";
import StratergyService from "../services/StratergyService";

/**
 * Use case: Discover Combos
 * Quản lý logic phát hiện combo sản phẩm
 */
export const useDiscoverCombos = () => {
  const [combos, setCombos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [comboParams, setComboParams] = useState({
    minSupport: 0.01,
    minConfidence: 0.3,
  });

  const discoverCombos = async () => {
    setIsLoading(true);
    setError("");
    setCombos([]);

    try {
      const data = await StratergyService.discoverCombos(
        comboParams.minSupport,
        comboParams.minConfidence
      );
      setCombos(data.combos || data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Không thể phát hiện combo. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocal = () => {
    localStorage.setItem("strat_combos", JSON.stringify(combos));
    return true;
  };

  const loadFromLocal = () => {
    const data = localStorage.getItem("strat_combos");
    return data ? JSON.parse(data) : null;
  };

  return {
    combos,
    isLoading,
    error,
    comboParams,
    setComboParams,
    discoverCombos,
    saveToLocal,
    loadFromLocal,
  };
};
