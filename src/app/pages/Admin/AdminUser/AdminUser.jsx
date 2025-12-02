import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import { AdminUserProvider, useAdminUserStore } from "./adminUserStore";
import UserService from "./services/UserService";
import Breadcrumb from "./partials/Breadcrumb";
import UserTable from "./partials/UserTable";
import AddUser from "./usecases/AddUser";
import UpdateUser from "./usecases/UpdateUser";
import ViewUserDetail from "./usecases/ViewUserDetail";
import Button from "../../../components/AdminLayout/Button";

const AdminUserContent = ({ onNavigate }) => {
  const {
    loading,
    error,
    showAddModal,
    showEditModal,
    showViewModal,
    setUsers,
    setLoading,
    setError,
    setShowAddModal,
    setShowEditModal,
    setShowViewModal,
    clearSelection,
  } = useAdminUserStore();

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await UserService.getAllUsers();
        console.log("👥 Full API Response:", response);
        console.log("👥 Response.data:", response.data);
        console.log(
          "👥 Sample user with rank:",
          response.data?.find((u) => u.currentRank)
        );
        setUsers(response.data || response);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [setUsers, setLoading, setError]);

  const handleCreateUser = () => {
    setShowAddModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    clearSelection();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb currentPage="Users" />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách người dùng
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tài khoản người dùng trong hệ thống
            </p>
          </div>
          <Button onClick={handleCreateUser}>
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* User Table */}
      {!loading && <UserTable />}

      {/* Modals */}
      {showAddModal && <AddUser onBack={handleCloseModals} />}
      {showEditModal && <UpdateUser onBack={handleCloseModals} />}
      {showViewModal && <ViewUserDetail onBack={handleCloseModals} />}
    </div>
  );
};

const AdminUser = ({ onNavigate }) => {
  return (
    <AdminUserProvider>
      <AdminUserContent onNavigate={onNavigate} />
    </AdminUserProvider>
  );
};

export default AdminUser;
