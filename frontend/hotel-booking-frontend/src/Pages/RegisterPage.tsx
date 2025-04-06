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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "role") {
      setRegisterData((prevData) => ({
        ...prevData,
        [name]: value.toUpperCase() as "CUSTOMER" | "ADMIN",
      }));
    } else {
      setRegisterData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRegister = async (registerData: RegisterData) => {
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password || !registerData.phoneNumber) {
      setError("Please fill in all fields.");
      return;
    }

    if (registerData.role === "ADMIN" && !registerData.email.endsWith("@ncs.com.sg")) {
      setError("Only users with an ncs.com.sg email domain can register as Admin.");
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
        />
      </div>
    </div>
  );
};

export default RegisterPage;
