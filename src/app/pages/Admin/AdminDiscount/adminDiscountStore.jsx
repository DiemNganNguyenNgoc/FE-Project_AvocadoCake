import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getAllDiscount,
  deleteDiscount,
  createDiscount,
  updateDiscount,
} from "./services/DiscountService";

const AdminDiscountContext = createContext(null);

export const AdminDiscountProvider = ({ children }) => {
  const [discounts, setDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshDiscounts = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await getAllDiscount();
      if (Array.isArray(res?.data)) {
        setDiscounts(res.data);
      } else {
        setError("Dữ liệu khuyến mãi không hợp lệ");
      }
    } catch (e) {
      setError(e?.message || "Không thể tải danh sách khuyến mãi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDiscounts();
  }, [refreshDiscounts]);

  const removeDiscountById = useCallback(async (id) => {
    const accessToken = localStorage.getItem("access_token");
    await deleteDiscount(id, accessToken);
    setDiscounts((prev) => prev.filter((d) => d._id !== id));
  }, []);

  const addDiscount = useCallback(
    async (newDiscount) => {
      const accessToken = localStorage.getItem("access_token");
      try {
        const response = await createDiscount(newDiscount, accessToken);
        if (response) {
          setDiscounts((prev) => [...prev, response]);
        }
      } catch (err) {
        setError("Thêm khuyến mãi thất bại.");
        throw err;
      }
    },
    [setDiscounts]
  );

  const updateDiscountById = useCallback(
    async (id, updatedDiscount) => {
      const accessToken = localStorage.getItem("access_token");
      try {
        const response = await updateDiscount(id, accessToken, updatedDiscount);
        if (response) {
          setDiscounts((prev) =>
            prev.map((discount) =>
              discount._id === id
                ? { ...discount, ...updatedDiscount }
                : discount
            )
          );
        }
      } catch (err) {
        setError("Cập nhật khuyến mãi thất bại.");
        throw err;
      }
    },
    [setDiscounts]
  );

  const value = useMemo(
    () => ({
      discounts,
      isLoading,
      error,
      refreshDiscounts,
      removeDiscountById,
      addDiscount,
      updateDiscountById,
    }),
    [
      discounts,
      isLoading,
      error,
      refreshDiscounts,
      removeDiscountById,
      addDiscount,
      updateDiscountById,
    ]
  );

  return (
    <AdminDiscountContext.Provider value={value}>
      {children}
    </AdminDiscountContext.Provider>
  );
};

export const useAdminDiscount = () => {
  const ctx = useContext(AdminDiscountContext);
  if (!ctx)
    throw new Error(
      "useAdminDiscount must be used within AdminDiscountProvider"
    );
  return ctx;
};
