package com.example.staymate.dto.user;

import java.time.LocalDate;

import com.example.staymate.entity.booking.Booking;

public class UserBookingResponseDTO {
    private Long bookingId;
    private Long hotelId;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String roomType;
    private String status;

    public UserBookingResponseDTO(Booking booking) {
        this.bookingId = booking.getId();
        this.status = booking.getStatus().toString();
        
        // Determine the room type based on the actual subclass
        if (booking.getRoom() != null) {
            this.roomType = booking.getRoom().getClass().getSimpleName().replaceAll("Room", "").toUpperCase();  // Get room type by class name (SingleRoom, DoubleRoom, etc.)
        }

        this.checkInDate = booking.getCheckInDate();
        this.checkOutDate = booking.getCheckOutDate();

        // Extract hotelId, roomId, and phone from the booking
        if (booking.getRoom() != null) {
            this.hotelId = booking.getRoom().getHotelId();  // Assuming booking has a room, and room has a hotel
            this.roomId = booking.getRoom().getRoomId();  // Assuming room has an id
        }
    }

    // Getters and Setters
    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    
}

