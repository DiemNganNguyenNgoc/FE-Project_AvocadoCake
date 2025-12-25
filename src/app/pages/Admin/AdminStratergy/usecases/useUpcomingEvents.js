import { useState } from "react";
import StratergyService from "../services/StratergyService";

/**
 * Use case: Upcoming Events
 * Quản lý logic lấy sự kiện sắp tới
 */
export const useUpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [daysAhead, setDaysAhead] = useState(60);

  const fetchUpcomingEvents = async () => {
    setIsLoading(true);
    setError("");
    setUpcomingEvents([]);

    try {
      const data = await StratergyService.getUpcomingEvents(daysAhead);
      setUpcomingEvents(data.events || data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Không thể lấy danh sách sự kiện. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocal = () => {
    localStorage.setItem(
      "strat_upcoming_events",
      JSON.stringify(upcomingEvents)
    );
    return true;
  };

  const loadFromLocal = () => {
    const data = localStorage.getItem("strat_upcoming_events");
    return data ? JSON.parse(data) : null;
  };

  return {
    upcomingEvents,
    isLoading,
    error,
    daysAhead,
    setDaysAhead,
    fetchUpcomingEvents,
    saveToLocal,
    loadFromLocal,
  };
};
