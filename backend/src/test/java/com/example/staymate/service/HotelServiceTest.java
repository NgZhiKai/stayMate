package com.example.staymate.service;

import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.SingleRoom;
import com.example.staymate.entity.room.Room;
import com.example.staymate.repository.HotelRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class HotelServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @InjectMocks
    private HotelService hotelService;

    private Hotel hotel;
    private SingleRoom singleRoom;

    @BeforeEach
    void setUp() {
        hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Sample Hotel");

        singleRoom = new SingleRoom(hotel, 101L, 100.0, 1); // Proper instantiation
        hotel.setRooms(List.of(singleRoom));
    }

    @Test
    void testGetAllHotels() {
        when(hotelRepository.findAll()).thenReturn(List.of(hotel));
        List<Hotel> hotels = hotelService.getAllHotels();
        assertNotNull(hotels);
        assertEquals(1, hotels.size());
        assertEquals("Sample Hotel", hotels.get(0).getName());
        verify(hotelRepository, times(1)).findAll();
    }

    @Test
    void testGetHotelById_Success() {
        when(hotelRepository.findById(hotel.getId())).thenReturn(Optional.of(hotel));
        Optional<Hotel> foundHotel = hotelService.getHotelById(hotel.getId());
        assertTrue(foundHotel.isPresent());
        assertEquals("Sample Hotel", foundHotel.get().getName());
        verify(hotelRepository, times(1)).findById(hotel.getId());
    }

    @Test
    void testSaveHotel_Create() {
        when(hotelRepository.save(hotel)).thenReturn(hotel);
        Hotel savedHotel = hotelService.saveHotel(hotel);
        assertNotNull(savedHotel);
        assertEquals("Sample Hotel", savedHotel.getName());
        verify(hotelRepository, times(1)).save(hotel);
    }

    @Test
    void testDeleteHotel_Success() {
        when(hotelRepository.existsById(hotel.getId())).thenReturn(true);
        hotelService.deleteHotel(hotel.getId());
        verify(hotelRepository, times(1)).existsById(hotel.getId());
        verify(hotelRepository, times(1)).deleteById(hotel.getId());
    }

    @Test
    void testFindHotelsByName() {
        when(hotelRepository.findByNameContaining("Sample")).thenReturn(List.of(hotel));
        List<Hotel> hotels = hotelService.findHotelsByName("Sample");
        assertNotNull(hotels);
        assertEquals(1, hotels.size());
        assertEquals("Sample Hotel", hotels.get(0).getName());
        verify(hotelRepository, times(1)).findByNameContaining("Sample");
    }

    @Test
    void testGetRoomsByHotel_Success() {
        when(hotelRepository.findById(hotel.getId())).thenReturn(Optional.of(hotel));
        List<Room> rooms = hotelService.getRoomsByHotel(hotel.getId());
        assertNotNull(rooms);
        assertEquals(1, rooms.size());
        verify(hotelRepository, times(1)).findById(hotel.getId());
    }

    @Test
    void testGetRoomsByHotel_NotFound() {
        when(hotelRepository.findById(hotel.getId())).thenReturn(Optional.empty());
        List<Room> rooms = hotelService.getRoomsByHotel(hotel.getId());
        assertNotNull(rooms);
        assertTrue(rooms.isEmpty());
        verify(hotelRepository, times(1)).findById(hotel.getId());
    }
}
