import { create } from "zustand";
import { Category } from "./models/Category";
import { CategoryService } from "./services/CategoryService";

export const useAdminCategoryStore = create((set, get) => ({
  // State
  categories: [],
  loading: false,
  error: null,
  selectedCategories: [],
  currentCategory: null,
  searchTerm: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  currentPage: 1,
  itemsPerPage: 10,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all categories
  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const categories = await CategoryService.fetchAllCategories();
      set({ categories, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Create new category
  createCategory: async (categoryData) => {
    try {
      set({ loading: true, error: null });
      const newCategory = await CategoryService.createNewCategory(categoryData);
      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));
      return newCategory;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
      set({ loading: true, error: null });
      const updatedCategory = await CategoryService.updateExistingCategory(
        id,
        categoryData
      );
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? updatedCategory : cat
        ),
        loading: false,
      }));
      return updatedCategory;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      set({ loading: true, error: null });
      await CategoryService.removeCategory(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== id),
        selectedCategories: state.selectedCategories.filter(
          (catId) => catId !== id
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete multiple categories
  deleteMultipleCategories: async (ids) => {
    try {
      set({ loading: true, error: null });
      await Promise.all(ids.map((id) => CategoryService.removeCategory(id)));
      set((state) => ({
        categories: state.categories.filter((cat) => !ids.includes(cat._id)),
        selectedCategories: [],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Selection management
  toggleCategorySelection: (id) => {
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(id)
        ? state.selectedCategories.filter((catId) => catId !== id)
        : [...state.selectedCategories, id],
    }));
  },

  selectAllCategories: () => {
    set((state) => ({
      selectedCategories: state.categories.map((cat) => cat._id),
    }));
  },

  clearSelection: () => {
    set({ selectedCategories: [] });
  },

  // Search and filter
  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
  setSortOrder: (sortOrder) => set({ sortOrder, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  // Get filtered and sorted categories
  getFilteredCategories: () => {
    const { categories, searchTerm, sortBy, sortOrder } = get();

    let filtered = categories;

    // Apply search filter
    if (searchTerm) {
      filtered = categories.filter(
        (cat) =>
          cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.categoryCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  },

  // Get paginated categories
  getPaginatedCategories: () => {
    const { currentPage, itemsPerPage } = get();
    const filtered = get().getFilteredCategories();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      categories: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      totalItems: filtered.length,
    };
  },

  // Reset store
  reset: () => {
    set({
      categories: [],
      loading: false,
      error: null,
      selectedCategories: [],
      currentCategory: null,
      searchTerm: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      currentPage: 1,
      itemsPerPage: 10,
    });
  },
}));
