import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { createReview } from "../services/ratingApi";
import { Review } from "../types/Review";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: number;
  userId: number | null;
  onReviewSubmitted: (review: Review) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  userId,
  onReviewSubmitted,
}) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    if (isOpen) {
      setComment("");
      setRating(0);
    }
  }, [isOpen]);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const review: Review = {
      hotelId,
      userId: userId!, // userId is guaranteed to be not null at this point
      comment,
      created: new Date().toISOString(),
      rating,
    };

    try {
      const createdReview = await createReview(review);
      onReviewSubmitted(createdReview);
      onClose();
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition";

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
        <div className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
            onClick={onClose}
            aria-label="Close Modal"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-center mb-6">Submit Your Review</h2>

          {userId === 0 ? (
            <div className="text-center text-red-500">
              <p>Need to login to enter a review.</p>
              <button
                onClick={() => navigate("/login")}  // Navigate to the login page
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`cursor-pointer text-2xl transition-transform transform ${
                        index < rating ? "text-yellow-400" : "text-gray-500"
                      } hover:scale-125`}
                      onClick={() => handleRatingClick(index + 1)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review here..."
                  rows={4}
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border border-gray-600 text-white hover:bg-gray-700 transition-transform transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewModal;
