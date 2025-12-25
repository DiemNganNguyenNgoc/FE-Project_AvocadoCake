import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./partials/LanguageSelector";
import LanguageManager from "./partials/LanguageManager";
import AddLanguage from "./usecases/AddLanguage";
import EditLanguage from "./usecases/EditLanguage";

const AdminLanguage = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();

  // Hard code data thay vì dùng store
  const [languages, setLanguages] = useState([
    {
      code: "vi",
      name: "Vietnamese",
      nativeName: "Tiếng Việt",
      flag: "🇻🇳",
      isActive: true,
      isDefault: true,
    },
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      isActive: true,
      isDefault: false,
    },
  ]);

  const [selectedLanguages, setSelectedLanguages] = useState(["vi"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock loading effect
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLanguageChange = (languages) => {
    setSelectedLanguages(languages);
  };

  const handleApplyLanguages = async () => {
    if (selectedLanguages.length > 0) {
      setIsLoading(true);

      // Mock API call
      setTimeout(() => {
        // Cập nhật ngôn ngữ chính
        const primaryLanguage = selectedLanguages[0];
        i18n.changeLanguage(primaryLanguage);

        // Lưu vào localStorage
        localStorage.setItem("preferredLanguage", primaryLanguage);
        localStorage.setItem(
          "availableLanguages",
          JSON.stringify(selectedLanguages)
        );

        setIsLoading(false);
        console.log("Applied languages:", selectedLanguages);
      }, 1000);
    }
  };

  const addLanguage = (newLanguage) => {
    setLanguages((prev) => [...prev, newLanguage]);
  };

  const updateLanguage = (code, updates) => {
    setLanguages((prev) =>
      prev.map((lang) => (lang.code === code ? { ...lang, ...updates } : lang))
    );
  };

  const deleteLanguage = (code) => {
    setLanguages((prev) => prev.filter((lang) => lang.code !== code));
  };

  // Render current view based on navigation
  const renderCurrentView = () => {
    if (onNavigate) {
      // Nếu đang ở sub-page, render component tương ứng
      const currentPath = window.location.pathname;
      if (currentPath.includes("/add")) {
        return (
          <AddLanguage
            onBack={() => onNavigate("main")}
            onAddLanguage={addLanguage}
          />
        );
      }
      if (currentPath.includes("/edit")) {
        // Lấy languageCode từ URL hoặc state
        const urlParams = new URLSearchParams(window.location.search);
        const languageCode = urlParams.get("code") || "en";
        return (
          <EditLanguage
            onBack={() => onNavigate("main")}
            languageCode={languageCode}
            languages={languages}
            onUpdateLanguage={updateLanguage}
            onDeleteLanguage={deleteLanguage}
          />
        );
      }
    }

    // Render main view
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Selector */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Chọn ngôn ngữ
          </h2>
          <LanguageSelector
            languages={languages}
            selectedLanguages={selectedLanguages}
            onLanguageChange={handleLanguageChange}
          />
          <button
            onClick={handleApplyLanguages}
            disabled={selectedLanguages.length === 0}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
        </div>

        {/* Language Manager */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quản lý ngôn ngữ
          </h2>
          <LanguageManager
            languages={languages}
            onNavigate={onNavigate}
            onAddLanguage={addLanguage}
            onUpdateLanguage={updateLanguage}
            onDeleteLanguage={deleteLanguage}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Quản lý ngôn ngữ
        </h1>
        <p className="text-gray-600">
          Cấu hình và quản lý các ngôn ngữ có sẵn cho hệ thống
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Lỗi: {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        renderCurrentView()
      )}
    </div>
  );
};

export default AdminLanguage;
