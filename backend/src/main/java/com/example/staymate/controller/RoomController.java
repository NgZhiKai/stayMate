package com.example.staymate.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.staymate.dto.custom.CustomResponse;
import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.service.RoomService;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/{hotelId}/{roomId}")
    public ResponseEntity<CustomResponse<Map<String, Object>>> createRoom(@PathVariable Long hotelId,
            @PathVariable Long roomId,
            @RequestParam RoomType roomType,
            @RequestParam double pricePerNight,
            @RequestParam int maxOccupancy) {
        try {
            Hotel hotel = roomService.getHotelById(hotelId);
            if (hotel == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new CustomResponse<>("Hotel not found with ID: " + hotelId, null));
            }

            Room newRoom = roomService.createRoom(hotel, roomId, roomType, pricePerNight, maxOccupancy);
            if (newRoom == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new CustomResponse<>("Failed to create room. Please try again later.", null));
            }

            Map<String, Object> roomData = Map.of(
                    "hotelId", newRoom.getId().getHotelId(),
                    "roomId", newRoom.getId().getRoomId(),
                    "pricePerNight", newRoom.getPricePerNight(),
                    "maxOccupancy", newRoom.getMaxOccupancy());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CustomResponse<>("Room created successfully", roomData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred: " + e.getMessage(), null));
        }
    }
}
