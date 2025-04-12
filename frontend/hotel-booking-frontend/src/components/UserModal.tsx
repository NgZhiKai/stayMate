import React, { useState, useEffect } from "react";
import { User } from "../types/User";

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  currentUser: User | null;
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [user, setUser] = useState<User | null>(currentUser);

  useEffect(() => {
    if (currentUser) {
      setUser({
        ...currentUser,
        role: currentUser.role === "CUSTOMER" ? "USER" : currentUser.role,
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedUser = {
        ...user,
        role: user.role === "USER" ? "CUSTOMER" : user.role,
      };
      onSubmit(updatedUser);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
        <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-md p-6 relative">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl leading-none"
            onClick={onClose}
            aria-label="Close Modal"
          >
            &times;
          </button>

          <h2 className="text-2xl font-semibold mb-6 text-center">
            {currentUser ? "Edit User" : "Create User"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={user?.firstName || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={user?.lastName || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user?.email || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1">Account Type</label>
              <input
                type="text"
                name="role"
                value={user?.role || ""}
                disabled
                className="w-full p-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={user?.phoneNumber || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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
