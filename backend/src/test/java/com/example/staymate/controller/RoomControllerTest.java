package com.example.staymate.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.room.SingleRoom;
import com.example.staymate.service.RoomService;
import java.util.List;
import java.util.Collections;

@ExtendWith(MockitoExtension.class)
class RoomControllerTest {

    @Autowired
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

    // @Test
    // void testCreateRoom() throws Exception {
    // Long hotelId = 3L;
    // Long generatedRoomId = 101L;
    // RoomType roomType = RoomType.SINGLE;
    // double pricePerNight = 50.0;
    // int maxOccupancy = 2;

    // // Simulate hotel creation
    // Hotel mockHotel = new Hotel();
    // mockHotel.setId(hotelId);
    // mockHotel.setName("Sunset Hotel");

    // // Simulate room creation using SingleRoom instead of RoomFactory
    // Room mockRoom = new SingleRoom(mockHotel, generatedRoomId, pricePerNight,
    // maxOccupancy);

    // // Ensure the mock behavior is set up correctly
    // doReturn(null).when(roomService).getHotelById(anyLong());
    // when(roomService.createRoom(any(Hotel.class), anyLong(), any(RoomType.class),
    // anyDouble(), anyInt()))
    // .thenReturn(mockRoom);

    // // Perform the POST request and verify the response
    // mockMvc.perform(post("/rooms/{hotelId}/{roomId}", hotelId, generatedRoomId)
    // .param("roomType", roomType.name()) // Pass room type as a parameter
    // .param("pricePerNight", String.valueOf(pricePerNight)) // Pass price as a
    // parameter
    // .param("maxOccupancy", String.valueOf(maxOccupancy)) // Pass max occupancy as
    // a parameter
    // .contentType(MediaType.APPLICATION_JSON))
    // .andExpect(status().isCreated()) // Expect a 201 Created status
    // .andExpect(jsonPath("$.message").value("Room created successfully")) // Check
    // message
    // .andExpect(jsonPath("$.hotelId").value(hotelId)) // Check hotelId in the
    // response
    // .andExpect(jsonPath("$.roomId").value(generatedRoomId)) // Check roomId in
    // the response
    // .andExpect(jsonPath("$.pricePerNight").value(pricePerNight)) // Check price
    // per night
    // .andExpect(jsonPath("$.maxOccupancy").value(maxOccupancy)); // Check max
    // occupancy
    // }

    // @Test
    // void testGetAvailableRooms_whenRoomsExist_returnsRoomList() throws Exception
    // {

    // Long hotelId = 3L;

    // // Simulate hotel creation
    // Hotel mockHotel = new Hotel();
    // mockHotel.setId(hotelId);
    // mockHotel.setName("Sunset Hotel");

    // List<Room> mockRooms = List.of(
    // new SingleRoom(mockHotel, 101L, 50.0, 2),
    // new SingleRoom(mockHotel, 102L, 50.0, 2));

    // when(roomService.getAvailableRoomsForHotel(hotelId)).thenReturn(mockRooms);

    // mockMvc.perform(get("/rooms/{hotelId}", hotelId))
    // .andExpect(status().isOk());
    // }

    @Test
    void testGetAvailableRooms_whenNoRoomsFound_returns404() throws Exception {
        Long hotelId = 1L;

        lenient().when(roomService.getAvailableRoomsForHotel(hotelId)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/rooms/{hotelId}", hotelId))
                .andExpect(status().isNotFound());
    }

}