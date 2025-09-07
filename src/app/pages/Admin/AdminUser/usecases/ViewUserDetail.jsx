import React from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              Chi tiết người dùng
            </h2>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Họ
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentUser.familyName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Tên
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentUser.userName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentUser.userEmail || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Số điện thoại
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentUser.userPhone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Địa chỉ
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Địa chỉ
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentUser.userAddress || "N/A"}
                    </p>
                  </div>
                  {currentUser.userWard && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Phường/Xã
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentUser.userWard}
                      </p>
                    </div>
                  )}
                  {currentUser.userDistrict && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Quận/Huyện
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentUser.userDistrict}
                      </p>
                    </div>
                  )}
                  {currentUser.userCity && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Tỉnh/Thành phố
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentUser.userCity}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Thông tin tài khoản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Vai trò
                    </label>
                    <div className="mt-1">
                      {formattedUser.isAdmin ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          User
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Số xu
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentUser.coins || 0} xu
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* User Avatar */}
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  {currentUser.userImage ? (
                    <img
                      src={currentUser.userImage}
                      alt={formattedUser.fullName}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {formattedUser.fullName}
                </h3>
                <p className="text-sm text-gray-500">{currentUser.userEmail}</p>
              </div>

              {/* Timestamps */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Thời gian
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Ngày tạo
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(currentUser.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Cập nhật lần cuối
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(currentUser.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thống kê
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Số đơn hàng</span>
                    <span className="text-sm font-medium text-gray-900">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tổng chi tiêu</span>
                    <span className="text-sm font-medium text-gray-900">
                      0 VND
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Trạng thái</span>
                    <span className="text-sm font-medium text-green-600">
                      Hoạt động
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetail;
