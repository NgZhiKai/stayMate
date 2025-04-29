import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginData } from "../../types/User";
import MessageModal from "../MessageModal";

interface LoginFormProps {
  onLogin: (loginData: LoginData) => void;
  error: string | null;
  loginData: LoginData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  error,
  loginData,
  handleChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsModalOpen(!!error);
  }, [error]);

  const closeModal = () => setIsModalOpen(false);

  const renderInputField = (field: keyof LoginData) => (
    <div key={field}>
      <label className="block text-gray-700 font-medium mb-1">
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </label>
      <input
        type={field === "email" ? "email" : "password"}
        name={field}
        value={loginData[field]}
        onChange={handleChange}
        className="w-full p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        required
      />
    </div>
  );

  const roles: ("customer" | "admin")[] = ["customer", "admin"];

  return (
    <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 w-full max-w-md mx-auto mt-20">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
        {loginData.role === "admin" ? "Admin Login" : "User Login"}
      </h2>
  
      {/* Error Modal */}
      {error && (
        <MessageModal
          isOpen={isModalOpen}
          message={error}
          onClose={closeModal}
          type="error"
        />
      )}
  
      {/* Role Toggle */}
      <div className="mb-8 flex justify-center border border-gray-200 rounded-lg overflow-hidden">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleChange({ target: { name: "role", value: role } } as React.ChangeEvent<HTMLInputElement>)}
            className={`flex-1 py-2 text-sm font-medium transition-colors duration-300 ${
              loginData.role === role
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {role === "admin" ? "Admin" : "User"}
          </button>
        ))}
      </div>
  
      {/* Form Fields */}
      <div className="space-y-6">
        {(["email", "password"] as (keyof LoginData)[]).map(renderInputField)}
  
        {/* Login Button */}
        <button
          onClick={() => onLogin(loginData)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
        >
          Login
        </button>
  
        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 font-medium hover:underline hover:text-blue-600 transition duration-300"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );  
  
};

export default LoginForm;
