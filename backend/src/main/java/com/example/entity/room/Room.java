package com.example.entity.room;

import com.example.entity.Hotel;
import com.example.entity.enums.RoomStatus;
import com.example.entity.enums.RoomType;
import com.example.entity.state.roomstate.AvailableState;
import com.example.entity.state.roomstate.BookedState;
import com.example.entity.state.roomstate.RoomState;
import com.example.entity.state.roomstate.UnderMaintenanceState;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public abstract class Room {
    @EmbeddedId
    private RoomId id; // Composite key for hotel_id and room_id

    @ManyToOne
    @MapsId("hotelId") // Maps hotelId from RoomId to Hotel entity
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    private double pricePerNight;
    private int maxOccupancy;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @Transient
    private RoomState roomState;

    public Room() {
        this.status = RoomStatus.AVAILABLE;
        updateState();
    }

    public Room(Hotel hotel, Long roomId, RoomType roomType, double pricePerNight, int maxOccupancy) {
        this.id = new RoomId(hotel.getId(), roomId);  // Set composite key
        this.hotel = hotel;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
        this.maxOccupancy = maxOccupancy;
        this.status = RoomStatus.AVAILABLE;
        updateState();
    }

    private void updateState() {
        switch (this.status) {
            case AVAILABLE -> this.roomState = new AvailableState();
            case BOOKED -> this.roomState = new BookedState();
            case UNDER_MAINTENANCE -> this.roomState = new UnderMaintenanceState();
        }
    }

    public void book() {
        roomState.book(this);
        updateState();
    }

    public void checkOut() {
        roomState.checkOut(this);
        updateState();
    }

    public void markUnderMaintenance() {
        roomState.markUnderMaintenance(this);
        updateState();
    }

    public RoomId getId() {
        return id;
    }

    public void setId(RoomId id) {
        this.id = id;
    }

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public int getMaxOccupancy() {
        return maxOccupancy;
    }

    public void setMaxOccupancy(int maxOccupancy) {
        this.maxOccupancy = maxOccupancy;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }
}
