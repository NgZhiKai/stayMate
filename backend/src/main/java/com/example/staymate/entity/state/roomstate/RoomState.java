package com.example.staymate.entity.state.roomstate;

import com.example.staymate.entity.room.Room;

public interface RoomState {
    void book(Room room);
    void checkOut(Room room);
    void markUnderMaintenance(Room room);
}
