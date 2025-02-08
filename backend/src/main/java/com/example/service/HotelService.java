package com.example.service;

import com.example.entity.Hotel;
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
}
