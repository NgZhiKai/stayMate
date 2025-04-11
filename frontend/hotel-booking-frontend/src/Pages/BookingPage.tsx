import React, { useState, useEffect } from "react";
import { DetailedBooking } from "../types/Booking";
import { getBookingsForUser, cancelBooking } from "../services/bookingApi";
import { fetchHotelById } from "../services/hotelApi";  // Assuming fetchHotelById is in hotelApi
import BookingCard from "../components/Booking/BookingCard"; // Assuming BookingCard is in the components folder
import MessageModal from "../components/MessageModal"; // Assuming MessageModal is in the components folder
import { useNavigate } from "react-router-dom"; // Import useNavigate

const BookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<DetailedBooking[]>([]);
  const [hotelNames, setHotelNames] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(6); // 6 bookings per page (3 per row, 2 rows)
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state
  const [modalMessage, setModalMessage] = useState(""); // Modal message
  const [modalType, setModalType] = useState<"success" | "error">("success"); // Modal type
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const bookingResponse = await getBookingsForUser(Number(userId));

          if (bookingResponse && bookingResponse.length > 0) {

            setBookings(bookingResponse);
            // Fetch hotel names for each booking
            bookingResponse.forEach(async (booking: DetailedBooking) => {
              try {
                const hotelData = await fetchHotelById(booking.hotelId);
                setHotelNames((prev) => ({
                  ...prev,
                  [booking.hotelId]: hotelData.name,
                }));
              } catch (error) {
                console.error(`Failed to fetch hotel name for Hotel ID ${booking.hotelId}:`, error);
              }
            });
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

  // Calculate which bookings to display on the current page
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCancelBooking = async (bookingId: number) => {
    try {
      // Call the API to cancel the booking
      const result = await cancelBooking(bookingId);

      // If the result contains an error, show the error message in the modal
      if (result.error) {
        setModalMessage(result.error);
        setModalType("error");
        setModalIsOpen(true);
        return;
      }

      setModalMessage(`Booking with ID ${bookingId} has been successfully canceled.`);
      setModalType("success");
      setModalIsOpen(true);
    } catch (error) {
      console.error("An error occurred while canceling the booking:", error);
      setModalMessage("An unexpected error occurred.");
      setModalType("error");
      setModalIsOpen(true);
    }
  };

  // Handle making a payment
  const handleMakePayment = (bookingId: number) => {
    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (!booking) return;

    // Navigate to the payment page with booking details
    navigate("/payment", {
      state: {
        bookingId: booking.bookingId
      },
    });

    console.log("Make payment for booking with ID:", bookingId);
  };

  const closeModal = () => {
    setModalIsOpen(false); // Close the modal when the "Close" button is clicked
  };

  return (
    <div className="bg-gray-100 min-h-full py-8">
      <h2 className="text-3xl font-semibold text-center mb-6">Your Bookings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center col-span-3">You have no bookings.</p>
        ) : (
          currentBookings.map((booking: DetailedBooking) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              hotelName={hotelNames[booking.hotelId] || "Loading..."}
              onCancelBooking={handleCancelBooking}
              onMakePayment={handleMakePayment}
            />
          ))
        )}
      </div>

      {/* Modal for Success/Error messages */}
      <MessageModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        message={modalMessage}
        type={modalType}
      />

      {/* Pagination Controls at the Bottom */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
        >
          Prev
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * bookingsPerPage >= bookings.length}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
