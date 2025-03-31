package com.example.staymate.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.staymate.dto.custom.CustomResponse;
import com.example.staymate.dto.hotel.HotelRequestDTO;
import com.example.staymate.dto.room.RoomRequestDTO;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.service.HotelService;
import com.example.staymate.service.RoomService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@RequestMapping("/hotels")
@RestController
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private RoomService roomService;

    @Operation(summary = "Create a new hotel", description = "This operation creates a new hotel and its rooms")
    @PostMapping
    public ResponseEntity<CustomResponse<Map<String, Object>>> createHotel(
            @Parameter(description = "Details of the hotel to be created") @RequestBody HotelRequestDTO hotelRequestDTO) {
        if (hotelRequestDTO.getName() == null || hotelRequestDTO.getName().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Hotel name is required", null)); // 400 Bad Request
        }

        Hotel hotel = new Hotel();
        hotel.setName(hotelRequestDTO.getName());
        hotel.setAddress(hotelRequestDTO.getAddress());
        hotel.setLatitude(hotelRequestDTO.getLatitude());
        hotel.setLongitude(hotelRequestDTO.getLongitude());

        // Save image to file storage (or database)
        if (hotelRequestDTO.getImage() != null && !hotelRequestDTO.getImage().isEmpty()) {
            try {
                byte[] imageBytes = hotelRequestDTO.getImage().getBytes();
                hotel.setImage(imageBytes); // Assuming you store as BLOB in DB
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new CustomResponse<>("Error processing image", null));
            }
        }

        Hotel savedHotel = hotelService.saveHotel(hotel);

        List<Room> rooms = new ArrayList<>();
        long roomId = 100;

        for (RoomRequestDTO roomRequest : hotelRequestDTO.getRooms()) {
            if (roomRequest.getQuantity() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new CustomResponse<>("Room quantity must be greater than zero", null)); // 400 Bad Request
            }
            for (int i = 0; i < roomRequest.getQuantity(); i++) {
                Room room = roomService.createRoom(savedHotel, roomId++, roomRequest.getRoomType(),
                        roomRequest.getPricePerNight(), roomRequest.getMaxOccupancy());
                rooms.add(room);
            }
        }

        savedHotel.setRooms(rooms);
        hotelService.saveHotel(savedHotel);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hotel created successfully");
        response.put("hotelId", savedHotel.getId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CustomResponse<>("Hotel created successfully", response));
    }

    @Operation(summary = "Get all hotels", description = "Retrieve a list of all hotels")
    @GetMapping
    public ResponseEntity<CustomResponse<List<Hotel>>> getAllHotels() {
        List<Hotel> hotels = hotelService.getAllHotels();
        if (hotels.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("No hotels found", null)); // 404 Not Found
        }
        return ResponseEntity.ok(new CustomResponse<>("Hotels retrieved successfully", hotels)); // 200 OK
    }

    @Operation(summary = "Get hotel by ID", description = "Retrieve a hotel by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<Hotel>> getHotelById(
            @Parameter(description = "ID of the hotel to retrieve") @PathVariable Long id) {
        try {
            Hotel hotel = hotelService.getHotelById(id); // Directly getting the hotel, no Optional
            return ResponseEntity.ok(new CustomResponse<>("Hotel retrieved successfully", hotel)); // 200 OK
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null)); // 404 Not Found
        }
    }

    @Operation(summary = "Update hotel details", description = "Update the information of an existing hotel")
    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse<Map<String, Object>>> updateHotel(
            @Parameter(description = "ID of the hotel to update") @PathVariable Long id,
            @Parameter(description = "Updated hotel information") @RequestBody Hotel hotel) {
        try {
            // Ensure the hotel exists
            Hotel existingHotel = hotelService.getHotelById(id);
            if (existingHotel == null) {
                throw new RuntimeException("Hotel not found with id: " + id);
            }

            // Set the ID to ensure the correct hotel is updated
            hotel.setId(id);
            Hotel updatedHotel = hotelService.saveHotel(hotel);

            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Hotel updated successfully");
            response.put("hotelId", updatedHotel.getId());

            return ResponseEntity.ok(new CustomResponse<>("Hotel updated successfully", response));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        }
    }

    @Operation(summary = "Delete hotel by ID", description = "Delete a hotel by its ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse<Map<String, Object>>> deleteHotel(
            @Parameter(description = "ID of the hotel to delete") @PathVariable Long id) {
        try {
            hotelService.getHotelById(id); // Ensure hotel exists

            hotelService.deleteHotel(id);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Hotel deleted successfully");
            response.put("hotelId", id);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new CustomResponse<>("Hotel deleted successfully", response)); // 200 OK
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null)); // 404 Not Found
        }
    }

    @Operation(summary = "Search hotels by name", description = "Search for hotels by their name")
    @GetMapping("/search")
    public ResponseEntity<CustomResponse<Map<String, Object>>> searchHotelsByName(
            @Parameter(description = "Name of the hotel to search") @RequestParam String name) {
        if (name == null || name.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Search query cannot be empty", null)); // 400 Bad Request
        }

        List<Hotel> hotels = hotelService.findHotelsByName(name);

        if (hotels.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("No hotels found matching the name: " + name, null)); // 404 Not Found
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hotels found matching the name: " + name);
        response.put("hotels", hotels);
        return ResponseEntity.ok(new CustomResponse<>("Hotels found successfully", response)); // 200 OK
    }
}
