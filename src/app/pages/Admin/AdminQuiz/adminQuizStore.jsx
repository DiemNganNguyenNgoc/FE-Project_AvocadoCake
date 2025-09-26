import { createContext, useContext, useReducer } from "react";
import { QuizModel } from "./models/QuizModel";

// Initial state
const initialState = {
  quizzes: [],
  loading: false,
  error: null,
  selectedQuizzes: [],
  searchTerm: "",
  filterType: "all",
  sortField: "order",
  sortDirection: "asc",
  currentQuiz: null,
  showAddModal: false,
  showEditModal: false,
  showViewModal: false,
  itemsPerPage: 10,
  currentPage: 1,
};

// Action types
const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_QUIZZES: "SET_QUIZZES",
  ADD_QUIZ: "ADD_QUIZ",
  UPDATE_QUIZ: "UPDATE_QUIZ",
  DELETE_QUIZ: "DELETE_QUIZ",
  DELETE_MULTIPLE_QUIZZES: "DELETE_MULTIPLE_QUIZZES",
  SET_SELECTED_QUIZZES: "SET_SELECTED_QUIZZES",
  TOGGLE_QUIZ_SELECTION: "TOGGLE_QUIZ_SELECTION",
  TOGGLE_SELECT_ALL: "TOGGLE_SELECT_ALL",
  CLEAR_SELECTION: "CLEAR_SELECTION",
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_FILTER_TYPE: "SET_FILTER_TYPE",
  SET_SORT: "SET_SORT",
  SET_CURRENT_QUIZ: "SET_CURRENT_QUIZ",
  SET_SHOW_ADD_MODAL: "SET_SHOW_ADD_MODAL",
  SET_SHOW_EDIT_MODAL: "SET_SHOW_EDIT_MODAL",
  SET_SHOW_VIEW_MODAL: "SET_SHOW_VIEW_MODAL",
  SET_ITEMS_PER_PAGE: "SET_ITEMS_PER_PAGE",
  SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
};

// Reducer
const quizReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };

    case ActionTypes.SET_QUIZZES:
      return { ...state, quizzes: action.payload };

    case ActionTypes.ADD_QUIZ:
      return { ...state, quizzes: [...state.quizzes, action.payload] };

    case ActionTypes.UPDATE_QUIZ:
      return {
        ...state,
        quizzes: state.quizzes.map((quiz) =>
          quiz._id === action.payload._id ? action.payload : quiz
        ),
      };

    case ActionTypes.DELETE_QUIZ:
      return {
        ...state,
        quizzes: state.quizzes.filter((quiz) => quiz._id !== action.payload),
      };

    case ActionTypes.DELETE_MULTIPLE_QUIZZES:
      return {
        ...state,
        quizzes: state.quizzes.filter(
          (quiz) => !action.payload.includes(quiz._id)
        ),
        selectedQuizzes: [],
      };

    case ActionTypes.SET_SELECTED_QUIZZES:
      return { ...state, selectedQuizzes: action.payload };

    case ActionTypes.TOGGLE_QUIZ_SELECTION:
      const quizId = action.payload;
      const isSelected = state.selectedQuizzes.includes(quizId);
      return {
        ...state,
        selectedQuizzes: isSelected
          ? state.selectedQuizzes.filter((id) => id !== quizId)
          : [...state.selectedQuizzes, quizId],
      };

    case ActionTypes.TOGGLE_SELECT_ALL:
      const filteredQuizzes = getFilteredQuizzes(state);
      const allSelected = filteredQuizzes.every((quiz) =>
        state.selectedQuizzes.includes(quiz._id)
      );
      return {
        ...state,
        selectedQuizzes: allSelected
          ? []
          : filteredQuizzes.map((quiz) => quiz._id),
      };

    case ActionTypes.CLEAR_SELECTION:
      return { ...state, selectedQuizzes: [] };

    case ActionTypes.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload, currentPage: 1 };

    case ActionTypes.SET_FILTER_TYPE:
      return { ...state, filterType: action.payload, currentPage: 1 };

    case ActionTypes.SET_SORT:
      return {
        ...state,
        sortField: action.payload.field,
        sortDirection: action.payload.direction,
      };

    case ActionTypes.SET_CURRENT_QUIZ:
      return { ...state, currentQuiz: action.payload };

    case ActionTypes.SET_SHOW_ADD_MODAL:
      return { ...state, showAddModal: action.payload };

    case ActionTypes.SET_SHOW_EDIT_MODAL:
      return { ...state, showEditModal: action.payload };

    case ActionTypes.SET_SHOW_VIEW_MODAL:
      return { ...state, showViewModal: action.payload };

    case ActionTypes.SET_ITEMS_PER_PAGE:
      return { ...state, itemsPerPage: action.payload, currentPage: 1 };

    case ActionTypes.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };

    default:
      return state;
  }
};

// Helper functions
const getFilteredQuizzes = (state) => {
  let filtered = [...state.quizzes];

  // Filter by search term
  if (state.searchTerm) {
    const searchLower = state.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (quiz) =>
        quiz.question.toLowerCase().includes(searchLower) ||
        quiz.type.toLowerCase().includes(searchLower)
    );
  }

  // Filter by type
  if (state.filterType !== "all") {
    filtered = filtered.filter((quiz) => quiz.type === state.filterType);
  }

  // Sort
  filtered.sort((a, b) => {
    let aValue = a[state.sortField];
    let bValue = b[state.sortField];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (state.sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
};

// Context
const QuizContext = createContext();

// Provider component
export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Actions
  const actions = {
    setLoading: (loading) =>
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) =>
      dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    setQuizzes: (quizzes) =>
      dispatch({ type: ActionTypes.SET_QUIZZES, payload: quizzes }),
    addQuiz: (quiz) => dispatch({ type: ActionTypes.ADD_QUIZ, payload: quiz }),
    updateQuiz: (quiz) =>
      dispatch({ type: ActionTypes.UPDATE_QUIZ, payload: quiz }),
    deleteQuiz: (quizId) =>
      dispatch({ type: ActionTypes.DELETE_QUIZ, payload: quizId }),
    deleteMultipleQuizzes: (quizIds) =>
      dispatch({ type: ActionTypes.DELETE_MULTIPLE_QUIZZES, payload: quizIds }),
    setSelectedQuizzes: (quizIds) =>
      dispatch({ type: ActionTypes.SET_SELECTED_QUIZZES, payload: quizIds }),
    toggleQuizSelection: (quizId) =>
      dispatch({ type: ActionTypes.TOGGLE_QUIZ_SELECTION, payload: quizId }),
    toggleSelectAll: () => dispatch({ type: ActionTypes.TOGGLE_SELECT_ALL }),
    clearSelection: () => dispatch({ type: ActionTypes.CLEAR_SELECTION }),
    setSearchTerm: (term) =>
      dispatch({ type: ActionTypes.SET_SEARCH_TERM, payload: term }),
    setFilterType: (type) =>
      dispatch({ type: ActionTypes.SET_FILTER_TYPE, payload: type }),
    setSort: (field, direction) =>
      dispatch({ type: ActionTypes.SET_SORT, payload: { field, direction } }),
    setCurrentQuiz: (quiz) =>
      dispatch({ type: ActionTypes.SET_CURRENT_QUIZ, payload: quiz }),
    setShowAddModal: (show) =>
      dispatch({ type: ActionTypes.SET_SHOW_ADD_MODAL, payload: show }),
    setShowEditModal: (show) =>
      dispatch({ type: ActionTypes.SET_SHOW_EDIT_MODAL, payload: show }),
    setShowViewModal: (show) =>
      dispatch({ type: ActionTypes.SET_SHOW_VIEW_MODAL, payload: show }),
    setItemsPerPage: (count) =>
      dispatch({ type: ActionTypes.SET_ITEMS_PER_PAGE, payload: count }),
    setCurrentPage: (page) =>
      dispatch({ type: ActionTypes.SET_CURRENT_PAGE, payload: page }),
  };

  // Computed values
  const filteredQuizzes = getFilteredQuizzes(state);
  const paginatedQuizzes = filteredQuizzes.slice(
    (state.currentPage - 1) * state.itemsPerPage,
    state.currentPage * state.itemsPerPage
  );
  const totalPages = Math.ceil(filteredQuizzes.length / state.itemsPerPage);

  const value = {
    ...state,
    ...actions,
    filteredQuizzes: () => filteredQuizzes,
    paginatedQuizzes: () => paginatedQuizzes,
    totalPages,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

// Hook to use the context
export const useQuizStore = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizStore must be used within a QuizProvider");
  }
  return context;
};
