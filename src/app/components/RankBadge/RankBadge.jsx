import React from "react";
import { useNavigate } from "react-router-dom";

const RankBadge = ({ userRankData, loading }) => {
  const navigate = useNavigate();

  // Show loading state instead of nothing
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-gray-200 bg-white animate-pulse">
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // If no data, don't show anything
  if (!userRankData) {
    return null;
  }

  const { currentRank } = userRankData;

  const handleClick = () => {
    navigate("/rank-benefits");
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-all duration-200 bg-white border"
      style={{ borderColor: `${currentRank.color}` }}
      title={`${currentRank.rankDisplayName} - Giảm ${currentRank.discountPercent}%`}
    >
      {/* Rank Icon Only */}
      <div className="text-2xl">{currentRank.icon}</div>
    </div>
  );
};

export default RankBadge;
