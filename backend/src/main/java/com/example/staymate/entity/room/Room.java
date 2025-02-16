package com.example.staymate.entity.room;

import com.example.staymate.entity.enums.RoomStatus;
import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.state.roomstate.AvailableState;
import com.example.staymate.entity.state.roomstate.BookedState;
import com.example.staymate.entity.state.roomstate.RoomState;
import com.example.staymate.entity.state.roomstate.UnderMaintenanceState;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy= InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="room_type", discriminatorType= DiscriminatorType.STRING)
@Table(name="room")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "room_type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = SingleRoom.class, name = "SINGLE"),
    @JsonSubTypes.Type(value = DoubleRoom.class, name = "DOUBLE"),
    @JsonSubTypes.Type(value = SuiteRoom.class, name = "SUITE"),
    @JsonSubTypes.Type(value = DeluxeRoom.class, name = "DELUXE")
})
public abstract class Room {

    @EmbeddedId
    @AttributeOverride(name = "hotelId", column = @Column(name = "hotel_id"))
    @AttributeOverride(name = "roomId", column = @Column(name = "room_id"))
    private RoomId id;  // Using composite key (hotel_id, room_id)

    @Column(name = "price_per_night")
    private double pricePerNight;

    @Column(name = "max_occupancy")
    private int maxOccupancy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RoomStatus status;

    @Transient
    private RoomState roomState;

    public Room() {
        this.status = RoomStatus.AVAILABLE;
        updateState();
    }

    public Room(Hotel hotel, Long roomId, RoomType roomType, double pricePerNight, int maxOccupancy) {
        // Setting the composite key
        this.id = new RoomId(hotel.getId(), roomId);
        // this.roomType = roomType;
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

    // Getters and setters
    public RoomId getId() {
        return id;
    }

    public void setId(RoomId id) {
        this.id = id;
    }

    public Long getHotelId() {
        return this.getId().getHotelId();
    }

    public Long getRoomId() {
        return this.getId().getRoomId();
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
