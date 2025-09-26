import React, { useState, useEffect } from "react";

const EditLanguage = ({
  onBack,
  languageCode,
  languages,
  onUpdateLanguage,
  onDeleteLanguage,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    nativeName: "",
    flag: "",
    isActive: true,
  });

  useEffect(() => {
    if (languageCode) {
      const language = languages.find((lang) => lang.code === languageCode);
      if (language) {
        setFormData(language);
      }
    }
  }, [languageCode, languages]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateLanguage(formData.code, formData);
    onBack();
  };

  const handleCancel = () => {
    onBack();
  };

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa ngôn ngữ ${formData.name}?`)) {
      onDeleteLanguage(formData.code);
      onBack();
    }
  };

  if (!languageCode) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Không tìm thấy thông tin ngôn ngữ
        </div>
      </div>
    );
  }

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
          Chỉnh sửa ngôn ngữ: {formData.name}
        </h1>
        <p className="text-gray-600">Cập nhật thông tin ngôn ngữ</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã ngôn ngữ
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mã ngôn ngữ không thể thay đổi
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
              Kích hoạt ngôn ngữ này
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Cập nhật
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
            {!formData.isDefault && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLanguage;
