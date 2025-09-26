import React, { useMemo, useState } from "react";
import { useAdminDiscount } from "../adminDiscountStore";

const DiscountTable = () => {
  const { discounts, isLoading, error, removeDiscountById, refreshDiscounts } =
    useAdminDiscount();
  const [selected, setSelected] = useState([]);

  const allSelected = useMemo(
    () => selected.length > 0 && selected.length === discounts.length,
    [selected, discounts.length]
  );

  const toggleAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(discounts.map((d) => d._id));
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selected.length !== 1) {
      alert("Vui lòng chọn đúng 1 khuyến mãi để xóa");
      return;
    }
    try {
      await removeDiscountById(selected[0]);
      setSelected([]);
    } catch (e) {
      alert(e?.message || "Xóa khuyến mãi thất bại");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Danh sách khuyến mãi
        </h2>
        <div className="flex gap-2">
          <button
            onClick={refreshDiscounts}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            Làm mới
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Xóa
          </button>
        </div>
      </div>

      {isLoading && <div className="p-6 text-gray-500">Đang tải...</div>}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-3 py-2">STT</th>
              <th className="px-3 py-2">Mã</th>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Giá trị</th>
              <th className="px-3 py-2">Sản phẩm áp dụng</th>
              <th className="px-3 py-2">Bắt đầu</th>
              <th className="px-3 py-2">Kết thúc</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {discounts?.length ? (
              discounts.map((d, idx) => (
                <tr
                  key={d._id}
                  className={selected.includes(d._id) ? "bg-brand-50" : ""}
                >
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(d._id)}
                      onChange={() => toggleOne(d._id)}
                    />
                  </td>
                  <td className="px-3 py-2 text-gray-700">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {d.discountCode}
                  </td>
                  <td className="px-3 py-2 text-gray-800">{d.discountName}</td>
                  <td className="px-3 py-2 text-gray-800">
                    {d.discountValue}%
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {Array.isArray(d.discountProduct)
                      ? d.discountProduct.map((p) => p.productName).join(", ")
                      : ""}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {d.discountStartDate}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {d.discountEndDate}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-3 py-6 text-center text-gray-500">
                  Không có khuyến mãi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountTable;
