import React, { useState, useEffect } from "react";
import { DetailedBooking } from "../types/Booking";  // Ensure the DTO is updated correctly
import { getBookingsForUser } from "../services/bookingApi";  // Assuming a function to fetch bookings by user ID

const BookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<DetailedBooking[]>([]);  // Store list of bookings

  // Fetch bookings data for the user on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      const userId = sessionStorage.getItem("userId");  // Retrieve user ID from sessionStorage
      if (userId) {
        try {
          const bookingResponse = await getBookingsForUser(Number(userId));  // Pass the userId as number
          if (bookingResponse && bookingResponse.length > 0) {
            setBookings(bookingResponse);
          }
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        }
      } else {
        console.error("User ID not found in sessionStorage");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Your Bookings</h2>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center">You have no bookings.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.bookingId} className="border-b pb-4 mb-4">
              <div>
                <strong>Booking ID:</strong> {booking.bookingId}
              </div>
              <div>
                <strong>Hotel ID:</strong> {booking.hotelId}
              </div>
              <div>
                <strong>Room ID:</strong> {booking.roomId}
              </div>
              <div>
                <strong>Guest Name:</strong> {booking.firstName} {booking.lastName}
              </div>
              <div>
                <strong>Email:</strong> {booking.email}
              </div>
              <div>
                <strong>Phone:</strong> {booking.phone}
              </div>
              <div>
                <strong>Check-in Date:</strong> {new Date(booking.checkInDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Check-out Date:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Room Type:</strong> {booking.roomType}
              </div>
              <div>
                <strong>Status:</strong> {booking.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingPage;
