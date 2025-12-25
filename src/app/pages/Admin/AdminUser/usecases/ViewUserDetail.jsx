import React from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit,
} from "lucide-react";
import { useAdminUserStore } from "../adminUserStore";
import { UserDataTransformer } from "../schemas/UserSchema";

const ViewUserDetail = ({ onBack }) => {
  const { currentUser, setShowViewModal, setShowEditModal } =
    useAdminUserStore();

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy thông tin người dùng</p>
      </div>
    );
  }

  const formattedUser = UserDataTransformer.formatUserForDisplay(currentUser);

  const handleEdit = () => {
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4 md:p-8">
      <div className="w-full max-w-7xl bg-white rounded-[28px] shadow-2xl ring-1 ring-slate-900/10 overflow-hidden max-h-[94vh] overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md border-b border-slate-200">
          <div className="px-6 md:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                aria-label="Quay lại"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Chi tiết người dùng
              </h2>
            </div>
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm md:text-xl font-medium text-white bg-emerald-600 rounded-xl shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
            >
              <Edit className="w-5 h-5" />
              Chỉnh sửa
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 space-y-10">
          {/* Profile Header Card */}
          <section className="p-7 md:p-9 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white ring-1 ring-white shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7">
              <div className="relative">
                <div className="w-32 h-32 rounded-full ring-4 ring-white shadow overflow-hidden bg-slate-100 flex items-center justify-center text-slate-600 text-3xl font-semibold">
                  {currentUser.userImage ? (
                    <img
                      src={currentUser.userImage}
                      alt={formattedUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(formattedUser.fullName)
                  )}
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
                      {formattedUser.fullName}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-slate-600">
                      {currentUser.userEmail && (
                        <a
                          href={`mailto:${currentUser.userEmail}`}
                          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-white border border-slate-200 text-sm hover:bg-slate-50 transition"
                        >
                          <Mail className="w-4 h-4 text-slate-500" />
                          {currentUser.userEmail}
                        </a>
                      )}
                      {currentUser.userPhone && (
                        <a
                          href={`tel:${currentUser.userPhone}`}
                          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-white border border-slate-200 text-sm hover:bg-slate-50 transition"
                        >
                          <Phone className="w-4 h-4 text-slate-500" />
                          {currentUser.userPhone}
                        </a>
                      )}
                      <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                        <Shield className="w-4 h-4" />
                        {formattedUser.isAdmin ? "Admin" : "User"}
                      </span>
                    </div>
                  </div>
                </div>

                {(currentUser.userCity || currentUser.userDistrict) && (
                  <div className="mt-3 text-sm text-slate-500 inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {[currentUser.userDistrict, currentUser.userCity]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Main sections (1 column, bigger scale) */}
          <div className="space-y-8">
            {/* Basic Information + Time */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <header className="flex items-center gap-2 px-7 py-5 border-b border-slate-100">
                <User className="w-6 h-6 text-slate-500" />
                <h4 className="text-xl md:text-2xl font-semibold text-slate-900">
                  Thông tin cơ bản
                </h4>
              </header>
              <div className="p-7">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Họ
                    </dt>
                    <dd className="mt-1 text-xl md:text-lg text-slate-900">
                      {currentUser.familyName || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Tên
                    </dt>
                    <dd className="mt-1 text-xl md:text-lg text-slate-900">
                      {currentUser.userName || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Email
                    </dt>
                    <dd className="mt-1 text-xl md:text-lg text-slate-900 break-all">
                      {currentUser.userEmail || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Số điện thoại
                    </dt>
                    <dd className="mt-1 text-xl md:text-lg text-slate-900">
                      {currentUser.userPhone || "N/A"}
                    </dd>
                  </div>

                  {/* Gộp thời gian vào đây */}
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Ngày tạo
                    </dt>
                    <dd className="mt-1 text-xl md:text-lg text-slate-900">
                      {formatDate(currentUser.createdAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Cập nhật lần cuối
                    </dt>
                    <dd className="mt-1 text-xl md:text-lg text-slate-900">
                      {formatDate(currentUser.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Address */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <header className="flex items-center gap-2 px-7 py-5 border-b border-slate-100">
                <MapPin className="w-6 h-6 text-slate-500" />
                <h4 className="text-xl md:text-2xl font-semibold text-slate-900">
                  Địa chỉ
                </h4>
              </header>
              <div className="p-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  <div className="md:col-span-2">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Địa chỉ
                    </dt>
                    <dd className="mt-1 text-xl md:text-lg text-slate-900">
                      {currentUser.userAddress || "N/A"}
                    </dd>
                  </div>
                  {currentUser.userWard && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Phường/Xã
                      </dt>
                      <dd className="mt-1 text-xl md:text-lg text-slate-900">
                        {currentUser.userWard}
                      </dd>
                    </div>
                  )}
                  {currentUser.userDistrict && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Quận/Huyện
                      </dt>
                      <dd className="mt-1 text-xl md:text-lg text-slate-900">
                        {currentUser.userDistrict}
                      </dd>
                    </div>
                  )}
                  {currentUser.userCity && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Tỉnh/Thành phố
                      </dt>
                      <dd className="mt-1 text-xl md:text-lg text-slate-900">
                        {currentUser.userCity}
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Account + Stats */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <header className="flex items-center gap-2 px-7 py-5 border-b border-slate-100">
                <Shield className="w-6 h-6 text-slate-500" />
                <h4 className="text-xl md:text-2xl font-semibold text-slate-900">
                  Thông tin tài khoản
                </h4>
              </header>
              <div className="p-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Số xu
                    </dt>
                    <dd className="mt-1 text-xl md:text-lg text-slate-900">
                      {currentUser.coins || 0} xu
                    </dd>
                  </div>

                  {/* Gộp thống kê vào đây */}
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Số đơn hàng
                    </dt>
                    <dd className="mt-1 text-xl md:text-lg text-slate-900">
                      0
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Tổng chi tiêu
                    </dt>
                    <dd className="mt-1 text-xl md:text-lg text-slate-900">
                      0 VND
                    </dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Trạng thái
                    </dt>
                    <dd className="mt-2">
                      <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                        Hoạt động
                      </span>
                    </dd>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetail;
