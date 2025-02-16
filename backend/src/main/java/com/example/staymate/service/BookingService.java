package com.example.staymate.service;

import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.BookingStatus;
import com.example.staymate.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create a new booking
    public Booking createBooking(Booking booking) {
        // Set the booking status to PENDING initially
        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking); // Persist the booking in the database
    }

    // Update a booking status (e.g., to CONFIRMED after successful room booking)
    @Transactional
    public Booking updateBooking(Booking booking) {
        return bookingRepository.save(booking); // Update the booking in the database
    }

    // Retrieve booking by ID
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null); // Find booking by ID
    }

    // Cancel a booking (set status to CANCELLED)
    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if (booking != null) {
            booking.setStatus(BookingStatus.CANCELLED); // Update status to CANCELLED
            return bookingRepository.save(booking);
        }
        return null;
    }

    public List<Booking> getBookingsByHotel(Long hotelId) {
        return bookingRepository.findBookingsByHotelId(hotelId);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findBookingsByUserId(userId);
    }
    
}
