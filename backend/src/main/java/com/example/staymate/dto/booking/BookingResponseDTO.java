package com.example.staymate.dto.booking;

import java.time.LocalDate;

import com.example.staymate.entity.booking.Booking;

public class BookingResponseDTO {
    private Long bookingId;
    private Long hotelId;
    private Long roomId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String roomType;
    private String status;
    private double totalAmount;

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BookingResponseDTO(Booking booking) {
        this.bookingId = booking.getId();
        this.status = booking.getStatus().toString();

        // Determine the room type based on the actual subclass
        if (booking.getRoom() != null) {
            this.roomType = booking.getRoom().getClass().getSimpleName().replaceAll("Room", "").toUpperCase();
        }

        this.checkInDate = booking.getCheckInDate();
        this.checkOutDate = booking.getCheckOutDate();
        this.totalAmount = booking.getTotalAmount();

        // Extract hotelId, roomId, and phone from the booking
        if (booking.getRoom() != null) {
            this.hotelId = booking.getRoom().getHotelId(); // Assuming booking has a room, and room has a hotel
            this.roomId = booking.getRoom().getRoomId(); // Assuming room has an id
        }

        if (booking.getUser() != null) {
            this.phone = booking.getUser().getPhoneNumber(); // Assuming user has a phone field
            this.firstName = booking.getUser().getFirstName();
            this.lastName = booking.getUser().getLastName();
            this.email = booking.getUser().getEmail();
        }
    }

    // Getters and Setters
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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

}
