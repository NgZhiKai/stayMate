import React from "react";
import { DetailedBooking } from "../../types/Booking";
import { CreditCard, XCircle } from "lucide-react";

interface BookingCardProps {
  booking: DetailedBooking;
  hotelName: string;
  hotelCheckIn: string;
  hotelCheckOut: string;
  onCancelBooking: (bookingId: number) => void;
  onMakePayment: (bookingId: number) => void;
}

const formatDate = (date: string) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  hotelName,
  hotelCheckIn,
  hotelCheckOut,
  onCancelBooking,
  onMakePayment,
}) => {
  const handleCancel = () => {
    onCancelBooking(booking.bookingId);
  };

  const handlePayment = () => {
    onMakePayment(booking.bookingId);
  };

  const isPending = booking.status === "PENDING";

  return (
    <div
      className={`bg-gray-800 rounded-xl p-4 w-full max-w-md mx-auto text-sm text-gray-300 shadow hover:shadow-lg transition-all duration-200 ${
        booking.status === "CANCELLED" ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {/* Header: Hotel Name + Status */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white truncate">
          {hotelName || "Loading..."}
        </h3>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            booking.status === "CONFIRMED"
              ? "bg-green-200 text-green-800"
              : booking.status === "CANCELLED"
              ? "bg-red-200 text-red-800"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {booking.status}
        </span>
      </div>
  
      {/* Booking Info */}
      <div className="space-y-1.5 mb-2 text-sm">
        <p>
          <span className="font-medium text-gray-400">Check-in:</span>{" "}
          {formatDate(booking.checkInDate)}{" "}
          <span className="text-gray-500">{hotelCheckIn}</span>
        </p>
        <p>
          <span className="font-medium text-gray-400">Check-out:</span>{" "}
          {formatDate(booking.checkOutDate)}{" "}
          <span className="text-gray-500">{hotelCheckOut}</span>
        </p>
        <p>
          <span className="font-medium text-gray-400">Room:</span>{" "}
          {booking.roomType}
        </p>
      </div>
  
      {/* Actions */}
      {isPending && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handlePayment}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-md transition"
          >
            <CreditCard size={14} />
            Pay
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-md transition"
          >
            <XCircle size={14} />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
  
};

export default BookingCard;
