package com.example.staymate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.room.RoomId;

@Repository
public interface RoomRepository extends JpaRepository<Room, RoomId> {
}
