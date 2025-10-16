import React from "react";
import SearchBarComponent from "../../../../components/AdminComponents/SearchBarComponent";
import { useAdminOrderStore } from "../adminOrderStore";

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useAdminOrderStore();

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <SearchBarComponent
      value={searchTerm}
      onChange={setSearchTerm}
      onClear={handleClear}
      placeholder="Search or type command"
      size="md"
      variant="default"
      searchMode="instant"
      debounceMs={300}
      maxLength={100}
    />
  );
};

export default SearchBar;
