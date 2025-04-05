import React, { useEffect, useState } from "react";

interface BookedHotel {
  id: string;
  name: string;
  image: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
}

const BookedHotelsPage: React.FC = () => {
  const [bookedHotels, setBookedHotels] = useState<BookedHotel[]>([]);

  useEffect(() => {
    const storedBookings = localStorage.getItem("bookedHotels");
    if (storedBookings) {
      setBookedHotels(JSON.parse(storedBookings));
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Booked Hotels</h1>

      {bookedHotels.length === 0 ? (
        <p className="text-gray-600">You haven’t booked any hotels yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bookedHotels.map((hotel) => (
            <div key={hotel.id} className="border rounded shadow p-4">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold">{hotel.name}</h2>
              <p>
                <strong>Check-in:</strong> {hotel.checkInDate}
              </p>
              <p>
                <strong>Check-out:</strong> {hotel.checkOutDate}
              </p>
              <p className="mt-2 font-semibold text-blue-600">
                Total: ${hotel.totalPrice.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookedHotelsPage;
