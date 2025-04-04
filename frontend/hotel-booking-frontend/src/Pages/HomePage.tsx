import React from "react";
import SearchBar from "../components/SearchBar";
import HotelCard from "../components/HotelCard";
import { Hotel } from "../types/Hotels";

const dummyHotel: Hotel = {
  id: 1,
  name: "Grand Paradise Hotel",
  address: "123 Oceanview Drive, Paradise City",
  rating: 4.5,
  pricePerNight: 180,
  image: "https://via.placeholder.com/400x200?text=Grand+Paradise+Hotel",
};

const HomePage: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search functionality here
  };

  return (
    <div className="p-6">
      {/* Top section with title and search bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to StayMate</h1>
          <p className="text-gray-600 mt-2">Find the best hotels near you with ease.</p>
        </div>
        <div className="ml-auto">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Hotel card section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended Hotels</h2>
        <HotelCard hotel={dummyHotel} />
      </div>
    </div>
  );
};

export default HomePage;
