import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPaymentsByUserId } from "../services/paymentApi"; // Make sure this is the correct path
import { Payment } from "../types/Payment"; // Assumes you have a Payment type defined
import { CreditCard } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const MyPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      const storedUserId = sessionStorage.getItem("userId");

      if (!storedUserId) {
        setLoading(false);
        return;
      }

      try {
        const userId = Number(storedUserId);
        setLoading(true);
        const data = await getPaymentsByUserId(userId);

        if (Array.isArray(data)) {
          // No filtering, just use all payments
          setPayments(data);
        } else {
          setPayments([]);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
  const currentPayments = payments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleMakePayment = (paymentId: number) => {
    // You can implement a specific page for payment if necessary
    navigate(`/payment/${paymentId}`);
  };

  if (loading) return <div className="p-6 text-white">Loading payments...</div>;

  return (
    <div className="bg-gray-900 min-h-full py-8 px-4 sm:px-6 lg:px-12">
      <h2 className="text-gray-100 text-3xl font-semibold text-center mb-8">My Payments</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.length === 0 && !loading ? (
          <p className="text-gray-500 text-center col-span-full">No payments found.</p>
        ) : (
          currentPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between gap-4 p-4 rounded bg-gray-800 text-sm">
              <div className="flex items-center gap-3">
                <CreditCard size={20} />
                <span><strong>Booking:</strong> {payment.bookingId}</span>
                <span><strong>Amount:</strong> ${payment.amount.toFixed(2)}</span>
                <span className="flex items-center gap-1 text-sm">
                  <strong>Status:</strong>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      payment.status === "SUCCESS"
                        ? "bg-green-200 text-green-800"
                        : payment.status === "FAILURE"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(payment.transactionDate).toLocaleString()}
              </div>
              <button
                onClick={() => handleMakePayment(payment.id)}
                className="text-blue-500 hover:text-blue-300"
              >
                Make Payment
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-4 items-center gap-2">
        {payments.length > 0 && (
          <>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
              }`}
            >
              &lt;
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
              }`}
            >
              &gt;
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPaymentsPage;
