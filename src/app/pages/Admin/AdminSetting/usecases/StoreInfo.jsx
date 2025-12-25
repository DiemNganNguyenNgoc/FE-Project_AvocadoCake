import React, { useState } from "react";
import { ArrowLeft, Store } from "lucide-react";

const StoreInfo = ({ onBack }) => {
  // TODO: Replace with API call to get store information
  const [storeData, setStoreData] = useState({
    storeName: "Avocado Cake Store",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "0123456789",
    email: "contact@avocadocake.com",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setStoreData({ ...storeData, [field]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await SettingService.updateStoreInfo(storeData);
      console.log("Saving store info:", storeData);

      // Simulate API call
      setTimeout(() => {
        alert("Thông tin cửa hàng đã được lưu thành công!");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving store info:", error);
      alert("Có lỗi xảy ra khi lưu thông tin!");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-6 p-3 rounded-xl hover:bg-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="font-medium">Quay lại</span>
          </button>
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white mr-4 shadow-lg">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Thông tin cửa hàng
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Quản lý thông tin cơ bản của cửa hàng
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-4"></div>
                Thông tin chi tiết
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Store Name */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Tên cửa hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={storeData.storeName}
                    onChange={(e) =>
                      handleInputChange("storeName", e.target.value)
                    }
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg bg-gray-50 focus:bg-white"
                    placeholder="Nhập tên cửa hàng"
                  />
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Email liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={storeData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg bg-gray-50 focus:bg-white"
                    placeholder="Nhập email liên hệ"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={storeData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg bg-gray-50 focus:bg-white"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                {/* Address - Full width */}
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={storeData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg resize-none bg-gray-50 focus:bg-white"
                    placeholder="Nhập địa chỉ cửa hàng"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-12 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Đang lưu...
                    </>
                  ) : (
                    "💾 Lưu thông tin"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Current Info Display */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></div>
                Thông tin hiện tại
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-blue-500">
                  <div className="font-bold text-gray-700 text-xs uppercase tracking-wide">
                    TÊN CỬA HÀNG
                  </div>
                  <div className="text-gray-900 text-lg mt-2 font-semibold">
                    {storeData.storeName || "Chưa cập nhật"}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-green-500">
                  <div className="font-bold text-gray-700 text-xs uppercase tracking-wide">
                    EMAIL
                  </div>
                  <div className="text-gray-900 text-lg mt-2 font-semibold">
                    {storeData.email || "Chưa cập nhật"}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-purple-500">
                  <div className="font-bold text-gray-700 text-xs uppercase tracking-wide">
                    SỐ ĐIỆN THOẠI
                  </div>
                  <div className="text-gray-900 text-lg mt-2 font-semibold">
                    {storeData.phone || "Chưa cập nhật"}
                  </div>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-blue-900 mb-4 text-lg flex items-center">
                💡 Lưu ý quan trọng
              </h4>
              <ul className="text-blue-800 space-y-3 text-sm leading-relaxed">
                <li className="flex items-start">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  Thông tin này sẽ hiển thị trên website và các tài liệu chính
                  thức
                </li>
                <li className="flex items-start">
                  <span className="w-3 h-3 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  Email sẽ được sử dụng để liên hệ với khách hàng
                </li>
                <li className="flex items-start">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  Đảm bảo số điện thoại luôn hoạt động để hỗ trợ khách hàng
                </li>
                <li className="flex items-start">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  Địa chỉ phải chính xác để giao hàng và liên hệ
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;
