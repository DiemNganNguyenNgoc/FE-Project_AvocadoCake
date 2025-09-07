import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import UserService from "./services/UserService";

// Initial state
const initialState = {
  users: [],
  selectedUsers: [],
  searchTerm: "",
  filterRole: "all",
  currentPage: 1,
  itemsPerPage: 25,
  loading: false,
  error: null,
  currentUser: null,
  showAddModal: false,
  showEditModal: false,
  showViewModal: false,
  sortField: null,
  sortDirection: "asc",
};

// Action types
const ActionTypes = {
  SET_USERS: "SET_USERS",
  SET_SELECTED_USERS: "SET_SELECTED_USERS",
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_FILTER_ROLE: "SET_FILTER_ROLE",
  SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
  SET_ITEMS_PER_PAGE: "SET_ITEMS_PER_PAGE",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_CURRENT_USER: "SET_CURRENT_USER",
  SET_SHOW_ADD_MODAL: "SET_SHOW_ADD_MODAL",
  SET_SHOW_EDIT_MODAL: "SET_SHOW_EDIT_MODAL",
  SET_SHOW_VIEW_MODAL: "SET_SHOW_VIEW_MODAL",
  TOGGLE_USER_SELECTION: "TOGGLE_USER_SELECTION",
  TOGGLE_SELECT_ALL: "TOGGLE_SELECT_ALL",
  CLEAR_SELECTION: "CLEAR_SELECTION",
  DELETE_USER: "DELETE_USER",
  DELETE_MULTIPLE_USERS: "DELETE_MULTIPLE_USERS",
  SET_SORT: "SET_SORT",
  RESET: "RESET",
};

// Reducer
const adminUserReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USERS:
      return { ...state, users: action.payload };
    case ActionTypes.SET_SELECTED_USERS:
      return { ...state, selectedUsers: action.payload };
    case ActionTypes.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    case ActionTypes.SET_FILTER_ROLE:
      return { ...state, filterRole: action.payload };
    case ActionTypes.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    case ActionTypes.SET_ITEMS_PER_PAGE:
      return { ...state, itemsPerPage: action.payload };
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case ActionTypes.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload };
    case ActionTypes.SET_SHOW_ADD_MODAL:
      return { ...state, showAddModal: action.payload };
    case ActionTypes.SET_SHOW_EDIT_MODAL:
      return { ...state, showEditModal: action.payload };
    case ActionTypes.SET_SHOW_VIEW_MODAL:
      return { ...state, showViewModal: action.payload };
    case ActionTypes.TOGGLE_USER_SELECTION:
      const isSelected = state.selectedUsers.includes(action.payload);
      return {
        ...state,
        selectedUsers: isSelected
          ? state.selectedUsers.filter((id) => id !== action.payload)
          : [...state.selectedUsers, action.payload],
      };
    case ActionTypes.TOGGLE_SELECT_ALL:
      const filtered = getFilteredUsers(state);
      const allSelected = filtered.every((user) =>
        state.selectedUsers.includes(user._id)
      );
      return {
        ...state,
        selectedUsers: allSelected ? [] : filtered.map((user) => user._id),
      };
    case ActionTypes.CLEAR_SELECTION:
      return { ...state, selectedUsers: [] };
    case ActionTypes.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
      };
    case ActionTypes.DELETE_MULTIPLE_USERS:
      return {
        ...state,
        users: state.users.filter((user) => !action.payload.includes(user._id)),
      };
    case ActionTypes.SET_SORT:
      return {
        ...state,
        sortField: action.payload.field,
        sortDirection: action.payload.direction,
      };
    case ActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
};

// Helper function to get filtered users
const getFilteredUsers = (state) => {
  let filtered = state.users;

  // Filter by search term
  if (state.searchTerm) {
    filtered = filtered.filter(
      (user) =>
        user.familyName
          ?.toLowerCase()
          .includes(state.searchTerm.toLowerCase()) ||
        user.userName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        user.userEmail
          ?.toLowerCase()
          .includes(state.searchTerm.toLowerCase()) ||
        user.userPhone?.includes(state.searchTerm)
    );
  }

  // Filter by role
  if (state.filterRole !== "all") {
    filtered = filtered.filter((user) =>
      state.filterRole === "admin" ? user.isAdmin : !user.isAdmin
    );
  }

  // Sort
  if (state.sortField) {
    filtered.sort((a, b) => {
      let aValue = a[state.sortField];
      let bValue = b[state.sortField];

      // Handle different data types
      if (state.sortField === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return state.sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return state.sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  return filtered;
};

// Create context
const AdminUserContext = createContext();

// Provider component
export const AdminUserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminUserReducer, initialState);

  // Actions
  const setUsers = useCallback((users) => {
    dispatch({ type: ActionTypes.SET_USERS, payload: users });
  }, []);

  const setSelectedUsers = useCallback((selectedUsers) => {
    dispatch({ type: ActionTypes.SET_SELECTED_USERS, payload: selectedUsers });
  }, []);

  const setSearchTerm = useCallback((searchTerm) => {
    dispatch({ type: ActionTypes.SET_SEARCH_TERM, payload: searchTerm });
  }, []);

  const setFilterRole = useCallback((filterRole) => {
    dispatch({ type: ActionTypes.SET_FILTER_ROLE, payload: filterRole });
  }, []);

  const setCurrentPage = useCallback((currentPage) => {
    dispatch({ type: ActionTypes.SET_CURRENT_PAGE, payload: currentPage });
  }, []);

  const setItemsPerPage = useCallback((itemsPerPage) => {
    dispatch({ type: ActionTypes.SET_ITEMS_PER_PAGE, payload: itemsPerPage });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  }, []);

  const setCurrentUser = useCallback((currentUser) => {
    dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: currentUser });
  }, []);

  const setShowAddModal = useCallback((showAddModal) => {
    dispatch({ type: ActionTypes.SET_SHOW_ADD_MODAL, payload: showAddModal });
  }, []);

  const setShowEditModal = useCallback((showEditModal) => {
    dispatch({ type: ActionTypes.SET_SHOW_EDIT_MODAL, payload: showEditModal });
  }, []);

  const setShowViewModal = useCallback((showViewModal) => {
    dispatch({ type: ActionTypes.SET_SHOW_VIEW_MODAL, payload: showViewModal });
  }, []);

  const toggleUserSelection = useCallback((userId) => {
    dispatch({ type: ActionTypes.TOGGLE_USER_SELECTION, payload: userId });
  }, []);

  const toggleSelectAll = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_SELECT_ALL });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_SELECTION });
  }, []);

  const setSort = useCallback(
    (field) => {
      const direction =
        state.sortField === field && state.sortDirection === "asc"
          ? "desc"
          : "asc";
      dispatch({
        type: ActionTypes.SET_SORT,
        payload: { field, direction },
      });
    },
    [state.sortField, state.sortDirection]
  );

  const deleteUser = useCallback(async (userId) => {
    try {
      await UserService.deleteUser(userId);
      dispatch({ type: ActionTypes.DELETE_USER, payload: userId });
    } catch (error) {
      throw error;
    }
  }, []);

  const deleteMultipleUsers = useCallback(async (userIds) => {
    try {
      await UserService.deleteMultipleUsers(userIds);
      dispatch({ type: ActionTypes.DELETE_MULTIPLE_USERS, payload: userIds });
    } catch (error) {
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ActionTypes.RESET });
  }, []);

  // Computed values
  const filteredUsers = useCallback(() => {
    return getFilteredUsers(state);
  }, [
    state.users,
    state.searchTerm,
    state.filterRole,
    state.sortField,
    state.sortDirection,
  ]);

  const value = {
    // State
    ...state,
    // Actions
    setUsers,
    setSelectedUsers,
    setSearchTerm,
    setFilterRole,
    setCurrentPage,
    setItemsPerPage,
    setLoading,
    setError,
    setCurrentUser,
    setShowAddModal,
    setShowEditModal,
    setShowViewModal,
    toggleUserSelection,
    toggleSelectAll,
    clearSelection,
    setSort,
    deleteUser,
    deleteMultipleUsers,
    reset,
    // Computed values
    filteredUsers,
  };

  return (
    <AdminUserContext.Provider value={value}>
      {children}
    </AdminUserContext.Provider>
  );
};

// Custom hook to use the context
export const useAdminUserStore = () => {
  const context = useContext(AdminUserContext);
  if (!context) {
    throw new Error(
      "useAdminUserStore must be used within an AdminUserProvider"
    );
  }
  return context;
};

export default useAdminUserStore;
