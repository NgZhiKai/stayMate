export interface Booking {
    userId: number;
    hotelId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
}

export interface DetailedBooking {
    bookingId: number;
    hotelId: number;
    roomId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    checkInDate: string;
    checkOutDate: string;
    roomType: string;
    status: string;
  }