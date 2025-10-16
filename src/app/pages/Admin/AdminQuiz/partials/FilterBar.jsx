import React from "react";
import { useQuizStore } from "../adminQuizStore";
import QuizService from "../services/QuizService";
import FilterbarComponent from "../../../../components/AdminComponents/FilterbarComponent";

const FilterBar = () => {
  const {
    filterType,
    setFilterType,
    itemsPerPage,
    setItemsPerPage,
    selectedQuizzes,
    clearSelection,
    deleteMultipleQuizzes,
    setLoading,
    setError,
  } = useQuizStore();

  const handleDeleteSelected = async () => {
    if (selectedQuizzes.length === 0) {
      alert("Vui lòng chọn ít nhất một quiz để xóa.");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedQuizzes.length} quiz đã chọn?`
      )
    ) {
      try {
        setLoading(true);
        await QuizService.deleteMultipleQuizzes(selectedQuizzes);
        deleteMultipleQuizzes(selectedQuizzes);
        clearSelection();
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter configuration
  const filters = [
    {
      label: "Loại quiz",
      value: filterType,
      onChange: (e) => setFilterType(e.target.value),
      options: [
        { value: "all", label: "Tất cả loại" },
        { value: "mood", label: "Tâm trạng" },
        { value: "memory", label: "Ký ức" },
        { value: "preference", label: "Sở thích" },
      ],
    },
  ];

  // Pagination configuration
  const pagination = {
    itemsPerPage,
    onChange: setItemsPerPage,
  };

  // Selection configuration
  const selection = {
    count: selectedQuizzes.length,
    onClear: clearSelection,
    onDelete: handleDeleteSelected,
  };

  return (
    <FilterbarComponent
      filters={filters}
      pagination={pagination}
      selection={selection}
      itemLabel="quiz"
      variant="default"
    />
  );
};

export default FilterBar;
