import { useCallback, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import ConfirmationModal from "../components/ConfirmationModal";
import HotelDetails from "../components/Hotel/HotelDetails";
import { deleteHotel, fetchHotelById } from "../services/hotelApi";
import { getReviewsForHotel } from "../services/ratingApi";
import { getUserInfo } from "../services/userApi";
import { HotelData } from "../types/Hotels";
import { Review } from "../types/Review";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays } from "date-fns";

const useHotelData = (id: string) => {
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userInfo, setUserInfo] = useState<{ [key: string]: { firstName: string; lastName: string } }>({});
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  const pricePerNight = 150; // Adjust or fetch this dynamically

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelData = await fetchHotelById(Number(id));
        const reviewsData = await getReviewsForHotel(Number(id));

        const userInfoMap = await Promise.all(
          reviewsData.map(async (review) => {
            const { userId } = review;
            const user = await getUserInfo(String(userId));
            return { userId, userInfo: user.user };
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

  return { loading, hotel, reviews, userInfo };
};

const HotelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, hotel, reviews, userInfo } = useHotelData(id!);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  const formatToAMPM = useCallback((timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
    const formattedMinute = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHour}:${formattedMinute} ${period}`;
  }, []);

  const getPricingRange = useCallback(() => {
    if (!hotel?.rooms?.length) return "$0 - $0";
    const prices = hotel.rooms.map((room) => room.pricePerNight);
    return `$${Math.min(...prices)} - $${Math.max(...prices)}`;
  }, [hotel]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    if (loading) {
      return (
        <>
          {[...Array(fullStars)].map((_, i) => (
            <FaStar key={i} className="text-yellow-500" />
          ))}
          {halfStar && <FaStar className="text-yellow-500 opacity-50" />}
        </>
      );
    }
  };

  // const handleConfirmBooking = () => {
  //   if (hotel && checkInDate && checkOutDate && totalNights > 0) {
  //     setIsModalOpen(false);
  //     navigate("/payment", {
  //       state: {
  //         hotel: {
  //           name: hotel.name,
  //           image: hotel.image,
  //         },
  //         checkInDate: checkInDate.toLocaleDateString(),
  //         checkOutDate: checkOutDate.toLocaleDateString(),
  //         totalPrice,
  //       },
  //     });
  //     setCheckInDate(null);
  //     setCheckOutDate(null);
  //   } else {
  //     alert("Please select valid check-in and check-out dates.");
  //   }
  // };

  const handleDeleteHotel = (hotelId: number) => {
    setHotelToDelete(hotelId);
    setModalMessage("Are you sure you want to delete this hotel?");
    setIsModalOpen(true);
  };

  const confirmDeletion = async () => {
    if (hotelToDelete) {
      try {
        await deleteHotel(hotelToDelete);
        setModalMessage("Hotel deleted successfully!");
        setIsModalOpen(false);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        console.error("Error deleting hotel:", error);
        setModalMessage("There was an error deleting the hotel.");
        setIsModalOpen(false);
      }
    }
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
        renderStars={renderStars}
        isBookmarked={isBookmarked}
        setIsBookmarked={setIsBookmarked}
        handleDeleteHotel={handleDeleteHotel}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeletion}
        message={modalMessage}
      />
    </div>
  );
};

export default HotelDetailsPage;
