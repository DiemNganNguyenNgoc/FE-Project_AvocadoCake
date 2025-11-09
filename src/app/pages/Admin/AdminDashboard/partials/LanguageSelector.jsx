import React, { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useAdminLanguage } from "../../../../contexts/AdminLanguageContext";

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useAdminLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const languages = [
    { code: "en", name: t("english"), flag: "🇺🇸" },
    { code: "vi", name: t("vietnamese"), flag: "🇻🇳" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowDropdown(!showDropdown)}
        className="h-13 flex items-center gap-2 px-4 rounded-full border border-stroke bg-white hover:bg-gray-50 transition-colors duration-200 dark:border-stroke-dark dark:bg-dark-2 dark:hover:bg-dark-3"
        title={t("selectLanguage")}
      >
        <Globe className="w-5 h-5 text-dark-5 dark:text-dark-6" />
        <span className="text-xl">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium text-dark dark:text-white hidden sm:inline">
          {currentLanguage?.code.toUpperCase()}
        </span>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-lg border border-stroke dark:bg-dark-2 dark:border-stroke-dark z-[2] overflow-hidden"
        >
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-dark-4 dark:text-dark-6 uppercase tracking-wide">
              {t("selectLanguage")}
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-200 ${
                  language === lang.code
                    ? "bg-blue-50 text-primary dark:bg-primary/20 dark:text-primary"
                    : "text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-dark-3"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="flex-1 font-medium text-base">
                  {lang.name}
                </span>
                {language === lang.code && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
