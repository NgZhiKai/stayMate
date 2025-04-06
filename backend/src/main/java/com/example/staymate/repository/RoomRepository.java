package com.example.staymate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.staymate.entity.enums.RoomStatus;
import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.room.RoomId;

@Repository
public interface RoomRepository extends JpaRepository<Room, RoomId> {

    @Query("SELECT r FROM Room r WHERE r.id.hotelId = :hotelId AND r.status = :status")
    List<Room> findByHotelIdAndStatus(@Param("hotelId") Long hotelId, @Param("status") RoomStatus status);

}
