import axios from 'axios';

import { BASE_URL } from '../constants/constants';

// Base URL for the API
const API_BASE_URL = `${BASE_URL}/rooms`;

// Function to get available rooms for a specific hotel
export const getHotelRooms = async (hotelId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${hotelId}`);
    return response.data;  // Assuming the API returns an array of rooms
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    throw new Error("Failed to fetch available rooms");
  }
};

export const getAvailableRooms = async (
  hotelId: number, 
  checkInDate: string, 
  checkOutDate: string
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/available-rooms`, {
      params: {
        hotelId,
        checkInDate,
        checkOutDate,
      },
    });
    return response.data;  // Assuming the API returns a list of available rooms
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    throw new Error("Failed to fetch available rooms");
  }
};