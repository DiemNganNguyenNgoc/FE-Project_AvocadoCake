import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import EventPromotionsTab from "./partials/EventPromotionsTab";
import AnalyzeProductsTab from "./partials/AnalyzeProductsTab";
import DiscoverCombosTab from "./partials/DiscoverCombosTab";
import UpcomingEventsTab from "./partials/UpcomingEventsTab";
import SmartPromotionTab from "./partials/SmartPromotionTab";
import HealthCheckTab from "./partials/HealthCheckTab";
import SavedDataModal from "./partials/SavedDataModal";

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
    label: "AI Event Promotions",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    key: "analyze-products",
    label: "Analyze Products",
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    key: "discover-combos",
    label: "Combo Discovery",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    key: "upcoming-events",
    label: "Upcoming Events",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    key: "smart-promotion",
    label: "Smart Promotion",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    key: "health",
    label: "Health Check",
    icon: <HeartPulse className="w-5 h-5" />,
  },
];

const AdminStratergy = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("event-promotions");
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [savedTitle, setSavedTitle] = useState("");

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
    sessionStorage.setItem("ai_promotion_draft", JSON.stringify(discountData));
    navigate("/admin/discount", {
      state: { fromAI: true, promotionData: discountData },
    });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-avocado-green-100 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-avocado-brown-100" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-avocado-brown-100">
                AI Strategy Assistant
              </h1>
              <p className="text-xl text-avocado-brown-50 mt-1">
                Khuyến nghị khuyến mãi thông minh từ AI
              </p>
            </div>
          </div>
          <div className="bg-avocado-green-10 border-2 border-avocado-green-30 rounded-lg px-6 py-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-avocado-green-100 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-base font-semibold text-avocado-brown-100">
                  Powered by RCM_PRICE AI Engine
                </p>
                <p className="text-sm text-avocado-brown-50 mt-1">
                  Sử dụng Thompson Sampling + Gemini AI để tối ưu hóa doanh thu
                  và giữ chân khách hàng
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-base transition-all border-2 ${
                  activeTab === tab.key
                    ? "bg-avocado-green-100 text-avocado-brown-100 border-avocado-green-100 shadow-md"
                    : "bg-white text-avocado-brown-50 border-avocado-brown-30 hover:bg-avocado-green-10 hover:border-avocado-green-30"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>{renderTabPanel()}</div>
      </div>
      <SavedDataModal
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        title={savedTitle}
        data={savedData}
      />
    </div>
  );
};

export default AdminStratergy;
