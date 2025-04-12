import React, { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { getPaymentsByUserId } from "../services/paymentApi"; // make sure this is the correct path
import { Payment } from "../types/Payment"; // assumes you have a Payment type defined

const ITEMS_PER_PAGE = 5;

const MyPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPayments = async () => {
      const storedUserId = sessionStorage.getItem("userId");

      if (!storedUserId) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      try {
        const userId = Number(storedUserId);
        const data = await getPaymentsByUserId(userId);
        console.log(data);
        setPayments(data);
      } catch (err: any) {
        setError("Failed to fetch payments.");
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

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading payments...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-full">
      <h1 className="text-2xl mb-4">My Payments</h1>

      {currentPayments.length === 0 ? (
        <div>No payments found.</div>
      ) : (
        <ul className="space-y-4">
          {currentPayments.map((payment) => (
            <li
              key={payment.id}
              className="flex items-center justify-between gap-4 p-4 rounded bg-gray-800 text-sm"
            >
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
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPaymentsPage;
