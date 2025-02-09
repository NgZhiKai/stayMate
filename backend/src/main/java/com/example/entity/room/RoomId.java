package com.example.entity.room;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class RoomId implements Serializable {
    private Long hotelId;
    private Long roomId;

    public RoomId() {}

    public RoomId(Long hotelId, Long roomId) {
        this.hotelId = hotelId;
        this.roomId = roomId;
    }

    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RoomId roomId1 = (RoomId) o;
        return Objects.equals(hotelId, roomId1.hotelId) && Objects.equals(roomId, roomId1.roomId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(hotelId, roomId);
    }
}
