import React, { useEffect, useState } from 'react';
import HotelCard from '../components/Hotel/HotelCard';
import SearchBar from '../components/SearchBar';
import { fetchHotels } from '../services/hotelApi';
import { getReviewsForHotel } from '../services/ratingApi';
import { HotelData } from '../types/Hotels';

const HomePage: React.FC = () => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
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
    console.log('Searching for:', query);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to StayMate</h1>
          <p className="text-gray-600 mt-2">Find the best hotels near you with ease.</p>
        </div>
        <div className="ml-auto">
          <SearchBar onSearch={handleSearch} />
        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;