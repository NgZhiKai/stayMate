package com.example.staymate.dto.hotel;

import java.time.LocalTime;
import java.util.List;

import com.example.staymate.dto.room.RoomRequestDTO;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;

public class HotelRequestDTO {
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private List<RoomRequestDTO> rooms; // List of rooms to create
    private String description; // Add description field
    private String contact; // Add contact field
    
    @JsonDeserialize(using = LocalTimeDeserializer.class)
    private LocalTime checkIn; // Add checkIn field
    @JsonDeserialize(using = LocalTimeDeserializer.class)
    private LocalTime checkOut; // Add checkOut field

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public List<RoomRequestDTO> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomRequestDTO> rooms) {
        this.rooms = rooms;
    }

    // Getter and Setter for description
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // Getter and Setter for contact
    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    // Getter and Setter for checkIn
    public LocalTime getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalTime checkIn) {
        this.checkIn = checkIn;
    }

    // Getter and Setter for checkOut
    public LocalTime getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalTime checkOut) {
        this.checkOut = checkOut;
    }

}
