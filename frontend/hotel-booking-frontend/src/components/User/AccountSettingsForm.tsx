import React, { useState } from "react";
import MessageModal from "../MessageModal"; // import the MessageModal component

type AccountSettingsFormProps = {
  userInfo: { name: string; email: string; phoneNumber: string; role: string };
  newEmail: string;
  setNewEmail: React.Dispatch<React.SetStateAction<string>>;
  passwords: { currentPassword: string; newPassword: string };
  setPasswords: React.Dispatch<React.SetStateAction<{ currentPassword: string; newPassword: string }>>;
  handleEmailChange: () => void;
  handlePasswordChange: () => void;
  handleDeleteAccount: () => void;
};

const AccountSettingsForm: React.FC<AccountSettingsFormProps> = ({
  userInfo,
  newEmail,
  setNewEmail,
  passwords,
  setPasswords,
  handleEmailChange,
  handlePasswordChange,
  handleDeleteAccount,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  // single error message
  const [isModalOpen, setIsModalOpen] = useState(false); // control modal visibility

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 8;
  };

  const handleEmailSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);

    if (!isValidEmail(newEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setIsModalOpen(true); // Show the modal for email error
      setLoading(false);
      return;
    }

    try {
      await handleEmailChange();
    } catch (err) {
      setErrorMessage("Failed to update email. Please try again.");
      setIsModalOpen(true); // Show the modal for error
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);

    if (!isValidPassword(passwords.newPassword)) {
      setErrorMessage("Password must be at least 8 characters long.");
      setIsModalOpen(true); // Show the modal for password error
      setLoading(false);
      return;
    }

    try {
      await handlePasswordChange();
    } catch (err) {
      setErrorMessage("Failed to change password. Please try again.");
      setIsModalOpen(true); // Show the modal for error
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>

      {/* Personal Info */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm">Name</label>
        <p className="border px-2 py-1 rounded bg-gray-100 text-sm">{userInfo.name}</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm">Registered Email</label>
        <p className="border px-2 py-1 rounded bg-gray-100 text-sm">{userInfo.email}</p>
      </div>

      {/* Change Email */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm">Change Email</label>
        <div className="flex items-center space-x-2">
          <input
            type="email"
            className="w-full border px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button
            onClick={handleEmailSubmit}
            disabled={loading}
            className={`bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm">Change Password</label>
        <input
          type="password"
          className="w-full border px-2 py-1 text-sm rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Current password"
          value={passwords.currentPassword}
          onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
        />
        <input
          type="password"
          className="w-full border px-2 py-1 text-sm rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New password"
          value={passwords.newPassword}
          onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
        />
        <button
          onClick={handlePasswordSubmit}
          disabled={loading}
          className={`bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </div>

      {/* Delete Account */}
      <div className="mt-4 text-center">
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>

      {/* Message Modal for Errors */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={errorMessage || ""}
        type="error"
      />
    </div>
  );
};

export default AccountSettingsForm;
