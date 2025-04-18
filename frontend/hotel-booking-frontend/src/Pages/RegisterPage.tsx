import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterData } from "../types/User";
import RegisterForm from "../components/User/RegisterForm";
import { registerUser } from "../services/userApi";

const RegisterPage: React.FC = () => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "CUSTOMER", // Default role set to uppercase
  });
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (registerData: RegisterData) => {
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password || !registerData.phoneNumber) {
      setError("Please fill in all fields.");
      return;
    }

    // Check if the passwords match
    if (registerData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const data = await registerUser(registerData);

      if (data) {
        setError(null);
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-full bg-gray-100">
      <div className="w-full max-w-screen-md p-6">
        <RegisterForm
          onRegister={handleRegister}
          error={error}
          registerData={registerData}
          handleChange={handleRegisterChange}
          confirmPassword={confirmPassword} // Pass confirmPassword state
          setConfirmPassword={setConfirmPassword} // Pass setConfirmPassword function
        />
      </div>
    </div>
  );
};

export default RegisterPage;
