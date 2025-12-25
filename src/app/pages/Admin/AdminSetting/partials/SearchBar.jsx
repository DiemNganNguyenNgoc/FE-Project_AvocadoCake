import React from "react";
import SearchBarComponent from "../../../../components/AdminComponents/SearchBarComponent";
import { useAdminProductStore } from "../adminSettingStore";

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useAdminProductStore();

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <SearchBarComponent
      value={searchTerm}
      onChange={setSearchTerm}
      onClear={handleClear}
      placeholder="Tìm kiếm cài đặt..."
      size="md"
      variant="default"
      searchMode="instant"
      debounceMs={300}
      maxLength={100}
    />
  );
};

export default SearchBar;
