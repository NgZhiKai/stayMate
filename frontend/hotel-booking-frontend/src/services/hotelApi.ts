import axios from 'axios';
import { Hotel, HotelManagement } from '../types/Hotels';

// Base URL for the API
const API_BASE_URL = 'http://localhost:4200/hotels';

// Create a new hotel (with rooms)
export const createHotel = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      body: formData, // Send the FormData as the request body
    });

    const data = await response.json(); // Parse the response as JSON

    console.log(data);

    // Check if the response is OK and if the success message is present
    if (!response.ok || data.message !== 'Hotel created successfully') {
      throw new Error('Failed to create hotel');
    }

    // Return the data or handle it as needed
    return data;
  } catch (error) {
    console.error('Error creating hotel:', error);
    throw new Error('An error occurred while creating the hotel. Please try again later.');
  }
};

// Fetch all hotels
export const fetchHotels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data.data; // Return the actual list of hotels from the `data` field
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw error;
  }
};

// Fetch hotel by ID
export const fetchHotelById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data.data; // Ensure you're returning the `data` field
  } catch (error) {
    console.error("Error fetching hotel by ID:", error);
    throw error;
  }
};

// Update hotel details
export const updateHotel = async (id: number, hotelData: HotelManagement) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, hotelData);
    return response.data; // Return the updated hotel details
  } catch (error) {
    console.error("Error updating hotel:", error);
    throw error;
  }
};

// Delete hotel by ID
export const deleteHotel = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data; // Return success message from the response
  } catch (error) {
    console.error("Error deleting hotel:", error);
    throw error;
  }
};

// Search hotels by name
export const searchHotelsByName = async (name: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, { params: { name } });
    return response.data.data; // Return the list of hotels from the `data` field
  } catch (error) {
    console.error("Error searching hotels by name:", error);
    throw error;
  }
};
