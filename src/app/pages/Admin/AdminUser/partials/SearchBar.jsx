import React from "react";
import SearchBarComponent from "../../../../components/AdminComponents/SearchBarComponent";
import { useAdminUserStore } from "../adminUserStore";

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useAdminUserStore();

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <SearchBarComponent
      value={searchTerm}
      onChange={handleSearchChange}
      onClear={handleClear}
      placeholder="Tìm kiếm người dùng..."
      size="lg"
      variant="default"
      searchMode="instant"
      debounceMs={300}
      maxLength={50}
      containerClassName="w-80 max-w-sm"
    />
  );
};

export default SearchBar;
