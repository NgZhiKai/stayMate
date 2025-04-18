import React from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa"; // Import missing icons
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { HotelData } from "../../types/Hotels";
import { Review } from "../../types/Review";

type HotelDetailsProps = {
  hotel: HotelData | null;
  reviews: Review[];
  userInfo: { [key: string]: { firstName: string; lastName: string } };
  getPricingRange: () => string;
  formatToAMPM: (timeString: string) => string;
  renderStars: (rating: number) => React.ReactNode;
  isBookmarked: boolean;
  setIsBookmarked: (value: boolean) => void;
  handleBookmarkToggle: () => void;
  handleDeleteHotel: (hotelId: number) => void;
  setIsReviewModalOpen: (open: boolean) => void;
  userId: Number;
};

const HotelDetails: React.FC<HotelDetailsProps> = ({
  hotel,
  reviews,
  userInfo,
  getPricingRange,
  formatToAMPM,
  renderStars,
  isBookmarked,
  handleBookmarkToggle,
  handleDeleteHotel,
  setIsReviewModalOpen,
  userId,
}) => {
  const navigate = useNavigate();
  const defaultImage = 'https://archive.org/download/placeholder-image/placeholder-image.jpg';
  const userRole = sessionStorage.getItem('role');
  const isAdmin = userRole === 'admin';

  const formatPhoneNumber = (rawPhone: string) => {
    if (!rawPhone || rawPhone.length < 5) return rawPhone;
    const countryCode = rawPhone.slice(0, 2);
    const localNumber = rawPhone.slice(2);
    return `(+${countryCode}) ${localNumber}`;
  };

  const handleBookClick = () => {
    navigate(`/create-bookings/${hotel?.id}`);
  };

  const handleUpdateHotel = () => {
    navigate(`/create-hotel/${hotel?.id}`);
  };

  const ContactInfo = ({ hotel }: { hotel: HotelData | null }) => (
    <div>
      <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
      <p><strong>Address:</strong> {hotel?.address || 'N/A'}</p>
      <p><strong>Contact:</strong> {hotel?.contact ? formatPhoneNumber(hotel.contact) : 'N/A'}</p>
    </div>
  );

  const PricingTiming = ({ hotel }: { hotel: HotelData | null }) => (
    <div>
      <h3 className="text-xl font-semibold mb-2">Pricing & Timing</h3>
      <p><strong>Price Range:</strong> {getPricingRange()}</p>
      <p><strong>Check-In:</strong> {hotel?.checkIn ? formatToAMPM(hotel.checkIn) : 'N/A'}</p>
      <p><strong>Check-Out:</strong> {hotel?.checkOut ? formatToAMPM(hotel.checkOut) : 'N/A'}</p>
    </div>
  );

  const Reviews = ({ reviews, userInfo }: { reviews: Review[], userInfo: { [key: string]: { firstName: string; lastName: string } } }) => (
    <div>
      <h3 className="text-xl font-semibold mb-2">Reviews</h3>
      <div
        className="space-y-4 max-h-96 overflow-y-auto pr-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.length === 0 ? (
          <p>No reviews available for this hotel.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded shadow">
              <p className="font-semibold">
                {userInfo[review.userId]?.firstName} {userInfo[review.userId]?.lastName}
              </p>
              <p className="flex">{renderStars(review.rating)}</p>
              <p className="text-gray-800">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Hotel Image */}
      <img
        src={hotel?.image ? `data:image/jpeg;base64,${hotel.image}` : defaultImage}
        alt={hotel?.name}
        className="w-full h-96 object-cover rounded-2xl shadow-xl transition-transform transform hover:scale-105 mb-8"
      />
  
      {/* Hotel Name and Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-gray-800">{hotel?.name}</h1>
        <div className="flex items-center space-x-4">
          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            className="text-gray-700 hover:text-blue-500 transition-all transform hover:scale-110 text-2xl"
          >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
  
          {/* Book Button (only for non-admins) */}
          {userId && (
            <button
              onClick={handleBookClick}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"            >
              Book Now
            </button>
          )}
  
          {/* Admin Action Buttons */}
          {isAdmin && (
            <>
              <button
                onClick={handleUpdateHotel}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                Update Hotel
              </button>
              <button
                onClick={() => handleDeleteHotel(hotel?.id!)}
                className="bg-red-600 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-red-700 transition-all transform hover:scale-105"
              >
                Delete Hotel
              </button>
            </>
          )}
        </div>
      </div>
  
      {/* Hotel Description */}
      <p className="text-gray-800 text-lg mb-6">{hotel?.description}</p>
  
      {/* Pricing and Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactInfo hotel={hotel} />
        <PricingTiming hotel={hotel} />
      </div>
  
      {/* Reviews Section */}
      {userId !== 0 && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition-all transform hover:scale-105"
          >
            Write a Review
          </button>
        </div>
      )}
  
      {/* Reviews List */}
      <Reviews reviews={reviews} userInfo={userInfo} />
    </div>
  );
  
};

export default HotelDetails;