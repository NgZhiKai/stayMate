package com.example.staymate.controller;

import com.example.staymate.dto.HotelRequestDTO;
import com.example.staymate.dto.RoomRequestDTO;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.service.HotelService;
import com.example.staymate.service.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RequestMapping("/hotels")
@RestController
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private RoomService roomService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createHotel(@RequestBody HotelRequestDTO hotelRequestDTO) {
        if (hotelRequestDTO.getName() == null || hotelRequestDTO.getName().isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Hotel name is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);  // 400 Bad Request
        }

        Hotel hotel = new Hotel();
        hotel.setName(hotelRequestDTO.getName());
        hotel.setAddress(hotelRequestDTO.getAddress());
        hotel.setLatitude(hotelRequestDTO.getLatitude());
        hotel.setLongitude(hotelRequestDTO.getLongitude());

        Hotel savedHotel = hotelService.saveHotel(hotel);

        List<Room> rooms = new ArrayList<>();
        long roomId = 100;

        for (RoomRequestDTO roomRequest : hotelRequestDTO.getRooms()) {
            if (roomRequest.getQuantity() <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Room quantity must be greater than zero");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);  // 400 Bad Request
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

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllHotels() {
        List<Hotel> hotels = hotelService.getAllHotels();
        if (hotels.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "No hotels found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);  // 404 Not Found with error message
        }
        return ResponseEntity.ok(hotels);  // Return the list of hotels when found
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getHotelById(@PathVariable Long id) {
        Optional<Hotel> hotel = hotelService.getHotelById(id);
        if (hotel.isPresent()) {
            return ResponseEntity.ok(hotel.get());  // Return hotel with 200 OK if found
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Hotel not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);  // 404 Not Found with error message
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
        Optional<Hotel> existingHotel = hotelService.getHotelById(id);
        
        // Case when the hotel is not found
        if (existingHotel.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Hotel not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);  // 404 Not Found
        }

        hotel.setId(id);  // Ensure the hotel ID is set before updating
        
        // Save the hotel and return the updated version
        Hotel updatedHotel = hotelService.saveHotel(hotel);
        
        // Case when the hotel ID is found, but no update happens (could be due to validation or some other reason)
        if (updatedHotel == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Hotel ID: " + id + " not updated");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);  // 400 Bad Request
        }
        
        // Case when the hotel is successfully updated
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hotel updated successfully");
        response.put("hotelId", updatedHotel.getId());
        return ResponseEntity.ok(response);  // 200 OK with the response
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteHotel(@PathVariable Long id) {
        Optional<Hotel> hotel = hotelService.getHotelById(id);
        
        // Case when the hotel is not found
        if (hotel.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Hotel not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);  // 404 Not Found
        }
        
        // Case when the hotel is found and deleted successfully
        hotelService.deleteHotel(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hotel deleted successfully");
        response.put("hotelId", id);
        return ResponseEntity.status(HttpStatus.OK).body(response);  // 200 OK with response body
    }      

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchHotelsByName(@RequestParam String name) {
        // Check if the search query is empty
        if (name == null || name.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Search query cannot be empty");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);  // 400 Bad Request
        }

        // Find hotels by name
        List<Hotel> hotels = hotelService.findHotelsByName(name);
        
        // If no hotels are found, return 404 Not Found with an error message
        if (hotels.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "No hotels found matching the name: " + name);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);  // 404 Not Found
        }

        // Return the list of hotels if found, with a success message
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hotels found matching the name: " + name);
        response.put("hotels", hotels);
        return ResponseEntity.ok(response);  // 200 OK with the list of matching hotels
    }

}
