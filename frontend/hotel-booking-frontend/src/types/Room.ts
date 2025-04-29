export interface Room {
  room_type: string;
  id: {
    hotelId: number;
    roomId: number;
  };
  pricePerNight: number;
  maxOccupancy: number;
  status: string;
}

export interface RoomRequestDTO {
  roomType: string;       // Type of room (e.g., "Single", "Double", etc.)
  pricePerNight: number;  // Price per night
  maxOccupancy: number;   // Max number of people allowed in the room
  quantity: number;       // Quantity of available rooms of this type
}
