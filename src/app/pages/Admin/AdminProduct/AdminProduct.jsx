import React, { useEffect } from "react";
import { Plus, AlertCircle, Package } from "lucide-react";
import {
  useAdminProductStore,
  AdminProductProvider,
} from "./AdminProductContext";
import ProductService from "./services/ProductService";
import Breadcrumb from "./partials/Breadcrumb";
import SearchBar from "./partials/SearchBar";
import FilterBar from "./partials/FilterBar";
import ProductTable from "./partials/ProductTable";
import ProductCard from "./partials/ProductCard";
import Pagination from "./partials/Pagination";
import ViewModeToggle from "./partials/ViewModeToggle";
import AddProduct from "./usecases/AddProduct";
import UpdateProduct from "./usecases/UpdateProduct";
import ViewProduct from "./partials/ViewProduct";
import Button from "../../../components/AdminLayout/Button";

const AdminProductContent = ({ onNavigate }) => {
  const {
    loading,
    error,
    showAddModal,
    showEditModal,
    showViewModal,
    viewMode,
    paginatedProducts,
    setLoading,
    setError,
    setProducts,
    setShowAddModal,
    setShowEditModal,
    setShowViewModal,
    setCategories,
  } = useAdminProductStore();

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProducts();
      setProducts(response.data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ProductService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb currentPage="Sản phẩm" />

        {/* Header */}
        <div className="mb-8">
          <div className="md:flex md:items-center md:justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Quản lý Sản phẩm
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Quản lý danh sách sản phẩm trong hệ thống
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm Sản phẩm Mới
              </Button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-end">
            <ViewModeToggle />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Display */}
        <div className="bg-white shadow rounded-lg">
          {viewMode === "list" ? (
            <ProductTable />
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts().map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {paginatedProducts().length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Không có sản phẩm
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Bắt đầu bằng cách thêm sản phẩm mới.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {showAddModal && <AddProduct onBack={handleCloseModals} />}

        {showEditModal && <UpdateProduct onBack={handleCloseModals} />}

        {showViewModal && <ViewProduct onBack={handleCloseModals} />}
      </div>
    </div>
  );
};

const AdminProduct = ({ onNavigate }) => {
  return (
    <AdminProductProvider>
      <AdminProductContent onNavigate={onNavigate} />
    </AdminProductProvider>
  );
};

export default AdminProduct;
