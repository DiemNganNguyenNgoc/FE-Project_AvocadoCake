import React from "react";

const LanguageSelector = ({
  languages,
  selectedLanguages,
  onLanguageChange,
}) => {
  const availableLanguages = languages.filter((lang) => lang.isActive);

  const handleLanguageToggle = (languageCode) => {
    const newSelectedLanguages = selectedLanguages.includes(languageCode)
      ? selectedLanguages.filter((code) => code !== languageCode)
      : [...selectedLanguages, languageCode];

    onLanguageChange(newSelectedLanguages);
  };

  return (
    <div className="space-y-3">
      {availableLanguages.map((language) => (
        <div
          key={language.code}
          className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
            selectedLanguages.includes(language.code)
              ? "border-green-500 bg-green-50"
              : "border-gray-200 bg-gray-50 hover:border-gray-300"
          }`}
          onClick={() => handleLanguageToggle(language.code)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Checkbox */}
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(language.code)}
                  onChange={() => handleLanguageToggle(language.code)}
                  className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                />
              </div>

              {/* Language name */}
              <span className="font-semibold text-gray-900">
                {language.name}
              </span>
            </div>

            {/* Flag */}
            <div className="text-2xl">{language.flag}</div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mt-2 ml-8">
            {language.nativeName || language.name}
          </p>
        </div>
      ))}

      {selectedLanguages.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-2">
          Vui lòng chọn ít nhất một ngôn ngữ
        </p>
      )}
    </div>
  );
};

export default LanguageSelector;
