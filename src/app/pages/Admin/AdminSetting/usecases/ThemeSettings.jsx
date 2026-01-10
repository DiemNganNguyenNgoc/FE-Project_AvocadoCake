import React, { useState } from "react";
import { ArrowLeft, Palette } from "lucide-react";

const ThemeSettings = ({ onBack }) => {
  // TODO: Replace with API call to get theme settings
  const [themeData, setThemeData] = useState({
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    accentColor: "#F59E0B",
    fontFamily: "Inter",
  });

  const [isLoading, setIsLoading] = useState(false);

  const colorOptions = [
    { name: "Xanh dương", value: "#3B82F6" },
    { name: "Xanh lá", value: "#10B981" },
    { name: "Tím", value: "#8B5CF6" },
    { name: "Hồng", value: "#EC4899" },
    { name: "Cam", value: "#F59E0B" },
    { name: "Đỏ", value: "#EF4444" },
    { name: "Xám", value: "#6B7280" },
    { name: "Nâu", value: "#92400E" },
  ];

  const fontOptions = [
    { name: "Inter", value: "Inter" },
    { name: "Roboto", value: "Roboto" },
    { name: "Open Sans", value: "Open Sans" },
    { name: "Poppins", value: "Poppins" },
    { name: "Montserrat", value: "Montserrat" },
    { name: "Nunito", value: "Nunito" },
  ];

  const handleColorChange = (type, color) => {
    setThemeData({ ...themeData, [type]: color });
  };

  const handleFontChange = (font) => {
    setThemeData({ ...themeData, fontFamily: font });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await SettingService.updateThemeSettings(themeData);
      console.log("Saving theme settings:", themeData);

      // Simulate API call
      setTimeout(() => {
        alert("Cài đặt giao diện đã được lưu thành công!");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving theme settings:", error);
      alert("Có lỗi xảy ra khi lưu cài đặt!");
      setIsLoading(false);
    }
  };

  const ColorPicker = ({ title, selectedColor, onColorChange }) => (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      <div className="grid grid-cols-4 gap-3">
        {colorOptions.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className={`w-12 h-12 rounded-lg border-2 ${
              selectedColor === color.value
                ? "border-gray-800"
                : "border-gray-300"
            } hover:border-gray-600 transition-colors`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          >
            {selectedColor === color.value && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center space-x-2">
        <span className="text-sm text-gray-600">Hoặc nhập mã màu:</span>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-300"
        />
        <input
          type="text"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-300 rounded w-20"
        />
      </div>
    </div>
  );

  // Preview Component
  const ThemePreview = () => (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <h4 className="text-lg font-medium text-gray-900 mb-3">
        Xem trước giao diện
      </h4>
      <div
        className="border rounded-lg p-4 space-y-3"
        style={{ fontFamily: themeData.fontFamily }}
      >
        <div
          className="p-3 rounded text-white text-center"
          style={{ backgroundColor: themeData.primaryColor }}
        >
          Màu chính - Header/Button
        </div>
        <div
          className="p-3 rounded text-white text-center"
          style={{ backgroundColor: themeData.secondaryColor }}
        >
          Màu phụ - Links/Success
        </div>
        <div
          className="p-3 rounded text-white text-center"
          style={{ backgroundColor: themeData.accentColor }}
        >
          Màu nhấn - Highlight/Warning
        </div>
        <div className="p-3 border rounded text-center">
          Font chữ: {themeData.fontFamily}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
          <div className="flex items-center">
            <Palette className="w-6 h-6 text-blue-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Cài đặt giao diện
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Màu sắc
              </h3>

              <div className="space-y-6">
                <ColorPicker
                  title="Màu chính (Primary)"
                  selectedColor={themeData.primaryColor}
                  onColorChange={(color) =>
                    handleColorChange("primaryColor", color)
                  }
                />

                <ColorPicker
                  title="Màu phụ (Secondary)"
                  selectedColor={themeData.secondaryColor}
                  onColorChange={(color) =>
                    handleColorChange("secondaryColor", color)
                  }
                />

                <ColorPicker
                  title="Màu nhấn (Accent)"
                  selectedColor={themeData.accentColor}
                  onColorChange={(color) =>
                    handleColorChange("accentColor", color)
                  }
                />
              </div>
            </div>

            {/* Font Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Font chữ
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {fontOptions.map((font) => (
                  <label
                    key={font.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      themeData.fontFamily === font.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="fontFamily"
                      value={font.value}
                      checked={themeData.fontFamily === font.value}
                      onChange={() => handleFontChange(font.value)}
                      className="mr-3"
                    />
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <ThemePreview />

            {/* Usage Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                💡 Hướng dẫn sử dụng:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Màu chính:</strong> Sử dụng cho header, button
                  chính, menu
                </li>
                <li>
                  • <strong>Màu phụ:</strong> Sử dụng cho links, thông báo thành
                  công
                </li>
                <li>
                  • <strong>Màu nhấn:</strong> Sử dụng cho highlight, cảnh báo
                </li>
                <li>
                  • <strong>Font chữ:</strong> Ảnh hưởng đến toàn bộ website
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Đang lưu...
              </>
            ) : (
              "Lưu cài đặt"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
