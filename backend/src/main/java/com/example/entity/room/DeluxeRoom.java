package com.example.entity.room;

import com.example.entity.Hotel;
import com.example.entity.enums.RoomType;

import jakarta.persistence.Entity;

@Entity
public class DeluxeRoom extends Room {

    public DeluxeRoom(Hotel hotel, Long roomId, double pricePerNight, int maxOccupancy) {
        super(hotel, roomId, RoomType.DELUXE, pricePerNight, maxOccupancy);
    }
    
}
