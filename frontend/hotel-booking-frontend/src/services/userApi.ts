import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { LoginData, RegisterData, User } from '../types/User';

// Base URL for the API
const API_BASE_URL = `${BASE_URL}/users`;

// Register a new user
export const registerUser = async (userData: RegisterData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
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
      const response = await fetch(`${API_BASE_URL}/login`, {
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

  export const getAllUsers = async (): Promise<{ users: User[] }> => {
    try {
      // Make a request to fetch all users
      const response = await fetch(`${API_BASE_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (response.ok && data?.data) {
        return { users: data.data };  // Return users array
      } else {
        throw new Error(data?.message || "No users found.");
      }
    } catch (err) {
      throw new Error("An error occurred while fetching user information. Please try again.");
    }
  };  

  export const getUserInfo = async (userId: string) => {
    try {
      // Make a request to fetch user information based on userId
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (response.ok && data?.data) {
        return { user: data.data };
      } else {
        throw new Error(data?.message || "User not found.");
      }
    } catch (err) {
      throw new Error("An error occurred while fetching user information. Please try again.");
    }
  };

  // API call to fetch user by email
export const getUserByEmail = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/by-email/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data?.data) {
      return { user: data.data };
    } else {
      throw new Error(data?.message || 'User not found.');
    }
  } catch (err) {
    throw new Error('An error occurred while fetching user information. Please try again.');
  }
};

export const updateUser = async (id: string, userData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok && data?.data) {
      return { user: data.data };
    } else {
      throw new Error(data?.message || "Failed to update user.");
    }
  } catch (err) {
    throw new Error("An error occurred while updating user information. Please try again.");
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response status is 204 (No Content)
    if (response.status === 204) {
      return { message: "User deleted successfully." };
    } else {
      const data = await response.json();
      throw new Error(data?.message || "Failed to delete user.");
    }
  } catch (err) {
    throw new Error("An error occurred while deleting the user. Please try again.");
  }
};

export const verifyUser = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  const message = await response.text();

  if (response.ok) {
    return message;
  } else {
    throw new Error(message);
  }
};

