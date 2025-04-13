import React, { useEffect, useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { User } from "../types/User";

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  currentUser: User | null;
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    role: "USER",
    phoneNumber: "",
    id: 0,
  });
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  // Reset form when the modal is closed or when `currentUser` changes
  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setUser({
          ...currentUser,
          role: currentUser.role === "CUSTOMER" ? "USER" : currentUser.role,
        });
      } else {
        setUser({
          firstName: "",
          lastName: "",
          email: "",
          role: "USER",
          phoneNumber: "",
          id: 0,
        });
        setPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setNameError("");
      }
    }
  }, [isOpen, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    name === "password" ? setPassword(value) : setConfirmPassword(value);
  };

  // Prevent non-letter characters for first and last name and set error message
  const handleNameInput = (e: React.FormEvent<HTMLInputElement>, name: 'firstName' | 'lastName') => {
    const value = e.currentTarget.value;
    const regex = /^[a-zA-Z ]*$/; // Allow letters and spaces only
    if (regex.test(value)) {
      setUser({ ...user, [name]: value });
      setNameError(""); // Clear error if valid input
    } else {
      setNameError("Names can only contain letters and spaces.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match!");
        return;
      }

      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
        return;
      }
    }

    if (nameError) {
      return; // Prevent submission if there's a name error
    }

    setPasswordError("");

    const updatedUser = {
      ...user,
      role: user.role === "USER" ? "CUSTOMER" : user.role,
      ...(currentUser ? {} : { password, confirmPassword }),
    };

    onSubmit(updatedUser);
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition";

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
        <div className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
            onClick={onClose}
            aria-label="Close Modal"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-center mb-6">
            {currentUser ? "Edit User" : "Create User"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onInput={(e) => handleNameInput(e, 'firstName')}
                  className={inputClass}
                  required
                />
                {nameError && <div className="text-red-400 text-sm">{nameError}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onInput={(e) => handleNameInput(e, 'lastName')}
                  className={inputClass}
                  required
                />
                {nameError && <div className="text-red-400 text-sm">{nameError}</div>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <PhoneInput
                country={'sg'}
                inputClass="!w-full !bg-gray-700 !text-white !border-gray-600 !rounded-md !px-3 !py-2 !placeholder-transparent"
                buttonClass="!bg-gray-700 !border-gray-600"
                containerClass="w-full relative flex justify-end"
                value={user.phoneNumber}
                onChange={(value: string) =>
                  handleChange({ target: { name: 'phoneNumber', value } } as React.ChangeEvent<HTMLInputElement>)
                }
              />
            </div>

            {!currentUser && (
              <div>
                <label className="block text-sm font-medium mb-1">Account Type</label>
                <select
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}

            {!currentUser && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handlePasswordChange}
                    className={inputClass}
                    required
                  />
                </div>
              </>
            )}

            {passwordError && (
              <div className="text-red-400 text-sm">{passwordError}</div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-600 text-white hover:bg-gray-700 transition-transform transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105"
              >
                {currentUser ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserModal;
