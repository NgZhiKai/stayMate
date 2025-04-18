package com.example.staymate.entity.state.roomstate;

import com.example.staymate.entity.enums.RoomStatus;
import com.example.staymate.entity.room.Room;

public class AvailableState implements RoomState {
    @Override
    public void book(Room room) {
        room.setStatus(RoomStatus.BOOKED);
    }

    @Override
    public void checkOut(Room room) {
        throw new IllegalStateException("Room is already available.");
    }

    @Override
    public void markUnderMaintenance(Room room) {
        room.setStatus(RoomStatus.UNDER_MAINTENANCE);
    }
}
