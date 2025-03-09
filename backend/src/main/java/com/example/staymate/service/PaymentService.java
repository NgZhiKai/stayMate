package com.example.staymate.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.entity.enums.PaymentMethod;
import com.example.staymate.entity.enums.PaymentStatus;
import com.example.staymate.entity.notification.Notification;
import com.example.staymate.entity.payment.Payment;
import com.example.staymate.observer.NotificationObserver;
import com.example.staymate.observer.Observer;
import com.example.staymate.observer.Subject;
import com.example.staymate.repository.BookingRepository;
import com.example.staymate.repository.PaymentRepository;
import com.example.staymate.strategy.payment.CreditCardPaymentStrategy;
import com.example.staymate.strategy.payment.PaymentContext;
import com.example.staymate.strategy.payment.PaypalPaymentStrategy;
import com.example.staymate.strategy.payment.StripePaymentStrategy;

@Service
public class PaymentService implements Subject {

    private final List<Observer> observers = new ArrayList<>();

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // Add observers
    @Override
    public void addObserver(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void removeObserver(Observer observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers(Map<String, Object> data) {
        for (Observer observer : observers) {
            observer.update(data);
        }
    }

    public void notifyObservers(Notification notification) {
        Map<String, Object> data = new HashMap<>();
        data.put("notification", notification);
        notifyObservers(data);
    }

    @Autowired
    public void setNotificationObserver(NotificationObserver notificationObserver) {
        addObserver(notificationObserver);
    }

    // Create a new payment and save it to the database with PENDING status
    public Payment createPayment(Long bookingId, PaymentMethod paymentMethod, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero.");
        }

        // Fetch the booking from the repository using the bookingId
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // Create a new Payment object and link the booking to the payment
        Payment payment = new Payment();
        payment.setBooking(booking); // Set the booking for this payment
        payment.setPaymentMethod(paymentMethod); // Set the payment method
        payment.setAmount(amount); // Set the payment amount
        payment.setTransactionDate(LocalDateTime.now()); // Set the transaction date
        payment.setStatus(PaymentStatus.PENDING); // Set status to PENDING initially

        // Save the payment to the database
        return paymentRepository.save(payment);
    }

    // Process the payment using the chosen payment method strategy
    public void processPayment(Long paymentId, PaymentMethod paymentMethod) {
        if (paymentId == null || paymentMethod == null) {
            throw new IllegalArgumentException("Payment ID and Payment Method must not be null.");
        }

        Payment payment = getPaymentById(paymentId); // Retrieve the payment by its ID
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new IllegalStateException("Payment has already been successfully processed.");
        }

        // Process payment using the selected strategy
        PaymentContext context = new PaymentContext();
        switch (paymentMethod) {
            case CREDIT_CARD:
                context.setPaymentStrategy(new CreditCardPaymentStrategy());
                break;
            case PAYPAL:
                context.setPaymentStrategy(new PaypalPaymentStrategy());
                break;
            case STRIPE:
                context.setPaymentStrategy(new StripePaymentStrategy());
                break;
            default:
                throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
        }

        // Execute the payment process
        boolean success = context.executePayment(payment.getAmount()); // Execute the payment strategy

        // After processing, update the payment status accordingly
        if (success) {
            payment.setStatus(PaymentStatus.SUCCESS);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        // Create a notification
        Notification notification = new Notification();
        notification.setUser(payment.getBooking().getUser());
        notification.setMessage("Your payment of $" + payment.getAmount() + " was successful.");
        notification.setType(NotificationType.PAYMENT);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        // Notify observers
        notifyObservers(notification);

        // Save the updated payment status back to the database
        paymentRepository.save(payment);
    }

    // Find payments by booking ID
    public List<Payment> getPaymentsByBookingId(Long bookingId) {
        if (bookingId == null) {
            throw new IllegalArgumentException("Booking ID must not be null.");
        }

        List<Payment> payments = paymentRepository.findByBookingId(bookingId);
        if (payments.isEmpty()) {
            throw new RuntimeException("No payments found for booking ID: " + bookingId);
        }
        return payments;
    }

    // Find payments by user ID
    public List<Payment> getPaymentsByUserId(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID must not be null.");
        }

        // Find bookings for the given user ID
        List<Booking> bookings = bookingRepository.findBookingsByUserId(userId);

        // Check if bookings are found
        if (bookings.isEmpty()) {
            throw new RuntimeException("No bookings found for user ID: " + userId);
        }

        // Find payments associated with each booking
        List<Payment> payments = new ArrayList<>();
        for (Booking booking : bookings) {
            List<Payment> bookingPayments = paymentRepository.findByBookingId(booking.getId());
            payments.addAll(bookingPayments);
        }

        // If no payments are found
        if (payments.isEmpty()) {
            throw new RuntimeException("No payments found for user ID: " + userId);
        }

        return payments;
    }

    // Get payment by ID
    public Payment getPaymentById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Payment ID must not be null.");
        }

        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));
    }
}
