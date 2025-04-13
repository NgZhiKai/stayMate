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
  handleDeleteHotel: (hotelId: number) => void;
};

const HotelDetails: React.FC<HotelDetailsProps> = ({
  hotel,
  reviews,
  userInfo,
  getPricingRange,
  formatToAMPM,
  renderStars,
  isBookmarked,
  setIsBookmarked,
  handleDeleteHotel,
}) => {
  const navigate = useNavigate();  // Initialize the navigate function
  const defaultImage = 'https://archive.org/download/placeholder-image/placeholder-image.jpg';

  // Check if the user is an admin
  const userRole = sessionStorage.getItem('role');
  const isAdmin = userRole === 'admin';

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleBookClick = () => {
    navigate(`/create-bookings/${hotel?.id}`);  // Navigate to create-bookings page when clicked
  };

  const handleUpdateHotel = () => {
    navigate(`/create-hotel/${hotel?.id}`); // Navigate to update-hotel page when clicked
  };

  // Helper component for displaying hotel contact info
  const ContactInfo = ({ hotel }: { hotel: HotelData | null }) => (
    <div>
      <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
      <p><strong>Address:</strong> {hotel?.address || 'N/A'}</p>
      <p><strong>Contact:</strong> {hotel?.contact || 'N/A'}</p>
    </div>
  );

  // Helper component for displaying pricing and timing
  const PricingTiming = ({ hotel }: { hotel: HotelData | null }) => (
    <div>
      <h3 className="text-xl font-semibold mb-2">Pricing & Timing</h3>
      <p><strong>Price Range:</strong> {getPricingRange()}</p>
      <p><strong>Check-In:</strong> {hotel?.checkIn ? formatToAMPM(hotel.checkIn) : 'N/A'}</p>
      <p><strong>Check-Out:</strong> {hotel?.checkOut ? formatToAMPM(hotel.checkOut) : 'N/A'}</p>
    </div>
  );

  // Helper component for displaying reviews
  const Reviews = ({ reviews, userInfo }: { reviews: Review[], userInfo: { [key: string]: { firstName: string; lastName: string } } }) => (
    <div>
      <h3 className="text-xl font-semibold mb-2">Reviews</h3>
      <div className="space-y-4">
        {reviews.length === 0 ? <p>No reviews available for this hotel.</p> : reviews.map((review, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded shadow">
            <p className="font-semibold">{userInfo[review.userId]?.firstName} {userInfo[review.userId]?.lastName}</p>
            <p className="flex">{renderStars(review.rating)}</p>
            <p className="text-gray-800">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <img src={hotel?.image ? `data:image/jpeg;base64,${hotel.image}` : defaultImage} alt={hotel?.name} className="w-full h-80 object-cover rounded-xl shadow-md mb-6" />
      <div className="mb-6 flex justify-between items-start">
        <h1 className="text-3xl font-bold">{hotel?.name}</h1>
        <div className="flex space-x-3 items-center">
          <button onClick={handleBookmarkToggle} className="text-gray-600 hover:text-blue-600 transition text-xl hover:scale-110">
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
          <button
            onClick={handleBookClick}  // Added onClick handler for booking
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition hover:scale-110"
          >
            Book
          </button>

          {/* Show the Update Hotel button if the user is an admin */}
          {isAdmin && (
            <>
            <button
              onClick={handleUpdateHotel}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition hover:scale-110"
            >
              Update Hotel
            </button>
            <button
              onClick={() => handleDeleteHotel(hotel?.id!)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition hover:scale-110"
            >
              Delete Hotel
            </button>
          </>
          )}
        </div>
      </div>
      <p className="text-gray-700 mb-6">{hotel?.description}</p>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <ContactInfo hotel={hotel} />
        <PricingTiming hotel={hotel} />
      </div>
      <Reviews reviews={reviews} userInfo={userInfo} />
    </div>
  );
};

export default HotelDetails;
