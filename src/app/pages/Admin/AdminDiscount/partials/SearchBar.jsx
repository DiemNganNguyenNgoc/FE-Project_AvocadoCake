import React from "react";
import SearchBarComponent from "../../../../components/AdminComponents/SearchBarComponent";
import { useQuizStore } from "../adminQuizStore";

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useQuizStore();

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <SearchBarComponent
      value={searchTerm}
      onChange={setSearchTerm}
      onClear={handleClear}
      placeholder="Tìm kiếm quiz..."
      size="md"
      variant="default"
      searchMode="instant"
      debounceMs={300}
      maxLength={100}
    />
  );
};

export default SearchBar;
