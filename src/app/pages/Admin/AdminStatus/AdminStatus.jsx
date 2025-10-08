import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllStatus,
  setSelectedStatus,
  clearSelectedStatus,
} from "../../../redux/slides/statusSlide";
import {
  getAllStatus,
  deleteStatus,
} from "../../../api/services/StatusService";
import SearchBar from "./partials/SearchBar";
import StatusTable from "./partials/StatusTable";
import AddStatus from "./usecases/AddStatus";
import UpdateStatus from "./usecases/UpdateStatus";
import AdminButtonComponent from "../../../components/AdminComponents/AdminButtonComponent";

const AdminStatus = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { allStatus, selectedStatus } = useSelector((state) => state.status);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("main");
  const [loading, setLoading] = useState(false);

  // Fetch danh sách status khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const access_token = localStorage.getItem("access_token");
        const response = await getAllStatus(access_token);
        dispatch(setAllStatus(response.data || []));
      } catch (error) {
        console.error("Error fetching statuses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const access_token = localStorage.getItem("access_token");
      const response = await getAllStatus(access_token);
      dispatch(setAllStatus(response.data || []));
    } catch (error) {
      console.error("Error fetching statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleNavigate = (view, status = null) => {
    if (view === "add") {
      dispatch(clearSelectedStatus());
    } else if (view === "update" && status) {
      dispatch(setSelectedStatus(status));
    }
    setCurrentView(view);
    if (onNavigate) {
      onNavigate(view);
    }
  };

  const handleBack = () => {
    setCurrentView("main");
    dispatch(clearSelectedStatus());
    if (onNavigate) {
      onNavigate("main");
    }
  };

  const handleStatusUpdated = () => {
    fetchStatuses(); // Refresh danh sách sau khi update
    handleBack();
  };

  const handleStatusDeleted = async (statusId) => {
    try {
      const access_token = localStorage.getItem("access_token");
      await deleteStatus(statusId, access_token);
      alert("Xóa trạng thái thành công!");
      fetchStatuses(); // Refresh danh sách sau khi delete
    } catch (error) {
      alert("Không thể xóa trạng thái: " + (error.message || "Đã xảy ra lỗi"));
    }
  };

  // Filter statuses based on search term
  const filteredStatuses = allStatus.filter((status) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      status.statusCode?.toLowerCase().includes(searchLower) ||
      status.statusName?.toLowerCase().includes(searchLower)
    );
  });

  // Render different views
  if (currentView === "add") {
    return <AddStatus onBack={handleBack} onSuccess={handleStatusUpdated} />;
  }

  if (currentView === "update" && selectedStatus) {
    return <UpdateStatus onBack={handleBack} onSuccess={handleStatusUpdated} />;
  }

  // Main view - Status list
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header với nút Create */}
      <div className="text-white p-6">
        <div className="w-full mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-500">
            Quản lý Trạng thái
          </h1>

          <AdminButtonComponent
            onClick={() => handleNavigate("add")}
            label="Create"
            variant="success"
            size="large"
          >
            Create
          </AdminButtonComponent>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full mx-auto px-6 py-8">
        {/* Search bar */}
        <div className="mb-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            placeholder="Tìm kiếm theo mã hoặc tên trạng thái..."
          />
        </div>

        {/* Status table */}
        <StatusTable
          statuses={filteredStatuses}
          loading={loading}
          onEdit={(status) => handleNavigate("update", status)}
          onDelete={handleStatusDeleted}
        />
      </div>
    </div>
  );
};

export default AdminStatus;
