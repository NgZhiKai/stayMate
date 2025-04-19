import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from '../components/Hotel/HotelCard';
import SearchBar from '../components/SearchBar';
import { useNotificationContext } from "../contexts/NotificationContext";
import { fetchHotels } from '../services/hotelApi';
import { getReviewsForHotel } from '../services/ratingApi';
import { HotelData } from '../types/Hotels';

const HomePage: React.FC = () => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hotelsPerPage] = useState<number>(8);
  const { refreshNotifications } = useNotificationContext();

  const userId = sessionStorage.getItem('userId');
  const userRole = sessionStorage.getItem('role');
  const isAdmin = userId && userRole === 'admin';

  const navigate = useNavigate();

  useEffect(() => {
    refreshNotifications();

    const loadHotels = async () => {
      try {
        const hotelData = await fetchHotels();

        if (Array.isArray(hotelData)) {
          const hotelsWithRatings = await Promise.all(
            hotelData.map(async (hotel) => {
              const reviews = await getReviewsForHotel(hotel.id);
              const averageRating =
                reviews.length > 0
                  ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                  : 0;

              return { ...hotel, averageRating };
            })
          );

          setHotels(hotelsWithRatings);
          setFilteredHotels(hotelsWithRatings);
        } else {
          throw new Error('Invalid data format received');
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching hotels:', error);
        setError('Failed to load hotels. Please try again.');
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredHotels(hotels);
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    const filtered = hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredHotels(filtered);
  };

  const handleCreateHotel = () => {
    navigate('/create-hotel');
  };

  // Get the hotels to display on the current page
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle next and previous page changes
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  return (
    <div className="p-6">
      <div className="relative bg-white py-16 px-6 md:px-20 rounded-lg">
        {/* Centered Content */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to StayMate Hotel New
          </h1>
          {/* Search Bar centered */}
          <div className="w-full max-w-xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
          {/* Create Hotel button - bottom right */}
          {isAdmin && (
            <button
              onClick={handleCreateHotel}
              className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all z-50"
            >
              Create Hotel
            </button>
          )}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended Hotels</h2>

        {loading ? (
          <p>Loading hotels...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : hotels.length === 0 ? (
          <p>No hotels available at the moment.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3">
              {currentHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>

            {/* Pagination with Arrows */}
            <div className="flex justify-center mt-4 items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-800' : 'bg-blue-600 text-white'}`}
              >
                &lt;
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 text-gray-800' : 'bg-blue-600 text-white'}`}
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
