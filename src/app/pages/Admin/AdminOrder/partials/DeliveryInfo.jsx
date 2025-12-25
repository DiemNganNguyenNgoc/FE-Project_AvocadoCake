import React from "react";
import Input from "../../../../components/AdminLayout/Input";
import Select from "../../../../components/AdminLayout/Select";
import Textarea from "../../../../components/AdminLayout/Textarea";

const DeliveryInfo = ({ formData, statuses, onFormChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>

      <div className="space-y-4">
        <Textarea
          label="Địa chỉ giao hàng *"
          placeholder="Nhập địa chỉ giao hàng..."
          rows={3}
          value={formData.shippingAddress}
          onChange={(e) =>
            onFormChange({ ...formData, shippingAddress: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ngày giao hàng *"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={formData.deliveryDate}
            onChange={(e) =>
              onFormChange({ ...formData, deliveryDate: e.target.value })
            }
          />
          <Input
            label="Giờ giao hàng *"
            type="time"
            value={formData.deliveryTime}
            onChange={(e) =>
              onFormChange({ ...formData, deliveryTime: e.target.value })
            }
          />
        </div>

        <Select
          label="Trạng thái đơn hàng *"
          value={formData.status}
          onChange={(e) => {
            const selectedStatus = statuses.find(
              (s) => s._id === e.target.value
            );
            onFormChange({
              ...formData,
              status: e.target.value,
              statusCode: selectedStatus?.statusCode || "",
            });
          }}
          options={statuses.map((status) => ({
            value: status._id,
            label: status.statusName,
          }))}
        />

        <Textarea
          label="Ghi chú"
          placeholder="Thêm ghi chú cho đơn hàng..."
          rows={3}
          value={formData.note}
          onChange={(e) => onFormChange({ ...formData, note: e.target.value })}
        />
      </div>
    </div>
  );
};

export default DeliveryInfo;
