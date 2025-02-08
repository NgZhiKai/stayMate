package com.example.service;

import com.example.entity.Booking;
import com.example.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create a new booking
    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    // Retrieve all bookings for a user
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Retrieve all bookings for a hotel
    public List<Booking> getBookingsByHotelId(Long hotelId) {
        return bookingRepository.findByHotelId(hotelId);
    }

    // Get a booking by ID
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // Cancel a booking (delete)
    public void cancelBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
