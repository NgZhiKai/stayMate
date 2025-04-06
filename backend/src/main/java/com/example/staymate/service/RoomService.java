package com.example.staymate.service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.room.RoomId;
import com.example.staymate.exception.RoomAlreadyBookedException;
import com.example.staymate.exception.RoomNotFoundException;
import com.example.staymate.factory.RoomFactory;
import com.example.staymate.repository.BookingRepository;
import com.example.staymate.repository.HotelRepository;
import com.example.staymate.repository.RoomRepository;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private HotelRepository hotelRepository;

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
    public Room bookRoom(Long hotelId, Long roomId, LocalDate checkInDate, LocalDate checkOutDate) {
        RoomId id = new RoomId(hotelId, roomId);

        // Fetch room or throw exception if not found
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(
                        "Room with ID " + roomId + " in Hotel " + hotelId + " not found."));

        // Check for overlapping bookings
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(hotelId, roomId, checkInDate,
                checkOutDate);

        if (!overlappingBookings.isEmpty()) {
            throw new RoomAlreadyBookedException(
                    "Room " + roomId + " in hotel " + hotelId + " is already booked for the selected dates.");
        }

        // Book the room
        room.book();

        // Save and return updated room
        return roomRepository.save(room);
    }

    public boolean isRoomAvailable(Long hotelId, Long roomId, LocalDate checkInDate, LocalDate checkOutDate) {
        RoomId id = new RoomId(hotelId, roomId);
        Optional<Room> roomOpt = roomRepository.findById(id);

        // Check if room exists
        if (roomOpt.isEmpty()) {
            throw new RuntimeException("Room with ID " + roomId + " in Hotel " + hotelId + " not found.");
        }

        // Check if the room has overlapping bookings
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(hotelId, roomId, checkInDate,
                checkOutDate);

        return overlappingBookings.isEmpty(); // Room is available if no overlapping bookings exist
    }

    public Hotel getHotelById(Long hotelId) {
        return hotelRepository.findById(hotelId)
                .orElseThrow(() -> new NoSuchElementException("Hotel with ID " + hotelId + " not found."));
    }

    public List<Room> getAvailableRoomsForHotel(Long hotelId) {
        return roomRepository.findByHotelIdAndStatus(hotelId);
    }
}
