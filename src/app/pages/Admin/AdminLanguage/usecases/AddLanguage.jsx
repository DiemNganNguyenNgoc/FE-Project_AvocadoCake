import React, { useState } from "react";

const AddLanguage = ({ onBack, onAddLanguage }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    nativeName: "",
    flag: "",
    isActive: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLanguage = {
      ...formData,
      isDefault: false,
    };
    onAddLanguage(newLanguage);
    onBack();
  };

  const handleCancel = () => {
    onBack();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Quay lại
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thêm ngôn ngữ mới
        </h1>
        <p className="text-gray-600">Thêm ngôn ngữ mới vào hệ thống</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã ngôn ngữ *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="en, vi, fr, de..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mã ngôn ngữ theo chuẩn ISO 639-1 (2 ký tự)
              </p>
            </div>

            {/* Language Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên ngôn ngữ (English) *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="English, French, German..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Native Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên bản địa
              </label>
              <input
                type="text"
                name="nativeName"
                value={formData.nativeName}
                onChange={handleInputChange}
                placeholder="English, Français, Deutsch..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Flag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emoji cờ
              </label>
              <input
                type="text"
                name="flag"
                value={formData.flag}
                onChange={handleInputChange}
                placeholder="🇺🇸, 🇫🇷, 🇩🇪..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Kích hoạt ngôn ngữ này ngay lập tức
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Thêm ngôn ngữ
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLanguage;
