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

  // Sync user state with currentUser prop when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUser({
        ...currentUser,
        role: currentUser.role === "CUSTOMER" ? "USER" : currentUser.role, // Set role to 'USER' if CUSTOMER
      });
    }
  }, [currentUser]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      // Change role to 'CUSTOMER' only if it is 'USER'
      const updatedUser = { ...user, role: user.role === "USER" ? "CUSTOMER" : user.role };
      onSubmit(updatedUser);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{currentUser ? "Edit User" : "Create User"}</h2>
            <span className="cursor-pointer text-gray-500 text-2xl" onClick={onClose}>&times;</span>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={user?.firstName || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={user?.lastName || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={user?.email || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <label className="block mb-2">Account Type</label>
            <input
              type="text"
              name="role"
              value={user?.role || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
              required
              disabled // Disable the field
            />
            <label className="block mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={user?.phoneNumber || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {currentUser ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserModal;
