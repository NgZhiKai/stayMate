package com.example.service;

import com.example.entity.Hotel;
import com.example.entity.Booking;
import com.example.entity.Review;
import com.example.entity.room.Room;
import com.example.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    // Retrieve all hotels
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    // Retrieve a hotel by ID
    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }

    // Create or update a hotel
    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    // Delete a hotel by ID
    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }

    // Find hotels by name (Example of custom query method)
    public List<Hotel> findHotelsByName(String name) {
        return hotelRepository.findByNameContaining(name); // assuming findByNameContaining exists
    }

    // Get the list of bookings for a specific hotel
    public List<Booking> getBookingsByHotel(Long hotelId) {
        Optional<Hotel> hotel = hotelRepository.findById(hotelId);
        return hotel.map(Hotel::getBookings).orElse(null);  // If hotel exists, return bookings
    }

    // Get the list of reviews for a specific hotel
    public List<Review> getReviewsByHotel(Long hotelId) {
        Optional<Hotel> hotel = hotelRepository.findById(hotelId);
        return hotel.map(Hotel::getReviews).orElse(null);  // If hotel exists, return reviews
    }

    // Get the list of rooms for a specific hotel
    public List<Room> getRoomsByHotel(Long hotelId) {
        Optional<Hotel> hotel = hotelRepository.findById(hotelId);
        return hotel.map(Hotel::getRooms).orElse(null);  // If hotel exists, return rooms
    }
}
