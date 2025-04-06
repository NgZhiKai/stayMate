import React, { useState, useEffect } from "react";
import MessageModal from "../MessageModal";
import { LoginData } from "../../types/User";

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

  const renderRoleButton = (role: "customer" | "admin") => (
    <button
      key={role}
      onClick={() => handleChange({ target: { name: "role", value: role } } as React.ChangeEvent<HTMLInputElement>)}
      className={`w-1/2 py-2 text-center font-medium text-gray-700 border-b-2 ${
        loginData.role === role ? "border-blue-500" : "border-transparent"
      } hover:border-blue-500 transition duration-300`}
    >
      {role === "customer" ? "User" : role.charAt(0).toUpperCase() + role.slice(1)}
    </button>
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-6">
        {loginData.role === "admin" ? "Admin Login" : "User Login"}
      </h2>

      {/* Modal for Error Message */}
      {error && <MessageModal isOpen={isModalOpen} message={error} onClose={closeModal} type="error" />}

      {/* Role selection tabs */}
      <div className="mb-6 flex border-b border-gray-300">
        {roles.map(renderRoleButton)}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {(["email", "password"] as (keyof LoginData)[]).map(renderInputField)}

        <button
          onClick={() => onLogin(loginData)}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <span>Don't have an account? </span>
          <a href="/register" className="text-blue-500 hover:text-blue-600 transition duration-300">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
