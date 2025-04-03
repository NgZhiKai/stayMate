import React, { useState, useEffect  } from "react";

const UserAccountSettings = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ✅ Load toggle state from localStorage on mount
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(() => {
    const savedState = localStorage.getItem("settingsOpen");
    return savedState ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    // ✅ Save to localStorage whenever isSettingsOpen changes
    localStorage.setItem("settingsOpen", JSON.stringify(isSettingsOpen));
  }, [isSettingsOpen]);
  

  const handleEmailChange = () => {
    if (newEmail.trim() !== "") {
      setEmail(newEmail);
      setNewEmail("");
      alert("Email updated successfully!");
    }
  };

  const handlePasswordChange = () => {
    if (currentPassword && newPassword) {
      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deleted.");
      // Call API to delete account
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>

      {/* User Info */}
      <div className="mb-6">
        <label className="block text-gray-700">Name</label>
        <p className="border px-3 py-2 rounded bg-gray-100">{name}</p>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700">Registered Email</label>
        <p className="border px-3 py-2 rounded bg-gray-100">{email}</p>
      </div>

      {/* Change Email */}
      <div className="mb-6">
        <label className="block text-gray-700">Change Email</label>
        <div className="flex space-x-2">
          <input
            type="email"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button
            onClick={handleEmailChange}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="mb-6">
        <label className="block text-gray-700">Change Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handlePasswordChange}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Change Password
        </button>
      </div>

      {/* Delete Account */}
      <div className="mt-6">
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default UserAccountSettings;
