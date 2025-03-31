import axios from 'axios';
import { RegisterData, LoginData } from '../types/User';

const USER_API_BASE_URL = 'http://localhost:4200/users';

// Register a new user
export const registerUser = async (userData: RegisterData) => {
  try {
    const response = await axios.post(`${USER_API_BASE_URL}/register`, userData);
    return response.data; // Assuming the response will contain user data or a success message
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle known errors (e.g., 400, 401, etc.)
      throw new Error(error.response?.data?.message || 'Registration failed.');
    }
    throw new Error('An unknown error occurred during registration.');
  }
};

export const loginUser = async (loginData: LoginData) => {
    try {
      const response = await fetch(`${USER_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
  
      const data = await response.json();
  
      if (response.ok && data?.data?.user) {
        return { user: data.data.user, token: data.data.token };
      } else {
        throw new Error(data?.message || "Invalid credentials or account not found.");
      }
    } catch (err) {
      throw new Error("An error occurred during login. Please try again.");
    }
  };