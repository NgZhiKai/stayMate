import React, { useState } from "react";

const AccountPage: React.FC = () => {
  // Simulating login state (replace with real authentication logic)
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Handle input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Simulated login function
  const handleLogin = () => {
    if (loginData.email && loginData.password) {
      setUser({ name: "John Doe", email: loginData.email }); // Mock user login
    }
  };

  // Logout function
  const handleLogout = () => {
    setUser(null); // Clears user state
    setLoginData({ email: "", password: "" });
  };

  return (
    <div className="p-6 bg-white shadow-md w-full min-h-screen">
      {user ? (
        // ✅ Show Account Details if User is Logged In
        <div>
          <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        // ✅ Show Login Form if No User is Logged In
        <div className="w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="w-full p-2 border rounded mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full p-2 border rounded mt-1"
              />
            </div>

            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
