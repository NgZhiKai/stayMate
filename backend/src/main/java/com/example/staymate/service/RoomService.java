package com.example.staymate.service;

import com.example.staymate.entity.enums.RoomStatus;
import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.room.RoomId;
import com.example.staymate.factory.RoomFactory;
import com.example.staymate.repository.RoomRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    // Method to create a new room
    public Room createRoom(Hotel hotel, Long roomId, RoomType roomType, double pricePerNight, int maxOccupancy) {
        // Use RoomFactory to create the Room
        Room room = RoomFactory.createRoom(hotel, roomId, roomType, pricePerNight, maxOccupancy);
        
        // Debugging log
        System.out.println("RoomId: " + room.getId()); 

        // Save the newly created room to the database
        return roomRepository.save(room);
    }

    // Method to book a room
    public Room bookRoom(Long hotelId, Long roomId) {
        RoomId id = new RoomId(hotelId, roomId);

        // Try to find the room in the database
        Optional<Room> roomOpt = roomRepository.findById(id);

        if (roomOpt.isPresent()) {
            Room room = roomOpt.get();

            // Check if the room is already booked
            if (room.getStatus() == RoomStatus.BOOKED) {
                throw new IllegalStateException("Room is already booked.");
            }

            // Book the room (this also updates the state)
            room.book();

            // Persist the updated room state in the database
            return roomRepository.save(room);
        } else {
            // Room not found, throw a custom exception
            throw new RuntimeException("Room with ID " + roomId + " in Hotel " + hotelId + " not found.");
        }
    }
}
