package com.example.staymate.controller;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.staymate.dto.booking.BookingRequestDTO;
import com.example.staymate.dto.booking.BookingResponseDTO;
import com.example.staymate.dto.custom.CustomResponse;
import com.example.staymate.dto.user.UserBookingResponseDTO;
import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.BookingStatus;
import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.user.User;
import com.example.staymate.service.BookingService;
import com.example.staymate.service.RoomService;
import com.example.staymate.service.UserService;

import jakarta.validation.Valid;

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
    public ResponseEntity<CustomResponse<Map<String, Object>>> createBooking(
            @Valid @RequestBody BookingRequestDTO bookingRequestDTO) {

        // Check if the user exists (throws ResourceNotFoundException if not found)
        User user = userService.getUserById(bookingRequestDTO.getUserId());

        // Validate check-in and check-out dates
        if (bookingRequestDTO.getCheckOutDate().isBefore(bookingRequestDTO.getCheckInDate())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Check-out date must be after check-in date", null));
        }

        // Check if the room is available
        if (!roomService.isRoomAvailable(bookingRequestDTO.getHotelId(), bookingRequestDTO.getRoomId(),
                bookingRequestDTO.getCheckInDate(), bookingRequestDTO.getCheckOutDate())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Room is not available for the selected dates", null));
        }

        // Book the room
        Room room;
        try {
            room = roomService.bookRoom(bookingRequestDTO.getHotelId(), bookingRequestDTO.getRoomId(),
                    bookingRequestDTO.getCheckInDate(), bookingRequestDTO.getCheckOutDate());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Room booking failed. The room might not be available.", null));
        }

        // Create Booking object
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckInDate(bookingRequestDTO.getCheckInDate());
        booking.setCheckOutDate(bookingRequestDTO.getCheckOutDate());
        booking.setTotalAmount(bookingRequestDTO.getTotalAmount());

        // Set Booking Date (if not provided)
        booking.setBookingDate(LocalDate.now());

        // Set Booking Status directly to CONFIRMED (to avoid double saves)
        booking.setStatus(BookingStatus.PENDING);

        // Step 8: Save the booking
        Booking savedBooking = bookingService.createBooking(booking);

        // Step 9: Return Success Response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Booking created successfully");
        response.put("bookingId", savedBooking.getId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CustomResponse<>("Booking created successfully", response));
    }

    // Get a booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<BookingResponseDTO>> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("Booking not found", null)); // Booking not found
        }
        BookingResponseDTO bookingResponseDTO = new BookingResponseDTO(booking);
        return ResponseEntity.ok(new CustomResponse<>("Booking retrieved successfully", bookingResponseDTO));
    }

    // Cancel a booking by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse<Map<String, Object>>> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingService.cancelBooking(id);
        if (booking == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Booking not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("Booking not found", response));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Booking cancelled successfully");
        response.put("bookingId", booking.getId());
        response.put("status", booking.getStatus());

        return ResponseEntity.status(HttpStatus.OK)
                .body(new CustomResponse<>("Booking cancelled successfully", response)); // Successfully cancelled
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<CustomResponse<List<BookingResponseDTO>>> getBookingsForHotel(@PathVariable Long hotelId) {

        List<BookingResponseDTO> bookings = bookingService.getBookingsByHotel(hotelId).stream()
                .map(BookingResponseDTO::new)
                .collect(Collectors.toList());

        if (bookings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("No bookings found for the hotel", Collections.emptyList()));
        }
        return ResponseEntity.ok(new CustomResponse<>("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CustomResponse<List<UserBookingResponseDTO>>> getBookingsForUser(@PathVariable Long userId) {
        List<UserBookingResponseDTO> bookings = bookingService.getBookingsByUser(userId).stream()
                .map(UserBookingResponseDTO::new)
                .collect(Collectors.toList());

        if (bookings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("No bookings found for user", Collections.emptyList()));
        }
        return ResponseEntity.ok(new CustomResponse<>("Bookings retrieved successfully", bookings));
    }

}
