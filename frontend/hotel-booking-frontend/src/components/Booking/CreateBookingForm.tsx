import React, { useState, useEffect } from "react";
import { Room } from "../../types/Room";
import { Booking } from "../../types/Booking";

interface Props {
  bookingData: Booking;
  rooms: Room[];
  isSubmitting: boolean;
  validationErrors: string | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleRoomSelect: (roomId: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const CreateBookingForm: React.FC<Props> = ({
  bookingData,
  rooms,
  isSubmitting,
  validationErrors,
  handleInputChange,
  handleRoomSelect,
  handleSubmit,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  // Calculate room slices for pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Total number of pages
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  // Calculate the number of days between check-in and check-out
  const calculateTotalAmount = () => {
    if (bookingData.checkInDate && bookingData.checkOutDate && selectedRoom) {
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const days = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days
      if (days > 0) {
        return days * selectedRoom.pricePerNight;
      }
    }
    return 0;
  };

  const totalAmount = calculateTotalAmount();

  // Handle room selection
  const handleRoomSelectWrapper = (roomId: number) => {
    const room = rooms.find((r) => r.id.roomId === roomId);
    if (room) {
      setSelectedRoom(room);
      handleRoomSelect(roomId); // Keep the existing logic intact
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Create a New Booking
      </h2>

      {validationErrors && (
        <div className="text-red-500 text-center mb-4">{validationErrors}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Select a Room
          </label>
          <div className="flex items-center justify-between">
            {/* Left Arrow Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50"
            >
              &lt;
            </button>

            {/* Room Grid */}
            <div className="grid grid-cols-3 gap-2">
              {currentRooms.map((room) => {
                const isSelected = room.id.roomId === bookingData.roomId;
                return (
                  <button
                    key={room.id.roomId}
                    type="button"
                    onClick={() => handleRoomSelectWrapper(room.id.roomId)}
                    className={`relative group border rounded-md p-3 text-center transition duration-300
                      ${
                        isSelected
                          ? "bg-blue-500 text-white border-blue-600"
                          : "bg-gray-100 hover:bg-blue-100"
                      }`}
                  >
                    <div className="font-medium text-sm">Room {room.id.roomId}</div>

                    {/* Tooltip on hover */}
                    <div className="absolute z-10 left-1/2 transform -translate-x-1/2 bottom-full mb-2 flex-col bg-white text-gray-800 border border-gray-300 rounded-md p-2 shadow-md text-xs w-40 opacity-0 group-hover:opacity-100 pointer-events-none transition duration-200">
                      <span className="font-medium">{room.room_type}</span>
                      <span>${room.pricePerNight}/night</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              name="checkInDate"
              value={bookingData.checkInDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              name="checkOutDate"
              value={bookingData.checkOutDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Total Amount
          </label>
          <input
            type="number"
            name="totalAmount"
            value={totalAmount}
            disabled
            className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          {isSubmitting ? "Submitting..." : "Create Booking"}
        </button>
      </form>
    </div>
  );
};

export default CreateBookingForm;
