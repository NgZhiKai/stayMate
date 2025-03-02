package com.example.staymate.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.staymate.entity.booking.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Find bookings by user ID
    public List<Booking> findBookingsByUserId(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.room.id.hotelId = :hotelId")
    List<Booking> findBookingsByHotelId(@Param("hotelId") Long hotelId);

    @Query("SELECT b FROM Booking b WHERE b.room.id.hotelId = :hotelId AND b.room.id.roomId = :roomId " +
           "AND ((b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate))")
    List<Booking> findOverlappingBookings(
                @Param("hotelId") Long hotelId,
                @Param("roomId") Long roomId,
                @Param("checkInDate") LocalDate checkInDate,
                @Param("checkOutDate") LocalDate checkOutDate
        );

}
