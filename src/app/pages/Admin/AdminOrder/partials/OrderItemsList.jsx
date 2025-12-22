import React from "react";
import { Trash2 } from "lucide-react";
import Input from "../../../../components/AdminLayout/Input";
import Button from "../../../../components/AdminLayout/Button";

const OrderItemsList = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
        >
          <img
            src={item.productImage}
            alt={item.productName}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1">
            <div className="font-medium">{item.productName}</div>
            <div className="text-sm text-gray-600">
              {item.productPrice.toLocaleString("vi-VN")}đ
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Số lượng:</label>
            <Input
              type="number"
              min="1"
              value={item.productQuantity}
              onChange={(e) => onUpdateQuantity(index, e.target.value)}
              className="w-20"
            />
          </div>
          <div className="font-semibold text-green-600 min-w-[100px] text-right">
            {(item.productPrice * item.productQuantity).toLocaleString("vi-VN")}
            đ
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveItem(index)}
            icon={<Trash2 className="w-5 h-5" />}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          />
        </div>
      ))}

      <div className="flex justify-end items-center pt-4 border-t">
        <div className="text-lg font-bold">
          Tổng tiền:{" "}
          <span className="text-green-600">
            {totalPrice.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsList;
