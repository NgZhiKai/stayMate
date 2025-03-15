package com.example.staymate.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.staymate.dto.custom.CustomResponse;
import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.service.RoomService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/rooms")
@Tag(name = "Room Controller", description = "API for managing hotel rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/{hotelId}/{roomId}")
    @Operation(summary = "Create a new room", description = "Creates a room in a specified hotel with given details.")
    public ResponseEntity<CustomResponse<Map<String, Object>>> createRoom(
            @PathVariable @Parameter(description = "ID of the hotel where the room will be created") Long hotelId,
            @PathVariable @Parameter(description = "ID of the room to be created") Long roomId,
            @RequestParam @Parameter(description = "Type of the room") RoomType roomType,
            @RequestParam @Parameter(description = "Price per night for the room") double pricePerNight,
            @RequestParam @Parameter(description = "Maximum occupancy of the room") int maxOccupancy) {
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

    //
    @GetMapping("/{hotelId}")
    @Operation(summary = "Create a new room", description = "Creates a room in a specified hotel with given details.")
    public ResponseEntity<CustomResponse<Map<String, Object>>> createRoom1(
            @PathVariable @Parameter(description = "ID of the hotel where the room will be created") Long hotelId,
            @PathVariable @Parameter(description = "ID of the room to be created") Long roomId,
            @RequestParam @Parameter(description = "Type of the room") RoomType roomType,
            @RequestParam @Parameter(description = "Price per night for the room") double pricePerNight,
            @RequestParam @Parameter(description = "Maximum occupancy of the room") int maxOccupancy) {
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