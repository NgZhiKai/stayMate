package com.example.staymate.entity.room;

import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("DELUXE")
public class DeluxeRoom extends Room {

    public DeluxeRoom() {
        super();
    }

    public DeluxeRoom(Hotel hotel, Long roomId, double pricePerNight, int maxOccupancy) {
        super(hotel, roomId, RoomType.DELUXE, pricePerNight, maxOccupancy);
    }
    
}
