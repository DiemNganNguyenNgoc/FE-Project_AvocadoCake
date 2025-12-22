import React, { useState } from "react";
import {
  Sparkles,
  BarChart2,
  Layers,
  Calendar,
  Zap,
  HeartPulse,
  Brain,
} from "lucide-react";

import Breadcrumb from "./partials/Breadcrumb";
import EventPromotionsTab from "./partials/EventPromotionsTab";
import AnalyzeProductsTab from "./partials/AnalyzeProductsTab";
import DiscoverCombosTab from "./partials/DiscoverCombosTab";
import UpcomingEventsTab from "./partials/UpcomingEventsTab";
import SmartPromotionTab from "./partials/SmartPromotionTab";
import HealthCheckTab from "./partials/HealthCheckTab";
import SavedDataModal from "./partials/SavedDataModal";
import AddDiscountModal from "./partials/AddDiscountModal";

import {
  useEventPromotions,
  useAnalyzeProducts,
  useDiscoverCombos,
  useUpcomingEvents,
  useSmartPromotion,
  useHealthCheck,
} from "./usecases";

const TABS = [
  {
    key: "event-promotions",
    label: "Khuyến mãi theo sự kiện",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    key: "analyze-products",
    label: "Phân tích sản phẩm",
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    key: "discover-combos",
    label: "Khám phá Combo",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    key: "upcoming-events",
    label: "Sự kiện sắp tới",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    key: "smart-promotion",
    label: "Khuyến mãi thông minh",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    key: "health",
    label: "Kiểm tra hệ thống",
    icon: <HeartPulse className="w-5 h-5" />,
  },
];

const AdminStratergy = () => {
  const [activeTab, setActiveTab] = useState("event-promotions");
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [savedTitle, setSavedTitle] = useState("");

  // Modal thêm khuyến mãi
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const eventPromotions = useEventPromotions();
  const analyzeProducts = useAnalyzeProducts();
  const discoverCombos = useDiscoverCombos();
  const upcomingEvents = useUpcomingEvents();
  const smartPromotion = useSmartPromotion();
  const healthCheck = useHealthCheck();

  const handleSave = (saveFunc) => {
    saveFunc();
    alert("Đã lưu kết quả vào localStorage!");
  };

  const handleViewSaved = (loadFunc, title) => {
    const data = loadFunc();
    setSavedTitle(title);
    setSavedData(data);
    setShowSavedModal(true);
  };

  const handleAddPromotion = (promotion) => {
    const discountData = {
      eventName: promotion.eventName || promotion.promotion_name,
      eventType: promotion.eventType || promotion.event_info?.event_type,
      startDate: promotion.startDate || promotion.start_date,
      endDate: promotion.endDate || promotion.end_date,
      products: promotion.products || promotion.target_products,
      description: promotion.description,
    };

    setSelectedPromotion(discountData);
    setShowAddDiscountModal(true);
  };

  const renderTabPanel = () => {
    switch (activeTab) {
      case "event-promotions":
        return (
          <EventPromotionsTab
            {...eventPromotions}
            onFetch={eventPromotions.fetchEventPromotions}
            onAddPromotion={handleAddPromotion}
            onSave={() => handleSave(eventPromotions.saveToLocal)}
            onViewSaved={() =>
              handleViewSaved(
                eventPromotions.loadFromLocal,
                "AI Event Promotions"
              )
            }
          />
        );
      case "analyze-products":
        return (
          <AnalyzeProductsTab
            {...analyzeProducts}
            onAnalyze={analyzeProducts.analyzeProducts}
            onSave={() => handleSave(analyzeProducts.saveToLocal)}
            onViewSaved={() =>
              handleViewSaved(analyzeProducts.loadFromLocal, "Analyze Products")
            }
          />
        );
      case "discover-combos":
        return (
          <DiscoverCombosTab
            {...discoverCombos}
            onDiscover={discoverCombos.discoverCombos}
            onSave={() => handleSave(discoverCombos.saveToLocal)}
            onViewSaved={() =>
              handleViewSaved(discoverCombos.loadFromLocal, "Combo Discovery")
            }
          />
        );
      case "upcoming-events":
        return (
          <UpcomingEventsTab
            {...upcomingEvents}
            onFetch={upcomingEvents.fetchUpcomingEvents}
            onSave={() => handleSave(upcomingEvents.saveToLocal)}
            onViewSaved={() =>
              handleViewSaved(upcomingEvents.loadFromLocal, "Upcoming Events")
            }
          />
        );
      case "smart-promotion":
        return (
          <SmartPromotionTab
            {...smartPromotion}
            onGenerate={smartPromotion.generateSmartPromotion}
            onAddPromotion={handleAddPromotion}
            onSave={() => handleSave(smartPromotion.saveToLocal)}
            onViewSaved={() =>
              handleViewSaved(smartPromotion.loadFromLocal, "Smart Promotion")
            }
          />
        );
      case "health":
        return (
          <HealthCheckTab
            {...healthCheck}
            onCheck={healthCheck.checkHealth}
            onSave={() => handleSave(healthCheck.saveToLocal)}
            onViewSaved={() =>
              handleViewSaved(healthCheck.loadFromLocal, "Health Check")
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-grey9">
      {/* Container với max-width */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Header - Đơn giản, sang trọng */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-avocado-green-100 rounded-lg flex items-center justify-center shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-avocado-brown-100 mb-2">
                AI Strategy Assistant
              </h1>
              <p className="text-base text-avocado-brown-50">
                Khuyến nghị khuyến mãi thông minh từ AI - Tối ưu hóa doanh thu
                và giữ chân khách hàng
              </p>
            </div>
          </div>

          {/* Info Banner - Thanh lịch */}
          {/* <div className="bg-white rounded-lg border border-avocado-brown-30 shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-avocado-green-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-avocado-green-100" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-avocado-brown-100 mb-1">
                  Powered by RCM_PRICE AI Engine
                </h3>
                <p className="text-base text-avocado-brown-50 leading-relaxed">
                  Sử dụng Thompson Sampling + Gemini AI để phân tích dữ liệu và
                  đưa ra khuyến nghị khuyến mãi tối ưu cho từng sự kiện và sản
                  phẩm.
                </p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Tabs - Clean & Minimalist */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-avocado-brown-30 shadow-sm p-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg font-medium text-base transition-all ${
                    activeTab === tab.key
                      ? "bg-avocado-green-100 text-white shadow-md"
                      : "bg-white text-avocado-brown-50 hover:bg-avocado-green-10 hover:text-avocado-brown-100"
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm text-center leading-tight">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg border border-avocado-brown-30 shadow-sm p-6 lg:p-8">
          {renderTabPanel()}
        </div>
      </div>

      {/* Modals */}
      <SavedDataModal
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        title={savedTitle}
        data={savedData}
      />

      <AddDiscountModal
        isOpen={showAddDiscountModal}
        onClose={() => {
          setShowAddDiscountModal(false);
          setSelectedPromotion(null);
        }}
        promotionData={selectedPromotion}
      />
    </div>
  );
};

export default AdminStratergy;
