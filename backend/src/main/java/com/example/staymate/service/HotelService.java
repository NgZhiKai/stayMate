package com.example.staymate.service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.exception.ResourceNotFoundException;
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
    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID " + id));
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

    // Search hotels by name (alias for findHotelsByName)
    public List<Hotel> searchHotelsByName(String name) {
        return findHotelsByName(name);
    }

    // Get the list of rooms for a specific hotel
    public List<Room> getRoomsByHotel(Long hotelId) {
        return hotelRepository.findById(hotelId)
                .map(Hotel::getRooms)
                .orElse(Collections.emptyList()); // If hotel exists, return rooms
    }

    private static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371; // Radius of the Earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c; // Distance in km
        return distance;
    }

    public List<Hotel> getNearbyHotels(double latitude, double longitude) {
        List<Hotel> allHotels = hotelRepository.findAll();
        return allHotels.stream()
                .filter(hotel -> calculateDistance(latitude, longitude, hotel.getLatitude(),
                        hotel.getLongitude()) <= 10)
                .collect(Collectors.toList());
    }
}
