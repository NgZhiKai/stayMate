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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

        @Operation(summary = "Create a new booking", description = "Creates a booking for a given user and room if available.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Booking created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CustomResponse.class))),
                        @ApiResponse(responseCode = "400", description = "Invalid request data or room unavailable", content = @Content(mediaType = "application/json"))
        })
        @PostMapping
        public ResponseEntity<CustomResponse<Map<String, Object>>> createBooking(
                        @Valid @RequestBody BookingRequestDTO bookingRequestDTO) {

                User user = userService.getUserById(bookingRequestDTO.getUserId());

                if (bookingRequestDTO.getCheckOutDate().isBefore(bookingRequestDTO.getCheckInDate())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new CustomResponse<>("Check-out date must be after check-in date", null));
                }

                if (!roomService.isRoomAvailable(bookingRequestDTO.getHotelId(), bookingRequestDTO.getRoomId(),
                                bookingRequestDTO.getCheckInDate(), bookingRequestDTO.getCheckOutDate())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new CustomResponse<>("Room is not available for the selected dates",
                                                        null));
                }

                Room room;
                try {
                        room = roomService.bookRoom(bookingRequestDTO.getHotelId(), bookingRequestDTO.getRoomId(),
                                        bookingRequestDTO.getCheckInDate(), bookingRequestDTO.getCheckOutDate());
                } catch (RuntimeException e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new CustomResponse<>(
                                                        "Room booking failed. The room might not be available.", null));
                }

                Booking booking = new Booking();
                booking.setUser(user);
                booking.setRoom(room);
                booking.setCheckInDate(bookingRequestDTO.getCheckInDate());
                booking.setCheckOutDate(bookingRequestDTO.getCheckOutDate());
                booking.setTotalAmount(bookingRequestDTO.getTotalAmount());
                booking.setBookingDate(LocalDate.now());
                booking.setStatus(BookingStatus.PENDING);

                Booking savedBooking = bookingService.createBooking(booking);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Booking created successfully");
                response.put("bookingId", savedBooking.getId());

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new CustomResponse<>("Booking created successfully", response));
        }

        @Operation(summary = "Get booking by ID", description = "Retrieve a booking's details using its ID.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Booking found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BookingResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Booking not found", content = @Content(mediaType = "application/json"))
        })
        @GetMapping("/{id}")
        public ResponseEntity<CustomResponse<BookingResponseDTO>> getBookingById(
                        @Parameter(description = "ID of the booking", required = true) @PathVariable Long id) {
                Booking booking = bookingService.getBookingById(id);
                if (booking == null) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(new CustomResponse<>("Booking not found", null));
                }
                BookingResponseDTO bookingResponseDTO = new BookingResponseDTO(booking);
                return ResponseEntity.ok(new CustomResponse<>("Booking retrieved successfully", bookingResponseDTO));
        }

        @Operation(summary = "Cancel a booking", description = "Cancels an existing booking by ID.")
        @DeleteMapping("/{id}")
        public ResponseEntity<CustomResponse<Map<String, Object>>> cancelBooking(
                        @Parameter(description = "ID of the booking to cancel", required = true) @PathVariable Long id) {
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
                                .body(new CustomResponse<>("Booking cancelled successfully", response));
        }

        @Operation(summary = "Get all bookings for a hotel", description = "Retrieves all bookings associated with a specific hotel.")
        @GetMapping("/hotel/{hotelId}")
        public ResponseEntity<CustomResponse<List<BookingResponseDTO>>> getBookingsForHotel(
                        @Parameter(description = "ID of the hotel", required = true) @PathVariable Long hotelId) {

                List<BookingResponseDTO> bookings = bookingService.getBookingsByHotel(hotelId).stream()
                                .map(BookingResponseDTO::new)
                                .collect(Collectors.toList());

                if (bookings.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(new CustomResponse<>("No bookings found for the hotel",
                                                        Collections.emptyList()));
                }
                return ResponseEntity.ok(new CustomResponse<>("Bookings retrieved successfully", bookings));
        }

        @Operation(summary = "Get all bookings for a user", description = "Retrieves all bookings associated with a specific user.")
        @GetMapping("/user/{userId}")
        public ResponseEntity<CustomResponse<List<UserBookingResponseDTO>>> getBookingsForUser(
                        @Parameter(description = "ID of the user", required = true) @PathVariable Long userId) {
                List<UserBookingResponseDTO> bookings = bookingService.getBookingsByUser(userId).stream()
                                .map(UserBookingResponseDTO::new)
                                .collect(Collectors.toList());

                if (bookings.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(new CustomResponse<>("No bookings found for user",
                                                        Collections.emptyList()));
                }
                return ResponseEntity.ok(new CustomResponse<>("Bookings retrieved successfully", bookings));
        }

        @Operation(summary = "Get all bookings", description = "Retrieves all bookings in the system.")
        @GetMapping
        public ResponseEntity<CustomResponse<List<Booking>>> getAllBookings() {
                List<Booking> bookings = bookingService.getAllBookings();

                if (bookings.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(new CustomResponse<>("No bookings found", Collections.emptyList()));
                }
                return ResponseEntity.ok(new CustomResponse<>("Bookings retrieved successfully", bookings));
        }

}
