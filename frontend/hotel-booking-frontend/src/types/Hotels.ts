import { Room, RoomRequestDTO } from './Room';

export interface Hotel {
    id: number;
    name: string;
    address: string;
    rating: number;
    pricePerNight: number;
    image: string;
  }
  
export interface SearchFilters {
    location: string;
    priceRange: [number, number];
    rating: number;
  }

  export interface HotelData {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    description: string;
    contact: string;
    averageRating: number;
    image?: string;
    rooms: Room[];
    checkIn: string;
    checkOut: string;
}

export interface HotelManagement {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  contact: string;
  check_in: { hour: number, minute: number, second: number, nano: number }; // Time object for check-in
  check_out: { hour: number, minute: number, second: number, nano: number }; // Time object for check-out
}