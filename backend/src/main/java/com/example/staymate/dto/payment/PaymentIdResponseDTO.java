package com.example.staymate.dto.payment;

import java.time.LocalDateTime;

import com.example.staymate.entity.enums.PaymentStatus;
import com.example.staymate.entity.payment.Payment;

public class PaymentIdResponseDTO {
    private Long paymentId;
    private Long bookingId;
    private Long userId;
    private double amountPaid;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentDateTime;

    public PaymentIdResponseDTO(Payment payment) {
        this.paymentId = payment.getId();
        this.bookingId = payment.getBooking().getId();
        this.userId = payment.getBooking().getUser().getId();
        this.amountPaid = payment.getAmount();
        this.paymentStatus = payment.getStatus();
        this.paymentDateTime = payment.getTransactionDate();

    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }



    public LocalDateTime getPaymentDateTime() {
        return paymentDateTime;
    }



    public void setPaymentDateTime(LocalDateTime paymentDateTime) {
        this.paymentDateTime = paymentDateTime;
    }

    
    
}
