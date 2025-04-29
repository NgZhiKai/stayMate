import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { Booking, DetailedBooking } from '../types/Booking'; // Assuming you have a Booking type defined elsewhere

// Base URL for the API
const API_BASE_URL = `${BASE_URL}/bookings`;

// Function to create a booking
export const createBooking = async (bookingData: Booking) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, bookingData);
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
    const response = await axios.get(`${API_BASE_URL}/${bookingId}`);
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
    const response = await axios.delete(`${API_BASE_URL}/${bookingId}`);
    return response.data.data; // Accessing response data as data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || 'Something went wrong' };
    }
    return { error: 'Unexpected error occurred' };
  }
};

export const getAllBookings = async (): Promise<{ bookings: DetailedBooking[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    
    // Map the response data to the DetailedBooking format
    const bookings = response.data.data.map((booking: any) => ({
      id: booking.id, // booking ID
      bookingDate: booking.bookingDate, // booking date
      checkInDate: booking.checkInDate, // check-in date
      checkOutDate: booking.checkOutDate, // check-out date
      status: booking.status, // status
      totalAmount: booking.totalAmount, // total amount
      hotelId: booking.room.hotelId, // hotel ID
      roomId: booking.room.roomId, // room ID
      userId: booking.user.id, // user ID
    }));

    return { bookings }; // Return the formatted bookings
  } catch (error) {
    throw new Error('Error fetching bookings');
  }
};

// Function to get all bookings for a hotel
export const getBookingsForHotel = async (hotelId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotel/${hotelId}`);
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
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data.data; // Accessing response data as data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data || 'Something went wrong' };
    }
    return { error: 'Unexpected error occurred' };
  }
};
