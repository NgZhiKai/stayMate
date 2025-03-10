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