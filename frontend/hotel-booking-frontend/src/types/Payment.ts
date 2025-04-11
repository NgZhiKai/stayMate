export interface Payment {
    id: number;
    bookingId: number;
    amount: number;
    paymentMethod: string;
    status: string;
    transactionDate: string;
    amountPaid: Number;
  }