import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getBookingById } from "../services/bookingApi";
import { fetchHotelById } from "../services/hotelApi";
import { createAndProcessPayment, getPaymentsByBookingId } from "../services/paymentApi";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = location.state || {};

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [amountPaidNow, setAmountPaidNow] = useState<number>(0);
  const [amountAlreadyPaid, setAmountAlreadyPaid] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [amountError, setAmountError] = useState("");

  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [hotelDetails, setHotelDetails] = useState<any>(null);

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
      alert("Please fill in all fields correctly.");
      return;
    }

    setIsLoading(true);
    try {
      // Assuming PaymentRequest requires the 'amount' field
      const paymentRequest = {
        bookingId,
        amount: amountPaidNow,  // 'amount' instead of 'paymentAmount'
      };

      // Call the API to process the payment
      const paymentResult = await createAndProcessPayment(paymentRequest, "CREDIT_CARD");

      setPaymentStatus(paymentResult);
      navigate("/bookings");
    } catch (error: any) {
      setPaymentStatus(`Payment failed: ${error.message}`);
      console.error("Payment error:", error);
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
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Hotel Payment</h2>

      <p className="mb-2 text-gray-800">
        Hotel: <strong>{hotelDetails.name}</strong>
      </p>
      <p className="text-gray-800">
        Total Amount Due: <strong>${totalAmount.toFixed(2)}</strong>
      </p>
      <p className="text-gray-800">
        Already Paid: <strong>${amountAlreadyPaid.toFixed(2)}</strong>
      </p>
      <p className="mb-4 text-gray-800">
        Outstanding: <strong>${remainingAmount.toFixed(2)}</strong>
      </p>

      {/* New Payment Input */}
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

      {/* Card Info */}
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition hover:scale-105"
        >
          {isLoading ? "Processing..." : "Confirm Payment"}
        </button>
      </div>

      {paymentStatus && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
          {paymentStatus}
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
