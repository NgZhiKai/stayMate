import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingCard from "../components/Booking/BookingCard";
import MessageModal from "../components/MessageModal";
import { cancelBooking, getBookingsForUser } from "../services/bookingApi";
import { fetchHotelById } from "../services/hotelApi";
import { DetailedBooking } from "../types/Booking";

const BookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<DetailedBooking[]>([]);
  const [hotelNames, setHotelNames] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return console.error("User ID not found.");

      try {
        setLoading(true);
        const bookingResponse = await getBookingsForUser(Number(userId));

        if (Array.isArray(bookingResponse)) {
          setBookings(bookingResponse);
        } else {
          setBookings([]);
        }

        const hotelNameMap: { [key: number]: string } = {};
        await Promise.all(
          bookingResponse.map(async (booking: DetailedBooking) => {
            const hotel = await fetchHotelById(booking.hotelId);
            hotelNameMap[booking.hotelId] = hotel.name;
          })
        );
        setHotelNames(hotelNameMap);
      } catch (error) {
        console.error("Error fetching bookings or hotels:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const result = await cancelBooking(bookingId);

      if (result.error) {
        showModal(result.error, "error");
        return;
      }

      showModal(`Booking with ID ${bookingId} has been canceled.`, "success");
    } catch {
      showModal("An unexpected error occurred.", "error");
    }
  };

  const handleMakePayment = (bookingId: number) => {
    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (!booking) return;

    navigate("/payment", { state: { bookingId: booking.bookingId } });
  };

  const showModal = (message: string, type: "success" | "error") => {
    setModalMessage(message);
    setModalType(type);
    setModalIsOpen(true);
  };

  return (
    <div className="bg-gray-900 min-h-full py-8 px-4 sm:px-6 lg:px-12">
      <h2 className="text-gray-100 text-3xl font-semibold text-center mb-8">Your Bookings</h2>

      {loading && <div className="text-center text-gray-500">Loading bookings...</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.length === 0 && !loading ? (
          <p className="text-gray-500 text-center col-span-full">You have no bookings.</p>
        ) : (
          currentBookings.map((booking) => (
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

      <div className="flex justify-center mt-4 items-center gap-2">
        {bookings.length > 0 && (
          <>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
              }`}
            >
              &lt;
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
              }`}
            >
              &gt;
            </button>
          </>
        )}
      </div>

      {/* Modal */}
      <MessageModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default BookingPage;
