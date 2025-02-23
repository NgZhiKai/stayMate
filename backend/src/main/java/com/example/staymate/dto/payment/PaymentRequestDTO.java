package com.example.staymate.dto.payment;

public class PaymentRequestDTO {
    private Long bookingId;
    private double amount;
    
    public Long getBookingId() {
        return bookingId;
    }
    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }
    public double getAmount() {
        return amount;
    }
    public void setAmount(double amount) {
        this.amount = amount;
    }

    
}
