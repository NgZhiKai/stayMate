package com.example.staymate.controller;

import com.example.staymate.dto.BookingRequestDTO;
import com.example.staymate.dto.BookingResponseDTO;
import com.example.staymate.dto.UserBookingResponseDTO;
import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.BookingStatus;
import com.example.staymate.service.BookingService;
import com.example.staymate.service.RoomService;
import com.example.staymate.service.UserService;

import jakarta.validation.Valid;

import com.example.staymate.entity.user.User;
import com.example.staymate.entity.room.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Collections;

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
    public ResponseEntity<Map<String, Object>> createBooking(@Valid @RequestBody BookingRequestDTO bookingRequestDTO) {

        // Step 1: Check if the user exists (throws ResourceNotFoundException if not found)
        User user = userService.getUserById(bookingRequestDTO.getUserId());

        // Step 2: Validate check-in and check-out dates
        if (bookingRequestDTO.getCheckOutDate().isBefore(bookingRequestDTO.getCheckInDate())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Check-out date must be after check-in date"));
        }

        // Step 3: Check if the room is available
        if (!roomService.isRoomAvailable(bookingRequestDTO.getHotelId(), bookingRequestDTO.getRoomId(),
                bookingRequestDTO.getCheckInDate(), bookingRequestDTO.getCheckOutDate())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Room is not available for the selected dates"));
        }

        // Step 4: Book the room
        Room room;
        try {
            room = roomService.bookRoom(bookingRequestDTO.getHotelId(), bookingRequestDTO.getRoomId(), 
                                        bookingRequestDTO.getCheckInDate(), bookingRequestDTO.getCheckOutDate());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Room booking failed. The room might not be available."));
        }

        // Step 5: Create Booking object
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckInDate(bookingRequestDTO.getCheckInDate());
        booking.setCheckOutDate(bookingRequestDTO.getCheckOutDate());
        booking.setTotalAmount(bookingRequestDTO.getTotalAmount());

        // Step 6: Set Booking Date (if not provided)
        booking.setBookingDate(LocalDate.now());

        // Step 7: Set Booking Status directly to CONFIRMED (to avoid double saves)
        booking.setStatus(BookingStatus.CONFIRMED);

        // Step 8: Save the booking
        Booking savedBooking = bookingService.createBooking(booking);

        // Step 9: Return Success Response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Booking created successfully");
        response.put("bookingId", savedBooking.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get a booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Booking not found
        }
        BookingResponseDTO bookingResponseDTO = new BookingResponseDTO(booking);
        return ResponseEntity.ok(bookingResponseDTO);
    }

    // Cancel a booking by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingService.cancelBooking(id);
        if (booking == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Booking not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); // Booking not found
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Booking cancelled successfully");
        response.put("bookingId", booking.getId());
        response.put("status", booking.getStatus());

        return ResponseEntity.status(HttpStatus.OK).body(response); // Successfully cancelled
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsForHotel(@PathVariable Long hotelId) {

        List<BookingResponseDTO> bookings = bookingService.getBookingsByHotel(hotelId).stream()
                .map(BookingResponseDTO::new)  // Using the constructor that automatically handles the mapping
                .collect(Collectors.toList());

        if (bookings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserBookingResponseDTO>> getBookingsForUser(@PathVariable Long userId) {
        List<UserBookingResponseDTO> bookings = bookingService.getBookingsByUser(userId).stream()
                .map(UserBookingResponseDTO::new)
                .collect(Collectors.toList());

        if (bookings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
        return ResponseEntity.ok(bookings);
    }

}
