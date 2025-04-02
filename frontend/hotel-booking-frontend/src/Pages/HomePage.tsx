import React from "react";
import SearchBar from "../components/SearchBar";

const HomePage: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search functionality here
  };

  return (
    <div className="p-6 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to StayMate</h1>
        <p className="text-gray-600 mt-2">Find the best hotels near you with ease.</p>
      </div>

      {/* Search bar positioned at the top right */}
      <div className="ml-auto">
        <SearchBar onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default HomePage;
