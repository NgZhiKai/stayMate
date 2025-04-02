import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5"; // Close (X) icon

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== "") {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-lg">
      {/* Search Input */}
      <input
        type="text"
        className="w-96 px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md pr-20 
          overflow-hidden text-ellipsis whitespace-nowrap"
        placeholder="Search for hotels, locations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      {/* Clear Button (X) - Shows only when query is not empty */}
      {query && (
        <button
          className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={handleClear}
        >
          <IoClose size={18} />
        </button>
      )}

      {/* Search Button */}
      <button
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-300"
        onClick={handleSearch}
      >
        <FiSearch size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
