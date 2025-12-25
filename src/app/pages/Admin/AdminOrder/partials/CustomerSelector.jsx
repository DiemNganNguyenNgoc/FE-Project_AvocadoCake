import React from "react";
import { Search } from "lucide-react";
import Input from "../../../../components/AdminLayout/Input";
import Checkbox from "../../../../components/AdminLayout/Checkbox";

const CustomerSelector = ({
  isGuest,
  onGuestToggle,
  searchUser,
  onSearchChange,
  showDropdown,
  onFocus,
  filteredUsers,
  onSelectUser,
  formData,
  onFormChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Thông tin khách hàng</h2>
        <div className="flex items-center">
          <Checkbox
            label="Khách vãng lai"
            checked={isGuest}
            onChange={(e) => onGuestToggle(e.target.checked)}
          />
        </div>
      </div>

      {!isGuest ? (
        <>
          {/* Registered User Search */}
          <div className="relative mb-4">
            <Input
              label="Tìm khách hàng *"
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              value={searchUser}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={onFocus}
              leftIcon={<Search className="w-5 h-5" />}
            />

            {showDropdown && filteredUsers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => onSelectUser(user)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="font-medium">{user.userName}</div>
                    <div className="text-sm text-gray-600">
                      {user.userEmail}
                    </div>
                    {user.userPhone && (
                      <div className="text-sm text-gray-500">
                        {user.userPhone}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Show selected user info */}
          {formData.user && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tên khách hàng"
                value={formData.userName}
                readOnly
                className="bg-gray-50"
              />
              <Input
                label="Email"
                type="email"
                value={formData.userEmail}
                readOnly
                className="bg-gray-50"
              />
              <Input
                label="Số điện thoại"
                value={formData.userPhone}
                onChange={(e) =>
                  onFormChange({ ...formData, userPhone: e.target.value })
                }
              />
            </div>
          )}
        </>
      ) : (
        /* Guest Customer Form */
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Họ *"
            placeholder="Nhập họ..."
            value={formData.familyName}
            onChange={(e) =>
              onFormChange({ ...formData, familyName: e.target.value })
            }
          />
          <Input
            label="Tên *"
            placeholder="Nhập tên..."
            value={formData.userName}
            onChange={(e) =>
              onFormChange({ ...formData, userName: e.target.value })
            }
          />
          <Input
            label="Email *"
            type="email"
            placeholder="Nhập email..."
            value={formData.userEmail}
            onChange={(e) =>
              onFormChange({ ...formData, userEmail: e.target.value })
            }
          />
          <Input
            label="Số điện thoại *"
            type="text"
            placeholder="Nhập số điện thoại..."
            value={formData.userPhone}
            onChange={(e) =>
              onFormChange({ ...formData, userPhone: e.target.value })
            }
          />
        </div>
      )}
    </div>
  );
};

export default CustomerSelector;
