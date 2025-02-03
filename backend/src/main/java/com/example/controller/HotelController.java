package com.example.controller;

import com.example.entity.Hotel;
import com.example.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    @GetMapping("/sort/price-asc")
    public List<Hotel> getHotelsByPriceAsc() {
        return hotelRepository.findByOrderByPricePerNightAsc();
    }

    @GetMapping("/sort/price-desc")
    public List<Hotel> getHotelsByPriceDesc() {
        return hotelRepository.findByOrderByPricePerNightDesc();
    }

    @GetMapping("/recommendations")
    public List<Hotel> getRecommendations(@RequestParam double userLat, @RequestParam double userLon) {
        List<Hotel> hotels = hotelRepository.findAll();
        return hotels.stream()
                .sorted(Comparator.comparingDouble(h -> calculateDistance(userLat, userLon, h.getLatitude(), h.getLongitude())))
                .limit(5) // Top 5 closest hotels
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula to calculate distance between two coordinates
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }
}