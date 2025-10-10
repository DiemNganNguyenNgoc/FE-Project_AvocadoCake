import React, { useState } from "react";
import { X, User, Mail, Phone, MapPin, Lock, Shield } from "lucide-react";

const AddUser = ({ onBack }) => {
  const [formData, setFormData] = useState({
    familyName: "",
    userName: "",
    userPhone: "",
    userEmail: "",
    userPassword: "",
    userConfirmPassword: "",
    userAddress: "",
    userImage: "",
    isAdmin: "false",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      onBack?.();
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      familyName: "",
      userName: "",
      userPhone: "",
      userEmail: "",
      userPassword: "",
      userConfirmPassword: "",
      userAddress: "",
      userImage: "",
      isAdmin: "false",
    });
    setErrors({});
    onBack?.();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative px-8 py-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Tạo người dùng mới
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Vui lòng điền đầy đủ thông tin bên dưới
              </p>
            </div>

            <button
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Personal Information */}
          <fieldset className="space-y-5">
            <legend className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Thông tin cá nhân
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Family Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="familyName"
                  value={formData.familyName}
                  onChange={handleInputChange}
                  placeholder="Nguyễn"
                  className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 transition-all ${
                    errors.familyName ? "border-red-300 bg-red-50" : ""
                  }`}
                />
                {errors.familyName && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.familyName}
                  </p>
                )}
              </div>

              {/* User Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="Văn A"
                  className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 transition-all ${
                    errors.userName ? "border-red-300 bg-red-50" : ""
                  }`}
                />
                {errors.userName && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.userName}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Contact Information */}
          <fieldset className="space-y-5">
            <legend className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Thông tin liên hệ
            </legend>

            <div className="space-y-5">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="userPhone"
                    value={formData.userPhone}
                    onChange={handleInputChange}
                    placeholder="0123456789"
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 transition-all ${
                      errors.userPhone ? "border-red-300 bg-red-50" : ""
                    }`}
                  />
                </div>
                {errors.userPhone && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.userPhone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    placeholder="abc123@gmail.com"
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 transition-all ${
                      errors.userEmail ? "border-red-300 bg-red-50" : ""
                    }`}
                  />
                </div>
                {errors.userEmail && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.userEmail}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="userAddress"
                    value={formData.userAddress}
                    onChange={handleInputChange}
                    placeholder="123 Đường ABC, Phường 1, Quận 1"
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 transition-all ${
                      errors.userAddress ? "border-red-300 bg-red-50" : ""
                    }`}
                  />
                </div>
                {errors.userAddress && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.userAddress}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Security Information */}
          <fieldset className="space-y-5">
            <legend className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Bảo mật & Phân quyền
            </legend>

            <div className="space-y-5">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className="w-4 h-4 text-gray-400" />
                  </div>
                  <select
                    name="isAdmin"
                    value={formData.isAdmin}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:bg-white focus:border-gray-900 transition-all appearance-none cursor-pointer ${
                      errors.isAdmin ? "border-red-300 bg-red-50" : ""
                    }`}
                  >
                    <option value="false">Người dùng</option>
                    <option value="true">Quản trị viên</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.isAdmin && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.isAdmin}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="userPassword"
                      value={formData.userPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 transition-all ${
                        errors.userPassword ? "border-red-300 bg-red-50" : ""
                      }`}
                    />
                  </div>
                  {errors.userPassword && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.userPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="userConfirmPassword"
                      value={formData.userConfirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-900 transition-all ${
                        errors.userConfirmPassword
                          ? "border-red-300 bg-red-50"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.userConfirmPassword && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.userConfirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang lưu...</span>
                </span>
              ) : (
                "Lưu thông tin"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
