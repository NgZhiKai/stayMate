package com.example.staymate.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.room.RoomId;

@Repository
public interface RoomRepository extends JpaRepository<Room, RoomId> {

    @Query("SELECT r FROM Room r WHERE r.id.hotelId = :hotelId")
    List<Room> findByHotelId(@Param("hotelId") Long hotelId);


    @Query("""
        SELECT r FROM Room r 
        WHERE r.id.hotelId = :hotelId
        AND r.id.roomId NOT IN (
            SELECT b.room.id.roomId FROM Booking b 
            WHERE b.room.id.hotelId = :hotelId
            AND b.status != 'CANCELLED'
            AND (
                :checkIn < b.checkOutDate AND :checkOut > b.checkInDate
            )
        )
    """)
    List<Room> findAvailableRooms(@Param("hotelId") Long hotelId,
                                @Param("checkIn") LocalDate checkIn,
                                @Param("checkOut") LocalDate checkOut);


}
