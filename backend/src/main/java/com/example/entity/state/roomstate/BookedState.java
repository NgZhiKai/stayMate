package com.example.entity.state.roomstate;

import com.example.entity.enums.RoomStatus;
import com.example.entity.room.Room;

public class BookedState implements RoomState {
    @Override
    public void book(Room room) {
        throw new IllegalStateException("Room is already booked.");
    }

    @Override
    public void checkOut(Room room) {
        room.setStatus(RoomStatus.AVAILABLE);
    }

    @Override
    public void markUnderMaintenance(Room room) {
        throw new IllegalStateException("Cannot put a booked room under maintenance.");
    }
}
