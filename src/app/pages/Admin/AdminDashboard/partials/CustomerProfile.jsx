import React, { useState, useEffect } from "react";
import { Users, UserCheck, ShoppingBag, TrendingUp } from "lucide-react";
import { DashboardService } from "../services/dashboardService";

const CustomerProfile = () => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getCustomerProfile();
      setCustomerData(data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!customerData) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Chân dung khách hàng
        </h3>
        <p className="text-gray-600 mt-1">
          Phân tích hành vi và giá trị khách hàng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Types */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Phân loại khách hàng
          </h4>
          {customerData.customerTypes.map((type, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">{type.name}</span>
                <span className="text-sm text-gray-500">
                  {type.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${type.percentage}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {type.count} khách hàng • AOV:{" "}
                {formatCurrency(type.averageOrderValue)}
              </div>
            </div>
          ))}
        </div>

        {/* New vs Repeat Customers */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Khách hàng mới vs Cũ
          </h4>
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-3 mb-3">
                <UserCheck className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Khách hàng trung thành
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-700">
                  {customerData.repeatCustomers.percentage}%
                </div>
                <div className="text-sm text-green-600">
                  AOV:{" "}
                  {formatCurrency(
                    customerData.repeatCustomers.averageOrderValue
                  )}
                </div>
                <div className="text-sm text-green-600">
                  {customerData.repeatCustomers.count} khách hàng
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">
                  Khách hàng mới
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-700">
                  {customerData.newCustomers.percentage}%
                </div>
                <div className="text-sm text-blue-600">
                  AOV:{" "}
                  {formatCurrency(customerData.newCustomers.averageOrderValue)}
                </div>
                <div className="text-sm text-blue-600">
                  {customerData.newCustomers.count} khách hàng
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Customer Segments */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Phân khúc hàng đầu
          </h4>
          <div className="space-y-3">
            {customerData.topSegments.map((segment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    {segment.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">
                      +{segment.growth}%
                    </span>
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(segment.revenue)}
                </div>
                <div className="text-sm text-gray-500">
                  {segment.orders} đơn hàng • {segment.customers} khách hàng
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
