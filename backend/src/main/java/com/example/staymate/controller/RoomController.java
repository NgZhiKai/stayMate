package com.example.staymate.controller;

import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.service.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rooms")
public class RoomController {
    @Autowired
    private RoomService roomService;

    // Endpoint for creating a room
    @PostMapping("/{hotelId}/{roomId}")
    public Room createRoom(@PathVariable Long hotelId, @PathVariable Long roomId,
                           @RequestParam RoomType roomType, @RequestParam double pricePerNight,
                           @RequestParam int maxOccupancy) {
        Hotel hotel = new Hotel();  // Assuming you fetch the hotel by ID, this can be improved
        hotel.setId(hotelId);
        return roomService.createRoom(hotel, roomId, roomType, pricePerNight, maxOccupancy);
    }
    
}
