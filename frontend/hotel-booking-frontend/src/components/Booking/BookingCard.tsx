import React from "react";
import { DetailedBooking } from "../../types/Booking";

interface BookingCardProps {
  booking: DetailedBooking;
  hotelName: string;
  onCancelBooking: (bookingId: number) => void; // Callback for canceling booking
  onMakePayment: (bookingId: number) => void; // Callback for making payment
}

const formatDate = (date: string) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0'); // Ensure two digits
  const month = d.toLocaleString('default', { month: 'short' }); // Get short month name (e.g., "Apr")
  const year = d.getFullYear();
  return `${day} ${month} ${year}`; // Format as dd Mon yyyy
};

const BookingCard: React.FC<BookingCardProps> = ({ booking, hotelName, onCancelBooking, onMakePayment }) => {
  const handleCancel = () => {
    // Call the cancel booking function passed via props
    onCancelBooking(booking.bookingId);
  };

  const handlePayment = () => {
    // Call the make payment function passed via props
    onMakePayment(booking.bookingId);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-3 mb-4 w-full max-w-sm mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="text-sm font-semibold text-gray-700 col-span-2">
          <span className="font-bold">Hotel:</span> {hotelName || "Loading..."}
        </div>
        <div className="text-xs text-gray-600">
          <span className="font-bold">Check-in:</span> {formatDate(booking.checkInDate)}
        </div>
        <div className="text-xs text-gray-600">
          <span className="font-bold">Check-out:</span> {formatDate(booking.checkOutDate)}
        </div>
        <div className="text-xs text-gray-600">
          <span className="font-bold">Room Type:</span> {booking.roomType}
        </div>
        <div className="text-xs text-gray-600">
          <span className="font-bold">Booking Status:</span>{" "}
          <span
            className={`font-semibold ${
              booking.status === "CONFIRMED"
                ? "text-green-600"
                : booking.status === "CANCELLED"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {booking.status}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      {booking.status !== "CANCELLED" && (
        <div className="flex justify-between mt-4">
          {booking.status === "PENDING" && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handlePayment}
            >
              Make Payment
            </button>
          )}
        
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleCancel}
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
