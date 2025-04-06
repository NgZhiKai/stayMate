import axios from 'axios';

const API_BASE_URL = 'http://localhost:4200/rooms';  // Update with your actual backend URL

// Function to get available rooms for a specific hotel
export const getAvailableRooms = async (hotelId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/available/${hotelId}`);
    return response.data;  // Assuming the API returns an array of rooms
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    throw new Error("Failed to fetch available rooms");
  }
};