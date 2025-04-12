export interface Payment {
    id: number;
    bookingId: number;
    amount: number;
    status: string;
    transactionDate: string;
    paymentMethod?: string;
    amountPaid?: number;
  }