import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../services/userApi";

const VerifyEmailPage: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenInput, setTokenInput] = useState<string>("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!tokenInput.trim()) {
      setIsSuccess(false);
      setMessage("Please enter a valid verification token.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await verifyUser(tokenInput);
      console.log("API response:", response);
      setIsSuccess(true);
      setMessage("Your email has been successfully verified! Redirecting to login...");

      setTimeout(() => navigate("/login"), 5000);
    } catch (error: any) {
      console.error("Verification error:", error);
      setIsSuccess(false);
      setMessage(error.message || "Verification failed. The token may be invalid or expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className={`text-2xl font-semibold mb-4 ${isSuccess ? "text-green-600" : isSuccess === false ? "text-red-600" : ""}`}>
          {isLoading ? "Verifying..." : isSuccess === null ? "Email Verification" : isSuccess ? "Success!" : "Verification Failed"}
        </h1>

        <p className="text-gray-700 mb-4">
          {isLoading
            ? "Please wait while we verify your email..."
            : message || "Enter your verification token below."}
        </p>

        {!isLoading && (
          <>
            <input
              type="text"
              placeholder="Enter token"
              className="w-full px-4 py-2 border rounded-md mb-4"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <button
              onClick={handleVerify}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Verify Email
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
