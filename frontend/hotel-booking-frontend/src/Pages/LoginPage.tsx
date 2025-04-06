import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import LoginForm from "../components/User/LoginForm"; // Ensure correct import path
import { loginUser } from "../services/userApi"; // Your API call for login
import { LoginData } from "../types/User"; // Ensure correct import path
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
    role: "customer", // Default to 'customer' role
  });
  const [error, setError] = useState<string | null>(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle input changes for email, password, and role
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle login logic (authentication)
  const handleLogin = async (loginData: LoginData) => {
    if (!loginData.email || !loginData.password) {
      setError("Please enter both email and password.");
      return;
    }
  
    try {
      const { user, token } = await loginUser(loginData); // Your login API call
      login(token, loginData.role, user.id);

      setError(null);
      navigate("/"); // Redirect after successful login
    } catch (err: any) {
      setError(err.message || "An error occurred during login. Please try again.");
    }
  };  

  return (
    <div className="flex justify-center items-center min-h-full bg-gray-100">
      <div className="w-full max-w-screen-md p-6">
        {/* Login Form - Always displayed with the current loginData */}
        <LoginForm
          onLogin={handleLogin}
          error={error}
          loginData={loginData}
          handleChange={handleLoginChange}
        />
      </div>
    </div>
  );
};

export default LoginPage;
