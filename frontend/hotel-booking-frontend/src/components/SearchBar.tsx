import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

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
    <div className="relative w-[600px]"> {/* You can adjust this value */}
      <input
        type="text"
        className="w-full px-5 py-3 pr-16 text-gray-800 bg-white border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search for hotels, locations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      {query && (
        <button
          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={handleClear}
        >
          <IoClose size={18} />
        </button>
      )}

      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition hover:scale-110 duration-300"
        onClick={handleSearch}
      >
        <FiSearch size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
