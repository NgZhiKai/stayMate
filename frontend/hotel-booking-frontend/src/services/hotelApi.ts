import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { HotelData } from '../types/Hotels';

// Base URL for the API
const API_BASE_URL = `${BASE_URL}/hotels`;

// Create a new hotel (with rooms)
export const createHotel = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      body: formData, // Send the FormData as the request body
    });

    const data = await response.json(); // Parse the response as JSON

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
export const updateHotel = async (id: number, formData: FormData) => {
  try {
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: formData, // Send FormData as the request body
    });

    const data = await response.json(); // Parse the response as JSON
    
    // Check if the response is OK and if the success message is present
    if (!response.ok || data.message !== 'Hotel updated successfully') {
      throw new Error('Failed to update hotel');
    }

    // Return the data or handle it as needed
    return data;
  } catch (error) {
    console.error("Error updating hotel:", error);
    throw new Error('An error occurred while updating the hotel. Please try again later.');
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

export const getHotelsNearby = async (latitude: number, longitude: number): Promise<HotelData[]> => {
  try {
    const response = await axios.get<HotelData[]>(`${API_BASE_URL}/hotels/nearby`, {
      params: {
        latitude,
        longitude
      }
    });

    // Return the list of hotels (HotelData objects) from the response
    return response.data;  // This is already an array of HotelData
  } catch (error) {
    console.error('Error fetching nearby hotels:', error);
    throw new Error('Unable to fetch nearby hotels');
  }
};


// Fetch multiple hotels by an array of hotel IDs
export const fetchHotelsByIds = async (hotelIds: number[]): Promise<HotelData[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bulk`, { hotelIds });
    return response.data.data; // Assuming the backend returns hotel list in `data`
  } catch (error) {
    console.error("Error fetching hotels by IDs:", error);
    throw new Error("Failed to fetch hotels by IDs");
  }
};
