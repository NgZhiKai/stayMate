import React, { useState, useEffect } from 'react';
import { getAllBookings, cancelBooking } from '../services/bookingApi';
import { DetailedBooking } from '../types/Booking';
import { getUserInfo } from '../services/userApi';
import { fetchHotelById } from '../services/hotelApi';

const ITEMS_PER_PAGE = 8;

const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<DetailedBooking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(ITEMS_PER_PAGE); // Changed from 10 to 5
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getAllBookings(); // Fetch bookings from the API
        const bookingsWithDetails = await Promise.all(result.bookings.map(async (booking) => {
          // Fetch user details
          const userInfo = await getUserInfo(String(booking.userId));
          // Fetch hotel details
          const hotelInfo = await fetchHotelById(booking.hotelId);

          console.log(hotelInfo);

          return {
            ...booking,
            userFirstName: userInfo.user.firstName,
            userLastName: userInfo.user.lastName,
            hotelName: hotelInfo.name,
            hotelCheckInTime: hotelInfo.checkIn || 'N/A',
            hotelCheckOutTime: hotelInfo.checkOut || 'N/A'
          };
        }));

        setBookings(bookingsWithDetails);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load bookings');
      }
    };
    fetchBookings();
  }, []);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;

  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCancel = async (bookingId: number) => {
    try {
      await cancelBooking(bookingId);
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking');
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-full relative">
      <h1 className="text-2xl mb-4">Manage Bookings</h1>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentBookings.map((booking) => (
            <div
              key={booking.id}
              className={`flex flex-col p-3 rounded-lg ${booking.status === 'CANCELLED' ? 'bg-gray-700' : 'bg-gray-800'}`}
            >
              <h2 className="text-lg font-semibold">Booking ID: {booking.id}</h2>
              <p className="text-sm">User: {booking.userFirstName} {booking.userLastName}</p>
              <p className="text-sm">Hotel: {booking.hotelName}</p>
              <p className="text-sm">
                Check-in: {new Date(booking.checkInDate).toLocaleDateString()} at {booking.hotelCheckInTime?.slice(0, 5)}
              </p>
              <p className="text-sm">
                Check-out: {new Date(booking.checkOutDate).toLocaleDateString()} at {booking.hotelCheckOutTime?.slice(0, 5)}
              </p>
              <p className="text-sm">
                <span
                  className={`font-semibold py-1 px-3 rounded-full inline-block ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-600'
                      : booking.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {booking.status}
                </span>
              </p>

              {booking.status !== 'CANCELLED' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="bg-red-500 text-white px-3 py-1 mt-2 rounded transition-all duration-300 transform hover:bg-red-400 hover:scale-105"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageBookingsPage;
