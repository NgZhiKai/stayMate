package com.example.staymate.controller;

import com.example.staymate.dto.hotel.HotelRequestDTO;
import com.example.staymate.dto.room.RoomRequestDTO;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.service.HotelService;
import com.example.staymate.service.RoomService;
import com.example.staymate.dto.custom.CustomResponse;

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
    public ResponseEntity<CustomResponse<Map<String, Object>>> createHotel(@RequestBody HotelRequestDTO hotelRequestDTO) {
        if (hotelRequestDTO.getName() == null || hotelRequestDTO.getName().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Hotel name is required", null));  // 400 Bad Request
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
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new CustomResponse<>("Room quantity must be greater than zero", null));  // 400 Bad Request
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

        return ResponseEntity.status(HttpStatus.CREATED).body(new CustomResponse<>("Hotel created successfully", response));
    }

    @GetMapping
    public ResponseEntity<CustomResponse<List<Hotel>>> getAllHotels() {
        List<Hotel> hotels = hotelService.getAllHotels();
        if (hotels.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("No hotels found", null));  // 404 Not Found
        }
        return ResponseEntity.ok(new CustomResponse<>("Hotels retrieved successfully", hotels));  // 200 OK
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<Hotel>> getHotelById(@PathVariable Long id) {
        Optional<Hotel> hotel = hotelService.getHotelById(id);
        if (hotel.isPresent()) {
            return ResponseEntity.ok(new CustomResponse<>("Hotel retrieved successfully", hotel.get()));  // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("Hotel not found with ID: " + id, null));  // 404 Not Found
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse<Map<String, Object>>> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
        Optional<Hotel> existingHotel = hotelService.getHotelById(id);
        
        if (existingHotel.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("Hotel not found with ID: " + id, null));  // 404 Not Found
        }

        hotel.setId(id);  // Ensure the hotel ID is set before updating
        
        Hotel updatedHotel = hotelService.saveHotel(hotel);
        
        if (updatedHotel == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Hotel ID: " + id + " not updated", null));  // 400 Bad Request
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hotel updated successfully");
        response.put("hotelId", updatedHotel.getId());
        return ResponseEntity.ok(new CustomResponse<>("Hotel updated successfully", response));  // 200 OK
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse<Map<String, Object>>> deleteHotel(@PathVariable Long id) {
        Optional<Hotel> hotel = hotelService.getHotelById(id);
        
        if (hotel.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("Hotel not found with ID: " + id, null));  // 404 Not Found
        }
        
        hotelService.deleteHotel(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hotel deleted successfully");
        response.put("hotelId", id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new CustomResponse<>("Hotel deleted successfully", response));  // 200 OK
    }      

    @GetMapping("/search")
    public ResponseEntity<CustomResponse<Map<String, Object>>> searchHotelsByName(@RequestParam String name) {
        if (name == null || name.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>("Search query cannot be empty", null));  // 400 Bad Request
        }

        List<Hotel> hotels = hotelService.findHotelsByName(name);
        
        if (hotels.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("No hotels found matching the name: " + name, null));  // 404 Not Found
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hotels found matching the name: " + name);
        response.put("hotels", hotels);
        return ResponseEntity.ok(new CustomResponse<>("Hotels found successfully", response));  // 200 OK
    }

}
