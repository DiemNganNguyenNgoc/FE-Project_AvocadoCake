import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Send, UserPlus, Upload } from "lucide-react";
import {
  getVoucherDetails,
  sendVoucherEmail,
} from "../../../api/services/VoucherService";
import { getAllUser } from "../../../api/services/UserService";
import { toast } from "react-toastify";

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
    const allEmails = users.map((u) => u.email);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/voucher")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
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
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          {voucher.voucherImage && (
            <img
              src={voucher.voucherImage}
              alt={voucher.voucherName}
              className="w-24 h-24 rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{voucher.voucherName}</h3>
            <p className="text-white/90 mb-2">{voucher.voucherDescription}</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              <p className="text-xs">Mã voucher</p>
              <p className="text-xl font-mono font-bold">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Thêm email
            </h2>

            <div className="flex space-x-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                placeholder="Nhập email và nhấn Enter..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleAddEmail}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Thêm
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Thao tác nhanh
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleSelectAllUsers}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-purple-300 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <UserPlus className="w-5 h-5 text-purple-600" />
                <span className="font-medium">
                  Chọn tất cả user ({users.length})
                </span>
              </button>

              <label className="flex items-center justify-center space-x-2 p-4 border-2 border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Upload file email</span>
                <input
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              * File txt/csv, mỗi email một dòng hoặc phân cách bằng dấu phẩy
            </p>
          </div>

          {/* Selected Emails List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Danh sách email ({selectedEmails.length})
              </h2>
              {selectedEmails.length > 0 && (
                <button
                  onClick={() => setSelectedEmails([])}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {selectedEmails.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có email nào được thêm</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {selectedEmails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {email}
                    </span>
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Xem trước email
            </h2>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tiêu đề:
                </p>
                <p className="text-sm font-medium">
                  🎉 Bạn nhận được voucher {voucher.voucherName}!
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Nội dung:
                </p>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Hình ảnh:
                  </p>
                  <img
                    src={voucher.voucherImage}
                    alt="Voucher"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleSendEmail}
                disabled={loading || selectedEmails.length === 0}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Gửi đến {selectedEmails.length} email</span>
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/admin/voucher")}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmailVoucher;
