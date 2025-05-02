import { CreditCard } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getPaymentsByUserId } from "../services/paymentApi";
import { Payment } from "../types/Payment";

const ITEMS_PER_PAGE = 5;

const MyPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

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
        setPayments(Array.isArray(data) ? data : []);
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
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (loading) return <div className="p-6 text-white">Loading payments...</div>;

  return (
    <div className="bg-gray-900 min-h-full py-8 px-4 sm:px-6 lg:px-12">
      <h2 className="text-gray-100 text-3xl font-semibold text-center mb-8">My Payments</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.length === 0 && !loading ? (
          <p className="text-gray-500 text-center col-span-full">No payments found.</p>
        ) : (
          currentPayments.map((payment) => (
            <div
              key={payment.id}
              className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 shadow-lg text-gray-200 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <CreditCard size={28} className="text-blue-400" />
                <div>
                  <div className="text-lg font-semibold">Booking #{payment.bookingId}</div>
                  <div className="text-sm text-gray-400">{new Date(payment.transactionDate).toLocaleString()}</div>
                </div>
              </div>

              <div className="flex justify-between text-base font-medium">
                <span>Amount</span>
                <span className="text-blue-300">${payment.amount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-medium">
                <span>Status</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    payment.status === "SUCCESS"
                      ? "bg-green-200 text-green-800"
                      : payment.status === "FAILURE"
                      ? "bg-red-200 text-red-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {payments.length > 0 && (
        <div className="flex justify-center mt-6 items-center gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500 transition"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-200 transition"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500 transition"
            }`}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPaymentsPage;
