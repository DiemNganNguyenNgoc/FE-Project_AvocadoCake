import React from "react";

const PaymentActions = ({
  primaryAction,
  primaryText,
  secondaryActions = [],
}) => {
  return (
    <div className="space-y-3 pt-6">
      {primaryAction && (
        <button
          onClick={primaryAction.onClick}
          className="w-full bg-avocado-green-100 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-avocado-green-100/90 active:scale-[0.98] transition-all duration-200 border border-avocado-green-100"
        >
          {primaryAction.text}
        </button>
      )}
      {secondaryActions.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {secondaryActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`${
                action.variant === "primary"
                  ? "bg-avocado-green-10 text-avocado-green-100 border-avocado-green-100 hover:bg-avocado-green-10/80"
                  : "bg-white text-avocado-brown-100 border-avocado-brown-30 hover:bg-gray-50"
              } font-semibold py-3.5 px-6 rounded-2xl active:scale-[0.98] transition-all duration-200 border`}
            >
              {action.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentActions;
