import React from "react";

const PaymentHeader = ({ status, icon, title, subtitle }) => {
  const statusColors = {
    success: "bg-avocado-green-100",
    failed: "bg-avocado-brown-100",
    pending: "bg-amber-500",
    error: "bg-gray-500",
  };

  const iconColors = {
    success: "text-avocado-green-100",
    failed: "text-avocado-brown-100",
    pending: "text-amber-500",
    error: "text-gray-500",
  };

  return (
    <div className={`${statusColors[status]} p-12 text-center`}>
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className={`${iconColors[status]}`}>{icon}</div>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
      <p className="text-white/95 text-lg">{subtitle}</p>
    </div>
  );
};

export default PaymentHeader;
