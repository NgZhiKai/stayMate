import React, { useState, useEffect } from "react";
import { RegisterData } from "../../types/User";
import MessageModal from "../MessageModal";
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

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

  const inputProps = "w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300";

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Create an Account</h2>

      {/* Success or Error Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => handleModal(false)}
        message={modalMessage}
        type={validationError || error ? "error" : "success"} // Show 'error' type if there's an error
      />

      <div className="space-y-4">
        {/* First and Last Name in a 2-column layout */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={registerData.firstName}
              onChange={handleChange}
              className={inputProps}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={registerData.lastName}
              onChange={handleChange}
              className={inputProps}
            />
          </div>
        </div>

        {/* Email and Phone Number in a 2-column layout */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleChange}
              className={inputProps}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <PhoneInput
              country={'sg'}
              inputProps={{ required: true, className: inputProps }}
              buttonClass="text-sm"
              containerClass="relative flex justify-end"
              value={registerData.phoneNumber}
              onChange={(value: string) => handleChange({ target: { name: 'phoneNumber', value } } as React.ChangeEvent<HTMLInputElement>)}
            />
          </div>
        </div>

        {/* Password and Confirm Password side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleChange}
              className={inputProps}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputProps}
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Account Type</label>
          <select
            name="role"
            value={registerData.role}
            onChange={handleChange}
            className={inputProps}
            disabled={registerData.email.indexOf('@ncs.com.sg') === -1}
          >
            <option value="CUSTOMER">User</option>
            <option value="ADMIN" disabled={registerData.email.indexOf('@ncs.com.sg') === -1}>Admin</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition hover:scale-105 duration-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
