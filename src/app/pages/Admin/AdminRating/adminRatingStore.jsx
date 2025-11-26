import { create } from "zustand";
import { RatingService } from "./services/RatingService";

export const useAdminRatingStore = create((set, get) => ({
  // State
  ratings: [],
  loading: false,
  error: null,
  selectedRatings: [],
  searchTerm: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  currentPage: 1,
  itemsPerPage: 10,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all ratings
  fetchRatings: async () => {
    try {
      set({ loading: true, error: null });
      const { searchTerm, sortBy, sortOrder } = get();
      const ratings = await RatingService.fetchAllRatings({
        search: searchTerm,
        sortBy,
        sortOrder,
      });
      set({ ratings, loading: false });
    } catch (error) {
      set({ error: error.message || error, loading: false });
    }
  },

  // Delete rating
  deleteRating: async (id) => {
    try {
      set({ loading: true, error: null });
      await RatingService.removeRating(id);
      set((state) => ({
        ratings: state.ratings.filter((rating) => rating._id !== id),
        selectedRatings: state.selectedRatings.filter(
          (ratingId) => ratingId !== id
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || error, loading: false });
      throw error;
    }
  },

  // Delete multiple ratings
  deleteMultipleRatings: async (ids) => {
    try {
      set({ loading: true, error: null });
      await RatingService.deleteMultipleRatings(ids);
      set((state) => ({
        ratings: state.ratings.filter((rating) => !ids.includes(rating._id)),
        selectedRatings: [],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || error, loading: false });
      throw error;
    }
  },

  // Toggle rating visibility
  toggleVisibility: async (id) => {
    try {
      const updatedRating = await RatingService.toggleVisibility(id);
      set((state) => ({
        ratings: state.ratings.map((rating) =>
          rating._id === id ? updatedRating : rating
        ),
      }));
    } catch (error) {
      set({ error: error.message || error });
      throw error;
    }
  },

  // Selection management
  toggleRatingSelection: (id) => {
    set((state) => ({
      selectedRatings: state.selectedRatings.includes(id)
        ? state.selectedRatings.filter((ratingId) => ratingId !== id)
        : [...state.selectedRatings, id],
    }));
  },

  selectAllRatings: () => {
    set((state) => ({
      selectedRatings: state.ratings.map((rating) => rating._id),
    }));
  },

  clearSelection: () => {
    set({ selectedRatings: [] });
  },

  // Search and filter
  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
  setSortOrder: (sortOrder) => set({ sortOrder, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),

  // Get filtered and sorted ratings
  getFilteredRatings: () => {
    const { ratings, searchTerm, sortBy, sortOrder } = get();

    let filtered = ratings;

    // Apply search filter
    if (searchTerm) {
      filtered = ratings.filter(
        (rating) =>
          rating.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rating.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rating
            .getProductName()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          rating.getOrderCode().toLowerCase().includes(searchTerm.toLowerCase())
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

  // Get paginated ratings
  getPaginatedRatings: () => {
    const { currentPage, itemsPerPage } = get();
    const filtered = get().getFilteredRatings();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      ratings: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      totalItems: filtered.length,
    };
  },

  // Get statistics
  getStats: () => {
    const { ratings } = get();
    return RatingService.getRatingStats(ratings);
  },

  // Reset store
  reset: () => {
    set({
      ratings: [],
      loading: false,
      error: null,
      selectedRatings: [],
      searchTerm: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      currentPage: 1,
      itemsPerPage: 10,
    });
  },
}));

export default useAdminRatingStore;
