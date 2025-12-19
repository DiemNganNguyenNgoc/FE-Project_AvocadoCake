import React from "react";

const PaymentStatusCard = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4 pt-24">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl border border-avocado-brown-10 overflow-hidden shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusCard;
