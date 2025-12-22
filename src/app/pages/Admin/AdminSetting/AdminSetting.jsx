import React from "react";
import { Store, CreditCard, Search, Palette, Bell, Truck } from "lucide-react";

const AdminSetting = ({ onNavigate }) => {
  const settingCategories = [
    {
      id: "storeInfo",
      title: "Thông tin cửa hàng",
      description:
        "Quản lý thông tin cơ bản của cửa hàng như tên, địa chỉ, liên hệ và các thông tin quan trọng khác",
      icon: <Store className="w-12 h-12" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      id: "payment",
      title: "Thanh toán",
      description:
        "Cấu hình các phương thức thanh toán như PayPal, Stripe, COD và quản lý tài khoản",
      icon: <CreditCard className="w-12 h-12" />,
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      id: "seo",
      title: "SEO",
      description:
        "Tối ưu hóa công cụ tìm kiếm với meta tags, từ khóa và xem trước kết quả Google",
      icon: <Search className="w-12 h-12" />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      id: "theme",
      title: "Giao diện",
      description:
        "Tùy chỉnh màu sắc, font chữ và các yếu tố thiết kế của website",
      icon: <Palette className="w-12 h-12" />,
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
    },
    {
      id: "notification",
      title: "Thông báo",
      description:
        "Cấu hình email, SMS và các mẫu thông báo tự động cho khách hàng",
      icon: <Bell className="w-12 h-12" />,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
    {
      id: "shipping",
      title: "Giao hàng",
      description:
        "Thiết lập phí giao hàng, khu vực phục vụ và chính sách vận chuyển",
      icon: <Truck className="w-12 h-12" />,
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    },
  ];

  const handleCategoryClick = (categoryId) => {
    if (onNavigate) {
      onNavigate(categoryId);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Cài đặt hệ thống
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Quản lý và cấu hình các thành phần quan trọng của cửa hàng một cách
            dễ dàng và trực quan
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {settingCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Icon */}
                  <div
                    className={`${category.color} p-6 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {category.icon}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {category.description}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom spacing for better visual balance */}
        <div className="mt-16"></div>
      </div>
    </div>
  );
};

export default AdminSetting;
