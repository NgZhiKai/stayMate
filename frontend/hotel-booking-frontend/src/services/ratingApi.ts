import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { Review } from '../types/Review';

// Base URL for the API
const API_BASE_URL = `${BASE_URL}/reviews`;

interface CustomResponse<T> {
  message: string;
  data: T;
}

// Fetch all reviews
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const response = await axios.get<CustomResponse<Review[]>>(API_BASE_URL);
    return response.data.data;  // Return the actual data
  } catch (error) {
    throw new Error('An error occurred while fetching reviews');
  }
};

// Fetch a review by ID
export const getReviewById = async (id: number): Promise<Review> => {
  try {
    const response = await axios.get<CustomResponse<Review>>(`${API_BASE_URL}/${id}`);
    return response.data.data;  // Return the actual data
  } catch (error) {
    throw new Error('An error occurred while fetching the review');
  }
};

// Create a new review
export const createReview = async (review: Review): Promise<Review> => {
  try {
    const response = await axios.post<CustomResponse<Review>>(API_BASE_URL, review);
    return response.data.data;  // Return the actual data
  } catch (error) {
    throw new Error('An error occurred while creating the review');
  }
};

// Update an existing review
export const updateReview = async (
  id: number,
  review: Review
): Promise<Review> => {
  try {
    const response = await axios.put<CustomResponse<Review>>(`${API_BASE_URL}/${id}`, review);
    return response.data.data;  // Return the actual data
  } catch (error) {
    throw new Error('An error occurred while updating the review');
  }
};

// Delete a review by ID
export const deleteReview = async (id: number): Promise<string> => {
  try {
    const response = await axios.delete<CustomResponse<string>>(`${API_BASE_URL}/${id}`);
    return response.data.data;  // Return the actual data
  } catch (error) {
    throw new Error('An error occurred while deleting the review');
  }
};

// Fetch reviews for a specific hotel
export const getReviewsForHotel = async (hotelId: number): Promise<Review[]> => {
  try {
    const response = await axios.get<CustomResponse<Review[]>>(`${API_BASE_URL}/hotel/${hotelId}`);
    return response.data.data;  // Return the list of reviews directly
  } catch (error) {
    console.error('Error fetching reviews for this hotel:', error);
    throw new Error('An error occurred while fetching reviews for this hotel');
  }
};
