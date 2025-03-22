package com.example.staymate.factory;

import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.DeluxeRoom;
import com.example.staymate.entity.room.DoubleRoom;
import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.room.SingleRoom;
import com.example.staymate.entity.room.SuiteRoom;

public class RoomFactory {

    public static Room createRoom(Hotel hotel, Long roomId, RoomType roomType, double pricePerNight, int maxOccupancy) {
        return switch (roomType) {
            case SINGLE -> new SingleRoom(hotel, roomId, pricePerNight, maxOccupancy);
            case DOUBLE -> new DoubleRoom(hotel, roomId, pricePerNight, maxOccupancy);
            case DELUXE -> new DeluxeRoom(hotel, roomId, pricePerNight, maxOccupancy);
            case SUITE -> new SuiteRoom(hotel, roomId, pricePerNight, maxOccupancy);
        };
    }
}
