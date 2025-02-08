package com.example.repository;

import com.example.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Find bookings by user ID
    List<Booking> findByUserId(Long userId);

    // Find bookings by hotel ID
    List<Booking> findByHotelId(Long hotelId);
}
