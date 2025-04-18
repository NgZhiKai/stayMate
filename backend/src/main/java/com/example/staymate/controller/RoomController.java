package com.example.staymate.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.staymate.entity.room.Room;
import com.example.staymate.service.RoomService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/rooms")
@Tag(name = "Room Controller", description = "API for managing hotel rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/{hotelId}")
    public ResponseEntity<List<Room>> getHotelRooms(@PathVariable Long hotelId) {
        List<Room> availableRooms = roomService.getHotelRooms(hotelId);
        if (availableRooms.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(availableRooms);
    }

    @GetMapping("/available-rooms")
    public ResponseEntity<List<Room>> getAvailableRooms(
            @RequestParam Long hotelId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {

        // Validate check-in and check-out date order
        if (checkOutDate.isBefore(checkInDate)) {
            return ResponseEntity.badRequest().build(); // No CustomResponse
        }

        List<Room> availableRooms = roomService.getAvailableRooms(hotelId, checkInDate, checkOutDate);

        if (availableRooms.isEmpty()) {
            return ResponseEntity.noContent().build(); // Standard 204 response
        }

        return ResponseEntity.ok(availableRooms); // Send raw list
    }

}