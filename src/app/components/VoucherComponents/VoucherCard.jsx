import React, { useState } from "react";
import { Ticket, Calendar, Tag, Clock, Copy, Check } from "lucide-react";
import {
  formatVoucherValue,
  getVoucherTypeText,
  isVoucherExpired,
} from "../../api/services/VoucherService";

const VoucherCard = ({
  voucher,
  onClaim,
  onUse,
  userStatus,
  showActions = true,
}) => {
  const [copied, setCopied] = useState(false);
  const isExpired = isVoucherExpired(voucher.endDate);
  const isAvailable = voucher.isAvailable && !isExpired;
  const canClaim = voucher.canClaim && !userStatus;

  // Calculate remaining quantity percentage
  const remainingPercentage =
    ((voucher.totalQuantity - voucher.claimedQuantity) /
      voucher.totalQuantity) *
    100;

  // Get voucher type badge color (AvocadoCake design)
  const getTypeBadge = (type) => {
    const badges = {
      PERCENTAGE: "bg-[#b1e321] text-[#3a060e]",
      FIXED_AMOUNT: "bg-[#b1e321]/80 text-[#3a060e]",
      FREE_SHIPPING: "bg-[#b1e321]/60 text-[#3a060e]",
      COMBO: "bg-[#b1e321]/90 text-[#3a060e]",
    };
    return badges[type] || "bg-gray-200 text-gray-700";
  };

  // Copy voucher code
  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get time remaining
  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(voucher.endDate);
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `Còn ${days} ngày`;
    if (hours > 0) return `Còn ${hours} giờ`;
    return "Sắp hết hạn";
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg ${
        isExpired || !isAvailable
          ? "border-gray-300 opacity-60"
          : "border-[#b1e321] hover:border-[#3a060e] hover:-translate-y-1"
      }`}
    >
      {/* Left Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#b1e321]"></div>

      {/* Content */}
      <div className="relative p-6 pl-8">
        {/* Header - Type Badge & Status */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${getTypeBadge(
              voucher.voucherType
            )}`}
          >
            {getVoucherTypeText(voucher.voucherType)}
          </span>
          {isExpired && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
              Hết hạn
            </span>
          )}
        </div>

        {/* Voucher Name */}
        <h3 className="text-xl font-bold text-[#3a060e] mb-2 line-clamp-1">
          {voucher.voucherName}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#3a060e]/70 mb-4 line-clamp-2">
          {voucher.voucherDescription || "Áp dụng cho đơn hàng của bạn"}
        </p>

        {/* Value Display - Prominent */}
        <div className="bg-[#b1e321]/10 border border-[#b1e321]/30 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#3a060e]/60 mb-1">Giảm giá</p>
              <p className="text-3xl font-bold text-[#b1e321]">
                {formatVoucherValue(voucher)}
              </p>
            </div>
            <Ticket className="w-10 h-10 text-[#b1e321]/40" />
          </div>
        </div>

        {/* Voucher Code - Clean */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-[#3a060e]/60 mb-1">Mã voucher</p>
              <p className="font-mono font-bold text-lg text-[#3a060e] tracking-wider">
                {voucher.voucherCode}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="ml-3 p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Copy mã"
              aria-label="Copy mã voucher"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-[#3a060e]/60" />
              )}
            </button>
          </div>
        </div>

        {/* Info Grid - Clean Layout */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          <div className="flex items-center text-sm text-[#3a060e]/80">
            <Tag className="w-4 h-4 mr-2 text-[#b1e321]" />
            <span>
              Đơn tối thiểu: {voucher.minOrderValue.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="flex items-center text-sm text-[#3a060e]/80">
            <Clock className="w-4 h-4 mr-2 text-[#b1e321]" />
            <span>{getTimeRemaining()}</span>
          </div>
          <div className="flex items-center text-sm text-[#3a060e]/80">
            <Calendar className="w-4 h-4 mr-2 text-[#b1e321]" />
            <span>
              HSD: {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Progress Bar - Minimalist */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-[#3a060e]/60 mb-2">
            <span>Đã sử dụng</span>
            <span className="font-medium">
              {voucher.claimedQuantity}/{voucher.totalQuantity}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#b1e321] h-full transition-all duration-300"
              style={{ width: `${100 - remainingPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons - Clean Design */}
        {showActions && (
          <div className="space-y-2">
            {!userStatus ? (
              <button
                onClick={() => onClaim(voucher._id)}
                disabled={!canClaim}
                className={`w-full font-semibold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  canClaim
                    ? "bg-[#b1e321] text-[#3a060e] hover:bg-[#b1e321]/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                aria-label={canClaim ? "Lưu voucher" : "Voucher đã hết lượt"}
              >
                <Ticket className="w-5 h-5" />
                <span>{canClaim ? "Lưu voucher" : "Hết lượt"}</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-[#b1e321]/30 text-[#3a060e] font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 cursor-default"
                aria-label="Voucher đã được lưu"
              >
                <Check className="w-5 h-5" />
                <span>Đã lưu voucher</span>
              </button>
            )}

            {userStatus === "ACTIVE" && onUse && (
              <button
                onClick={() => onUse(voucher)}
                className="w-full bg-[#3a060e] text-white font-semibold py-3 rounded-xl hover:bg-[#3a060e]/90 transition-colors duration-200"
                aria-label="Sử dụng voucher ngay"
              >
                Sử dụng ngay
              </button>
            )}

            {userStatus === "USED" && (
              <div className="w-full bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-center">
                Đã sử dụng
              </div>
            )}

            {userStatus === "EXPIRED" && (
              <div className="w-full bg-red-100 text-red-600 font-semibold py-3 rounded-xl text-center">
                Đã hết hạn
              </div>
            )}
          </div>
        )}

        {/* Status Badge for User Vouchers */}
        {userStatus && !showActions && (
          <div className="mt-2">
            {userStatus === "ACTIVE" && (
              <span className="inline-block bg-[#b1e321] text-[#3a060e] text-xs px-3 py-1 rounded-full font-semibold">
                Có thể dùng
              </span>
            )}
            {userStatus === "USED" && (
              <span className="inline-block bg-gray-400 text-white text-xs px-3 py-1 rounded-full font-semibold">
                Đã sử dụng
              </span>
            )}
            {userStatus === "EXPIRED" && (
              <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                Hết hạn
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherCard;
