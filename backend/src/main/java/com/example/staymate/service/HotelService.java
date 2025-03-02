package com.example.staymate.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.repository.HotelRepository;

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
        if (hotelRepository.existsById(id)) {
            hotelRepository.deleteById(id);
        } else {
            throw new RuntimeException("Hotel not found for deletion");
        }
    }

    // Find hotels by name (Example of custom query method)
    public List<Hotel> findHotelsByName(String name) {
        return hotelRepository.findByNameContaining(name); // assuming findByNameContaining exists
    }

    // Get the list of rooms for a specific hotel
    public List<Room> getRoomsByHotel(Long hotelId) {
        return hotelRepository.findById(hotelId)
                             .map(Hotel::getRooms)
                             .orElse(Collections.emptyList());  // If hotel exists, return rooms
    }
}
