import React from "react";
import { useNavigate } from "react-router-dom";

const RankBadge = ({ userRankData, loading }) => {
  const navigate = useNavigate();

  if (loading || !userRankData) {
    return null;
  }

  const { currentRank, progressToNextRank } = userRankData;

  const handleClick = () => {
    navigate("/rank-benefits");
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 px-4 py-2 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all duration-200 bg-white"
      style={{ borderColor: `${currentRank.color}60` }}
      title="Xem chi tiết rank"
    >
      {/* Rank Icon */}
      <div className="text-2xl">{currentRank.icon}</div>

      {/* Rank Info */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-gray-900">
            {currentRank.rankDisplayName}
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: currentRank.color }}
          >
            -{currentRank.discountPercent}%
          </span>
        </div>

        {/* Progress Bar (if has next rank) */}
        {progressToNextRank?.hasNextRank && (
          <div className="mt-1">
            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressToNextRank.progress}%`,
                  backgroundColor: currentRank.color,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {progressToNextRank.progress}% đến{" "}
              {progressToNextRank.nextRank.rankDisplayName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankBadge;
