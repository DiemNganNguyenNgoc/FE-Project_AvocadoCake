import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllRanks, getUserRank } from "../../../api/services/RankService";
import ButtonFormComponent from "../../../components/ButtonFormComponent/ButtonFormComponent";

const RankBenefitsPage = () => {
  const [ranks, setRanks] = useState([]);
  const [userRankData, setUserRankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchRanksData();
  }, [user?.id]);

  const fetchRanksData = async () => {
    try {
      setLoading(true);

      // Lấy tất cả ranks
      const ranksResponse = await getAllRanks();
      if (ranksResponse.status === "OK") {
        setRanks(
          ranksResponse.data
            .filter((r) => r.isActive)
            .sort((a, b) => a.priority - b.priority)
        );
      }

      // Lấy rank của user nếu đã đăng nhập
      if (user?.id && access_token) {
        const userRankResponse = await getUserRank(user.id, access_token);
        if (userRankResponse.status === "OK") {
          setUserRankData(userRankResponse.data);
        }
      }
    } catch (error) {
      console.error("Error fetching ranks data:", error);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-avocado-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-[40px] font-bold text-[#212529] mb-4">
            HỆ THỐNG HẠNG THÀNH VIÊN
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tích lũy chi tiêu để nhận được nhiều ưu đãi hấp dẫn hơn. Càng mua
            nhiều, càng nhận được nhiều đặc quyền!
          </p>
        </div>

        {/* User Current Rank Card */}
        {userRankData && (
          <div
            className="mb-12 bg-white p-8 border"
            style={{ borderRadius: "16px" }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="text-6xl">{userRankData.currentRank.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">
                    Hạng {userRankData.currentRank.rankDisplayName}
                  </h2>
                  <p className="text-gray-600">
                    Tổng chi tiêu: {formatCurrency(userRankData.totalSpending)}
                  </p>
                  <p className="text-lg font-semibold mt-2 text-avocado-green-100">
                    Giảm giá hiện tại: {userRankData.discountPercent}%
                  </p>
                </div>
              </div>

              {/* Progress to Next Rank */}
              {userRankData.progressToNextRank?.hasNextRank && (
                <div className="flex-1 max-w-md">
                  <div
                    className="bg-gray-50 p-4"
                    style={{ borderRadius: "16px" }}
                  >
                    <div className="flex justify-between text-sm mb-2 text-gray-700">
                      <span>Tiến độ đến rank tiếp theo</span>
                      <span className="font-bold">
                        {userRankData.progressToNextRank.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-avocado-green-100 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${userRankData.progressToNextRank.progress}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm mt-2 text-gray-600">
                      Còn{" "}
                      {formatCurrency(
                        userRankData.progressToNextRank.remainingSpending
                      )}{" "}
                      nữa để đạt hạng{" "}
                      <span className="font-bold text-gray-900">
                        {
                          userRankData.progressToNextRank.nextRank
                            .rankDisplayName
                        }
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ranks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ranks.map((rank) => {
            const isCurrentRank = userRankData?.currentRank?._id === rank._id;

            return (
              <div
                key={rank._id}
                className="relative overflow-hidden transition-all duration-300 hover:scale-105 flex flex-col"
                style={{
                  borderRadius: "16px",
                  border: isCurrentRank
                    ? "2px solid #27a300"
                    : "0.5px solid #d1d5db",
                }}
              >
                {/* Card Header */}
                <div className="p-8 bg-gray-50 text-center border-b">
                  <div className="text-6xl mb-4">{rank.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    {rank.rankDisplayName}
                  </h3>
                  <div className="text-3xl font-bold mb-2 text-avocado-green-100">
                    {rank.discountPercent}%
                  </div>
                  <p className="text-sm text-gray-600">Giảm giá mọi đơn hàng</p>
                </div>

                {/* Card Body */}
                <div className="bg-white p-8 flex flex-col flex-grow">
                  {/* Spending Range */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      Hạn mức chi tiêu
                    </p>
                    <div className="font-semibold text-gray-900">
                      {rank.maxSpending
                        ? `${formatCurrency(
                            rank.minSpending
                          )} - ${formatCurrency(rank.maxSpending)}`
                        : `Từ ${formatCurrency(rank.minSpending)}`}
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Đặc quyền:
                    </p>
                    <ul className="space-y-3">
                      {rank.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm text-gray-700">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Description */}
                  {rank.description && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600 italic">
                        {rank.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        {!user?.id && (
          <div className="mt-16 text-center bg-white rounded-2xl p-12 border-2 border-gray-400">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Đăng nhập để bắt đầu tích lũy
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Tạo tài khoản ngay để theo dõi tiến độ rank của bạn và nhận được
              nhiều ưu đãi
            </p>
            <div className="flex justify-center">
              <ButtonFormComponent
                onClick={() => (window.location.href = "/login")}
              >
                Đăng nhập ngay
              </ButtonFormComponent>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-avocado-green-10 rounded-2xl p-8 border-2 border-blue-100">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Cách thức hoạt động
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-4">
                {/* <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div> */}
                <p>
                  1. Mỗi lần mua hàng, tổng giá trị đơn hàng sẽ được cộng dồn
                  vào tổng chi tiêu của bạn.
                </p>
              </div>
              <div className="flex items-start gap-4">
                {/* <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div> */}
                <p>
                  2. Hệ thống tự động xếp hạng dựa trên tổng chi tiêu của bạn.
                </p>
              </div>
              <div className="flex items-start gap-4">
                {/* <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div> */}
                <p>
                  3. Mỗi hạng có phần trăm giảm giá riêng, tự động áp dụng cho
                  mọi đơn hàng.
                </p>
              </div>
              <div className="flex items-start gap-4">
                {/* <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div> */}
                <p>
                  4. Khi thăng hạng, bạn sẽ nhận được email thông báo kèm
                  voucher đặc biệt!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankBenefitsPage;
