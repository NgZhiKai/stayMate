import axios from 'axios';
import { Booking } from '../types/Booking'; // Assuming you have a Booking type defined elsewhere

// Base URL of your backend API
const API_URL = 'http://localhost:4200/bookings'; // Adjust to your backend URL

// Function to create a booking
export const createBooking = async (bookingData: Booking) => {
  try {
    const response = await axios.post(`${API_URL}`, bookingData);
    return response.data.data; // Accessing response data as data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific axios error (e.g., network, timeout, etc.)
      return { error: error.response?.data || 'Something went wrong' };
    }
    return { error: 'Unexpected error occurred' };
  }
};

// Function to get booking by ID
export const getBookingById = async (bookingId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${bookingId}`);
    return response.data.data; // Accessing response data as data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || 'Something went wrong' };
    }
    return { error: 'Unexpected error occurred' };
  }
};

// Function to cancel a booking
export const cancelBooking = async (bookingId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${bookingId}`);
    return response.data.data; // Accessing response data as data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || 'Something went wrong' };
    }
    return { error: 'Unexpected error occurred' };
  }
};

// Function to get all bookings for a hotel
export const getBookingsForHotel = async (hotelId: number) => {
  try {
    const response = await axios.get(`${API_URL}/hotel/${hotelId}`);
    return response.data.data; // Accessing response data as data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || 'Something went wrong' };
    }
    return { error: 'Unexpected error occurred' };
  }
};

// Function to get all bookings for a user
export const getBookingsForUser = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data.data; // Accessing response data as data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || 'Something went wrong' };
    }
    return { error: 'Unexpected error occurred' };
  }
};
