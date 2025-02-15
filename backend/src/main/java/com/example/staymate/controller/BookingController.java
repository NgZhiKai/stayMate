package com.example.staymate.controller;

import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.BookingStatus;
import com.example.staymate.service.BookingService;
import com.example.staymate.service.RoomService;
import com.example.staymate.service.UserService;
import com.example.staymate.entity.user.User;
import com.example.staymate.entity.room.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserService userService;

    // Create a new booking
   @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Booking booking) {
        // Step 1: Check if the user exists (this will throw ResourceNotFoundException if not found)
        User user = userService.getUserById(booking.getUser().getId());
        booking.setUser(user);

        // Step 2: Set initial booking status to PENDING
        booking.setStatus(BookingStatus.PENDING);

        // Step 3: Book the room
        Room room;
        try {
            room = roomService.bookRoom(booking.getRoom().getHotelId(), booking.getRoom().getRoomId());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Handle room booking failure
        }

        booking.setRoom(room);

        // Step 4: Set the check-in and check-out dates
        if (booking.getCheckInDate() == null || booking.getCheckOutDate() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Missing dates
        }

        // Step 5: Set booking date if not provided
        if (booking.getBookingDate() == null) {
            booking.setBookingDate(LocalDate.now()); // Set to today if not provided
        }

        // Step 6: Save the booking (this sets status to PENDING)
        Booking savedBooking = bookingService.createBooking(booking);

        // Step 7: Update the status to CONFIRMED after successful room booking
        savedBooking.setStatus(BookingStatus.CONFIRMED);
        bookingService.updateBooking(savedBooking); // Save the updated status to database

        // Create a custom response with a message and booking ID
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Booking created successfully");
        response.put("bookingId", savedBooking.getId());  // Include minimal details like booking ID

        return ResponseEntity.status(HttpStatus.CREATED).body(response);  // Return the response
    }

    // Get a booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Booking not found
        }
        return ResponseEntity.ok(booking);
    }

    // Cancel a booking by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingService.cancelBooking(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Booking not found
        }
        return ResponseEntity.noContent().build(); // Successfully cancelled
    }
}
