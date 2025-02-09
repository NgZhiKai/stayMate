package com.example.entity.state.roomstate;

import com.example.entity.room.Room;

public interface RoomState {
    void book(Room room);
    void checkOut(Room room);
    void markUnderMaintenance(Room room);
}
