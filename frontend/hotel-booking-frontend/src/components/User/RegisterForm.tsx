import React, { useEffect, useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { RegisterData } from "../../types/User";
import MessageModal from "../MessageModal";

const RegisterForm: React.FC<{
  onRegister: (registerData: RegisterData) => void;
  error: string | null;
  registerData: RegisterData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}> = ({ onRegister, error, registerData, handleChange, confirmPassword, setConfirmPassword }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState<string>("");

  const handleModal = (open: boolean) => setIsModalOpen(open);

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordMinLength = 8;
    let errors: string[] = [];

    // Validate email
    if (!emailRegex.test(registerData.email)) {
      errors.push("Please enter a valid email address.");
    }

    // Validate password length
    if (registerData.password.length < passwordMinLength) {
      errors.push(`Password must be at least ${passwordMinLength} characters long.`);
    }

    // Validate passwords match
    if (registerData.password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
      // Create a bullet point list of errors
      setValidationError(
        `<ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>`
      );
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Assuming onRegister is the function that will create the user account
      onRegister(registerData);
      setModalMessage("Verification email has been sent.\nYour account has been created successfully!"); // Both messages
      handleModal(true); // Open modal on success
    } else {
      setModalMessage(validationError || "There was an error with your registration.");
      handleModal(true); // Open modal if validation fails
    }
  };

  // Ensure modal message is updated based on error or validation error change
  useEffect(() => {
    if (validationError) {
      setModalMessage(validationError);
      handleModal(true); // Open modal when validation error is set
    } else if (error) {
      setModalMessage(error);
      handleModal(true); // Open modal when there's an error
    }
  }, [validationError, error]); // Dependency array ensures update when validationError or error change
  
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-8 w-full max-w-2xl mx-auto mt-12">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Sign Up</h2>
  
      {/* Success or Error Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => handleModal(false)}
        message={modalMessage}
        type={validationError || error ? "error" : "success"}
      />
  
      <div className="space-y-6 text-sm">
        {/* First and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={registerData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={registerData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            />
          </div>
        </div>
  
        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Phone Number</label>
            <PhoneInput
              country={'sg'}
              inputProps={{
                required: true,
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200",
              }}
              buttonClass="text-sm"
              containerClass="relative flex justify-end"
              value={registerData.phoneNumber}
              onChange={(value: string) =>
                handleChange({
                  target: { name: 'phoneNumber', value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            />
          </div>
        </div>
  
        {/* Password and Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            />
          </div>
        </div>
  
        {/* Register Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
        >
          Register
        </button>
      </div>
    </div>
  );  
};

export default RegisterForm;
