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
      className={`bg-gray-800 rounded-lg p-3 mb-3 w-full max-w-md mx-auto text-sm text-gray-300 shadow-sm hover:shadow-md transition ${
        booking.status === "CANCELLED" ? "opacity-70" : ""
      }`}
    >
      {/* Top Row: Hotel name + status pill */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-base font-semibold text-white">
          {hotelName || "Loading..."}
        </h3>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
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

      {/* Booking dates and room info */}
      <div className="mb-2 space-y-1">
        <div>
          <span className="text-gray-400 font-medium">Check-in:</span>{" "}
          {`${formatDate(booking.checkInDate)} ${hotelCheckIn || ""}`}
        </div>
        <div>
          <span className="text-gray-400 font-medium">Check-out:</span>{" "}
          {`${formatDate(booking.checkOutDate)} ${hotelCheckOut || ""}`}
        </div>
        <div>
          <span className="text-gray-400 font-medium">Room:</span>{" "}
          {booking.roomType}
        </div>
      </div>

      {/* Action buttons - only if booking is PENDING */}
      {isPending && (
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={handlePayment}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-md"
          >
            <CreditCard size={14} />
            Pay
          </button>

          <button
            onClick={handleCancel}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md"
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
