import React, { useState } from "react";
import {
  Sparkles,
  BarChart2,
  Layers,
  Calendar,
  Zap,
  HeartPulse,
  Info,
} from "lucide-react";
import Breadcrumb from "./partials/Breadcrumb";
import PromotionCard from "./partials/PromotionCard";
import StratergyService from "./services/StratergyService";
import { useNavigate } from "react-router-dom";

/**
 * AdminStratergy - Trang AI Strategy với UI chatbot
 * Design System: AvocadoCake + Gestalt Principles
 * Features:
 * - AI recommendations từ RCM_PRICE
 * - Chatbot-style interface
 * - Product cards với discount suggestions
 * - Integration với AdminDiscount để thêm promotion
 */

const TABS = [
  {
    key: "event-promotions",
    label: "AI Event Promotions",
    icon: <Sparkles className="w-5 h-5 mr-1" />,
  },
  {
    key: "analyze-products",
    label: "Analyze Products",
    icon: <BarChart2 className="w-5 h-5 mr-1" />,
  },
  {
    key: "discover-combos",
    label: "Combo Discovery",
    icon: <Layers className="w-5 h-5 mr-1" />,
  },
  {
    key: "upcoming-events",
    label: "Upcoming Events",
    icon: <Calendar className="w-5 h-5 mr-1" />,
  },
  {
    key: "smart-promotion",
    label: "Smart Promotion",
    icon: <Zap className="w-5 h-5 mr-1" />,
  },
  {
    key: "health",
    label: "Health Check",
    icon: <HeartPulse className="w-5 h-5 mr-1" />,
  },
];

const AdminStratergy = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("event-promotions");
  const [isLoading, setIsLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [daysAhead, setDaysAhead] = useState(60);
  const [productsAnalysis, setProductsAnalysis] = useState([]);
  const [combos, setCombos] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [smartPromotion, setSmartPromotion] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [eventPromotionsError, setEventPromotionsError] = useState("");
  const [analyzeError, setAnalyzeError] = useState("");
  const [comboError, setComboError] = useState("");
  const [eventError, setEventError] = useState("");
  const [smartError, setSmartError] = useState("");
  const [healthError, setHealthError] = useState("");
  const [comboParams, setComboParams] = useState({
    minSupport: 0.05,
    minConfidence: 0.3,
  });
  const [smartFocus, setSmartFocus] = useState("balanced");
  // For analyze products
  const [analyzePeriod, setAnalyzePeriod] = useState(30);

  // Fetch AI Event Promotions
  const handleGetEventPromotions = async () => {
    setIsLoading(true);
    setEventPromotionsError("");
    setPromotions([]);
    try {
      const rawResponse = await StratergyService.getEventPromotions(daysAhead);
      // const formattedData =
      //   StratergyService.formatPromotionResponse(rawResponse);
      setPromotions(rawResponse);
    } catch (error) {
      setEventPromotionsError(
        error.response?.data?.detail ||
          "Không thể kết nối đến AI Strategy API. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Analyze Products
  const handleAnalyzeProducts = async () => {
    setIsLoading(true);
    setAnalyzeError("");
    setProductsAnalysis([]);
    try {
      const data = await StratergyService.analyzeProducts(analyzePeriod);
      setProductsAnalysis(data.products || data);
    } catch (error) {
      setAnalyzeError(
        error.response?.data?.detail ||
          "Không thể phân tích sản phẩm. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Combos
  const handleDiscoverCombos = async () => {
    setIsLoading(true);
    setComboError("");
    setCombos([]);
    try {
      const data = await StratergyService.discoverCombos(
        comboParams.minSupport,
        comboParams.minConfidence
      );
      setCombos(data.combos || data);
    } catch (error) {
      setComboError(
        error.response?.data?.detail ||
          "Không thể phát hiện combo. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Upcoming Events
  const handleGetUpcomingEvents = async () => {
    setIsLoading(true);
    setEventError("");
    setUpcomingEvents([]);
    try {
      const data = await StratergyService.getUpcomingEvents(daysAhead);
      setUpcomingEvents(data.events || data);
    } catch (error) {
      setEventError(
        error.response?.data?.detail ||
          "Không thể lấy danh sách sự kiện. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Smart Promotion
  const handleGenerateSmartPromotion = async () => {
    setIsLoading(true);
    setSmartError("");
    setSmartPromotion(null);
    try {
      const data = await StratergyService.generateSmartPromotion(smartFocus);
      setSmartPromotion(data.promotion || data);
    } catch (error) {
      setSmartError(
        error.response?.data?.detail ||
          "Không thể tạo khuyến mãi thông minh. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Health
  const handleGetHealthStatus = async () => {
    setIsLoading(true);
    setHealthError("");
    setHealthStatus(null);
    try {
      const data = await StratergyService.getEventPromotionsHealth();
      setHealthStatus(data);
    } catch (error) {
      setHealthError(
        error.response?.data?.detail ||
          "Không thể kiểm tra trạng thái hệ thống."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add promotion to discount page
  const handleAddPromotion = (promotion) => {
    const discountData = {
      eventName: promotion.eventName,
      eventType: promotion.eventType,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      products: promotion.products,
      description: promotion.description,
    };
    sessionStorage.setItem("ai_promotion_draft", JSON.stringify(discountData));
    navigate("/admin/discount", {
      state: { fromAI: true, promotionData: discountData },
    });
  };

  // Modal state for viewing saved data
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [savedTitle, setSavedTitle] = useState("");

  // Save and view helpers
  const saveToLocal = (key, data, title) => {
    localStorage.setItem(key, JSON.stringify(data));
    alert("Đã lưu kết quả vào localStorage!");
  };
  const viewSaved = (key, title) => {
    const data = localStorage.getItem(key);
    setSavedTitle(title);
    setSavedData(data ? JSON.parse(data) : null);
    setShowSavedModal(true);
  };

  // UI for each tab
  const renderTabPanel = () => {
    switch (activeTab) {
      case "event-promotions":
        return (
          <div>
            <div className="flex items-end space-x-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Số ngày tìm kiếm sự kiện
                </label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={daysAhead}
                  onChange={(e) => setDaysAhead(Number(e.target.value))}
                  className="w-32 px-4 py-2 text-base rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                  placeholder="60"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleGetEventPromotions}
                disabled={isLoading}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isLoading ? "Đang tải..." : "Lấy khuyến nghị"}
                </span>
              </button>
            </div>
            {eventPromotionsError && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3 mb-4 text-red-700 font-semibold">
                {eventPromotionsError}
              </div>
            )}
            {/* Save/View buttons */}
            <div className="flex space-x-2 mb-4">
              {promotions.length > 0 && (
                <>
                  <button
                    onClick={() =>
                      saveToLocal(
                        "strat_event_promotions",
                        promotions,
                        "AI Event Promotions"
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition"
                  >
                    Lưu kết quả
                  </button>
                  <button
                    onClick={() =>
                      viewSaved("strat_event_promotions", "AI Event Promotions")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                  >
                    Xem dữ liệu đã lưu
                  </button>
                </>
              )}
            </div>
            <div className="space-y-6">
              {promotions.length > 0 ? (
                promotions.map((promotion, index) => (
                  <PromotionCard
                    key={index}
                    promotion={promotion}
                    onAddPromotion={handleAddPromotion}
                  />
                ))
              ) : (
                <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-12 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Chưa có khuyến nghị
                  </h3>
                  <p className="text-base text-gray-600 max-w-md mx-auto">
                    Nhập số ngày và bấm "Lấy khuyến nghị" để AI phân tích và đề
                    xuất các chương trình khuyến mãi phù hợp.
                  </p>
                  {/* View saved if any */}
                  <button
                    onClick={() =>
                      viewSaved("strat_event_promotions", "AI Event Promotions")
                    }
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                  >
                    Xem dữ liệu đã lưu
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case "analyze-products":
        return (
          <div>
            <div className="flex space-x-2 mb-4">
              {productsAnalysis.length > 0 && (
                <>
                  <button
                    onClick={() =>
                      saveToLocal(
                        "strat_analyze_products",
                        productsAnalysis,
                        "Analyze Products"
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition"
                  >
                    Lưu kết quả
                  </button>
                  <button
                    onClick={() =>
                      viewSaved("strat_analyze_products", "Analyze Products")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                  >
                    Xem dữ liệu đã lưu
                  </button>
                </>
              )}
            </div>
            <div className="flex items-end space-x-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Số ngày phân tích
                </label>
                <input
                  type="number"
                  min="7"
                  max="90"
                  value={analyzePeriod}
                  onChange={(e) => setAnalyzePeriod(Number(e.target.value))}
                  className="w-32 px-4 py-2 text-base rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                  placeholder="30"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleAnalyzeProducts}
                disabled={isLoading}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <BarChart2 className="w-4 h-4 mr-2" />
                  {isLoading ? "Đang phân tích..." : "Phân tích sản phẩm"}
                </span>
              </button>
            </div>
            {analyzeError && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3 mb-4 text-red-700 font-semibold">
                {analyzeError}
              </div>
            )}
            <div className="overflow-x-auto">
              {productsAnalysis.length > 0 ? (
                <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-md">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Sản phẩm
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Trạng thái
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Giá
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Giảm giá đề xuất
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Lý do
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsAnalysis.map((p, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="px-4 py-2 font-medium text-gray-900">
                          {p.product_name || p.name}
                        </td>
                        <td className="px-4 py-2 text-gray-700">{p.status}</td>
                        <td className="px-4 py-2 text-gray-700">
                          {p.price || p.current_price}
                        </td>
                        <td className="px-4 py-2 text-blue-700 font-bold">
                          {p.recommended_discount || p.discount_percent}%
                        </td>
                        <td className="px-4 py-2 text-gray-600">{p.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-8 text-center">
                  <BarChart2 className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                  <p className="text-base text-gray-600">
                    Chưa có dữ liệu phân tích.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "discover-combos":
        return (
          <div>
            <div className="flex space-x-2 mb-4">
              {combos.length > 0 && (
                <>
                  <button
                    onClick={() =>
                      saveToLocal("strat_combos", combos, "Combo Discovery")
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition"
                  >
                    Lưu kết quả
                  </button>
                  <button
                    onClick={() => viewSaved("strat_combos", "Combo Discovery")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                  >
                    Xem dữ liệu đã lưu
                  </button>
                </>
              )}
            </div>
            <div className="flex items-end space-x-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Min Support
                </label>
                <input
                  type="number"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={comboParams.minSupport}
                  onChange={(e) =>
                    setComboParams((prev) => ({
                      ...prev,
                      minSupport: Number(e.target.value),
                    }))
                  }
                  className="w-24 px-4 py-2 text-base rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Min Confidence
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="0.9"
                  step="0.01"
                  value={comboParams.minConfidence}
                  onChange={(e) =>
                    setComboParams((prev) => ({
                      ...prev,
                      minConfidence: Number(e.target.value),
                    }))
                  }
                  className="w-24 px-4 py-2 text-base rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleDiscoverCombos}
                disabled={isLoading}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Layers className="w-4 h-4 mr-2" />
                  {isLoading ? "Đang tìm..." : "Phát hiện combo"}
                </span>
              </button>
            </div>
            {comboError && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3 mb-4 text-red-700 font-semibold">
                {comboError}
              </div>
            )}
            <div className="overflow-x-auto">
              {combos.length > 0 ? (
                <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-md">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Combo
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Tần suất
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Confidence
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Bundle Discount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {combos.map((c, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="px-4 py-2 font-medium text-gray-900">
                          {c.combo_name ||
                            (c.product_1_name && c.product_2_name
                              ? `${c.product_1_name} + ${c.product_2_name}`
                              : c.product_1 && c.product_2
                              ? `${c.product_1} + ${c.product_2}`
                              : c.product_1_id && c.product_2_id
                              ? `${c.product_1_id} + ${c.product_2_id}`
                              : "N/A")}
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          {c.frequency_together}
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          {c.confidence}
                        </td>
                        <td className="px-4 py-2 text-blue-700 font-bold">
                          {c.recommended_bundle_discount != null
                            ? `${c.recommended_bundle_discount}%`
                            : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-8 text-center">
                  <Layers className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                  <p className="text-base text-gray-600">
                    Chưa có dữ liệu combo.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "upcoming-events":
        return (
          <div>
            <div className="flex space-x-2 mb-4">
              {upcomingEvents.length > 0 && (
                <>
                  <button
                    onClick={() =>
                      saveToLocal(
                        "strat_upcoming_events",
                        upcomingEvents,
                        "Upcoming Events"
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition"
                  >
                    Lưu kết quả
                  </button>
                  <button
                    onClick={() =>
                      viewSaved("strat_upcoming_events", "Upcoming Events")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                  >
                    Xem dữ liệu đã lưu
                  </button>
                </>
              )}
            </div>
            <div className="flex items-end space-x-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Số ngày tới
                </label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={daysAhead}
                  onChange={(e) => setDaysAhead(Number(e.target.value))}
                  className="w-32 px-4 py-2 text-base rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                  placeholder="60"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleGetUpcomingEvents}
                disabled={isLoading}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {isLoading ? "Đang tải..." : "Lấy sự kiện"}
                </span>
              </button>
            </div>
            {eventError && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3 mb-4 text-red-700 font-semibold">
                {eventError}
              </div>
            )}
            <div className="overflow-x-auto">
              {upcomingEvents.length > 0 ? (
                <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-md">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Sự kiện
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Ngày diễn ra
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Còn lại
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Discount Range
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">
                        Target Categories
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.map((e, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="px-4 py-2 font-medium text-gray-900">
                          {e.event_type}
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          {e.event_date}
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          {e.days_until_event}
                        </td>
                        <td className="px-4 py-2 text-blue-700 font-bold">
                          {e.recommended_discount_range}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {Array.isArray(e.target_categories)
                            ? e.target_categories.join(", ")
                            : e.target_categories}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-8 text-center">
                  <Calendar className="w-10 h-10 text-green-400 mx-auto mb-3" />
                  <p className="text-base text-gray-600">
                    Chưa có sự kiện nào sắp tới.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "smart-promotion":
        return (
          <div>
            <div className="flex space-x-2 mb-4">
              {smartPromotion && (
                <>
                  <button
                    onClick={() =>
                      saveToLocal(
                        "strat_smart_promotion",
                        smartPromotion,
                        "Smart Promotion"
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition"
                  >
                    Lưu kết quả
                  </button>
                  <button
                    onClick={() =>
                      viewSaved("strat_smart_promotion", "Smart Promotion")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                  >
                    Xem dữ liệu đã lưu
                  </button>
                </>
              )}
            </div>
            <div className="flex items-end space-x-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Chiến lược
                </label>
                <select
                  value={smartFocus}
                  onChange={(e) => setSmartFocus(e.target.value)}
                  className="w-40 px-4 py-2 text-base rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                  disabled={isLoading}
                >
                  <option value="revenue">Tối ưu doanh thu</option>
                  <option value="clearance">Xả hàng tồn</option>
                  <option value="balanced">Cân bằng</option>
                </select>
              </div>
              <button
                onClick={handleGenerateSmartPromotion}
                disabled={isLoading}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Zap className="w-4 h-4 mr-2" />
                  {isLoading ? "Đang tạo..." : "Tạo khuyến mãi"}
                </span>
              </button>
            </div>
            {smartError && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3 mb-4 text-red-700 font-semibold">
                {smartError}
              </div>
            )}
            <div className="space-y-6">
              {smartPromotion ? (
                <PromotionCard
                  promotion={smartPromotion}
                  onAddPromotion={handleAddPromotion}
                />
              ) : (
                <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-8 text-center">
                  <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                  <p className="text-base text-gray-600">
                    Chưa có khuyến mãi thông minh nào.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "health":
        return (
          <div>
            <div className="flex space-x-2 mb-4">
              {healthStatus && (
                <>
                  <button
                    onClick={() =>
                      saveToLocal("strat_health", healthStatus, "Health Check")
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition"
                  >
                    Lưu kết quả
                  </button>
                  <button
                    onClick={() => viewSaved("strat_health", "Health Check")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                  >
                    Xem dữ liệu đã lưu
                  </button>
                </>
              )}
            </div>
            <div className="flex items-end space-x-4 mb-6">
              <button
                onClick={handleGetHealthStatus}
                disabled={isLoading}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <HeartPulse className="w-4 h-4 mr-2" />
                  {isLoading ? "Đang kiểm tra..." : "Kiểm tra hệ thống"}
                </span>
              </button>
            </div>
            {healthError && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3 mb-4 text-red-700 font-semibold">
                {healthError}
              </div>
            )}
            <div className="space-y-6">
              {healthStatus ? (
                <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Trạng thái hệ thống
                  </h3>
                  <pre className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 overflow-x-auto">
                    {JSON.stringify(healthStatus, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-8 text-center">
                  <HeartPulse className="w-10 h-10 text-pink-400 mx-auto mb-3" />
                  <p className="text-base text-gray-600">
                    Chưa kiểm tra trạng thái hệ thống.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full mx-auto px-6 py-8">
        {/* Header */}
        <Breadcrumb />
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                AI Strategy Assistant
              </h1>
              <p className="text-lg text-gray-600">
                Khuyến nghị khuyến mãi thông minh từ AI
              </p>
            </div>
          </div>
          {/* Info Banner */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl px-6 py-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-semibold">
                  Powered by RCM_PRICE AI Engine
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  Sử dụng Thompson Sampling + Gemini AI để tối ưu hóa doanh thu
                  và giữ chân khách hàng
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Tab Bar */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center px-5 py-2 rounded-2xl font-bold text-sm transition-all duration-200 border-2 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-lg"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Tab Panel */}
        <div>{renderTabPanel()}</div>
      </div>
      {/* Saved Data Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setShowSavedModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
              title="Đóng"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {savedTitle} - Dữ liệu đã lưu
            </h2>
            <div className="overflow-x-auto max-h-[60vh]">
              <pre className="text-sm text-gray-800 bg-gray-50 rounded-xl p-4">
                {savedData
                  ? typeof savedData === "object"
                    ? JSON.stringify(savedData, null, 2)
                    : String(savedData)
                  : "Không có dữ liệu đã lưu."}
              </pre>
            </div>
          </div>
        </div>
      )}
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminStratergy;
