package com.example.staymate.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.exception.ResourceNotFoundException;
import com.example.staymate.service.HotelService;
import com.example.staymate.service.RoomService;

@ExtendWith(MockitoExtension.class)
class HotelControllerTest {

    private MockMvc mockMvc;

    @Mock
    private HotelService hotelService;

    @Mock
    private RoomService roomService;

    @InjectMocks
    private HotelController hotelController;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(hotelController).build();
    }

    @Test
    void testGetAllHotels_WhenHotelsFound() throws Exception {
        // Given: A list of hotels
        List<Hotel> hotels = new ArrayList<>();
        Hotel hotelA = new Hotel();
        hotelA.setId(1L);
        hotelA.setName("Hotel A");

        Hotel hotelB = new Hotel();
        hotelB.setId(2L);
        hotelB.setName("Hotel B");

        hotels.add(hotelA);
        hotels.add(hotelB);

        when(hotelService.getAllHotels()).thenReturn(hotels);

        // When & Then: Expect HTTP 200 OK with the list of hotels
        mockMvc.perform(get("/hotels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$.data[0].name").value("Hotel A"))
                .andExpect(jsonPath("$.data[1].name").value("Hotel B"));
    }

    @Test
    void testGetAllHotels_WhenNoHotelsFound() throws Exception {
        // Given: An empty hotel list
        when(hotelService.getAllHotels()).thenReturn(List.of());

        // When & Then: Expect HTTP 404 Not Found with the error message
        mockMvc.perform(get("/hotels"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No hotels found"));
    }

    @Test
    void testGetHotelById_WhenHotelFound() throws Exception {
        // Given: A hotel with ID 1
        Long hotelId = 1L;
        String hotelName = "Mock Hotel";

        Hotel mockHotel = new Hotel();
        mockHotel.setId(hotelId);
        mockHotel.setName(hotelName);

        when(hotelService.getHotelById(hotelId)).thenReturn(mockHotel);

        // When & Then: Expect HTTP 200 OK with the hotel data
        mockMvc.perform(get("/hotels/{id}", hotelId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Mock Hotel"));
    }

    @Test
    void testGetHotelById_WhenHotelNotFound() throws Exception {
        // Given: A hotel ID that does not exist
        Long hotelId = 1L;
        when(hotelService.getHotelById(hotelId))
                .thenThrow(new ResourceNotFoundException("Hotel not found with ID: " + hotelId));

        // When & Then: Expect HTTP 404 Not Found with error message
        mockMvc.perform(get("/hotels/{id}", hotelId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Hotel not found with ID: 1"));
    }

    @Test
    void testSearchHotelsByName_WhenSearchQueryEmpty() throws Exception {
        // Given: An empty search query
        String name = "";

        // When & Then: Expect HTTP 400 Bad Request with error message
        mockMvc.perform(get("/hotels/search")
                .param("name", name))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Search query cannot be empty"));
    }
}
