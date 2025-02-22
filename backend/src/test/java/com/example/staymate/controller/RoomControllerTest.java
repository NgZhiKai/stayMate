package com.example.staymate.controller;

import com.example.staymate.entity.enums.RoomStatus;
import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.room.RoomId;
import com.example.staymate.factory.RoomFactory;
import com.example.staymate.service.RoomService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class RoomControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RoomService roomService;

    @InjectMocks
    private RoomController roomController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(roomController).build();
    }

    @Test
    void testCreateRoom() throws Exception {
        Long hotelId = 3L;
        Long generatedRoomId = 101L;
        RoomType roomType = RoomType.SINGLE;
        double pricePerNight = 50.0;
        int maxOccupancy = 2;

        // Simulate hotel creation
        Hotel mockHotel = new Hotel();
        mockHotel.setId(hotelId);

        // Simulate room creation using RoomFactory
        Room mockRoom = RoomFactory.createRoom(mockHotel, generatedRoomId, roomType, pricePerNight, maxOccupancy);
        mockRoom.setId(new RoomId(hotelId, generatedRoomId));
        mockRoom.setMaxOccupancy(maxOccupancy);
        mockRoom.setPricePerNight(pricePerNight);
        mockRoom.setStatus(RoomStatus.AVAILABLE);

        // Mock RoomService to return the created room from the factory
        lenient().when(roomService.createRoom(eq(mockHotel), eq(generatedRoomId), eq(roomType), eq(pricePerNight), eq(maxOccupancy)))
            .thenReturn(mockRoom);

        // Perform the POST request to create the room
        mockMvc.perform(post("/rooms/{hotelId}/{roomId}", hotelId, generatedRoomId)
            .param("roomType", roomType.name())
            .param("pricePerNight", String.valueOf(pricePerNight))
            .param("maxOccupancy", String.valueOf(maxOccupancy))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.hotelId").value(hotelId))
            .andExpect(jsonPath("$.roomId").value(generatedRoomId))
            .andExpect(jsonPath("$.pricePerNight").value(pricePerNight))
            .andExpect(jsonPath("$.maxOccupancy").value(maxOccupancy));

    }

}
