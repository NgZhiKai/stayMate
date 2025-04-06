import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createBooking } from "../services/bookingApi";
import { getAvailableRooms } from "../services/roomApi";
import { Booking } from "../types/Booking";
import { Room } from "../types/Room";
import CreateBookingForm from "../components/Booking/CreateBookingForm";

const Modal: React.FC<{ message: string; onClose: () => void }> = ({
  message,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">Success</h2>
        <p className="text-gray-800 text-center">{message}</p>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams<{ hotelId: string }>();
  const [bookingData, setBookingData] = useState<Booking>({
    userId: 0,
    hotelId: 0,
    roomId: 0,
    checkInDate: "",
    checkOutDate: "",
    totalAmount: 0,
  });

  const [validationErrors, setValidationErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setShowLoginPrompt(true);
      return;
    }

    if (userId && hotelId) {
      setBookingData((prevData) => ({
        ...prevData,
        userId: Number(userId),
        hotelId: Number(hotelId),
      }));

      const fetchAvailableRooms = async () => {
        try {
          const availableRooms = await getAvailableRooms(Number(hotelId));
          setRooms(availableRooms);
        } catch (error) {
          console.error("Failed to fetch available rooms", error);
        }
      };

      fetchAvailableRooms();
    }
  }, [hotelId, userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const handleRoomSelect = (roomId: number) => {
    setBookingData((prevData) => ({
      ...prevData,
      roomId,
    }));
  };

  const validateForm = () => {
    let errors = "";
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
        await createBooking(bookingData);
        setIsSubmitting(false);
        setModalMessage("Booking created successfully!");
        setShowModal(true);  // Show modal on success
      } catch (error) {
        setIsSubmitting(false);
        console.error("Error creating booking:", error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/bookings");  // Redirect to the bookings page
  };

  if (showLoginPrompt) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto text-center">
        <p className="text-lg text-gray-700 mb-4">
          You must be logged in to create a booking.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-full bg-gray-100">
      <div className="w-full max-w-screen-md p-6">
        <CreateBookingForm
          bookingData={bookingData}
          rooms={rooms}
          isSubmitting={isSubmitting}
          validationErrors={validationErrors}
          handleInputChange={handleInputChange}
          handleRoomSelect={handleRoomSelect}
          handleSubmit={handleSubmit}
        />
      </div>
      {showModal && <Modal message={modalMessage} onClose={handleModalClose} />}
    </div>
  );
};

export default CreateBookingPage;
