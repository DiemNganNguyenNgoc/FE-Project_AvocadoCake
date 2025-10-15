import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import HomeAdminPage from "./HomeAdminPage/HomeAdminPage";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import AdminProduct from "./AdminProduct/AdminProduct";
import AdminOrder from "./AdminOrder/AdminOrder";
import AdminUser from "./AdminUser/AdminUser";
import AdminCategory from "./AdminCategory/AdminCategory";
import AdminDiscount from "./AdminDiscount/AdminDiscount";
import AdminQuiz from "./AdminQuiz/AdminQuiz";
import AdminSetting from "./AdminSetting/AdminSetting";

const AdminWrapper = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<HomeAdminPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/products" element={<AdminProduct />} />
        <Route path="/orders" element={<AdminOrder />} />
        <Route path="/users" element={<AdminUser />} />
        <Route path="/categories" element={<AdminCategory />} />
        <Route path="/discounts" element={<AdminDiscount />} />
        <Route path="/quizzes" element={<AdminQuiz />} />
        <Route path="/settings" element={<AdminSetting />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminWrapper;
