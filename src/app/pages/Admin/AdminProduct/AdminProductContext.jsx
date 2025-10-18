import React, { createContext, useContext, useReducer } from "react";

// Initial state
const initialState = {
  products: [],
  loading: false,
  error: null,
  searchTerm: "",
  filterCategory: "all",
  filterPriceMin: "",
  filterPriceMax: "",
  sortField: "createdAt",
  sortDirection: "desc",
  currentPage: 1,
  itemsPerPage: 10,
  selectedProducts: [],
  showAddModal: false,
  showEditModal: false,
  showViewModal: false,
  currentProduct: null,
  categories: [],
  viewMode: "list",
};

// Action types
const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_CATEGORIES: "SET_CATEGORIES",
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_FILTER_CATEGORY: "SET_FILTER_CATEGORY",
  SET_FILTER_PRICE_MIN: "SET_FILTER_PRICE_MIN",
  SET_FILTER_PRICE_MAX: "SET_FILTER_PRICE_MAX",
  SET_SORT: "SET_SORT",
  SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
  SET_ITEMS_PER_PAGE: "SET_ITEMS_PER_PAGE",
  SET_VIEW_MODE: "SET_VIEW_MODE",
  TOGGLE_PRODUCT_SELECTION: "TOGGLE_PRODUCT_SELECTION",
  TOGGLE_SELECT_ALL: "TOGGLE_SELECT_ALL",
  CLEAR_SELECTION: "CLEAR_SELECTION",
  SET_SHOW_ADD_MODAL: "SET_SHOW_ADD_MODAL",
  SET_SHOW_EDIT_MODAL: "SET_SHOW_EDIT_MODAL",
  SET_SHOW_VIEW_MODAL: "SET_SHOW_VIEW_MODAL",
  SET_CURRENT_PRODUCT: "SET_CURRENT_PRODUCT",
  ADD_PRODUCT: "ADD_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
  DELETE_MULTIPLE_PRODUCTS: "DELETE_MULTIPLE_PRODUCTS",
  RESET: "RESET",
};

// Reducer
const adminProductReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };

    case ActionTypes.SET_PRODUCTS:
      return { ...state, products: action.payload };

    case ActionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload };

    case ActionTypes.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload, currentPage: 1 };

    case ActionTypes.SET_FILTER_CATEGORY:
      return { ...state, filterCategory: action.payload, currentPage: 1 };

    case ActionTypes.SET_FILTER_PRICE_MIN:
      return { ...state, filterPriceMin: action.payload, currentPage: 1 };

    case ActionTypes.SET_FILTER_PRICE_MAX:
      return { ...state, filterPriceMax: action.payload, currentPage: 1 };

    case ActionTypes.SET_SORT:
      return {
        ...state,
        sortField: action.payload.field,
        sortDirection: action.payload.direction,
      };

    case ActionTypes.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };

    case ActionTypes.SET_ITEMS_PER_PAGE:
      return { ...state, itemsPerPage: action.payload, currentPage: 1 };

    case ActionTypes.SET_VIEW_MODE:
      return { ...state, viewMode: action.payload };

    case ActionTypes.TOGGLE_PRODUCT_SELECTION:
      const productId = action.payload;
      const isSelected = state.selectedProducts.includes(productId);
      return {
        ...state,
        selectedProducts: isSelected
          ? state.selectedProducts.filter((id) => id !== productId)
          : [...state.selectedProducts, productId],
      };

    case ActionTypes.TOGGLE_SELECT_ALL:
      const filteredProducts = getFilteredProducts(state);
      const allSelected = filteredProducts.every((product) =>
        state.selectedProducts.includes(product._id)
      );
      return {
        ...state,
        selectedProducts: allSelected
          ? state.selectedProducts.filter(
              (id) => !filteredProducts.some((p) => p._id === id)
            )
          : [...state.selectedProducts, ...filteredProducts.map((p) => p._id)],
      };

    case ActionTypes.CLEAR_SELECTION:
      return { ...state, selectedProducts: [] };

    case ActionTypes.SET_SHOW_ADD_MODAL:
      return { ...state, showAddModal: action.payload };

    case ActionTypes.SET_SHOW_EDIT_MODAL:
      return { ...state, showEditModal: action.payload };

    case ActionTypes.SET_SHOW_VIEW_MODAL:
      return { ...state, showViewModal: action.payload };

    case ActionTypes.SET_CURRENT_PRODUCT:
      return { ...state, currentProduct: action.payload };

    case ActionTypes.ADD_PRODUCT:
      return { ...state, products: [action.payload, ...state.products] };

    case ActionTypes.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload.id
            ? { ...product, ...action.payload.updates }
            : product
        ),
      };

    case ActionTypes.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
        selectedProducts: state.selectedProducts.filter(
          (id) => id !== action.payload
        ),
      };

    case ActionTypes.DELETE_MULTIPLE_PRODUCTS:
      return {
        ...state,
        products: state.products.filter(
          (product) => !action.payload.includes(product._id)
        ),
        selectedProducts: state.selectedProducts.filter(
          (id) => !action.payload.includes(id)
        ),
      };

    case ActionTypes.RESET:
      return initialState;

    default:
      return state;
  }
};

// Helper functions
const getFilteredProducts = (state) => {
  let filtered = state.products;

  if (state.searchTerm) {
    filtered = filtered.filter(
      (product) =>
        product.productName
          .toLowerCase()
          .includes(state.searchTerm.toLowerCase()) ||
        product.productDescription
          .toLowerCase()
          .includes(state.searchTerm.toLowerCase())
    );
  }

  if (state.filterCategory !== "all") {
    filtered = filtered.filter(
      (product) => product.productCategory === state.filterCategory
    );
  }

  // Filter by price range
  if (state.filterPriceMin !== "" && state.filterPriceMin !== null) {
    const minPrice = parseFloat(state.filterPriceMin);
    if (!isNaN(minPrice)) {
      filtered = filtered.filter(
        (product) => parseFloat(product.productPrice) >= minPrice
      );
    }
  }

  if (state.filterPriceMax !== "" && state.filterPriceMax !== null) {
    const maxPrice = parseFloat(state.filterPriceMax);
    if (!isNaN(maxPrice)) {
      filtered = filtered.filter(
        (product) => parseFloat(product.productPrice) <= maxPrice
      );
    }
  }

  return filtered;
};

const getSortedProducts = (state) => {
  const filtered = getFilteredProducts(state);

  return [...filtered].sort((a, b) => {
    let aValue = a[state.sortField];
    let bValue = b[state.sortField];

    if (state.sortField === "productPrice") {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    } else if (state.sortField === "createdAt") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (aValue < bValue) return state.sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return state.sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};

const getPaginatedProducts = (state) => {
  const sorted = getSortedProducts(state);
  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const endIndex = startIndex + state.itemsPerPage;
  return sorted.slice(startIndex, endIndex);
};

const getTotalPages = (state) => {
  const sorted = getSortedProducts(state);
  return Math.ceil(sorted.length / state.itemsPerPage);
};

// Context
const AdminProductContext = createContext();

// Provider component
export const AdminProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminProductReducer, initialState);

  // Actions
  const actions = {
    setLoading: (loading) =>
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) =>
      dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    setProducts: (products) =>
      dispatch({ type: ActionTypes.SET_PRODUCTS, payload: products }),
    setCategories: (categories) =>
      dispatch({ type: ActionTypes.SET_CATEGORIES, payload: categories }),
    setSearchTerm: (searchTerm) =>
      dispatch({ type: ActionTypes.SET_SEARCH_TERM, payload: searchTerm }),
    setFilterCategory: (filterCategory) =>
      dispatch({
        type: ActionTypes.SET_FILTER_CATEGORY,
        payload: filterCategory,
      }),
    setFilterPriceMin: (filterPriceMin) =>
      dispatch({
        type: ActionTypes.SET_FILTER_PRICE_MIN,
        payload: filterPriceMin,
      }),
    setFilterPriceMax: (filterPriceMax) =>
      dispatch({
        type: ActionTypes.SET_FILTER_PRICE_MAX,
        payload: filterPriceMax,
      }),
    setSort: (field, direction) =>
      dispatch({ type: ActionTypes.SET_SORT, payload: { field, direction } }),
    setCurrentPage: (page) =>
      dispatch({ type: ActionTypes.SET_CURRENT_PAGE, payload: page }),
    setItemsPerPage: (itemsPerPage) =>
      dispatch({ type: ActionTypes.SET_ITEMS_PER_PAGE, payload: itemsPerPage }),
    setViewMode: (viewMode) =>
      dispatch({ type: ActionTypes.SET_VIEW_MODE, payload: viewMode }),
    toggleProductSelection: (productId) =>
      dispatch({
        type: ActionTypes.TOGGLE_PRODUCT_SELECTION,
        payload: productId,
      }),
    toggleSelectAll: () => dispatch({ type: ActionTypes.TOGGLE_SELECT_ALL }),
    clearSelection: () => dispatch({ type: ActionTypes.CLEAR_SELECTION }),
    setShowAddModal: (show) =>
      dispatch({ type: ActionTypes.SET_SHOW_ADD_MODAL, payload: show }),
    setShowEditModal: (show) =>
      dispatch({ type: ActionTypes.SET_SHOW_EDIT_MODAL, payload: show }),
    setShowViewModal: (show) =>
      dispatch({ type: ActionTypes.SET_SHOW_VIEW_MODAL, payload: show }),
    setCurrentProduct: (product) =>
      dispatch({ type: ActionTypes.SET_CURRENT_PRODUCT, payload: product }),
    addProduct: (product) =>
      dispatch({ type: ActionTypes.ADD_PRODUCT, payload: product }),
    updateProduct: (id, updates) =>
      dispatch({ type: ActionTypes.UPDATE_PRODUCT, payload: { id, updates } }),
    deleteProduct: (productId) =>
      dispatch({ type: ActionTypes.DELETE_PRODUCT, payload: productId }),
    deleteMultipleProducts: (productIds) =>
      dispatch({
        type: ActionTypes.DELETE_MULTIPLE_PRODUCTS,
        payload: productIds,
      }),
    reset: () => dispatch({ type: ActionTypes.RESET }),
  };

  // Computed values
  const computed = {
    filteredProducts: () => getFilteredProducts(state),
    sortedProducts: () => getSortedProducts(state),
    paginatedProducts: () => getPaginatedProducts(state),
    totalPages: () => getTotalPages(state),
  };

  const value = {
    ...state,
    ...actions,
    ...computed,
  };

  return (
    <AdminProductContext.Provider value={value}>
      {children}
    </AdminProductContext.Provider>
  );
};

// Hook to use the context
export const useAdminProductStore = () => {
  const context = useContext(AdminProductContext);
  if (!context) {
    throw new Error(
      "useAdminProductStore must be used within an AdminProductProvider"
    );
  }
  return context;
};

export default AdminProductContext;
