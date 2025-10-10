import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useAdminUserStore } from "../adminUserStore";
import UserService from "../services/UserService";
import {
  UserValidationSchema,
  UserValidator,
  UserDataTransformer,
} from "../schemas/UserSchema";

const UpdateUser = ({ onBack }) => {
  const { currentUser, setUsers, setLoading, setError, setShowEditModal } =
    useAdminUserStore();

  const [formData, setFormData] = useState({
    familyName: "",
    userName: "",
    userPhone: "",
    userEmail: "",
    userPassword: "",
    userAddress: "",
    userImage: "",
    isAdmin: "false",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData(UserDataTransformer.toFormData(currentUser));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, isAdmin: value }));
    if (errors.isAdmin) setErrors((prev) => ({ ...prev, isAdmin: "" }));
  };

  const handleImageUrl = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, userImage: value }));
    if (errors.userImage) setErrors((prev) => ({ ...prev, userImage: "" }));
  };

  const handleImageFile = async (file) => {
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, userImage: reader.result }));
      };
      reader.readAsDataURL(file);
    } catch {}
  };

  const validateForm = () => {
    const { isValid, errors: validationErrors } = UserValidator.validateForm(
      formData,
      UserValidationSchema.update
    );
    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      setLoading(true);
      const userData = UserDataTransformer.fromFormData(formData);
      if (!userData.userPassword) delete userData.userPassword;

      await UserService.updateUser(currentUser._id, userData);
      const users = await UserService.getAllUsers();
      setUsers(users.data || users);

      setShowEditModal(false);
      setError(null);
    } catch (error) {
      setError(error?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(UserDataTransformer.toFormData(currentUser));
    setErrors({});
    setShowEditModal(false);
  };

  const initials = (name) =>
    (name || "U")
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy thông tin người dùng</p>
      </div>
    );
  }

  const fullName = `${formData.familyName || ""} ${
    formData.userName || ""
  }`.trim();

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm grid place-items-center z-50 p-4 md:p-8">
      <div className="w-full max-w-7xl bg-white rounded-[28px] shadow-2xl ring-1 ring-slate-900/10 overflow-hidden max-h-[94vh] flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md border-b border-slate-200">
          <div className="px-6 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                aria-label="Đóng"
                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-semibold text-slate-900">
                Chỉnh sửa người dùng
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
              >
                Hủy
              </button>
              <button
                form="update-user-form"
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Lưu
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          id="update-user-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto p-6 md:p-8 space-y-8"
        >
          {/* Avatar / Profile */}
          <section className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-28 h-28 rounded-full ring-4 ring-white shadow overflow-hidden bg-slate-100 flex items-center justify-center text-slate-600 text-2xl font-semibold">
                {formData.userImage ? (
                  <img
                    src={formData.userImage}
                    alt={fullName || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials(
                    fullName || currentUser.userName || currentUser.familyName
                  )
                )}
              </div>
              <div className="flex-1 w-full space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFile(e.target.files?.[0])}
                    />
                    <User className="w-4 h-4 text-slate-500" />
                    Tải ảnh
                  </label>
                  {formData.userImage && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, userImage: "" }))
                      }
                      className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    >
                      Xóa ảnh
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Hoặc dán URL ảnh
                  </label>
                  <input
                    type="url"
                    name="userImage"
                    value={formData.userImage}
                    onChange={handleImageUrl}
                    placeholder="https://..."
                    className={`w-full rounded-xl border px-3.5 py-2.5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 ${
                      errors.userImage ? "border-rose-300" : "border-slate-300"
                    }`}
                  />
                  {errors.userImage && (
                    <p className="mt-1 text-sm text-rose-600">
                      {errors.userImage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Basic info */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <User className="w-5 h-5 text-slate-500" />
              <h3 className="text-lg font-semibold text-slate-900">
                Thông tin cơ bản
              </h3>
            </header>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Họ
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleInputChange}
                    placeholder="Nguyễn"
                    autoComplete="family-name"
                    className={`w-full rounded-xl border pl-10 pr-3 py-2.5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 ${
                      errors.familyName ? "border-rose-300" : "border-slate-300"
                    }`}
                    aria-invalid={!!errors.familyName}
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                {errors.familyName && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.familyName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    placeholder="Văn A"
                    autoComplete="given-name"
                    className={`w-full rounded-xl border pl-10 pr-3 py-2.5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 ${
                      errors.userName ? "border-rose-300" : "border-slate-300"
                    }`}
                    aria-invalid={!!errors.userName}
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                {errors.userName && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.userName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="userPhone"
                    value={formData.userPhone}
                    onChange={handleInputChange}
                    placeholder="0123456789"
                    autoComplete="tel"
                    className={`w-full rounded-xl border pl-10 pr-3 py-2.5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 ${
                      errors.userPhone ? "border-rose-300" : "border-slate-300"
                    }`}
                    aria-invalid={!!errors.userPhone}
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                {errors.userPhone && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.userPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    placeholder="abc123@gmail.com"
                    autoComplete="email"
                    className={`w-full rounded-xl border pl-10 pr-3 py-2.5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 ${
                      errors.userEmail ? "border-rose-300" : "border-slate-300"
                    }`}
                    aria-invalid={!!errors.userEmail}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                {errors.userEmail && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.userEmail}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-slate-500" />
              <h3 className="text-lg font-semibold text-slate-900">Địa chỉ</h3>
            </header>
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Địa chỉ
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="userAddress"
                  value={formData.userAddress}
                  onChange={handleInputChange}
                  placeholder="1/1 khu phố 8"
                  autoComplete="street-address"
                  className={`w-full rounded-xl border pl-10 pr-3 py-2.5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 ${
                    errors.userAddress ? "border-rose-300" : "border-slate-300"
                  }`}
                  aria-invalid={!!errors.userAddress}
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              {errors.userAddress && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors.userAddress}
                </p>
              )}
            </div>
          </section>

          {/* Account */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <Shield className="w-5 h-5 text-slate-500" />
              <h3 className="text-lg font-semibold text-slate-900">
                Tài khoản
              </h3>
            </header>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role segmented */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vai trò
                </label>
                <div className="inline-flex rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    aria-pressed={formData.isAdmin === "false"}
                    onClick={() => handleRoleChange("false")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      formData.isAdmin === "false"
                        ? "bg-white text-slate-900 shadow ring-1 ring-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    aria-pressed={formData.isAdmin === "true"}
                    onClick={() => handleRoleChange("true")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      formData.isAdmin === "true"
                        ? "bg-white text-slate-900 shadow ring-1 ring-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Admin
                  </button>
                </div>
                {errors.isAdmin && (
                  <p className="mt-1 text-sm text-rose-600">{errors.isAdmin}</p>
                )}
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mật khẩu mới (để trống nếu không đổi)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="userPassword"
                    value={formData.userPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full rounded-xl border pl-10 pr-12 py-2.5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 ${
                      errors.userPassword
                        ? "border-rose-300"
                        : "border-slate-300"
                    }`}
                    aria-invalid={!!errors.userPassword}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.userPassword && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.userPassword}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  Tối thiểu 8 ký tự, nên dùng chữ hoa, chữ thường, số và ký tự
                  đặc biệt.
                </p>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
