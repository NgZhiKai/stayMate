import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";

const HotelDetailsPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  const pricePerNight = 150; // Adjust or fetch this dynamically

  useEffect(() => {
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
    }, 1000);
  }, [id]);

  const totalNights = checkInDate && checkOutDate
    ? differenceInDays(checkOutDate, checkInDate)
    : 0;

  const totalPrice = totalNights > 0 ? totalNights * pricePerNight : 0;

  const handleConfirmBooking = () => {
    if (hotel && checkInDate && checkOutDate && totalNights > 0) {
      setIsModalOpen(false);
  
      navigate("/payment", {
        state: {
          hotel: {
            name: hotel.name,
            image: hotel.image,
          },
          checkInDate: checkInDate.toLocaleDateString(),
          checkOutDate: checkOutDate.toLocaleDateString(),
          totalPrice,
        },
      });
  
      setCheckInDate(null);
      setCheckOutDate(null);
    } else {
      alert("Please select valid check-in and check-out dates.");
    }
  };
  
  
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
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="text-gray-600 hover:text-blue-600 transition text-xl"
            title={isBookmarked ? "Unsave Hotel" : "Save Hotel"}
          >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
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

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Confirm Your Booking</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Check-In Date</label>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                selectsStart
                startDate={checkInDate}
                endDate={checkOutDate}
                className="border rounded p-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Check-Out Date</label>
              <DatePicker
                selected={checkOutDate ?? undefined}
                onChange={(date) => setCheckOutDate(date)}
                selectsEnd
                startDate={checkInDate ?? undefined}
                endDate={checkOutDate ?? undefined}
                minDate={checkInDate ?? undefined}
                className="border rounded p-2 w-full"
              />
            </div>

            {totalNights > 0 && (
              <p className="mb-4 text-gray-700">
                <strong>Total Price:</strong> ${totalPrice} ({totalNights} nights)
              </p>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={totalNights <= 0}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetailsPage;
