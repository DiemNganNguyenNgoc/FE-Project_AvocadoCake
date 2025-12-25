import React from "react";

const ButtonSideMenuAdmin = ({
  icon: Icon,
  text,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full h-[48px] px-5 py-2.5 gap-[15px] rounded-lg ${
        isActive
          ? "bg-[rgba(46,144,46,0.15)] hover:bg-[rgba(124, 129, 124, 0.22)]"
          : "bg-white hover:bg-gray-100"
      }
      transition-colors duration-200 cursor-pointer`}
    >
      <div
        className={`text-xl ${isActive ? "text-[#2E902E]" : "text-gray-700"}`}
      >
        {Icon}
      </div>
      <span
        className={`font-medium ${
          isActive ? "text-[#2E902E]" : "text-gray-700"
        }`}
      >
        {text}
      </span>
    </button>
  );
};

export default ButtonSideMenuAdmin;
