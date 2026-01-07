import React, { useState } from "react";
import { ArrowLeft, Bell, Mail, MessageSquare } from "lucide-react";

const NotificationSettings = ({ onBack }) => {
  // TODO: Replace with API call to get notification settings
  const [notificationData, setNotificationData] = useState({
    email: {
      orderConfirmation: true,
      orderStatusUpdate: true,
      newCustomer: false,
      lowStock: true,
    },
    sms: {
      orderConfirmation: false,
      orderStatusUpdate: false,
      paymentReceived: false,
    },
    emailTemplates: {
      orderConfirmation:
        "Xin chào {customerName},\n\nCảm ơn bạn đã đặt hàng tại Avocado Cake! Đơn hàng #{orderId} của bạn đã được xác nhận.\n\nTrân trọng,\nAvocado Cake Team",
      orderStatusUpdate:
        "Xin chào {customerName},\n\nTrạng thái đơn hàng #{orderId} của bạn đã được cập nhật thành: {status}\n\nTrân trọng,\nAvocado Cake Team",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (type, setting) => {
    setNotificationData({
      ...notificationData,
      [type]: {
        ...notificationData[type],
        [setting]: !notificationData[type][setting],
      },
    });
  };

  const handleTemplateChange = (template, value) => {
    setNotificationData({
      ...notificationData,
      emailTemplates: {
        ...notificationData.emailTemplates,
        [template]: value,
      },
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await SettingService.updateNotificationSettings(notificationData);
      console.log("Saving notification settings:", notificationData);

      // Simulate API call
      setTimeout(() => {
        alert("Cài đặt thông báo đã được lưu thành công!");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      alert("Có lỗi xảy ra khi lưu cài đặt!");
      setIsLoading(false);
    }
  };

  const NotificationSection = ({ title, icon, type, settings }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900 ml-2">{title}</h3>
      </div>

      <div className="space-y-3">
        {Object.entries(settings).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
          >
            <div>
              <div className="font-medium text-gray-900">
                {key === "orderConfirmation" && "Xác nhận đơn hàng"}
                {key === "orderStatusUpdate" && "Cập nhật trạng thái đơn hàng"}
                {key === "newCustomer" && "Khách hàng mới đăng ký"}
                {key === "lowStock" && "Cảnh báo hết hàng"}
                {key === "paymentReceived" && "Xác nhận thanh toán"}
              </div>
              <div className="text-sm text-gray-600">
                {key === "orderConfirmation" &&
                  "Gửi thông báo khi có đơn hàng mới"}
                {key === "orderStatusUpdate" &&
                  "Gửi thông báo khi trạng thái đơn hàng thay đổi"}
                {key === "newCustomer" && "Gửi thông báo khi có khách hàng mới"}
                {key === "lowStock" && "Cảnh báo khi sản phẩm sắp hết"}
                {key === "paymentReceived" &&
                  "Xác nhận khi nhận được thanh toán"}
              </div>
            </div>
            <button
              onClick={() => handleToggle(type, key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
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
            <Bell className="w-6 h-6 text-blue-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Cài đặt thông báo
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Settings */}
          <div className="space-y-6">
            <NotificationSection
              title="Thông báo Email"
              icon={<Mail className="w-5 h-5 text-blue-500" />}
              type="email"
              settings={notificationData.email}
            />

            <NotificationSection
              title="Thông báo SMS"
              icon={<MessageSquare className="w-5 h-5 text-green-500" />}
              type="sms"
              settings={notificationData.sms}
            />
          </div>

          {/* Email Templates */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mẫu email
              </h3>

              <div className="space-y-6">
                {/* Order Confirmation Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email xác nhận đơn hàng
                  </label>
                  <textarea
                    value={notificationData.emailTemplates.orderConfirmation}
                    onChange={(e) =>
                      handleTemplateChange("orderConfirmation", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mẫu email xác nhận đơn hàng"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Sử dụng: {"{customerName}"}, {"{orderId}"}, {"{orderTotal}"}
                  </div>
                </div>

                {/* Order Status Update Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email cập nhật trạng thái
                  </label>
                  <textarea
                    value={notificationData.emailTemplates.orderStatusUpdate}
                    onChange={(e) =>
                      handleTemplateChange("orderStatusUpdate", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mẫu email cập nhật trạng thái"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Sử dụng: {"{customerName}"}, {"{orderId}"}, {"{status}"}
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                💡 Mẹo sử dụng:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Sử dụng các biến {"{customerName}"}, {"{orderId}"} trong mẫu
                  email
                </li>
                <li>• Kiểm tra kỹ nội dung trước khi lưu</li>
                <li>• Email ngắn gọn, rõ ràng sẽ hiệu quả hơn</li>
                <li>• SMS có giới hạn ký tự, nên viết ngắn gọn</li>
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

export default NotificationSettings;
