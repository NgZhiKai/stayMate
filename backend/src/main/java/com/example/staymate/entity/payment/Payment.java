package com.example.staymate.entity.payment;

import java.time.LocalDateTime;

import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.PaymentMethod;
import com.example.staymate.entity.enums.PaymentStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod; // CREDIT_CARD, PAYPAL, STRIPE

    private double amount;
    private LocalDateTime transactionDate;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // PENDING, SUCCESS, FAILED

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    // Method to mark payment as successful
    public void markAsPaid() {
        if (this.status == PaymentStatus.FAILED) {
            throw new IllegalStateException("Cannot mark as paid after a failure");
        }
        this.status = PaymentStatus.SUCCESS;
        this.transactionDate = LocalDateTime.now();
    }

    // Method to mark payment as failed
    public void markAsFailed() {
        if (this.status == PaymentStatus.SUCCESS) {
            throw new IllegalStateException("Cannot mark as failed after success");
        }
        this.status = PaymentStatus.FAILED;
        this.transactionDate = LocalDateTime.now();
    }

    // Method to mark payment as pending
    public void markAsPending() {
        if (this.status == PaymentStatus.SUCCESS || this.status == PaymentStatus.FAILED) {
            throw new IllegalStateException("Cannot mark as pending after success or failure");
        }
        this.status = PaymentStatus.PENDING;
        this.transactionDate = LocalDateTime.now();
    }
}