import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import ConfirmationModal from "../components/ConfirmationModal";
import HotelDetails from "../components/Hotel/HotelDetails";
import MessageModal from "../components/MessageModal"; // <-- NEW IMPORT
import ReviewModal from "../components/ReviewModal"; // <-- NEW IMPORT
import { deleteHotel, fetchHotelById } from "../services/hotelApi";
import { getReviewsForHotel } from "../services/ratingApi";
import { getUserInfo } from "../services/userApi";
import { HotelData } from "../types/Hotels";
import { Review } from "../types/Review";

const useHotelData = (id: string) => {
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userInfo, setUserInfo] = useState<{ [key: string]: { firstName: string; lastName: string } }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelData = await fetchHotelById(Number(id));
        const reviewsData = await getReviewsForHotel(Number(id));

        const userInfoMap = await Promise.all(
          reviewsData.map(async (review) => {
            const user = await getUserInfo(String(review.userId));
            return { userId: review.userId, userInfo: user.user };
          })
        ).then((data) =>
          data.reduce((acc, { userId, userInfo }) => ({ ...acc, [userId]: userInfo }), {})
        );

        setHotel(hotelData);
        setReviews(reviewsData);
        setUserInfo(userInfoMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { loading, hotel, reviews, userInfo, setReviews };
};

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="text-yellow-500" />
      ))}
      {halfStar && <FaStar className="text-yellow-500 opacity-50" />}
    </>
  );
};

const HotelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, hotel, reviews, userInfo, setReviews } = useHotelData(id!);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false); 
  const [messageModalType, setMessageModalType] = useState<"success" | "error">("success");
  const [messageModalContent, setMessageModalContent] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const navigate = useNavigate();

  const currentUserId = Number(sessionStorage.getItem("userId"));

  const formatToAMPM = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
    const formattedMinute = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  const getPricingRange = () => {
    if (!hotel?.rooms?.length) return "$0 - $0";
    const prices = hotel.rooms.map((room) => room.pricePerNight);
    return `$${Math.min(...prices)} - $${Math.max(...prices)}`;
  };

  const handleDeleteHotel = (hotelId: number) => {
    setHotelToDelete(hotelId);
    setModalMessage("Are you sure you want to delete this hotel?");
    setIsModalOpen(true);
  };

  const confirmDeletion = async () => {
    if (hotelToDelete) {
      try {
        await deleteHotel(hotelToDelete);
        setIsModalOpen(false);
        setMessageModalContent("Hotel deleted successfully!");
        setMessageModalType("success");
        setMessageModalOpen(true);
        setTimeout(() => {
          setMessageModalOpen(false);
          navigate("/");
        }, 2000);
      } catch (error) {
        console.error("Error deleting hotel:", error);
        setIsModalOpen(false);
        setMessageModalContent("There was an error deleting the hotel.");
        setMessageModalType("error");
        setMessageModalOpen(true);
      }
    }
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleReviewSubmitted = (review: Review | null) => {
    if (!review) return;
    setReviews((prev) => [...prev, review]);
    handleCloseReviewModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#2563EB" />
      </div>
    );
  }

  if (!hotel) {
    return <div className="text-center py-10">Hotel not found.</div>;
  }

  return (
    <div className="p-6">
      <HotelDetails
        hotel={hotel}
        reviews={reviews}
        userInfo={userInfo}
        getPricingRange={getPricingRange}
        formatToAMPM={formatToAMPM}
        isBookmarked={isBookmarked}
        renderStars={renderStars}
        setIsBookmarked={setIsBookmarked}
        handleDeleteHotel={handleDeleteHotel}
        setIsReviewModalOpen={setIsReviewModalOpen}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeletion}
        message={modalMessage}
      />
      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        message={messageModalContent}
        type={messageModalType}
      />
      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        hotelId={hotel.id}
        userId={currentUserId!}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default HotelDetailsPage;
