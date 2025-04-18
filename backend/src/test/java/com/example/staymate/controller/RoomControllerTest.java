package com.example.staymate.controller;

import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.staymate.entity.enums.RoomStatus;
import com.example.staymate.entity.room.Room;
import com.example.staymate.entity.room.RoomId;
import com.example.staymate.entity.room.SingleRoom;
import com.example.staymate.service.RoomService;

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

    @Test
    void testGetAvailableRooms_whenNoRoomsFound_returns404() throws Exception {
        Long hotelId = 1L;

        lenient().when(roomService.getAvailableRoomsForHotel(hotelId))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/rooms/{hotelId}", hotelId))
                .andExpect(status().isNotFound())
                .andExpect(content().string("")); // since body is null
    }

    // @Test
    // void testGetAvailableRooms_whenRoomsFound_returns200WithRoomList() throws Exception {
    //     Long hotelId = 1L;
    //     Room room = new SingleRoom();
    //     room.setId(new RoomId(hotelId, 101L));
    //     room.setMaxOccupancy(1);
    //     room.setPricePerNight(1);
    //     room.setStatus(RoomStatus.AVAILABLE);

    //     List<Room> rooms = List.of(room);

    //     when(roomService.getAvailableRoomsForHotel(hotelId)).thenReturn(rooms);

    //     mockMvc.perform(get("/rooms/{hotelId}", hotelId))
    //             .andExpect(status().isOk())
    //             .andExpect(jsonPath("$[0].id.roomId").value(101))
    //             .andExpect(jsonPath("$[0].id.hotelId").value(1))
    //             .andExpect(jsonPath("$[0].status").value("AVAILABLE"));

    // }

}