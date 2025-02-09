package com.example.entity.state.roomstate;

import com.example.entity.room.Room;

public class UnderMaintenanceState implements RoomState {
    @Override
    public void book(Room room) {
        throw new IllegalStateException("Room is under maintenance and cannot be booked.");
    }

    @Override
    public void checkOut(Room room) {
        throw new IllegalStateException("Room is not occupied.");
    }

    @Override
    public void markUnderMaintenance(Room room) {
        throw new IllegalStateException("Room is already under maintenance.");
    }
}
