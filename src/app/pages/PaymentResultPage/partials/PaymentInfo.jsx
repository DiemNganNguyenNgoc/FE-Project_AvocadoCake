import React from "react";

const PaymentInfo = ({ paymentData, paymentCode, status }) => {
  const statusBadges = {
    success:
      "bg-avocado-green-10 text-avocado-green-100 border-avocado-green-100",
    failed: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const statusText = {
    success: "Thành công",
    failed: "Thất bại",
    pending: "Đang xử lý",
  };

  return (
    <div className="bg-gray-50/50 rounded-2xl p-6 space-y-4 border border-avocado-brown-10">
      <div className="flex items-center justify-between pb-4 border-b border-avocado-brown-10">
        <span className="text-gray-600 font-medium">Mã thanh toán</span>
        <span className="font-semibold text-avocado-brown-100 text-sm">
          {paymentData?.paymentCode || paymentCode}
        </span>
      </div>
      {paymentData?.amount && (
        <div className="flex items-center justify-between pb-4 border-b border-avocado-brown-10">
          <span className="text-gray-600 font-medium">Số tiền</span>
          <span className="font-bold text-avocado-green-100 text-2xl">
            {paymentData.amount.toLocaleString("vi-VN")} ₫
          </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-gray-600 font-medium">Trạng thái</span>
        <span
          className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border ${statusBadges[status]}`}
        >
          {statusText[status]}
        </span>
      </div>
    </div>
  );
};

export default PaymentInfo;
