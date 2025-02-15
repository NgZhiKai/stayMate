package com.example.staymate.entity.room;

import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SINGLE")
public class SingleRoom extends Room {

    public SingleRoom() {
        super();
    }

    public SingleRoom(Hotel hotel, Long roomId, double pricePerNight, int maxOccupancy) {
        super(hotel, roomId, RoomType.SINGLE, pricePerNight, maxOccupancy);
    }
    
}
