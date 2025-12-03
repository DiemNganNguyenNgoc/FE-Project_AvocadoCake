import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Send, UserPlus, Upload, X } from "lucide-react";
import {
  getVoucherDetails,
  sendVoucherEmail,
} from "../../../api/services/VoucherService";
import { getAllUser } from "../../../api/services/UserService";
import { toast } from "react-toastify";
import Button from "../../../components/AdminLayout/Button";
import Input from "../../../components/AdminLayout/Input";

const SendEmailVoucher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);

  const fetchVoucherDetails = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await getVoucherDetails(id, accessToken);
      if (response.status === "OK") {
        setVoucher(response.data);
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin voucher!");
    }
  }, [id]);

  const fetchUsers = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await getAllUser(accessToken);
      if (response.status === "OK") {
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    fetchVoucherDetails();
    fetchUsers();
  }, [fetchVoucherDetails, fetchUsers]);

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (!selectedEmails.includes(email)) {
        setSelectedEmails([...selectedEmails, email]);
        setEmailInput("");
      } else {
        toast.warning("Email đã được thêm!");
      }
    } else {
      toast.error("Email không hợp lệ!");
    }
  };

  const handleRemoveEmail = (email) => {
    setSelectedEmails(selectedEmails.filter((e) => e !== email));
  };

  const handleSelectAllUsers = () => {
    const allEmails = users.map((u) => u.userEmail).filter(Boolean);
    setSelectedEmails([...new Set([...selectedEmails, ...allEmails])]);
    toast.success(`Đã thêm ${allEmails.length} email!`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const emails = text
          .split(/[\n,;]/)
          .map((e) => e.trim())
          .filter(Boolean);
        const validEmails = emails.filter((e) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
        );
        setSelectedEmails([...new Set([...selectedEmails, ...validEmails])]);
        toast.success(`Đã thêm ${validEmails.length} email từ file!`);
      };
      reader.readAsText(file);
    }
  };

  const handleSendEmail = async () => {
    if (selectedEmails.length === 0) {
      toast.warning("Vui lòng thêm ít nhất 1 email!");
      return;
    }

    if (
      !window.confirm(
        `Bạn có chắc muốn gửi voucher đến ${selectedEmails.length} email?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await sendVoucherEmail(
        { voucherId: id, emails: selectedEmails },
        accessToken
      );

      if (response.status === "OK") {
        toast.success(response.message);
        navigate("/admin/voucher");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi gửi email!");
    } finally {
      setLoading(false);
    }
  };

  if (!voucher) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-avocado-green-100"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/voucher")}
            className="min-w-[48px] min-h-[48px] p-0 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-heading-4 font-bold text-dark dark:text-white">
              Gửi voucher qua email
            </h1>
            <p className="mt-1 text-body-sm text-dark-6 dark:text-dark-6">
              Gửi voucher "{voucher.voucherName}" đến email khách hàng
            </p>
          </div>
        </div>
      </div>

      {/* Voucher Preview */}
      <div className="bg-gradient-to-br from-avocado-green-100 to-avocado-green-200 rounded-2xl shadow-card-3 p-8 text-white">
        <div className="flex items-center gap-6">
          {voucher.voucherImage && (
            <img
              src={voucher.voucherImage}
              alt={voucher.voucherName}
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
            />
          )}
          <div className="flex-1">
            <h3 className="text-heading-4 font-bold mb-3">
              {voucher.voucherName}
            </h3>
            <p className="text-body-md text-white/95 mb-4">
              {voucher.voucherDescription}
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 inline-block border-2 border-white/30">
              <p className="text-body-xs text-white/90 font-medium">
                Mã voucher
              </p>
              <p className="text-heading-5 font-mono font-bold mt-1">
                {voucher.voucherCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Email Manually */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
            <h2 className="text-heading-5 font-bold mb-6 text-dark dark:text-white flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-3">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              Thêm email
            </h2>

            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                  placeholder="Nhập email và nhấn Enter..."
                />
              </div>
              <Button
                onClick={handleAddEmail}
                variant="primary"
                className="px-6"
              >
                Thêm
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
            <h2 className="text-heading-5 font-bold mb-6 text-dark dark:text-white">
              Thao tác nhanh
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleSelectAllUsers}
                className="flex items-center justify-center gap-3 p-6 border-2 border-purple-300 dark:border-purple-700 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all min-h-[80px] group"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
                <span className="font-semibold text-body-sm text-dark dark:text-white">
                  Chọn tất cả user ({users.length})
                </span>
              </button>

              <label className="flex items-center justify-center gap-3 p-6 border-2 border-blue-300 dark:border-blue-700 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all min-h-[80px] cursor-pointer group">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-semibold text-body-sm text-dark dark:text-white">
                  Upload file email
                </span>
                <input
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-body-xs text-dark-6 mt-4 px-2">
              * File txt/csv, mỗi email một dòng hoặc phân cách bằng dấu phẩy
            </p>
          </div>

          {/* Selected Emails List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-5 font-bold text-dark dark:text-white">
                Danh sách email ({selectedEmails.length})
              </h2>
              {selectedEmails.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setSelectedEmails([])}
                  className="text-red-600 hover:text-red-700"
                >
                  Xóa tất cả
                </Button>
              )}
            </div>

            {selectedEmails.length === 0 ? (
              <div className="text-center py-12 text-dark-6">
                <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl mb-4">
                  <Mail className="w-12 h-12 opacity-50" />
                </div>
                <p className="text-body-sm font-medium">
                  Chưa có email nào được thêm
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {selectedEmails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group"
                  >
                    <span className="text-body-sm text-dark dark:text-white font-medium">
                      {email}
                    </span>
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="min-w-[32px] min-h-[32px] text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-2 p-8 sticky top-6">
            <h2 className="text-heading-5 font-bold mb-6 text-dark dark:text-white">
              Xem trước email
            </h2>

            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
              <div>
                <p className="text-body-xs text-dark-6 font-medium mb-2">
                  Tiêu đề:
                </p>
                <p className="text-body-sm font-semibold text-dark dark:text-white">
                  🎉 Bạn nhận được voucher {voucher.voucherName}!
                </p>
              </div>

              <div>
                <p className="text-body-xs text-dark-6 font-medium mb-2">
                  Nội dung:
                </p>
                <div className="text-body-xs text-dark-7 dark:text-dark-6 space-y-1.5 leading-relaxed">
                  <p>✨ Chúc mừng bạn!</p>
                  <p>📋 Mã: {voucher.voucherCode}</p>
                  <p>
                    💰 Giảm giá: {voucher.discountValue}
                    {voucher.voucherType === "PERCENTAGE" ? "%" : "₫"}
                  </p>
                  <p>
                    📅 HSD:{" "}
                    {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="mt-2">👉 Mua sắm ngay!</p>
                </div>
              </div>

              {voucher.voucherImage && (
                <div>
                  <p className="text-body-xs text-dark-6 font-medium mb-2">
                    Hình ảnh:
                  </p>
                  <img
                    src={voucher.voucherImage}
                    alt="Voucher"
                    className="w-full rounded-xl"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 space-y-3">
              <Button
                onClick={handleSendEmail}
                disabled={loading || selectedEmails.length === 0}
                variant="primary"
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    <span>Gửi đến {selectedEmails.length} email</span>
                  </>
                )}
              </Button>

              <Button
                onClick={() => navigate("/admin/voucher")}
                variant="secondary"
                className="w-full"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmailVoucher;
