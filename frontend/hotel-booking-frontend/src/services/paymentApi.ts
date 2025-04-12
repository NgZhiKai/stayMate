import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { Payment } from '../types/Payment';

const API_BASE_URL = `${BASE_URL}/payments`;

export interface PaymentRequest {
  bookingId: number;
  amount: number;
}

export const createAndProcessPayment = async (
  paymentRequest: PaymentRequest,
  paymentMethod: string
): Promise<string> => {
  try {
    const response = await axios.post<string>(
      API_BASE_URL,
      paymentRequest,
      {
        params: { paymentMethod },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error processing payment');
  }
};

export const getPaymentById = async (paymentId: number): Promise<Payment> => {
  try {
    const response = await axios.get<Payment>(`${API_BASE_URL}/${paymentId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error retrieving payment');
  }
};

export const getPaymentsByBookingId = async (bookingId: number): Promise<Payment[]> => {
  try {
    const response = await axios.get<{ data: Payment[] }>(`${API_BASE_URL}/booking/${bookingId}`);
    return response.data.data; // Return the data property inside the response
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error retrieving payments for booking');
  }
};


export const getPaymentsByUserId = async (userId: number): Promise<Payment[]> => {
  try {
    const response = await axios.get<{ data: any[] }>(`${API_BASE_URL}/user/${userId}`);
    
    const mappedPayments: Payment[] = response.data.data.map((p) => ({
      id: p.paymentId,
      bookingId: p.bookingId,
      amount: p.amountPaid,
      status: p.paymentStatus,
      transactionDate: p.paymentDateTime,
    }));

    return mappedPayments;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error retrieving payments for user');
  }
};

export const getAllPayments = async (): Promise<Payment[]> => {
  try {
    const response = await axios.get<{ data: any[] }>(`${API_BASE_URL}`);  // Adjust the endpoint as needed

    // Map the response data to the Payment type
    const mappedPayments: Payment[] = response.data.data.map((p) => ({
      id: p.paymentId,
      bookingId: p.bookingId,
      amount: p.amountPaid,
      status: p.paymentStatus,
      transactionDate: p.paymentDateTime,
    }));

    return mappedPayments;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Error retrieving all payments');
  }
};
