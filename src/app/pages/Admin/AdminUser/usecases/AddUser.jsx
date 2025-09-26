import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, MapPin, Lock, Shield } from "lucide-react";
import { useAdminUserStore } from "../adminUserStore";
import UserService from "../services/UserService";
import {
  UserValidationSchema,
  UserValidator,
  UserDataTransformer,
} from "../schemas/UserSchema";

const AddUser = ({ onBack }) => {
  const { setUsers, setLoading, setError, setShowAddModal } =
    useAdminUserStore();
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const { isValid, errors: validationErrors } = UserValidator.validateForm(
      formData,
      UserValidationSchema.create
    );

    // Check password match
    const passwordMatchError = UserValidator.validatePasswordMatch(
      formData.userPassword,
      formData.userConfirmPassword
    );

    if (passwordMatchError) {
      validationErrors.userConfirmPassword = passwordMatchError;
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      setLoading(true);
      const userData = UserDataTransformer.fromFormData(formData);
      await UserService.createUser(userData);

      // Refresh users list
      const users = await UserService.getAllUsers();
      setUsers(users.data || users);

      // Reset form
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

      // Close modal
      setShowAddModal(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
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
    setShowAddModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create-user</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Family Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ
            </label>
            <div className="relative">
              <input
                type="text"
                name="familyName"
                value={formData.familyName}
                onChange={handleInputChange}
                placeholder="Nguyễn"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                  errors.familyName ? "border-red-300" : "border-gray-300"
                }`}
              />
            </div>
            {errors.familyName && (
              <p className="mt-1 text-sm text-red-600">{errors.familyName}</p>
            )}
          </div>

          {/* User Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên
            </label>
            <div className="relative">
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Văn A"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                  errors.userName ? "border-red-300" : "border-gray-300"
                }`}
              />
            </div>
            {errors.userName && (
              <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <input
                type="tel"
                name="userPhone"
                value={formData.userPhone}
                onChange={handleInputChange}
                placeholder="0123456789"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                  errors.userPhone ? "border-red-300" : "border-gray-300"
                }`}
              />
            </div>
            {errors.userPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.userPhone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                placeholder="abc123@gmail.com"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                  errors.userEmail ? "border-red-300" : "border-gray-300"
                }`}
              />
            </div>
            {errors.userEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.userEmail}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <div className="relative">
              <select
                name="isAdmin"
                value={formData.isAdmin}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                  errors.isAdmin ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="false">User</option>
                <option value="true">Admin</option>
              </select>
            </div>
            {errors.isAdmin && (
              <p className="mt-1 text-sm text-red-600">{errors.isAdmin}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                name="userPassword"
                value={formData.userPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                  errors.userPassword ? "border-red-300" : "border-gray-300"
                }`}
              />
            </div>
            {errors.userPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.userPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                name="userConfirmPassword"
                value={formData.userConfirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                  errors.userConfirmPassword
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
            </div>
            {errors.userConfirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.userConfirmPassword}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <div className="relative">
              <input
                type="text"
                name="userAddress"
                value={formData.userAddress}
                onChange={handleInputChange}
                placeholder="1/1 khu phố 8"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                  errors.userAddress ? "border-red-300" : "border-gray-300"
                }`}
              />
            </div>
            {errors.userAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.userAddress}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
