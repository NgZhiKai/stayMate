package com.example.staymate.controller;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.staymate.dto.bookmark.BookmarkRequestDTO;
import com.example.staymate.service.BookmarkService;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class BookmarkControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BookmarkService bookmarkService;

    @InjectMocks
    private BookmarkController bookmarkController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(bookmarkController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testAddBookmark_Success() throws Exception {
        // Prepare test data
        BookmarkRequestDTO requestDTO = new BookmarkRequestDTO();
        requestDTO.setUserId(1L);
        requestDTO.setHotelIds(Arrays.asList(1L, 2L, 3L));

        // Mock service behavior
        doNothing().when(bookmarkService).addBookmark(anyLong(), anyLong());

        // Perform the request
        mockMvc.perform(post("/api/bookmarks/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Bookmarks added successfully."));
    }

    @Test
    void testAddBookmark_InvalidRequest() throws Exception {
        // Test with invalid request (empty hotelIds)
        BookmarkRequestDTO requestDTO = new BookmarkRequestDTO();
        requestDTO.setUserId(1L);
        requestDTO.setHotelIds(Arrays.asList());

        mockMvc.perform(post("/api/bookmarks/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk()); // Controller accepts empty lists
    }

    @Test
    void testGetBookmarks_Success() throws Exception {
        // Prepare test data
        List<Long> hotelIds = Arrays.asList(1L, 2L, 3L);
        Long userId = 1L;

        // Mock service behavior
        when(bookmarkService.getHotelIdsByUserId(userId)).thenReturn(hotelIds);

        // Perform the request
        mockMvc.perform(get("/api/bookmarks/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value(1L))
                .andExpect(jsonPath("$[1]").value(2L))
                .andExpect(jsonPath("$[2]").value(3L));
    }

    @Test
    void testGetBookmarks_NoBookmarks() throws Exception {
        // Prepare test data
        Long userId = 1L;

        // Mock service behavior
        when(bookmarkService.getHotelIdsByUserId(userId)).thenReturn(Arrays.asList());

        // Perform the request
        mockMvc.perform(get("/api/bookmarks/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void testRemoveBookmark_Success() throws Exception {
        // Prepare test data
        Long userId = 1L;
        Long hotelId = 1L;

        // Mock service behavior
        doNothing().when(bookmarkService).removeBookmark(userId, hotelId);

        // Perform the request
        mockMvc.perform(delete("/api/bookmarks/remove")
                .param("userId", userId.toString())
                .param("hotelId", hotelId.toString()))
                .andExpect(status().isOk())
                .andExpect(content().string("Bookmark removed."));
    }

    @Test
    void testRemoveBookmark_InvalidParameters() throws Exception {
        // Test with invalid parameters
        mockMvc.perform(delete("/api/bookmarks/remove")
                .param("userId", "invalid")
                .param("hotelId", "invalid"))
                .andExpect(status().isBadRequest());
    }
} 