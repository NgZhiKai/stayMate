package com.example.staymate.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.staymate.entity.booking.Booking;
import com.example.staymate.entity.enums.RoomStatus;
import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.room.RoomId;
import com.example.staymate.entity.room.SingleRoom;
import com.example.staymate.exception.RoomAlreadyBookedException;
import com.example.staymate.repository.BookingRepository;
import com.example.staymate.repository.RoomRepository;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private RoomService roomService;

    private Hotel hotel;
    private Room room;
    private Booking booking;

    @BeforeEach
    void setUp() {
        // Initialize mock hotel
        hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Sample Hotel");

        // Create SingleRoom instead of generic Room
        room = new SingleRoom(hotel, 101L, 100.0, 2);

        // Create booking for the room
        booking = new Booking();
        booking.setId(1L);
        booking.setRoom(room);
        booking.setCheckInDate(LocalDate.of(2025, 3, 1));
        booking.setCheckOutDate(LocalDate.of(2025, 3, 5));
    }

    // Test for createRoom method
    @Test
    void testCreateRoom() {
        // Create a new instance with the same arguments as the method under test
        Room roomToSave = new SingleRoom(hotel, 101L, 100.0, 2);

        // Mock the save method to return the room
        doReturn(roomToSave).when(roomRepository).save(any(SingleRoom.class));

        // Call the service method
        Room createdRoom = roomService.createRoom(hotel, 101L, RoomType.SINGLE, 100.0, 2);

        // Validate the room
        assertNotNull(createdRoom);
        assertEquals(101L, createdRoom.getId().getRoomId());

        // Verify the repository save method was called with any SingleRoom instance
        verify(roomRepository, times(1)).save(any(SingleRoom.class));
    }

    // Test for bookRoom method (room is available)
    @Test
    void testBookRoom_Success() {
        // Ensure room starts as AVAILABLE
        room.setStatus(RoomStatus.AVAILABLE);
    
        // Mock repository responses
        RoomId expectedRoomId = new RoomId(hotel.getId(), 101L);
        when(roomRepository.findById(expectedRoomId)).thenReturn(Optional.of(room));
        when(bookingRepository.findOverlappingBookings(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5)))
            .thenReturn(List.of());
        when(roomRepository.save(any(Room.class))).thenAnswer(invocation -> invocation.getArgument(0));
    
        // Call bookRoom
        Room bookedRoom = roomService.bookRoom(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5));
    
        // Assertions
        assertNotNull(bookedRoom);
        assertEquals(RoomStatus.BOOKED, bookedRoom.getStatus());
    
        // Verify interactions
        verify(roomRepository, times(1)).findById(expectedRoomId);
        verify(bookingRepository, times(1)).findOverlappingBookings(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5));
        verify(roomRepository, times(1)).save(bookedRoom);
    }    

    // Test for bookRoom method (room already booked)
    @Test
    void testBookRoom_RoomAlreadyBooked() {
        // Mock roomRepository.findById to return the room
        when(roomRepository.findById(new RoomId(hotel.getId(), 101L))).thenReturn(Optional.of(room));
        
        // Mock bookingRepository.findOverlappingBookings to return a non-empty list (room is already booked)
        when(bookingRepository.findOverlappingBookings(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5)))
            .thenReturn(List.of(booking));

        // Call the service method and expect RoomAlreadyBookedException
        assertThrows(RoomAlreadyBookedException.class, () -> roomService.bookRoom(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5)));

        // Verify the repository methods were called
        verify(roomRepository, times(1)).findById(new RoomId(hotel.getId(), 101L));
        verify(bookingRepository, times(1)).findOverlappingBookings(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5));
        verify(roomRepository, times(0)).save(any(Room.class));  // Save should not be called if room is already booked
    }

    // Test for isRoomAvailable method (room is available)
    @Test
    void testIsRoomAvailable_Available() {
        // Mock roomRepository.findById to return the room
        when(roomRepository.findById(new RoomId(hotel.getId(), 101L))).thenReturn(Optional.of(room));

        // Mock bookingRepository.findOverlappingBookings to return an empty list (no overlapping bookings)
        when(bookingRepository.findOverlappingBookings(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5)))
            .thenReturn(List.of());

        // Call the service method
        boolean isAvailable = roomService.isRoomAvailable(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5));

        // Validate the result
        assertTrue(isAvailable);

        // Verify the repository methods were called
        verify(roomRepository, times(1)).findById(new RoomId(hotel.getId(), 101L));
        verify(bookingRepository, times(1)).findOverlappingBookings(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5));
    }

    // Test for isRoomAvailable method (room is not available)
    @Test
    void testIsRoomAvailable_NotAvailable() {
        // Mock roomRepository.findById to return the room
        when(roomRepository.findById(new RoomId(hotel.getId(), 101L))).thenReturn(Optional.of(room));

        // Mock bookingRepository.findOverlappingBookings to return a non-empty list (room is already booked)
        when(bookingRepository.findOverlappingBookings(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5)))
            .thenReturn(List.of(booking));

        // Call the service method
        boolean isAvailable = roomService.isRoomAvailable(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5));

        // Validate the result
        assertFalse(isAvailable);

        // Verify the repository methods were called
        verify(roomRepository, times(1)).findById(new RoomId(hotel.getId(), 101L));
        verify(bookingRepository, times(1)).findOverlappingBookings(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5));
    }

    // Test for isRoomAvailable method (room not found)
    @Test
    void testIsRoomAvailable_RoomNotFound() {
        // Mock roomRepository.findById to return empty (room not found)
        when(roomRepository.findById(new RoomId(hotel.getId(), 101L))).thenReturn(Optional.empty());

        // Call the service method and expect RuntimeException
        assertThrows(RuntimeException.class, () -> roomService.isRoomAvailable(hotel.getId(), 101L, LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 5)));

        // Verify the repository method was called
        verify(roomRepository, times(1)).findById(new RoomId(hotel.getId(), 101L));
    }
}
