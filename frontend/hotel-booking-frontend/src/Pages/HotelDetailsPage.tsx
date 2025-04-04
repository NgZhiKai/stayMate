import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { ClipLoader } from "react-spinners"; // You can install this with: npm install react-spinners

const HotelDetailsPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<any>(null); // You can replace `any` with a `Hotel` type later
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Simulate fetching hotel by ID
    setTimeout(() => {
      const dummyHotel = {
        image: "/images/sample-hotel.jpg",
        name: "Grand Paradise Hotel",
        rating: 4.5,
        description:
          "Located in the heart of the city, Grand Paradise offers luxurious accommodations with stunning views, top-notch service, and easy access to local attractions.",
        address: "123 Oceanview Drive, Paradise City",
        contact: "(123) 456-7890",
        pricing: "$120 - $250 per night",
        reviews: [
          {
            user: "Alice",
            comment: "Great stay! Friendly staff and clean rooms.",
            rating: 5,
          },
          {
            user: "Bob",
            comment: "Nice location but could improve breakfast options.",
            rating: 3.5,
          },
        ],
        amenities: ["Free Wi-Fi", "Swimming Pool", "Spa", "Gym", "Restaurant"],
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
      };

      setHotel(dummyHotel);
      setLoading(false);
    }, 1000); // Simulate 1 second loading delay
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#2563EB" />
      </div>
    );
  }

  if (!hotel) {
    return <div className="text-center py-10">Hotel not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-80 object-cover rounded-xl shadow-md mb-6"
      />

    <div className="mb-6 flex justify-between items-start">
    <h1 className="text-3xl font-bold">{hotel.name}</h1>
    
    <div className="flex space-x-3 items-center">
        {/* Bookmark Icon */}
        <button
        onClick={() => setIsBookmarked(!isBookmarked)}
        className="text-gray-600 hover:text-blue-600 transition text-xl"
        title={isBookmarked ? "Unsave Hotel" : "Save Hotel"}
        >
        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>

        {/* Book Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Book
        </button>
    </div>
    </div>


      <p className="text-gray-700 mb-6">{hotel.description}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
          <p><strong>Address:</strong> {hotel.address}</p>
          <p><strong>Contact:</strong> {hotel.contact}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Pricing & Timing</h3>
          <p><strong>Price Range:</strong> {hotel.pricing}</p>
          <p><strong>Check-In:</strong> {hotel.checkIn}</p>
          <p><strong>Check-Out:</strong> {hotel.checkOut}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Amenities</h3>
        <ul className="list-disc list-inside text-gray-700">
          {hotel.amenities.map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>
        <div className="space-y-4">
          {hotel.reviews.map((review: any, index: number) => (
            <div key={index} className="bg-gray-100 p-4 rounded shadow">
              <p className="font-semibold">{review.user}</p>
              <p className="text-yellow-500 flex">
                {[...Array(Math.floor(review.rating))].map((_, i) => (
                  <FaStar key={i} />
                ))}
                {review.rating % 1 !== 0 && <FaStar className="opacity-50" />}
              </p>
              <p className="text-gray-800">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
