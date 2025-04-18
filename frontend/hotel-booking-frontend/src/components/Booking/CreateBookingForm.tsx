import React, { useState } from "react";
import { Booking } from "../../types/Booking";
import { Room } from "../../types/Room";

interface Props {
  bookingData: Booking;
  rooms: Room[];
  isSubmitting: boolean;
  errors: { [key: string]: string };
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
  errors,
  handleInputChange,
  handleRoomSelect,
  handleSubmit,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const hasSelectedDates = bookingData.checkInDate && bookingData.checkOutDate;
  const today = new Date().toISOString().split("T")[0];

  const uniqueRoomTypes = Array.from(
    new Map(rooms.map((room) => [room.room_type, room])).values()
  );

  const calculateTotalAmount = () => {
    if (hasSelectedDates && selectedRoom) {
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const days = (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24);
      return days > 0 ? days * selectedRoom.pricePerNight : 0;
    }
    return 0;
  };

  bookingData.totalAmount = calculateTotalAmount();

  const handleRoomSelectWrapper = (roomType: string) => {
    const availableRoom = rooms.find((r) => r.room_type === roomType);
    if (availableRoom) {
      setSelectedRoom(availableRoom);
      handleRoomSelect(availableRoom.id.roomId);
    } else {
      alert(`No available rooms of type ${roomType}`);
    }
  };

  const displayErrors = {
    ...errors,
    ...(hasSelectedDates && rooms.length === 0 && {
      room: "Sorry, there are no available rooms for the selected dates.",
    }),
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Create Booking
      </h2>

      {Object.keys(displayErrors).length > 0 && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <ul className="list-disc list-inside text-sm space-y-1">
            {Object.values(displayErrors).map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block text-lg font-semibold mb-2 text-gray-700">
          Select a Room Type
        </label>

        <div className="mb-4">
          {uniqueRoomTypes.length === 0 ? (
            <div className="text-center text-gray-600 py-4">
              No rooms available for the selected dates.
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              {uniqueRoomTypes.map((room) => {
                const isAvailable = rooms.some(
                  (r) => r.room_type === room.room_type
                );
                const isSelected = selectedRoom?.room_type === room.room_type;

                return (
                  <button
                    key={room.id.roomId}
                    type="button"
                    disabled={!hasSelectedDates || !isAvailable}
                    onClick={() => handleRoomSelectWrapper(room.room_type)}
                    className={`relative group p-4 rounded-xl border transition duration-300 text-center
                      ${
                        isSelected
                          ? "bg-blue-500 text-white border-blue-600"
                          : isAvailable
                          ? "bg-gray-50 hover:bg-blue-50 text-gray-800"
                          : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                      }
                    `}
                  >
                    <div className="text-sm font-semibold mb-1">
                      {room.room_type} ROOM
                    </div>
                    <div className="text-xs">
                      ${room.pricePerNight}/night
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 p-2 text-xs text-gray-700 bg-white border border-gray-300 rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition">
                      {isAvailable ? (
                        <>
                          <div>{room.room_type} ROOM</div>
                          <div>${room.pricePerNight} per night</div>
                        </>
                      ) : (
                        <div className="text-red-500">Fully booked</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Check-in Date
            </label>
            <input
              type="date"
              name="checkInDate"
              value={bookingData.checkInDate}
              onChange={handleInputChange}
              min={today}
              className="w-full p-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Check-out Date
            </label>
            <input
              type="date"
              name="checkOutDate"
              value={bookingData.checkOutDate}
              onChange={handleInputChange}
              min={today}
              className="w-full p-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Total Amount
          </label>
          <input
            type="number"
            name="totalAmount"
            value={bookingData.totalAmount}
            disabled
            className="w-full p-2 border rounded-md border-gray-300 bg-gray-100 text-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Create Booking"}
        </button>
      </form>
    </div>
  );
};

export default CreateBookingForm;
