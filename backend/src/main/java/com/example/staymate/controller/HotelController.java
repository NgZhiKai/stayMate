package com.example.staymate.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.staymate.dto.custom.CustomResponse;
import com.example.staymate.dto.hotel.HotelRequestDTO;
import com.example.staymate.dto.room.RoomRequestDTO;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.service.HotelService;
import com.example.staymate.service.RoomService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomResponse<Map<String, Object>>> createHotel(
            @RequestPart("hotelDetails") String hotelDetailsJson,
            @RequestPart("image") MultipartFile image) {

        HotelRequestDTO hotelRequestDTO = null;
        try {
            // Attempt to parse the hotelDetailsJson into HotelRequestDTO
            hotelRequestDTO = new ObjectMapper().readValue(hotelDetailsJson, HotelRequestDTO.class);
        } catch (JsonProcessingException e) {
            // Handle JSON parsing error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Invalid JSON format for hotel details", null));
        }

        // Validate hotel name
        if (hotelRequestDTO.getName() == null || hotelRequestDTO.getName().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Hotel name is required", null)); // 400 Bad Request
        }

        // Create Hotel object and populate fields
        Hotel hotel = new Hotel();
        hotel.setName(hotelRequestDTO.getName());
        hotel.setAddress(hotelRequestDTO.getAddress());
        hotel.setDescription(hotelRequestDTO.getDescription());
        hotel.setLatitude(hotelRequestDTO.getLatitude());
        hotel.setLongitude(hotelRequestDTO.getLongitude());
        hotel.setContact(hotelRequestDTO.getContact());
        hotel.setCheckIn(hotelRequestDTO.getCheckIn());
        hotel.setCheckOut(hotelRequestDTO.getCheckOut());

        if (image != null && !image.isEmpty()) {
            try {
                byte[] imageBytes = image.getResource().getInputStream().readAllBytes();
                hotel.setImage(imageBytes); // Store image as byte array
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new CustomResponse<>("Error processing image", null));
            }
        }

        // Save hotel to the database
        Hotel savedHotel = hotelService.saveHotel(hotel);

        // Process rooms
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
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomResponse<Map<String, Object>>> updateHotel(
            @Parameter(description = "ID of the hotel to update") @PathVariable Long id,
            @Parameter(description = "Updated hotel information") @RequestPart("hotelDetails") String hotelDetailsJson,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            // Ensure the hotel exists
            Hotel existingHotel = hotelService.getHotelById(id);
            if (existingHotel == null) {
                throw new RuntimeException("Hotel not found with id: " + id);
            }
            HotelRequestDTO hotelRequestDTO = null;
            try {
                // Attempt to parse the hotelDetailsJson into HotelRequestDTO
                hotelRequestDTO = new ObjectMapper().readValue(hotelDetailsJson, HotelRequestDTO.class);
            } catch (JsonProcessingException e) {
                // Handle JSON parsing error
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new CustomResponse<>("Invalid JSON format for hotel details", null));
            }

            Hotel hotel = new Hotel();
            hotel.setId(id);
            hotel.setName(hotelRequestDTO.getName());
            hotel.setAddress(hotelRequestDTO.getAddress());
            hotel.setDescription(hotelRequestDTO.getDescription());
            hotel.setLatitude(hotelRequestDTO.getLatitude());
            hotel.setLongitude(hotelRequestDTO.getLongitude());
            hotel.setContact(hotelRequestDTO.getContact());
            hotel.setCheckIn(hotelRequestDTO.getCheckIn());
            hotel.setCheckOut(hotelRequestDTO.getCheckOut());

            if (image != null && !image.isEmpty()) {
                try {
                    byte[] imageBytes = image.getResource().getInputStream().readAllBytes();
                    hotel.setImage(imageBytes); // Store image as byte array
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(new CustomResponse<>("Error processing image", null));
                }
            }

            // Save the hotel with or without an image (if provided)
            Hotel updatedHotel = hotelService.saveHotel(hotel);

            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Hotel updated successfully");
            response.put("hotelId", updatedHotel.getId());

            return ResponseEntity.ok(new CustomResponse<>("Hotel updated successfully", response));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
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

    @Operation(summary = "Get hotels within 10 km", description = "Returns hotels within a 10 km radius of the current location")
    @GetMapping("/hotels/nearby")
    public ResponseEntity<List<Hotel>> getHotelsNearby(@RequestParam double latitude, @RequestParam double longitude) {
        List<Hotel> nearbyHotels = hotelService.getNearbyHotels(latitude, longitude);
        return ResponseEntity.ok(nearbyHotels);
    }
}
