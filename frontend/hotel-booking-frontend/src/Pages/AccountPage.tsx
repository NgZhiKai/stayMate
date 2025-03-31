import React, { useState } from "react";
import { LoginData, User } from "../types/User";
import { loginUser } from "../services/userApi"; // Import the login function from UserAPI

// Login form component
const LoginForm: React.FC<{
  onLogin: (loginData: LoginData) => void;
  error: string | null;
  loginData: LoginData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeTab: "customer" | "admin";
}> = ({ onLogin, error, loginData, handleChange, activeTab }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
    <h2 className="text-3xl font-semibold mb-6 text-center">
      {activeTab === "admin" ? "Admin Login" : "Customer Login"}
    </h2>
    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
    <div className="space-y-4">
      {["email", "password"].map((field) => (
        <div key={field}>
          <label className="block text-gray-700 font-medium mb-1">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type={field === "email" ? "email" : "password"}
            name={field}
            value={loginData[field as keyof LoginData]}
            onChange={handleChange}
            className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
      ))}
      <button
        onClick={() => onLogin(loginData)}
        className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Login
      </button>
      <div className="mt-4 text-center">
        <span>Don't have an account? </span>
        <a
          href="/register" // Adjust the link to your actual registration page
          className="text-blue-500 hover:text-blue-600 transition duration-300"
        >
          Register here
        </a>
      </div>
    </div>
  </div>
);

// Account details component
const AccountDetails: React.FC<{
  user: User;
  onLogout: () => void;
}> = ({ user, onLogout }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
    <h2 className="text-3xl font-semibold mb-6">Account Details</h2>
    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
    <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Role:</strong> {user.role === "ADMIN" ? "Administrator" : "Customer"}</p>
    <button
      onClick={onLogout}
      className="mt-4 w-full bg-red-500 text-white px-4 py-3 rounded-md hover:bg-red-600 transition duration-300"
    >
      Logout
    </button>
    {user.role === "ADMIN" && (
      <div className="mt-4">
        <h3 className="text-xl">Admin Panel</h3>
        <p>Manage users and content here.</p>
      </div>
    )}
    {user.role === "CUSTOMER" && (
      <div className="mt-4">
        <h3 className="text-xl">User Dashboard</h3>
        <p>View your bookings and account details here.</p>
      </div>
    )}
  </div>
);

const AccountPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "", role: "customer" });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"customer" | "admin">("customer");

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (loginData: LoginData) => {
    if (!loginData.email || !loginData.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const { user, token } = await loginUser(loginData); // Use the loginUser function from UserAPI
      localStorage.setItem("token", token); // Save JWT token
      setUser(user);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred during login. Please try again.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoginData({ email: "", password: "", role: "customer" }); // Reset role to "customer"
  };

  return (
    <div className="flex justify-center items-center min-h-full bg-gray-100">
      <div className="w-full max-w-screen-md p-6">
        {!user && (
          <div className="flex justify-center mb-6">
            {["customer", "admin"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as "customer" | "admin");
                  setLoginData((prevData) => ({ ...prevData, role: tab as "customer" | "admin" }));
                }}
                className={`px-4 py-2 mr-2 rounded-md text-white font-semibold ${activeTab === tab ? "bg-blue-500" : "bg-gray-300"}`}
              >
                {tab === "customer" ? "Customer Login" : "Admin Login"}
              </button>
            ))}
          </div>
        )}

        {user ? (
          <AccountDetails user={user} onLogout={handleLogout} />
        ) : (
          <LoginForm
            onLogin={handleLogin}
            error={error}
            loginData={loginData}
            handleChange={handleLoginChange}
            activeTab={activeTab}
          />
        )}
      </div>
    </div>
  );
};

export default AccountPage;
