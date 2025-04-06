import React, { useState, useEffect } from 'react';
import { getAllBookings, cancelBooking } from '../services/bookingApi';
import { DetailedBooking } from '../types/Booking';
import { getUserInfo } from '../services/userApi'; // Assuming the API is defined for fetching user data
import { fetchHotelById } from '../services/hotelApi'; // Assuming the API is defined for fetching hotel data

const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<DetailedBooking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
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

          // Return updated booking object with user and hotel names
          return {
            ...booking,
            userFirstName: userInfo.user.firstName,
            userLastName: userInfo.user.lastName,
            hotelName: hotelInfo.name,  // Assuming `name` is the field for hotel name
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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center">Admin - Manage Bookings</h1>
      {error && <p className="text-red-600 text-center">{error}</p>}

      {bookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <div className="flex justify-center mt-8">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Booking ID</th>
                <th className="py-2 px-4 text-left">User</th> {/* Column for User */}
                <th className="py-2 px-4 text-left">Hotel</th> {/* Column for Hotel */}
                <th className="py-2 px-4 text-left">Check-in</th>
                <th className="py-2 px-4 text-left">Check-out</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking) => (
                <tr key={booking.id} className="border-b">
                  <td className="py-2 px-4">{booking.id}</td> {/* Booking ID */}
                  <td className="py-2 px-4">{booking.userFirstName} {booking.userLastName}</td> {/* User Name */}
                  <td className="py-2 px-4">{booking.hotelName}</td> {/* Hotel Name */}
                  <td className="py-2 px-4">{booking.checkInDate}</td>
                  <td className="py-2 px-4">{booking.checkOutDate}</td>
                  <td className="py-2 px-4">
                    {booking.status === 'CANCELLED' ? 'CANCELLED' : booking.status}
                  </td> {/* Show 'Cancelled' only if booking is cancelled */}
                  <td className="py-2 px-4">
                    {booking.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
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

export default ManageBookingsPage;
