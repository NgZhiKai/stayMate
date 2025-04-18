import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateBookingForm from "../components/Booking/CreateBookingForm";
import { useNotificationContext } from "../contexts/NotificationContext";
import { createBooking } from "../services/bookingApi";
import { getHotelRooms, getAvailableRooms } from "../services/roomApi"; // Importing both APIs
import { Booking } from "../types/Booking";
import { Room } from "../types/Room";

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
  const { refreshNotifications } = useNotificationContext();

  const [bookingData, setBookingData] = useState<Booking>({
    userId: 0,
    hotelId: 0,
    roomId: 0,
    checkInDate: "",
    checkOutDate: "",
    totalAmount: 0,
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);  // All rooms
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
  
      const fetchRooms = async () => {
        try {
          if (bookingData.checkInDate && bookingData.checkOutDate) {
            const response = await getAvailableRooms(
              Number(hotelId),
              bookingData.checkInDate,
              bookingData.checkOutDate
            );
            console.log(response);
            setRooms(response || []);
          } else {
            const response = await getHotelRooms(Number(hotelId));
            console.log(response);
            setRooms(response || []);
          }
        } catch (error) {
          console.error("Failed to fetch rooms", error);
        }
      };
  
      fetchRooms();
    }
  }, [hotelId, userId, bookingData.checkInDate, bookingData.checkOutDate]);  

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
    const errors: { [key: string]: string } = {};
  
    if (!bookingData.roomId || bookingData.roomId <= 0) {
      errors.roomId = "Room must be selected.";
    }
  
    if (!bookingData.checkInDate) {
      errors.checkInDate = "Check-in date is required.";
    }
  
    if (!bookingData.checkOutDate) {
      errors.checkOutDate = "Check-out date is required.";
    }
  
    if (bookingData.checkInDate && bookingData.checkOutDate) {
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      if (checkOut <= checkIn) {
        errors.checkOutDate = "Check-out date must be after check-in date.";
      }
    }
  
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      setIsSubmitting(true);
      try {
        await createBooking(bookingData);
        refreshNotifications();
        setIsSubmitting(false);
        setModalMessage("Booking created successfully!");
        setShowModal(true);
      } catch (error) {
        setIsSubmitting(false);
        console.error("Error creating booking:", error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/bookings");
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
          rooms={rooms}  // Pass all rooms here
          isSubmitting={isSubmitting}
          errors={validationErrors}
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
