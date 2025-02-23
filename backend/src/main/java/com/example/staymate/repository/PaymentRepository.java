
package com.example.staymate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.staymate.entity.payment.Payment;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Find payments by booking ID
    List<Payment> findByBookingId(Long bookingId);
}
