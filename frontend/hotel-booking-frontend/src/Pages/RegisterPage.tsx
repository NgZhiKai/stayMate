import React, { useState } from "react";
import { RegisterData } from "../types/User";
import { registerUser } from "../services/userApi"; // Import the registerUser API function

// Register form component
const RegisterForm: React.FC<{
  onRegister: (registerData: RegisterData) => void;
  error: string | null;
  registerData: RegisterData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}> = ({ onRegister, error, registerData, handleChange }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
    <h2 className="text-3xl font-semibold mb-6 text-center">Create an Account</h2>
    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
    <div className="space-y-4">
      {/* First and Last Name in a single row */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-gray-700 font-medium mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={registerData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={registerData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
      </div>

      {/* Email and Phone Number in a single row */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={registerData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
      </div>

      {/* Password field */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={registerData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>

      {/* Role selection */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Role</label>
        <select
          name="role"
          value={registerData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          disabled={registerData.email.indexOf('@ncs.com.sg') === -1}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN" disabled={registerData.email.indexOf('@ncs.com.sg') === -1}>
            Admin
          </option>
        </select>
      </div>

      <button
        onClick={() => onRegister(registerData)}
        className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Register
      </button>
    </div>
  </div>
);

const RegisterPage: React.FC = () => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "CUSTOMER", // Default role set to uppercase
  });
  const [error, setError] = useState<string | null>(null);

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "role") {
      // Convert role to uppercase to match the backend enum
      setRegisterData((prevData) => ({
        ...prevData,
        [name]: value.toUpperCase() as "CUSTOMER" | "ADMIN", // Convert role to uppercase
      }));
    } else {
      setRegisterData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRegister = async (registerData: RegisterData) => {
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password || !registerData.phoneNumber) {
      setError("Please fill in all fields.");
      return;
    }

    if (registerData.role === "ADMIN" && !registerData.email.endsWith("@ncs.com.sg")) {
      setError("Only users with an ncs.com.sg email domain can register as Admin.");
      return;
    }

    try {
      const data = await registerUser(registerData); // Call the registerUser function from userApi

      if (data) {
        // Registration successful
        setError(null); // Clear any previous error
        alert("Registration successful! Please log in.");
        window.location.href = "/account"; // Redirect to login page
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-full bg-gray-100">
      <div className="w-full max-w-screen-md p-6">
        <RegisterForm
          onRegister={handleRegister}
          error={error}
          registerData={registerData}
          handleChange={handleRegisterChange}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
