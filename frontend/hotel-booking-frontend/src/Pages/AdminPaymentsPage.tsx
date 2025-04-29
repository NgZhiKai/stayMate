import React, { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { getAllPayments } from "../services/paymentApi";
import { Payment } from "../types/Payment";
import { getBookingById } from "../services/bookingApi";

const ITEMS_PER_PAGE = 5;

const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingDetails, setBookingDetails] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data);

        // Fetch booking details for each payment
        const bookingDetailsPromises = data.map(async (payment) => {
          const bookingData = await getBookingById(payment.bookingId);
          return { bookingId: payment.bookingId, bookingData };
        });

        const bookingResults = await Promise.all(bookingDetailsPromises);

        // Map booking details by payment's bookingId
        const bookingMap: { [key: number]: any } = {};
        bookingResults.forEach((result) => {
          bookingMap[result.bookingId] = result.bookingData;
        });
        setBookingDetails(bookingMap);
      } catch (err: any) {
        setError("Failed to fetch payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
      <h1 className="text-2xl mb-4">All Payments</h1>

      {currentPayments.length === 0 ? (
        <div>No payments found.</div>
      ) : (
        <ul className="space-y-4">
          {currentPayments.map((payment) => {
            const booking = bookingDetails[payment.bookingId];
            return (
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
                  {formatDate(payment.transactionDate)}
                </div>
                {booking && (
                  <div className="mt-2 text-sm text-gray-400">
                    <p><strong>Check-In Date:</strong> {formatDate(booking.checkInDate)}</p>
                    <p><strong>Check-Out Date:</strong> {formatDate(booking.checkOutDate)}</p>
                  </div>
                )}
              </li>
            );
          })}
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

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              );
            })
            .reduce<(number | string)[]>((acc, page, index, pages) => {
              if (index > 0 && (page as number) - (pages[index - 1] as number) > 1) {
                acc.push('...');
              }
              acc.push(page);
              return acc;
            }, [])
            .map((item, index) => (
              <button
                key={index}
                onClick={() => typeof item === 'number' && goToPage(item)}
                disabled={item === '...'}
                className={`px-3 py-1 rounded ${
                  item === currentPage
                    ? 'bg-blue-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                } ${item === '...' && 'cursor-default text-gray-400'}`}
              >
                {item}
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

export default AdminPaymentsPage;
