import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAdminRecipeStore from "./adminRecipeStore";
import SmartGenerate from "./usecases/SmartGenerate";
import GenerateFromIngredient from "./usecases/GenerateFromIngredient";
import GenerateFromTrend from "./partials/GenerateFromTrend";
import RecipeAnalytics from "./partials/RecipeAnalytics";
import RecipeHistory from "./partials/RecipeHistory";

/**
 * AdminRecipe - Main component for AI Recipe Generation
 * Redesigned với minimal & elegant style
 */
const AdminRecipe = () => {
  const { activeTab, setActiveTab, checkHealth, error, clearError } =
    useAdminRecipeStore();

  const [healthStatus, setHealthStatus] = useState(null);
  const [showHealthCheck, setShowHealthCheck] = useState(false);

  useEffect(() => {
    performHealthCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      clearError();
    }
  }, [error, clearError]);

  const performHealthCheck = async () => {
    try {
      const health = await checkHealth();
      setHealthStatus(health);
      setShowHealthCheck(true);

      if (health.status === "healthy") {
        toast.success("Kết nối backend thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      setHealthStatus({ status: "error", message: error.message });
      setShowHealthCheck(true);
      toast.error("Không thể kết nối backend. Vui lòng kiểm tra server!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const tabs = [
    {
      id: "smart-generate",
      label: "🚀 Smart Generate",
      description:
        "Tự động tạo công thức với AI - Zero user input, auto-detect trends & events",
      component: SmartGenerate,
      badge: "NEW",
    },
    {
      id: "generate-ingredient",
      label: "Từ Nguyên liệu",
      description: "Tạo công thức từ danh sách nguyên liệu có sẵn",
      component: GenerateFromIngredient,
    },
    {
      id: "generate-trend",
      label: "Từ Xu hướng",
      description: "Tạo công thức dựa trên xu hướng thị trường",
      component: GenerateFromTrend,
    },
    {
      id: "analytics",
      label: "Phân tích",
      description: "Phân tích thị trường và dự báo xu hướng",
      component: RecipeAnalytics,
    },
    {
      id: "history",
      label: "Lịch sử",
      description: "Xem lại các công thức đã tạo",
      component: RecipeHistory,
    },
  ];

  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const ActiveComponent = activeTabConfig.component;

  return (
    <div className="p-9">
      {/* Page Header - Minimal & Elegant */}
      <div className="mb-9">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-5xl font-semibold text-avocado-brown-100 mb-3">
              AI Recipe Generator
            </h1>
            <p className="text-2xl text-avocado-brown-50 font-light">
              Công cụ tạo công thức bánh thông minh
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              className={`flex items-center gap-3 px-7 py-4 rounded-xl font-medium transition-all text-2xl ${
                healthStatus?.status === "healthy"
                  ? "bg-avocado-green-10 text-avocado-green-100 hover:bg-avocado-green-30 border-2 border-avocado-green-50"
                  : healthStatus?.status === "error"
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200"
                  : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border-2 border-yellow-200"
              }`}
              onClick={performHealthCheck}
              title="Kiểm tra kết nối backend"
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  healthStatus?.status === "healthy"
                    ? "bg-avocado-green-100"
                    : healthStatus?.status === "error"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              />
              <span className="font-normal">
                {healthStatus?.status === "healthy"
                  ? "Đã kết nối"
                  : healthStatus?.status === "error"
                  ? "Mất kết nối"
                  : "Đang kiểm tra..."}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Clean & Modern */}
      <div className="bg-white border border-avocado-brown-30 rounded-2xl mb-9 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`relative flex-1 px-9 py-6 text-2xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-avocado-green-100 text-white"
                  : "text-avocado-brown-100 hover:bg-avocado-green-10"
              }`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.description}
            >
              {tab.label}
              {tab.badge && (
                <span className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Description - Soft & Elegant */}
      <div className="mb-9">
        <div className="p-7 bg-avocado-green-10 border border-avocado-green-30 rounded-2xl">
          <p className="text-2xl text-avocado-brown-100 font-light">
            {activeTabConfig.description}
          </p>
        </div>
      </div>

      {/* Active Component */}
      <div className="bg-white rounded-2xl shadow-sm border border-avocado-brown-30 p-9">
        <ActiveComponent />
      </div>

      {/* Health Check Modal */}
      {showHealthCheck && healthStatus?.status === "error" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowHealthCheck(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-9 border-b border-avocado-brown-30">
              <h3 className="text-3xl font-semibold text-avocado-brown-100">
                Lỗi kết nối Backend
              </h3>
              <button
                className="text-avocado-brown-50 hover:text-avocado-brown-100 text-3xl"
                onClick={() => setShowHealthCheck(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-9">
              <p className="text-2xl text-red-600 mb-6">
                {healthStatus.message}
              </p>

              <div className="bg-grey9 rounded-2xl p-7">
                <h4 className="font-medium text-2xl text-avocado-brown-100 mb-5">
                  Hướng dẫn khắc phục:
                </h4>
                <ol className="list-decimal list-inside space-y-3 text-2xl text-avocado-brown-100">
                  <li>
                    Kiểm tra backend server có đang chạy không (RCM_RECIPE_2)
                  </li>
                  <li>
                    Xác nhận URL backend:{" "}
                    <code className="bg-grey px-2 py-1 rounded-lg">
                      http://localhost:8000
                    </code>
                  </li>
                  <li>Kiểm tra CORS settings trong backend</li>
                  <li>Thử khởi động lại backend server</li>
                </ol>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 p-9 border-t border-avocado-brown-30">
              <button
                className="px-8 py-4 text-2xl font-medium text-avocado-brown-100 bg-grey9 hover:bg-grey5 rounded-xl transition-colors"
                onClick={() => setShowHealthCheck(false)}
              >
                Đóng
              </button>
              <button
                className="px-8 py-4 text-2xl font-medium text-white bg-avocado-green-100 hover:bg-avocado-green-80 rounded-xl transition-colors"
                onClick={() => {
                  setShowHealthCheck(false);
                  performHealthCheck();
                }}
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecipe;
