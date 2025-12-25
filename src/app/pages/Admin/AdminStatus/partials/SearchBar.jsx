import React from "react";
import SearchBarComponent from "../../../../components/AdminComponents/SearchBarComponent";

const SearchBar = ({ searchTerm, onSearchChange, placeholder }) => {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <SearchBarComponent
      value={searchTerm}
      onChange={onSearchChange}
      onClear={handleClearSearch}
      placeholder={placeholder || "Tìm kiếm theo mã hoặc tên trạng thái..."}
      size="md"
      variant="default"
      searchMode="instant"
      debounceMs={300}
      maxLength={100}
    />
  );
};

export default SearchBar;
