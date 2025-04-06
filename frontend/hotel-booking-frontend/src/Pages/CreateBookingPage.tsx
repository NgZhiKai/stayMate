import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Booking } from "../types/Booking";
import { Room } from "../types/Room";
import { createBooking } from "../services/bookingApi";
import { getAvailableRooms } from "../services/roomApi";  // Import the function to fetch available rooms

const CreateBookingPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();  // Access hotelId from URL
  const [bookingData, setBookingData] = useState<Booking>({
    userId: 0,  // Assuming the user ID will be fetched or passed from sessionStorage
    hotelId: 0,
    roomId: 0,
    checkInDate: '',
    checkOutDate: '',
    totalAmount: 0,
  });

  const [validationErrors, setValidationErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);  // State to store available rooms

  // Get the userId from sessionStorage or other means
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (userId && hotelId) {
      setBookingData((prevData) => ({
        ...prevData,
        userId: Number(userId),
        hotelId: Number(hotelId), // Set the hotelId from the URL parameter
      }));

      // Fetch available rooms for the hotel
      const fetchAvailableRooms = async () => {
        try {
          const availableRooms = await getAvailableRooms(Number(hotelId));  // Fetch rooms for the hotel
          setRooms(availableRooms);  // Set available rooms to the state
        } catch (error) {
          console.error("Failed to fetch available rooms", error);
        }
      };

      fetchAvailableRooms();
    }
  }, [hotelId, userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let errors = '';
    // Validate the required fields
    if (!bookingData.roomId || bookingData.roomId <= 0) {
      errors += "Room ID must be a valid number. ";
    }
    if (!bookingData.checkInDate) {
      errors += "Check-in Date is required. ";
    }
    if (!bookingData.checkOutDate) {
      errors += "Check-out Date is required. ";
    }
    if (bookingData.checkInDate && bookingData.checkOutDate) {
      const checkInDate = new Date(bookingData.checkInDate);
      const checkOutDate = new Date(bookingData.checkOutDate);
      if (checkOutDate <= checkInDate) {
        errors += "Check-out Date must be after Check-in Date. ";
      }
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors) {
      setValidationErrors(errors);
    } else {
      setIsSubmitting(true);
      try {
        await createBooking(bookingData);  // Call the API to create the booking
        setIsSubmitting(false);
        alert("Booking created successfully!");
      } catch (error) {
        setIsSubmitting(false);
        console.error("Error creating booking:", error);
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Create a New Booking</h2>

      {validationErrors && (
        <div className="text-red-500 text-center mb-4">{validationErrors}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Room</label>
            <select
  name="roomId"
  value={bookingData.roomId}
  onChange={handleInputChange}
  className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
>
  <option value={0}>Select a room</option>
  {rooms.map((room) => (
    <option key={room.id.roomId} value={room.id.roomId}>
      {`Room ${room.id.roomId} - ${room.room_type} - $${room.pricePerNight}/night`}
    </option>
  ))}
</select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Check-in Date</label>
            <input
              type="date"
              name="checkInDate"
              value={bookingData.checkInDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Check-out Date</label>
            <input
              type="date"
              name="checkOutDate"
              value={bookingData.checkOutDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              value={bookingData.totalAmount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          {isSubmitting ? 'Submitting...' : 'Create Booking'}
        </button>
      </form>
    </div>
  );
};

export default CreateBookingPage;
