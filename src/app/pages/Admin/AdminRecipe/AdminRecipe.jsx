import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAdminRecipeStore from "./adminRecipeStore";
import SmartGenerate from "./usecases/SmartGenerate";
import GenerateFromIngredient from "./usecases/GenerateFromIngredient";
import GenerateFromTrend from "./usecases/GenerateFromTrend";
import RecipeAnalytics from "./usecases/RecipeAnalytics";
import RecipeHistory from "./usecases/RecipeHistory";
import "./AdminRecipe.css";

/**
 * AdminRecipe - Main component for AI Recipe Generation
 * Redesigned theo AvocadoCake design system - Simple, Elegant, User-friendly
 */
const AdminRecipe = () => {
  const { activeTab, setActiveTab, checkHealth, error, clearError } =
    useAdminRecipeStore();

  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    performHealthCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
      clearError();
    }
  }, [error, clearError]);

  const performHealthCheck = async () => {
    try {
      const health = await checkHealth();
      setHealthStatus(health);

      if (health.status === "healthy") {
        toast.success("Kết nối backend thành công!");
      }
    } catch (error) {
      setHealthStatus({ status: "error", message: error.message });
      toast.error("Không thể kết nối backend!");
    }
  };

  const tabs = [
    {
      id: "smart-generate",
      label: "Smart Generate",
      component: SmartGenerate,
    },
    {
      id: "generate-ingredient",
      label: "Từ Nguyên liệu",
      component: GenerateFromIngredient,
    },
    {
      id: "generate-trend",
      label: "Từ Xu hướng",
      component: GenerateFromTrend,
    },
    {
      id: "analytics",
      label: "Phân tích",
      component: RecipeAnalytics,
    },
    {
      id: "history",
      label: "Lịch sử",
      component: RecipeHistory,
    },
  ];

  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const ActiveComponent = activeTabConfig.component;

  return (
    <div className="space-y-8">
      {/* Header - Simple & Clean */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-avocado-brown-100 mb-2">
            AI Recipe Generator
          </h1>
          <p className="text-xl text-avocado-brown-50">
            Tạo công thức bánh thông minh với AI
          </p>
        </div>

        {/* Health Status Indicator */}
        <div
          className={`px-4 py-2 rounded-lg border-2 ${
            healthStatus?.status === "healthy"
              ? "bg-avocado-green-10 border-avocado-green-100 text-avocado-green-100"
              : "bg-red-50 border-red-300 text-red-600"
          }`}
        >
          <span className="text-sm font-medium">
            {healthStatus?.status === "healthy" ? "Đã kết nối" : "Mất kết nối"}
          </span>
        </div>
      </div>

      {/* Tab Navigation - Clean & Minimal */}
      <div className="bg-white rounded-2xl border-2 border-avocado-brown-30 overflow-hidden">
        <div className="flex">
          {tabs.map((tab) => {
            return (
              <button
                key={tab.id}
                className={`flex-1 flex items-center justify-center px-6 py-4 text-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-avocado-green-100 text-white"
                    : "text-avocado-brown-100 hover:bg-avocado-green-10"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Component */}
      <div className="bg-white rounded-2xl border-2 border-avocado-brown-30 p-8">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default AdminRecipe;
