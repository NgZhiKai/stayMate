import React from "react";

const SavedHotels = () => {
  const savedHotels = [
    { id: 1, name: "Grand Hotel", location: "New York" },
    { id: 2, name: "Ocean View Resort", location: "California" },
    { id: 3, name: "Mountain Retreat", location: "Colorado" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏨 Your Saved Hotels</h1>
      {savedHotels.length > 0 ? (
        <ul className="space-y-3">
          {savedHotels.map((hotel) => (
            <li key={hotel.id} className="bg-gray-100 p-4 rounded-lg shadow">
              <p className="font-semibold">{hotel.name}</p>
              <p className="text-gray-600">{hotel.location}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">You haven't saved any hotels yet.</p>
      )}
    </div>
  );
};

export default SavedHotels;
