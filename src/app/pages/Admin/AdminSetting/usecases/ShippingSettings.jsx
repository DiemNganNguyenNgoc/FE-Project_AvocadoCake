import React, { useState } from "react";
import { ArrowLeft, Truck, MapPin, Clock } from "lucide-react";

const ShippingSettings = ({ onBack }) => {
  // TODO: Replace with API call to get shipping settings
  const [shippingData, setShippingData] = useState({
    freeShippingThreshold: 500000,
    expressShipping: {
      enabled: true,
      fee: 50000,
      estimatedTime: "1-2 giờ",
    },
    standardShipping: {
      enabled: true,
      fee: 25000,
      estimatedTime: "2-4 giờ",
    },
    shippingZones: [
      { id: 1, name: "Quận 1", fee: 15000 },
      { id: 2, name: "Quận 2", fee: 20000 },
      { id: 3, name: "Quận 3", fee: 15000 },
      { id: 4, name: "Quận 7", fee: 25000 },
      { id: 5, name: "Quận Bình Thạnh", fee: 20000 },
    ],
  });

  const [newZone, setNewZone] = useState({ name: "", fee: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleShippingToggle = (type) => {
    setShippingData({
      ...shippingData,
      [type]: {
        ...shippingData[type],
        enabled: !shippingData[type].enabled,
      },
    });
  };

  const handleShippingChange = (type, field, value) => {
    setShippingData({
      ...shippingData,
      [type]: {
        ...shippingData[type],
        [field]: value,
      },
    });
  };

  const handleFreeShippingChange = (value) => {
    setShippingData({
      ...shippingData,
      freeShippingThreshold: parseInt(value) || 0,
    });
  };

  const handleAddZone = () => {
    if (newZone.name && newZone.fee) {
      const nextId =
        Math.max(...shippingData.shippingZones.map((z) => z.id)) + 1;
      setShippingData({
        ...shippingData,
        shippingZones: [
          ...shippingData.shippingZones,
          { id: nextId, name: newZone.name, fee: parseInt(newZone.fee) },
        ],
      });
      setNewZone({ name: "", fee: "" });
    }
  };

  const handleRemoveZone = (id) => {
    setShippingData({
      ...shippingData,
      shippingZones: shippingData.shippingZones.filter(
        (zone) => zone.id !== id
      ),
    });
  };

  const handleZoneChange = (id, field, value) => {
    setShippingData({
      ...shippingData,
      shippingZones: shippingData.shippingZones.map((zone) =>
        zone.id === id
          ? { ...zone, [field]: field === "fee" ? parseInt(value) || 0 : value }
          : zone
      ),
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await SettingService.updateShippingSettings(shippingData);
      console.log("Saving shipping settings:", shippingData);

      // Simulate API call
      setTimeout(() => {
        alert("Cài đặt giao hàng đã được lưu thành công!");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving shipping settings:", error);
      alert("Có lỗi xảy ra khi lưu cài đặt!");
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
            <Truck className="w-6 h-6 text-blue-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Cài đặt giao hàng
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipping Methods */}
          <div className="space-y-6">
            {/* Free Shipping */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Miễn phí giao hàng
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miễn phí khi đơn hàng từ (VNĐ)
                </label>
                <input
                  type="number"
                  value={shippingData.freeShippingThreshold}
                  onChange={(e) => handleFreeShippingChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="500000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hiện tại: {formatCurrency(shippingData.freeShippingThreshold)}
                </p>
              </div>
            </div>

            {/* Express Shipping */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-orange-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Giao hàng nhanh
                  </h3>
                </div>
                <button
                  onClick={() => handleShippingToggle("expressShipping")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    shippingData.expressShipping.enabled
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      shippingData.expressShipping.enabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {shippingData.expressShipping.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phí giao hàng (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={shippingData.expressShipping.fee}
                      onChange={(e) =>
                        handleShippingChange(
                          "expressShipping",
                          "fee",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian giao hàng
                    </label>
                    <input
                      type="text"
                      value={shippingData.expressShipping.estimatedTime}
                      onChange={(e) =>
                        handleShippingChange(
                          "expressShipping",
                          "estimatedTime",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1-2 giờ"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Standard Shipping */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Giao hàng tiêu chuẩn
                  </h3>
                </div>
                <button
                  onClick={() => handleShippingToggle("standardShipping")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    shippingData.standardShipping.enabled
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      shippingData.standardShipping.enabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {shippingData.standardShipping.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phí giao hàng (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={shippingData.standardShipping.fee}
                      onChange={(e) =>
                        handleShippingChange(
                          "standardShipping",
                          "fee",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian giao hàng
                    </label>
                    <input
                      type="text"
                      value={shippingData.standardShipping.estimatedTime}
                      onChange={(e) =>
                        handleShippingChange(
                          "standardShipping",
                          "estimatedTime",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2-4 giờ"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Zones */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Khu vực giao hàng
              </h3>

              {/* Add New Zone */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">
                  Thêm khu vực mới
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newZone.name}
                    onChange={(e) =>
                      setNewZone({ ...newZone, name: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tên khu vực"
                  />
                  <input
                    type="number"
                    value={newZone.fee}
                    onChange={(e) =>
                      setNewZone({ ...newZone, fee: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phí giao hàng"
                  />
                </div>
                <button
                  onClick={handleAddZone}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Thêm khu vực
                </button>
              </div>

              {/* Existing Zones */}
              <div className="space-y-3">
                {shippingData.shippingZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                  >
                    <input
                      type="text"
                      value={zone.name}
                      onChange={(e) =>
                        handleZoneChange(zone.id, "name", e.target.value)
                      }
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      value={zone.fee}
                      onChange={(e) =>
                        handleZoneChange(zone.id, "fee", e.target.value)
                      }
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-xs text-gray-500">VNĐ</span>
                    <button
                      onClick={() => handleRemoveZone(zone.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Lưu ý:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Phí giao hàng được tính theo khu vực</li>
                <li>• Giao hàng nhanh có phí cao hơn nhưng thời gian ngắn</li>
                <li>• Miễn phí giao hàng khi đạt ngưỡng tối thiểu</li>
                <li>• Có thể tắt/bật từng phương thức giao hàng</li>
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

export default ShippingSettings;
