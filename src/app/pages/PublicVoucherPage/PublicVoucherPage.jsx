import React, { useState, useEffect } from "react";
import {
  getPublicVouchers,
  claimVoucher,
  getUserVouchers,
} from "../../api/services/VoucherService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import VoucherHero from "./components/VoucherHero";
import VoucherFilters from "./components/VoucherFilters";
import VoucherStatistics from "./components/VoucherStatistics";
import VoucherGrid from "./components/VoucherGrid";

const PublicVoucherPage = () => {
  const user = useSelector((state) => state.user);
  const [vouchers, setVouchers] = useState([]);
  const [userVouchers, setUserVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [sortBy, setSortBy] = useState("priority");

  useEffect(() => {
    const initPage = async () => {
      await fetchVouchers();
      // Always fetch user vouchers if token exists
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        await fetchUserVouchers();
      }
    };
    initPage();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await getPublicVouchers();
      if (response.status === "OK") {
        setVouchers(response.data || []);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách voucher!");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVouchers = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await getUserVouchers(null, accessToken);
      if (response.status === "OK") {
        setUserVouchers(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching user vouchers:", error);
    }
  };

  const handleClaimVoucher = async (voucherId) => {
    if (!user?.id) {
      toast.warning("Vui lòng đăng nhập để nhận voucher!");
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await claimVoucher(voucherId, accessToken);

      if (response.status === "OK") {
        toast.success("Lưu voucher thành công!");
        // Refresh để cập nhật danh sách
        await fetchUserVouchers();
      }
    } catch (error) {
      // Xử lý lỗi từ backend
      const errorMessage = error.message || "Lỗi khi lưu voucher!";

      // Nếu đã lưu voucher rồi thì hiển thị info và refresh
      if (errorMessage.includes("đã lưu") || errorMessage.includes("already")) {
        toast.info(errorMessage);
        // Refresh để cập nhật trạng thái "Đã lưu"
        await fetchUserVouchers();
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const getUserVoucherStatus = (voucherId) => {
    const userVoucher = userVouchers.find(
      (uv) => uv.voucherId === voucherId || uv.voucherId?._id === voucherId
    );
    return userVoucher ? "claimed" : undefined;
  };

  const filteredVouchers = vouchers
    .filter((voucher) => {
      const matchesSearch =
        voucher.voucherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.voucherCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "ALL" || voucher.voucherType === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        return (b.priority || 0) - (a.priority || 0);
      } else if (sortBy === "discount") {
        return b.discountValue - a.discountValue;
      } else if (sortBy === "endDate") {
        return new Date(a.endDate) - new Date(b.endDate);
      }
      return 0;
    });

  // Calculate available vouchers (not expired and not fully claimed)
  const availableVouchers = vouchers.filter((v) => {
    const daysLeft = Math.ceil(
      (new Date(v.endDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft > 0 && v.claimedQuantity < v.totalQuantity;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <VoucherHero />

      <div className="container mx-auto px-4 py-8">
        <VoucherFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <VoucherStatistics
          totalVouchers={vouchers.length}
          savedVouchers={userVouchers.length}
          availableVouchers={availableVouchers}
        />

        <VoucherGrid
          loading={loading}
          filteredVouchers={filteredVouchers}
          getUserVoucherStatus={getUserVoucherStatus}
          handleClaimVoucher={handleClaimVoucher}
        />
      </div>
    </div>
  );
};

export default PublicVoucherPage;
