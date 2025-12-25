import React from "react";

const LanguageManager = ({
  languages,
  onNavigate,
  onAddLanguage,
  onUpdateLanguage,
  onDeleteLanguage,
}) => {
  const handleAddLanguage = () => {
    if (onNavigate) {
      onNavigate("add");
    }
  };

  const handleEditLanguage = (languageCode) => {
    if (onNavigate) {
      onNavigate("edit", { languageCode });
    }
  };

  const handleDeleteLanguage = (languageCode) => {
    if (window.confirm(`Bạn có chắc muốn xóa ngôn ngữ ${languageCode}?`)) {
      onDeleteLanguage(languageCode);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Language Button */}
      <button
        onClick={handleAddLanguage}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        + Thêm ngôn ngữ mới
      </button>

      {/* Language List */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-700">Ngôn ngữ hiện tại:</h3>

        {languages.map((language) => (
          <div
            key={language.code}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {language.isDefault && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Mặc định
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditLanguage(language.code)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Sửa
              </button>
              {!language.isDefault && (
                <button
                  onClick={() => handleDeleteLanguage(language.code)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        ))}

        {languages.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Chưa có ngôn ngữ nào trong hệ thống
          </p>
        )}
      </div>

      {/* Language Settings */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Cài đặt ngôn ngữ</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <p>• Ngôn ngữ đầu tiên được chọn sẽ là ngôn ngữ mặc định</p>
          <p>• Có thể thay đổi ngôn ngữ mặc định bất cứ lúc nào</p>
          <p>• Ngôn ngữ mặc định không thể bị xóa</p>
        </div>
      </div>
    </div>
  );
};

export default LanguageManager;
