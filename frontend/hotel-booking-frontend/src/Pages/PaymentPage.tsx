import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MessageModal from "../components/MessageModal";
import { useNotificationContext } from "../contexts/NotificationContext";
import { getBookingById } from "../services/bookingApi";
import { fetchHotelById } from "../services/hotelApi";
import { createAndProcessPayment, getPaymentsByBookingId } from "../services/paymentApi";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = location.state || {};

  const { refreshNotifications } = useNotificationContext();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [amountPaidNow, setAmountPaidNow] = useState<number>(0);
  const [amountAlreadyPaid, setAmountAlreadyPaid] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [amountError, setAmountError] = useState("");

  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [hotelDetails, setHotelDetails] = useState<any>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId) {
        navigate("/bookings");
        return;
      }

      try {
        const booking = await getBookingById(bookingId);
        setBookingDetails(booking);

        const hotel = await fetchHotelById(booking.hotelId);
        setHotelDetails(hotel);

        try {
          const payments = await getPaymentsByBookingId(bookingId);
          const totalPaid = payments?.length
            ? payments.reduce((sum, payment) => sum + Number(payment.amountPaid), 0)
            : 0;
          setAmountAlreadyPaid(totalPaid);
        } catch (paymentError) {
          console.warn("No payments found or error retrieving payments:", paymentError);
          setAmountAlreadyPaid(0);
        }
      } catch (error) {
        console.error("Error fetching booking/hotel info:", error);
        navigate("/bookings");
      }
    };

    fetchData();
  }, [bookingId, navigate]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmountPaidNow(value);

    if (value < 0) {
      setAmountError("Amount cannot be negative.");
    } else if (value > remainingAmount) {
      setAmountError("Amount exceeds the outstanding balance.");
    } else if (value === 0) {
      setAmountError("Amount must be greater than zero.");
    } else {
      setAmountError("");
    }
  };

  const handlePayment = async () => {
    if (!bookingId || !amountPaidNow || !cardNumber || !expiry || !cvv || amountError) {
      setModalType("error");
      setModalMessage("Please fill in all fields correctly.");
      setModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const paymentRequest = {
        bookingId,
        amount: amountPaidNow,
      };

      await createAndProcessPayment(paymentRequest, "CREDIT_CARD");

      setModalType("success");
      setModalMessage("Payment successful!");
      setModalOpen(true);

      // Refresh notifications after payment success
      refreshNotifications();

      setTimeout(() => {
        setModalOpen(false);
        navigate("/bookings");
      }, 2000);
    } catch (error: any) {
      console.error("Payment error:", error);
      setModalType("error");
      setModalMessage(`Payment failed: ${error.message}`);
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!bookingDetails || !hotelDetails) {
    return <div className="text-center mt-10">Loading booking details...</div>;
  }

  const totalAmount = bookingDetails.totalAmount;
  const remainingAmount = totalAmount - amountAlreadyPaid;

  return (
    <div className="flex justify-center items-center min-h-full bg-gray-100 py-12 px-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg space-y-6">
        {/* Payment Header */}
        <h2 className="text-3xl font-bold text-gray-800">Hotel Payment</h2>
  
        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">
            <div className="font-medium">Hotel:</div>
            <div className="text-gray-800">{hotelDetails.name}</div>
  
            <div className="font-medium">Total Amount:</div>
            <div className="text-gray-800">${totalAmount.toFixed(2)}</div>
  
            <div className="font-medium">Already Paid:</div>
            <div className="text-gray-800">${amountAlreadyPaid.toFixed(2)}</div>
  
            <div className="font-medium text-red-600">Outstanding:</div>
            <div className="text-red-600 font-semibold">${remainingAmount.toFixed(2)}</div>
          </div>
        </div>
  
        {/* Amount You’re Paying Now */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Amount You’re Paying Now</label>
          <input
            type="text"
            placeholder="Enter payment amount"
            value={amountPaidNow}
            onChange={handleAmountChange}
            className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {amountError && <p className="text-red-600 text-sm mt-2">{amountError}</p>}
        </div>
  
        {/* Card Details Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Card Details</h3>
  
          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
  
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>
  
        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading || !!amountError}
          className="w-full py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          {isLoading ? "Processing..." : "Confirm Payment"}
        </button>
  
        {/* Modal for Payment Feedback */}
        <MessageModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          message={modalMessage}
          type={modalType}
        />
      </div>
    </div>
  );
  
};

export default PaymentPage;
