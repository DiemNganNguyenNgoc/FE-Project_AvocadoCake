import { useState } from "react";
import StratergyService from "../services/StratergyService";

/**
 * Use case: Health Check
 * Quản lý logic kiểm tra trạng thái hệ thống
 */
export const useHealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const checkHealth = async () => {
    setIsLoading(true);
    setError("");
    setHealthStatus(null);
    
    try {
      const data = await StratergyService.getEventPromotionsHealth();
      setHealthStatus(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Không thể kiểm tra trạng thái hệ thống."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocal = () => {
    localStorage.setItem("strat_health", JSON.stringify(healthStatus));
    return true;
  };

  const loadFromLocal = () => {
    const data = localStorage.getItem("strat_health");
    return data ? JSON.parse(data) : null;
  };

  return {
    healthStatus,
    isLoading,
    error,
    checkHealth,
    saveToLocal,
    loadFromLocal,
  };
};
