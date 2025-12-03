import React from "react";
import { Users } from "lucide-react";

const RankStatsCards = ({ statistics }) => {
  if (!statistics || !statistics.statistics) {
    return null;
  }

  const { statistics: rankStats, totalUsers } = statistics;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Users Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-blue-600 bg-blue-200 px-3 py-1 rounded-full">
            Tổng
          </span>
        </div>
        <h3 className="text-3xl font-bold text-blue-900 mb-1">{totalUsers}</h3>
        <p className="text-sm text-blue-600">Tổng khách hàng</p>
      </div>

      {/* Rank Distribution Cards */}
      {rankStats.map((stat, index) => {
        const percentage =
          totalUsers > 0 ? ((stat.userCount / totalUsers) * 100).toFixed(1) : 0;

        // Gradient colors based on rank
        const gradients = [
          {
            from: "from-orange-50",
            to: "to-orange-100",
            border: "border-orange-200",
            bg: "bg-orange-500",
            text: "text-orange-600",
            badge: "bg-orange-200",
          },
          {
            from: "from-gray-50",
            to: "to-gray-100",
            border: "border-gray-300",
            bg: "bg-gray-400",
            text: "text-gray-600",
            badge: "bg-gray-200",
          },
          {
            from: "from-yellow-50",
            to: "to-yellow-100",
            border: "border-yellow-200",
            bg: "bg-yellow-500",
            text: "text-yellow-600",
            badge: "bg-yellow-200",
          },
        ];

        const style = gradients[index] || gradients[0];

        return (
          <div
            key={stat.rank._id}
            className={`bg-gradient-to-br ${style.from} ${style.to} rounded-2xl p-6 border ${style.border}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${style.bg} rounded-xl flex items-center justify-center text-2xl`}
              >
                {stat.rank.icon}
              </div>
              <span
                className={`text-sm font-medium ${style.text} ${style.badge} px-3 py-1 rounded-full`}
              >
                {percentage}%
              </span>
            </div>

            <h3 className={`text-3xl font-bold ${style.text} mb-1`}>
              {stat.userCount}
            </h3>
            <p className={`text-sm ${style.text} mb-3`}>
              {stat.rank.rankDisplayName}
            </p>

            {/* Mini Bar Chart */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={style.text}>Chi tiêu TB</span>
                <span className={`font-semibold ${style.text}`}>
                  {formatCurrency(stat.avgSpending)}
                </span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2">
                <div
                  className={`${style.bg} h-2 rounded-full transition-all duration-500`}
                  style={{
                    width: `${Math.min(
                      (stat.avgSpending / (stat.rank.maxSpending || 2000000)) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`${style.text} opacity-75`}>
                  Giảm giá: {stat.rank.discountPercent}%
                </span>
                <span className={`${style.text} opacity-75`}>
                  Min: {formatCurrency(stat.rank.minSpending)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RankStatsCards;
