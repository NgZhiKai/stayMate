package com.example.staymate.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
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
import org.springframework.mock.web.MockMultipartFile;
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
        mockMvc = MockMvcBuilders.standaloneSetup(hotelController)
                .build();
    }

    // Positive Test Cases

    @Test
    void testCreateHotel_Success() throws Exception {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Test Hotel");

        when(hotelService.saveHotel(any(Hotel.class))).thenReturn(hotel);

        MockMultipartFile hotelDetails = new MockMultipartFile(
                "hotelDetails",
                "",
                "application/json",
                "{\"name\":\"Test Hotel\", \"rooms\":[]}".getBytes()
        );

        MockMultipartFile image = new MockMultipartFile(
                "image",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        mockMvc.perform(multipart("/hotels")
                .file(hotelDetails)
                .file(image))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Hotel created successfully"));
    }

    @Test
    void testGetAllHotels_Success() throws Exception {
        List<Hotel> hotels = new ArrayList<>();
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Test Hotel");
        hotels.add(hotel);

        when(hotelService.getAllHotels()).thenReturn(hotels);

        mockMvc.perform(get("/hotels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].name").value("Test Hotel"));
    }

    @Test
    void testGetHotelById_Success() throws Exception {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Test Hotel");

        when(hotelService.getHotelById(1L)).thenReturn(hotel);

        mockMvc.perform(get("/hotels/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Test Hotel"));
    }

    @Test
    void testUpdateHotel_Success() throws Exception {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Updated Hotel");

        when(hotelService.getHotelById(1L)).thenReturn(hotel);
        when(hotelService.saveHotel(any(Hotel.class))).thenReturn(hotel);

        MockMultipartFile hotelDetails = new MockMultipartFile(
                "hotelDetails",
                "",
                "application/json",
                "{\"name\":\"Updated Hotel\"}".getBytes()
        );

        mockMvc.perform(multipart("/hotels/1")
                .file(hotelDetails)
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Hotel updated successfully"));
    }

    @Test
    void testDeleteHotel_Success() throws Exception {
        Hotel hotel = new Hotel();
        hotel.setId(1L);

        when(hotelService.getHotelById(1L)).thenReturn(hotel);

        mockMvc.perform(delete("/hotels/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Hotel deleted successfully"));
    }

    // Negative Test Cases

    @Test
    void testCreateHotel_InvalidJson() throws Exception {
        MockMultipartFile hotelDetails = new MockMultipartFile(
                "hotelDetails",
                "",
                "application/json",
                "invalid json".getBytes()
        );

        mockMvc.perform(multipart("/hotels")
                .file(hotelDetails))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid JSON format for hotel details"));
    }

    @Test
    void testCreateHotel_MissingName() throws Exception {
        MockMultipartFile hotelDetails = new MockMultipartFile(
                "hotelDetails",
                "",
                "application/json",
                "{\"address\":\"Test Address\"}".getBytes()
        );

        mockMvc.perform(multipart("/hotels")
                .file(hotelDetails))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Hotel name is required"));
    }

    @Test
    void testGetAllHotels_NoHotelsFound() throws Exception {
        when(hotelService.getAllHotels()).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/hotels"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No hotels found"));
    }

    @Test
    void testGetHotelById_NotFound() throws Exception {
        when(hotelService.getHotelById(1L))
                .thenThrow(new ResourceNotFoundException("Hotel not found with ID 1"));

        mockMvc.perform(get("/hotels/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Hotel not found with ID 1"));
    }

    @Test
    void testUpdateHotel_NotFound() throws Exception {
        when(hotelService.getHotelById(1L))
                .thenThrow(new ResourceNotFoundException("Hotel not found with ID 1"));

        MockMultipartFile hotelDetails = new MockMultipartFile(
                "hotelDetails",
                "",
                "application/json",
                "{\"name\":\"Updated Hotel\"}".getBytes()
        );

        mockMvc.perform(multipart("/hotels/1")
                .file(hotelDetails)
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                }))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Hotel not found with ID 1"));
    }

    @Test
    void testDeleteHotel_NotFound() throws Exception {
        when(hotelService.getHotelById(1L))
                .thenThrow(new ResourceNotFoundException("Hotel not found with ID 1"));

        mockMvc.perform(delete("/hotels/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Hotel not found with ID 1"));
    }

    @Test
    void testSearchHotelsByName_EmptyQuery() throws Exception {
        mockMvc.perform(get("/hotels/search")
                .param("name", ""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Search query cannot be empty"));
    }

    @Test
    void testSearchHotelsByName_NoResults() throws Exception {
        when(hotelService.findHotelsByName("NonExistent")).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/hotels/search")
                .param("name", "NonExistent"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No hotels found matching the name: NonExistent"));
    }

    @Test
    void testGetHotelRooms_NotFound() throws Exception {
        when(hotelService.getHotelById(1L))
                .thenThrow(new ResourceNotFoundException("Hotel not found with ID 1"));

        mockMvc.perform(get("/hotels/1/rooms"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Hotel not found with ID 1"));
    }
}
