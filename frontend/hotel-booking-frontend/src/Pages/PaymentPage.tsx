import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotel, checkInDate, checkOutDate, totalPrice } = location.state || {};

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = () => {
    if (cardNumber && expiry && cvv) {
      alert("Payment successful!");
  
      // Save booking to localStorage (flatten hotel info)
      const bookings = JSON.parse(localStorage.getItem("bookedHotels") || "[]");
      bookings.push({
        id: Date.now().toString(),
        name: hotel?.name ?? "Unnamed Hotel",
        image: hotel?.image ?? "/images/default.jpg",
        checkInDate,
        checkOutDate,
        totalPrice,
      });
      localStorage.setItem("bookedHotels", JSON.stringify(bookings));
  
      navigate("/booked-hotels");
    } else {
      alert("Please fill in all card details.");
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Enter Payment Details</h2>
      <p className="mb-4">Paying <strong>${totalPrice}</strong> for <strong>{hotel?.name}</strong></p>

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
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default PaymentPage;
