import React from "react";
import SearchBarComponent from "../../../../components/AdminComponents/SearchBarComponent";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <SearchBarComponent
      value={searchTerm}
      onChange={onSearchChange}
      onClear={handleClearSearch}
      placeholder="Tìm kiếm theo mã hoặc tên danh mục..."
      size="lg"
      variant="glass"
      searchMode="instant"
      debounceMs={300}
      maxLength={100}
      containerClassName="w-full max-w-2xl"
    />
  );
};

export default SearchBar;
