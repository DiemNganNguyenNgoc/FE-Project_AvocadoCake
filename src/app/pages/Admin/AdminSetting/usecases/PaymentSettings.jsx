import React, { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Check,
  X,
  Shield,
  DollarSign,
} from "lucide-react";

const PaymentSettings = ({ onBack }) => {
  // TODO: Replace with API call to get payment settings
  const [paymentMethods, setPaymentMethods] = useState({
    paypal: {
      enabled: true,
      email: "business@avocadocake.com",
    },
    stripe: {
      enabled: false,
      publicKey: "",
      secretKey: "",
    },
    cod: {
      enabled: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleToggleMethod = (method) => {
    setPaymentMethods({
      ...paymentMethods,
      [method]: {
        ...paymentMethods[method],
        enabled: !paymentMethods[method].enabled,
      },
    });
  };

  const handleInputChange = (method, field, value) => {
    setPaymentMethods({
      ...paymentMethods,
      [method]: {
        ...paymentMethods[method],
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await SettingService.updatePaymentSettings(paymentMethods);
      console.log("Saving payment settings:", paymentMethods);

      // Simulate API call
      setTimeout(() => {
        alert("Cài đặt thanh toán đã được lưu thành công!");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving payment settings:", error);
      alert("Có lỗi xảy ra khi lưu cài đặt!");
      setIsLoading(false);
    }
  };

  const PaymentMethodCard = ({
    method,
    title,
    description,
    children,
    icon,
    gradient,
  }) => (
    <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className={`${gradient} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
              {icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="opacity-90">{description}</p>
            </div>
          </div>
          <button
            onClick={() => handleToggleMethod(method)}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
              paymentMethods[method].enabled
                ? "bg-white bg-opacity-30"
                : "bg-black bg-opacity-20"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                paymentMethods[method].enabled
                  ? "translate-x-9"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {paymentMethods[method].enabled ? (
          <div>
            {children}
            <div className="mt-6 flex items-center text-sm">
              <div className="flex items-center text-green-600">
                <Check className="w-5 h-5 mr-2" />
                <span className="font-semibold">Đã kích hoạt</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="flex items-center justify-center text-gray-400 mb-4">
              <X className="w-8 h-8 mr-2" />
              <span className="text-lg font-semibold">Chưa kích hoạt</span>
            </div>
            <p className="text-gray-500">
              Bật tính năng này để sử dụng phương thức thanh toán
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
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
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white mr-4 shadow-lg">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Cài đặt thanh toán
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Quản lý các phương thức thanh toán
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* PayPal */}
          <PaymentMethodCard
            method="paypal"
            title="PayPal"
            description="Thanh toán qua tài khoản PayPal"
            icon={<DollarSign className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Email tài khoản PayPal
                </label>
                <input
                  type="email"
                  value={paymentMethods.paypal.email}
                  onChange={(e) =>
                    handleInputChange("paypal", "email", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all text-lg"
                  placeholder="Nhập email PayPal business"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Sử dụng email tài khoản PayPal Business
                </p>
              </div>
            </div>
          </PaymentMethodCard>

          {/* Stripe */}
          <PaymentMethodCard
            method="stripe"
            title="Stripe"
            description="Thanh toán bằng thẻ tín dụng/ghi nợ"
            icon={<CreditCard className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Public Key
                </label>
                <input
                  type="text"
                  value={paymentMethods.stripe.publicKey}
                  onChange={(e) =>
                    handleInputChange("stripe", "publicKey", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white transition-all text-lg font-mono"
                  placeholder="pk_test_..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Secret Key
                </label>
                <input
                  type="password"
                  value={paymentMethods.stripe.secretKey}
                  onChange={(e) =>
                    handleInputChange("stripe", "secretKey", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white transition-all text-lg font-mono"
                  placeholder="sk_test_..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Lấy từ Stripe Dashboard
                </p>
              </div>
            </div>
          </PaymentMethodCard>
        </div>

        {/* Cash on Delivery - Full Width */}
        <div className="mb-8">
          <PaymentMethodCard
            method="cod"
            title="Thanh toán khi nhận hàng (COD)"
            description="Khách hàng thanh toán trực tiếp khi nhận hàng"
            icon={<Shield className="w-6 h-6" />}
            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          >
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-6">
              <div className="flex items-start">
                <Shield className="w-8 h-8 text-orange-600 mr-4 mt-1" />
                <div>
                  <h4 className="font-bold text-orange-900 text-lg mb-2">
                    Phương thức thanh toán an toàn
                  </h4>
                  <p className="text-orange-800 leading-relaxed">
                    Phương thức thanh toán này không yêu cầu cấu hình thêm.
                    Khách hàng sẽ thanh toán trực tiếp cho nhân viên giao hàng
                    khi nhận được sản phẩm. Đây là phương thức an toàn và được
                    nhiều khách hàng tin tưởng.
                  </p>
                </div>
              </div>
            </div>
          </PaymentMethodCard>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
          <h4 className="font-bold text-red-900 mb-4 text-xl flex items-center">
            🔒 Bảo mật thông tin thanh toán
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-red-800">
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Không chia sẻ API key với bất kỳ ai</span>
              </div>
              <div className="flex items-start">
                <span className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Sử dụng HTTPS cho trang thanh toán</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Thường xuyên kiểm tra giao dịch</span>
              </div>
              <div className="flex items-start">
                <span className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Backup thông tin cấu hình</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Đang lưu...
              </>
            ) : (
              "💳 Lưu cài đặt"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
