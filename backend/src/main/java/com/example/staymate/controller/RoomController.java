package com.example.staymate.controller;

import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.service.RoomService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/{hotelId}/{roomId}")
    public ResponseEntity<Map<String, Object>> createRoom(@PathVariable Long hotelId, @PathVariable Long roomId,
                                                        @RequestParam RoomType roomType, @RequestParam double pricePerNight,
                                                        @RequestParam int maxOccupancy) {
        Hotel hotel = new Hotel();
        hotel.setId(hotelId);

        Room newRoom = roomService.createRoom(hotel, roomId, roomType, pricePerNight, maxOccupancy);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Room created successfully");
        response.put("hotelId", hotelId);
        response.put("roomId", roomId);
        response.put("pricePerNight", pricePerNight);
        response.put("maxOccupancy", maxOccupancy);

        // Return the newly created room with a 201 Created status
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

