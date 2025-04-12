import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyUser } from "../services/userApi";

const VerifyEmailPage: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const verify = async () => {
      if (!token) {
        setIsSuccess(false);
        setMessage("Invalid verification link.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await verifyUser(token);
        console.log("API response:", response);
        setIsSuccess(true);
        setMessage("Your email has been successfully verified! Redirecting to login...");
      } catch (error: any) {
        console.error("Verification error:", error);
        setIsSuccess(false);
        setMessage(error.message || "Verification failed. The link may be invalid or expired.");
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className={`text-2xl font-semibold mb-4 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {isLoading ? "Verifying..." : isSuccess ? "Success!" : "Verification Failed"}
        </h1>
        <p className="text-gray-700">
          {isLoading ? "Please wait while we verify your email..." : message}
        </p>

        {/* Show button to go to login page */}
        {!isLoading && (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
