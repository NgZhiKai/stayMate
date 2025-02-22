package com.example.staymate.controller;

import com.example.staymate.dto.HotelRequestDTO;
import com.example.staymate.dto.RoomRequestDTO;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.enums.RoomType;
import com.example.staymate.service.HotelService;
import com.example.staymate.service.RoomService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class HotelControllerTest {

    private MockMvc mockMvc;

    @Mock
    private HotelService hotelService;

    @Mock
    private RoomService roomService;

    @InjectMocks
    private HotelController hotelController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(hotelController).build();
    }

    @Test
    void shouldCreateHotelSuccessfully() throws Exception {
        // Given: A valid hotel request with enum RoomType
        HotelRequestDTO requestDTO = new HotelRequestDTO();
        requestDTO.setName("Sunset Hotel");
        requestDTO.setAddress("123 Beachside Blvd, Miami, FL");
        requestDTO.setLatitude(25.7617);
        requestDTO.setLongitude(-80.1918);
        requestDTO.setRooms(List.of(
            new RoomRequestDTO(RoomType.SINGLE, 30.0, 2, 10),
            new RoomRequestDTO(RoomType.DOUBLE, 50.0, 4, 10),
            new RoomRequestDTO(RoomType.SUITE, 100.0, 8, 20)
        ));

        // Mock Hotel creation
        Hotel mockHotel = new Hotel();
        mockHotel.setId(1L);
        mockHotel.setName("Sunset Hotel");
        when(hotelService.saveHotel(any(Hotel.class))).thenReturn(mockHotel);

        // When: Sending a POST request
        mockMvc.perform(post("/hotels")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                
                // Then: Expect HTTP 201 Created
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Hotel created successfully"))
                .andExpect(jsonPath("$.hotelId").value(1));
    }

    @Test
    void testGetAllHotels_WhenHotelsFound() throws Exception {
        // Given: A list of hotels
        List<Hotel> hotels = new ArrayList<>();
        Hotel hotelA = new Hotel();  // No-argument constructor
        hotelA.setId(1L);            // Set ID
        hotelA.setName("Hotel A");   // Set Name

        Hotel hotelB = new Hotel();  // No-argument constructor
        hotelB.setId(2L);            // Set ID
        hotelB.setName("Hotel B");   // Set Name

        hotels.add(hotelA);
        hotels.add(hotelB);

        when(hotelService.getAllHotels()).thenReturn(hotels);

        // When & Then: Expect HTTP 200 OK with the list of hotels
        mockMvc.perform(get("/hotels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Hotel A"))
                .andExpect(jsonPath("$[1].name").value("Hotel B"));
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

        Hotel mockHotel = new Hotel();  // No-argument constructor
        mockHotel.setId(hotelId);            // Set ID
        mockHotel.setName(hotelName);

        when(hotelService.getHotelById(hotelId)).thenReturn(Optional.of(mockHotel));

        // When & Then: Expect HTTP 200 OK with the hotel data
        mockMvc.perform(get("/hotels/{id}", hotelId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Mock Hotel"));
    }

    @Test
    void testGetHotelById_WhenHotelNotFound() throws Exception {
        // Given: A hotel ID that does not exist
        Long hotelId = 1L;
        when(hotelService.getHotelById(hotelId)).thenReturn(Optional.empty());

        // When & Then: Expect HTTP 404 Not Found with error message
        mockMvc.perform(get("/hotels/{id}", hotelId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Hotel not found with ID: 1"));
    }

    @Test
    void testUpdateHotel_WhenHotelFoundAndUpdated() throws Exception {
        // Given: A hotel with ID 1
        Long hotelId = 1L;
        String hotelName = "Mock Hotel";
        String hotelNameUpdated = "Updated Hotel";

        Hotel mockHotel = new Hotel();  // No-argument constructor
        mockHotel.setId(hotelId);            // Set ID
        mockHotel.setName(hotelName);

        Hotel updatedHotel = new Hotel();  // No-argument constructor
        updatedHotel.setId(hotelId);            // Set ID
        updatedHotel.setName(hotelNameUpdated);

        when(hotelService.getHotelById(hotelId)).thenReturn(Optional.of(mockHotel));
        when(hotelService.saveHotel(any(Hotel.class))).thenReturn(updatedHotel);

        // When & Then: Expect HTTP 200 OK with the update confirmation
        mockMvc.perform(put("/hotels/{id}", hotelId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedHotel)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Hotel updated successfully"))
                .andExpect(jsonPath("$.hotelId").value(hotelId));
    }

    @Test
    void testUpdateHotel_WhenHotelNotFound() throws Exception {
        // Given: A hotel ID that does not exist
        Long hotelId = 1L;
        String hotelNameUpdated = "Updated Hotel";

        Hotel updatedHotel = new Hotel();  // No-argument constructor
        updatedHotel.setId(hotelId);            // Set ID
        updatedHotel.setName(hotelNameUpdated);

        when(hotelService.getHotelById(hotelId)).thenReturn(Optional.empty());

        // When & Then: Expect HTTP 404 Not Found with error message
        mockMvc.perform(put("/hotels/{id}", hotelId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedHotel)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Hotel not found with ID: 1"));
    }

    @Test
    void testUpdateHotel_WhenUpdateFails() throws Exception {
        // Given: A hotel that exists but update fails
        Long hotelId = 1L;
        String hotelName = "Mock Hotel";

        Hotel existingHotel = new Hotel();  // No-argument constructor
        existingHotel.setId(hotelId);            // Set ID
        existingHotel.setName(hotelName);

        when(hotelService.getHotelById(hotelId)).thenReturn(Optional.of(existingHotel));
        when(hotelService.saveHotel(any(Hotel.class))).thenReturn(null);

        // When & Then: Expect HTTP 400 Bad Request with error message
        mockMvc.perform(put("/hotels/{id}", hotelId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(existingHotel)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Hotel ID: 1 not updated"));
    }

    @Test
    void testDeleteHotel_WhenHotelFoundAndDeleted() throws Exception {
        // Given: A hotel with ID 1
        Long hotelId = 1L;
        String hotelName = "Mock Hotel";

        Hotel mockHotel = new Hotel();  // No-argument constructor
        mockHotel.setId(hotelId);            // Set ID
        mockHotel.setName(hotelName);

        when(hotelService.getHotelById(hotelId)).thenReturn(Optional.of(mockHotel));

        // When & Then: Expect HTTP 200 OK with deletion confirmation
        mockMvc.perform(delete("/hotels/{id}", hotelId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Hotel deleted successfully"))
                .andExpect(jsonPath("$.hotelId").value(hotelId));
    }

    @Test
    void testDeleteHotel_WhenHotelNotFound() throws Exception {
        // Given: A hotel ID that does not exist
        Long hotelId = 1L;
        when(hotelService.getHotelById(hotelId)).thenReturn(Optional.empty());

        // When & Then: Expect HTTP 404 Not Found with error message
        mockMvc.perform(delete("/hotels/{id}", hotelId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Hotel not found with ID: 1"));
    }

    @Test
    void testSearchHotelsByName_WhenHotelsFound() throws Exception {
        // Given: A hotel search by name
        String name = "Hotel";
        List<Hotel> hotels = new ArrayList<>();
        Hotel hotelA = new Hotel();  // No-argument constructor
        hotelA.setId(1L);            // Set ID
        hotelA.setName("Hotel A");   // Set Name

        Hotel hotelB = new Hotel();  // No-argument constructor
        hotelB.setId(2L);            // Set ID
        hotelB.setName("Hotel B");   // Set Name

        hotels.add(hotelA);
        hotels.add(hotelB);
        
        when(hotelService.findHotelsByName(name)).thenReturn(hotels);

        // When & Then: Expect HTTP 200 OK with the list of hotels
        mockMvc.perform(get("/hotels/search")
                .param("name", name))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Hotels found matching the name: Hotel"))
                .andExpect(jsonPath("$.hotels.length()").value(2));
    }

    @Test
    void testSearchHotelsByName_WhenNoHotelsFound() throws Exception {
        // Given: A hotel search by name with no results
        String name = "Hotel";
        when(hotelService.findHotelsByName(name)).thenReturn(List.of());

        // When & Then: Expect HTTP 404 Not Found with error message
        mockMvc.perform(get("/hotels/search")
                .param("name", name))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No hotels found matching the name: Hotel"));
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