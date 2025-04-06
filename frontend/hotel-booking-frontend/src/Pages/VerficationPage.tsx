import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyUser } from "../services/userApi";

const VerifyEmailPage: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const verify = async () => {
      if (!token) {
        setIsSuccess(false);
        setMessage("Invalid verification link.");
        return;
      }

      try {
        await verifyUser(token);
        setIsSuccess(true);
        setMessage("Your email has been successfully verified! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } catch (error: any) {
        console.error("Verification error:", error);

        setIsSuccess(false);

        setMessage(error.message || "Verification failed. The link may be invalid or expired.");
      }
    };

    verify();
  }, [location.search, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className={`text-2xl font-semibold mb-4 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {isSuccess ? "Success!" : "Verification Failed"}
        </h1>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
