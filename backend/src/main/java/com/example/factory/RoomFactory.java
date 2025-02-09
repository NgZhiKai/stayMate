package com.example.factory;

import com.example.entity.Hotel;
import com.example.entity.enums.RoomType;
import com.example.entity.room.DeluxeRoom;
import com.example.entity.room.DoubleRoom;
import com.example.entity.room.Room;
import com.example.entity.room.SingleRoom;
import com.example.entity.room.SuiteRoom;

public class RoomFactory {

    public static Room createRoom(Hotel hotel, Long roomId, RoomType roomType, double pricePerNight, int maxOccupancy) {
        Room room = null;
        
        // Create specific room based on RoomType
        switch (roomType) {
            case SINGLE:
                room = new SingleRoom(hotel, roomId, pricePerNight, maxOccupancy);
                break;
            case DOUBLE:
                room = new DoubleRoom(hotel, roomId, pricePerNight, maxOccupancy);
                break;
            case SUITE:
                room = new SuiteRoom(hotel, roomId, pricePerNight, maxOccupancy);
                break;
            case DELUXE:
                room = new DeluxeRoom(hotel, roomId, pricePerNight, maxOccupancy);
                break;
        }

        // Further customization based on room type or other logic can be done here
        return room;
    }
}
