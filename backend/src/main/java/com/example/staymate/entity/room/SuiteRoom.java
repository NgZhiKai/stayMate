package com.example.staymate.entity.room;

import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SUITE")
public class SuiteRoom extends Room {

    public SuiteRoom() {
        super();
    }

    public SuiteRoom(Hotel hotel, Long roomId, double pricePerNight, int maxOccupancy) {
        super(hotel, roomId, RoomType.SUITE, pricePerNight, maxOccupancy);
    }
    
}
