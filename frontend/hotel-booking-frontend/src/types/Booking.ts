export interface Booking {
    userId: number;
    hotelId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
}

export interface DetailedBooking {
    id: number;
    bookingId: number;
    bookingDate: string;
    checkInDate: string;
    checkOutDate: string;
    status: 'CANCELLED' | 'CONFIRMED' | 'PENDING'; 
    totalAmount: number; 
    hotelId: number; 
    roomId: number; 
    userId: number;  
    userFirstName: string;
    userLastName: string;
    hotelName: string;
    roomType: string;
}