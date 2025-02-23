package com.example.staymate.service;

import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.PaymentMethod;
import com.example.staymate.entity.enums.PaymentStatus;
import com.example.staymate.entity.notification.Notification;
import com.example.staymate.entity.payment.Payment;
import com.example.staymate.observer.NotificationObserver;
import com.example.staymate.repository.BookingRepository;
import com.example.staymate.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private NotificationObserver notificationObserver;

    @InjectMocks
    private PaymentService paymentService;

    private Booking booking;
    private Payment payment;

    @BeforeEach
    void setUp() {
        booking = new Booking();
        booking.setId(1L);

        payment = new Payment();
        payment.setId(1L);
        payment.setBooking(booking);
        payment.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        payment.setAmount(100.0);
        payment.setTransactionDate(LocalDateTime.now());
        payment.setStatus(PaymentStatus.PENDING);

        paymentService.addObserver(notificationObserver);
    }

    @Test
    void testCreatePayment_Success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        Payment createdPayment = paymentService.createPayment(1L, PaymentMethod.CREDIT_CARD, 100.0);

        assertNotNull(createdPayment);
        assertEquals(booking, createdPayment.getBooking());
        assertEquals(PaymentMethod.CREDIT_CARD, createdPayment.getPaymentMethod());
        assertEquals(100.0, createdPayment.getAmount());
        assertEquals(PaymentStatus.PENDING, createdPayment.getStatus());
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void testCreatePayment_BookingNotFound() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () ->
            paymentService.createPayment(1L, PaymentMethod.CREDIT_CARD, 100.0)
        );

        assertEquals("Booking not found with ID: 1", exception.getMessage());
    }

    @Test
    void testProcessPayment_Success() {
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        paymentService.processPayment(1L, PaymentMethod.CREDIT_CARD);

        assertEquals(PaymentStatus.SUCCESS, payment.getStatus());
        verify(paymentRepository, times(1)).save(payment);
        verify(notificationObserver, times(1)).update(any(Notification.class));
    }

    @Test
    void testProcessPayment_AlreadyProcessed() {
        payment.setStatus(PaymentStatus.SUCCESS);
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));

        Exception exception = assertThrows(IllegalStateException.class, () ->
            paymentService.processPayment(1L, PaymentMethod.CREDIT_CARD)
        );

        assertEquals("Payment has already been successfully processed.", exception.getMessage());
    }

    @Test
    void testGetPaymentsByBookingId() {
        when(paymentRepository.findByBookingId(1L)).thenReturn(List.of(payment));

        List<Payment> payments = paymentService.getPaymentsByBookingId(1L);

        assertNotNull(payments);
        assertEquals(1, payments.size());
        assertEquals(payment, payments.get(0));
    }

    @Test
    void testGetPaymentById() {
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));

        Payment foundPayment = paymentService.getPaymentById(1L);

        assertNotNull(foundPayment);
        assertEquals(payment, foundPayment);
    }
}
