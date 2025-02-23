package com.example.staymate.controller;

import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.service.RoomService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/{hotelId}/{roomId}")
    public ResponseEntity<Map<String, Object>> createRoom(@PathVariable Long hotelId, @PathVariable Long roomId,
                                                          @RequestParam RoomType roomType,
                                                          @RequestParam double pricePerNight,
                                                          @RequestParam int maxOccupancy) {
        Hotel hotel = new Hotel();
        hotel.setId(hotelId);

        Room newRoom = roomService.createRoom(hotel, roomId, roomType, pricePerNight, maxOccupancy);

        if (newRoom == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create room"));
        }

        // Build the response map directly
        Map<String, Object> response = Map.of(
                "message", "Room created successfully",
                "hotelId", newRoom.getId().getHotelId(),
                "roomId", newRoom.getId().getRoomId(),
                "pricePerNight", newRoom.getPricePerNight(),
                "maxOccupancy", newRoom.getMaxOccupancy()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
