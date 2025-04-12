import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MessageModal from "../components/MessageModal";
import { getBookingById } from "../services/bookingApi";
import { fetchHotelById } from "../services/hotelApi";
import { createAndProcessPayment, getPaymentsByBookingId } from "../services/paymentApi";
import { useNotificationContext } from "../contexts/NotificationContext"; // Import NotificationContext

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = location.state || {};

  const { refreshNotifications } = useNotificationContext(); // Access refreshNotifications from context

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
    <div className="flex justify-center items-center min-h-full bg-gray-100">
      <div className="w-full max-w-screen-md p-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Hotel Payment</h2>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">
              <div className="font-medium">Hotel:</div>
              <div>{hotelDetails.name}</div>

              <div className="font-medium">Total Amount:</div>
              <div>${totalAmount.toFixed(2)}</div>

              <div className="font-medium">Already Paid:</div>
              <div>${amountAlreadyPaid.toFixed(2)}</div>

              <div className="font-medium text-red-600">Outstanding:</div>
              <div className="text-red-600 font-semibold">${remainingAmount.toFixed(2)}</div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Amount You’re Paying Now</label>
            <input
              type="text"
              placeholder="Enter payment amount"
              value={amountPaidNow}
              onChange={handleAmountChange}
              className="w-full p-2 border rounded"
            />
            {amountError && <p className="text-red-600 text-sm mt-1">{amountError}</p>}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Card Details</h3>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              onClick={handlePayment}
              disabled={isLoading || !!amountError}
              className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition hover:scale-105"
            >
              {isLoading ? "Processing..." : "Confirm Payment"}
            </button>
          </div>

          <MessageModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            message={modalMessage}
            type={modalType}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
