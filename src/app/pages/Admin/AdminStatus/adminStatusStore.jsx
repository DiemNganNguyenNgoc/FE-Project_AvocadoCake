import { create } from "zustand";

// Local store cho AdminStatus module nếu cần quản lý state phức tạp
const useAdminStatusStore = create((set, get) => ({
  // UI States
  isModalOpen: false,
  modalType: null, // 'add' | 'edit' | 'view'

  // Modal actions
  openAddModal: () => set({ isModalOpen: true, modalType: "add" }),
  openEditModal: () => set({ isModalOpen: true, modalType: "edit" }),
  closeModal: () => set({ isModalOpen: false, modalType: null }),

  // Search and filter states
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Sort configuration
  sortConfig: { key: null, direction: "asc" },
  setSortConfig: (config) => set({ sortConfig: config }),

  // Loading states
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Error handling
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useAdminStatusStore;
