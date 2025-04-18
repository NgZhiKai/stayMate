import React, { useEffect, useState } from 'react';
import HotelCard from '../components/Hotel/HotelCard';
import { getBookmarkedHotelIds } from '../services/bookmarkApi';
import { fetchHotelById } from '../services/hotelApi';
import { getReviewsForHotel } from '../services/ratingApi';
import { HotelData } from '../types/Hotels';

const BookmarkedHotelsPage: React.FC = () => {
  const [bookmarkedHotels, setBookmarkedHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const loadBookmarkedHotels = async () => {
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const result = await getBookmarkedHotelIds(userId);

        if ('error' in result) {
          setError(result.error);
          setLoading(false);
          return;
        }

        if (Array.isArray(result) && result.length > 0) {
          const hotelPromises = result.map(async (id) => {
            const hotel = await fetchHotelById(id);
            const reviews = await getReviewsForHotel(id);
            const averageRating =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

            return { ...hotel, averageRating };
          });

          const hotelsWithRatings = await Promise.all(hotelPromises);
          setBookmarkedHotels(hotelsWithRatings);
        } else {
          setBookmarkedHotels([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading bookmarked hotels:', err);
        setError('Failed to load bookmarked hotels');
        setLoading(false);
      }
    };

    loadBookmarkedHotels();
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">Your Bookmarked Hotels</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : bookmarkedHotels.length === 0 ? (
        <p>No bookmarked hotels.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3">
          {bookmarkedHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedHotelsPage;
