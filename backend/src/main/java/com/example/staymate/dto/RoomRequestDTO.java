package com.example.staymate.dto;

import com.example.staymate.entity.enums.RoomType;

public class RoomRequestDTO {
    private RoomType roomType;
    private double pricePerNight;
    private int maxOccupancy;
    private int quantity; // Number of rooms to create

    // Getters and Setters
    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(double pricePerNight) { this.pricePerNight = pricePerNight; }

    public int getMaxOccupancy() { return maxOccupancy; }
    public void setMaxOccupancy(int maxOccupancy) { this.maxOccupancy = maxOccupancy; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
