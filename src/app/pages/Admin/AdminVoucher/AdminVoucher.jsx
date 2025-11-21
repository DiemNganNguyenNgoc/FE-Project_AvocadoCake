import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  Eye,
  Copy,
  Package,
  Users,
  Percent,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getAllVouchers,
  deleteVoucher,
  toggleVoucherStatus,
  getVoucherStatistics,
  getVoucherTypeText,
  formatVoucherValue,
} from "../../../api/services/VoucherService";
import { toast } from "react-toastify";
import DataTable from "../../../components/AdminLayout/DataTable";
import StatCard from "../../../components/AdminLayout/StatCard";
import Button from "../../../components/AdminLayout/Button";

const AdminVoucher = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchVouchers();
    fetchStatistics();
  }, [page]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");
      const response = await getAllVouchers(
        { limit: 10, page, sort: null, filter: null },
        accessToken
      );

      if (response.status === "OK") {
        setVouchers(response.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách voucher!");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await getVoucherStatistics(accessToken);
      if (response.status === "OK") {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await deleteVoucher(id, accessToken);

        if (response.status === "OK") {
          toast.success("Xóa voucher thành công!");
          fetchVouchers();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error.message || "Lỗi khi xóa voucher!");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await toggleVoucherStatus(id, accessToken);

      if (response.status === "OK") {
        toast.success(response.message);
        fetchVouchers();
      }
    } catch (error) {
      toast.error("Lỗi khi thay đổi trạng thái!");
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Đã copy mã voucher!");
  };

  const filteredVouchers = vouchers.filter(
    (v) =>
      v.voucherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.voucherCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-heading-4 font-bold text-dark dark:text-white">
            Quản lý Voucher
          </h1>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
            Tạo và quản lý voucher giảm giá cho khách hàng
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => navigate("/admin/voucher/create-bulk")}
            variant="secondary"
            size="lg"
            icon={<Copy />}
            className="min-h-[48px]"
          >
            Tạo hàng loạt
          </Button>
          <Button
            onClick={() => navigate("/admin/voucher/create")}
            variant="primary"
            size="lg"
            icon={<Plus />}
            className="min-h-[48px]"
          >
            Tạo voucher
          </Button>
        </div>
      </div>

      {/* Statistics Cards - Using StatCard component */}
      {statistics && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Tổng voucher"
            value={statistics.totalVouchers}
            icon={<Package />}
            color="bg-blue-500"
          />

          <StatCard
            title="Đang hoạt động"
            value={statistics.activeVouchers}
            icon={<ToggleRight />}
            color="bg-green-500"
          />

          <StatCard
            title="Đã lưu"
            value={statistics.totalClaimed}
            icon={<Users />}
            color="bg-purple-500"
          />

          <StatCard
            title="Tỷ lệ sử dụng"
            value={`${statistics.usageRate}%`}
            icon={<Percent />}
            color="bg-orange-500"
          />
        </div>
      )}

      {/* Vouchers DataTable */}
      {loading ? (
        <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-dark rounded-2xl shadow-card-2">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-avocado-green-100 border-t-transparent"></div>
        </div>
      ) : filteredVouchers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-dark rounded-2xl shadow-card-2">
          <Package className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-6" />
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-4">
            Không có voucher nào
          </p>
          <Button
            onClick={() => navigate("/admin/voucher/create")}
            variant="primary"
            size="lg"
            icon={<Plus />}
          >
            Tạo voucher mới
          </Button>
        </div>
      ) : (
        <DataTable
          columns={[
            {
              header: "Voucher",
              key: "voucherName",
              render: (value, row) => (
                <div className="flex items-center gap-4">
                  {row.voucherImage && (
                    <img
                      src={row.voucherImage}
                      alt={row.voucherName}
                      className="w-16 h-16 rounded-2xl object-cover shadow-md"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      {row.voucherName}
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                        {row.voucherCode}
                      </code>
                      <button
                        onClick={() => handleCopyCode(row.voucherCode)}
                        className="text-gray-400 hover:text-avocado-green-100 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              header: "Loại",
              key: "voucherType",
              render: (value) => (
                <span className="inline-flex px-3 py-1.5 text-sm font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {getVoucherTypeText(value)}
                </span>
              ),
            },
            {
              header: "Giá trị",
              key: "discountValue",
              render: (value, row) => (
                <span className="font-semibold text-avocado-green-100">
                  {formatVoucherValue(row)}
                </span>
              ),
            },
            {
              header: "Sử dụng",
              key: "usedQuantity",
              render: (value, row) => (
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {row.usedQuantity}/{row.totalQuantity}
                  </p>
                  <div className="mt-1 w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-avocado-green-100 rounded-full transition-all"
                      style={{
                        width: `${
                          (row.usedQuantity / row.totalQuantity) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ),
            },
            {
              header: "Thời hạn",
              key: "endDate",
              render: (value) => (
                <span className="text-base text-gray-600 dark:text-gray-400">
                  {new Date(value).toLocaleDateString("vi-VN")}
                </span>
              ),
            },
            {
              header: "Trạng thái",
              key: "isActive",
              render: (value) =>
                value ? (
                  <span className="inline-flex px-3 py-1.5 text-sm font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Hoạt động
                  </span>
                ) : (
                  <span className="inline-flex px-3 py-1.5 text-sm font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    Tắt
                  </span>
                ),
            },
            {
              header: "Thao tác",
              key: "_id",
              render: (value, row) => (
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigate(`/admin/voucher/detail/${value}`)}
                    className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/voucher/edit/${value}`)}
                    className="p-2.5 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-xl transition-all"
                    title="Sửa"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(value)}
                    className="p-2.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all"
                    title={row.isActive ? "Tắt" : "Bật"}
                  >
                    {row.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/admin/voucher/send-email/${value}`)
                    }
                    className="p-2.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-all"
                    title="Gửi email"
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(value)}
                    className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredVouchers}
          searchPlaceholder="Tìm kiếm voucher theo tên hoặc mã..."
          showSearch={true}
          onSearch={(term) => setSearchTerm(term)}
        />
      )}
    </div>
  );
};

export default AdminVoucher;
