package com.example.staymate.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.staymate.dto.custom.CustomResponse;
import com.example.staymate.entity.Review.Review;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.user.User;
import com.example.staymate.exception.ResourceNotFoundException;
import com.example.staymate.service.HotelService;
import com.example.staymate.service.ReviewService;
import com.example.staymate.service.UserService;

@ExtendWith(MockitoExtension.class)
class ReviewControllerTest {

    @Mock
    private ReviewService reviewService;

    @Mock
    private HotelService hotelService;

    @Mock
    private UserService userService;

    @InjectMocks
    private ReviewController reviewController;

    private MockMvc mockMvc;

    private Hotel hotel;
    private User user;
    private Review review;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(reviewController).build();

        hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Sample Hotel");

        user = new User();
        user.setId(1L);
        user.setFirstName("john_doe");

        review = new Review();
        review.setId(1L);
        review.setHotel(hotel);
        review.setUser(user);
        review.setRating(5);
        review.setComment("Great stay!");
    }

    @Test
    public void testGetAllReviews() {
        // Arrange
        List<Review> reviews = Arrays.asList(new Review(), new Review());
        when(reviewService.getAllReviews()).thenReturn(reviews);

        // Act
        ResponseEntity<CustomResponse<List<Review>>> response = reviewController.getAllReviews();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Reviews retrieved successfully", response.getBody().getMessage());
        assertEquals(reviews, response.getBody().getData());
    }

    @Test
    public void testGetReviewById() {
        // Arrange
        Long reviewId = 1L;
        Review review = new Review();
        review.setId(reviewId);
        when(reviewService.getReviewById(reviewId)).thenReturn(review);

        // Act
        ResponseEntity<CustomResponse<Review>> response = reviewController.getReviewById(reviewId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Review retrieved successfully", response.getBody().getMessage());
        assertEquals(review, response.getBody().getData());
    }

    @Test
    void testGetReviewById_NotFound() throws Exception {
        // Arrange
        when(reviewService.getReviewById(999L))
                .thenThrow(new ResourceNotFoundException("Review not found for this id: 999"));

        // Act & Assert
        mockMvc.perform(get("/reviews/{id}", 999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Review not found for this id: 999"));
    }

    @Test
    void testCreateReview() throws Exception {
        // Arrange
        when(hotelService.getHotelById(1L)).thenReturn(hotel);
        when(userService.getUserById(1L)).thenReturn(user);
        when(reviewService.saveReview(any(Review.class))).thenReturn(review);

        // Act & Assert
        mockMvc.perform(post("/reviews")
                .contentType("application/json")
                .content(
                        "{\"hotel\": {\"id\": 1}, \"user\": {\"id\": 1}, \"rating\": 5, \"comment\": \"Great stay!\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.rating").value(5))
                .andExpect(jsonPath("$.data.comment").value("Great stay!"));
    }

    @Test
    void testCreateReview_HotelNotFound() throws Exception {
        // Arrange
        when(hotelService.getHotelById(1L)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(post("/reviews")
                .contentType("application/json")
                .content(
                        "{\"hotel\": {\"id\": 1}, \"user\": {\"id\": 1}, \"rating\": 5, \"comment\": \"Great stay!\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Hotel not found for this id: 1"));
    }

    @Test
    void testCreateReview_UserNotFound() throws Exception {
        // Arrange
        when(hotelService.getHotelById(1L)).thenReturn(hotel);
        when(userService.getUserById(1L)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(post("/reviews")
                .contentType("application/json")
                .content(
                        "{\"hotel\": {\"id\": 1}, \"user\": {\"id\": 1}, \"rating\": 5, \"comment\": \"Great stay!\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("User not found for this id: 1"));
    }

    @Test
    void testUpdateReview() throws Exception {
        // Arrange
        Review updatedReview = new Review();
        updatedReview.setId(1L);
        updatedReview.setHotel(hotel);
        updatedReview.setUser(user);
        updatedReview.setRating(4);
        updatedReview.setComment("Nice stay!");

        when(reviewService.getReviewById(1L)).thenReturn(review);
        when(hotelService.getHotelById(1L)).thenReturn(hotel);
        when(userService.getUserById(1L)).thenReturn(user);
        when(reviewService.saveReview(any(Review.class))).thenReturn(updatedReview); // Updated to use any()

        // Act & Assert
        mockMvc.perform(put("/reviews/{id}", 1L)
                .contentType("application/json")
                .content("{\"hotel\": {\"id\": 1}, \"user\": {\"id\": 1}, \"rating\": 4, \"comment\": \"Nice stay!\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.rating").value(4))
                .andExpect(jsonPath("$.data.comment").value("Nice stay!"));
    }

    @Test
    void testUpdateReview_NotFound() throws Exception {
        // Arrange
        when(reviewService.getReviewById(999L))
                .thenThrow(new ResourceNotFoundException("Review not found for this id: 999"));

        // Act & Assert
        mockMvc.perform(put("/reviews/{id}", 999L)
                .contentType("application/json")
                .content("{\"hotel\": {\"id\": 1}, \"user\": {\"id\": 1}, \"rating\": 4, \"comment\": \"Nice stay!\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Review not found for this id: 999"));
    }

    @Test
    void testDeleteReview() throws Exception {
        // Arrange
        when(reviewService.getReviewById(1L)).thenReturn(review);

        // Act & Assert
        mockMvc.perform(delete("/reviews/{id}", 1L))
                .andExpect(status().isOk()) // Expecting 200 OK, since your controller returns this
                .andExpect(jsonPath("$.message").value("Review deleted successfully")) // You can also verify the
                                                                                       // response message
                .andExpect(jsonPath("$.data").value("Review with id 1 was deleted"));

        verify(reviewService).deleteReview(1L);
    }

    @Test
    void testDeleteReview_NotFound() throws Exception {
        // Arrange: Set up the mock to return null when looking for review with ID 999
        when(reviewService.getReviewById(1L))
                .thenThrow(new ResourceNotFoundException("Review not found for this id: 1"));

        // Act & Assert: Perform the delete request and assert the response status and
        // body
        mockMvc.perform(delete("/reviews/1"))
                .andExpect(status().isNotFound()) // Expecting 404 status code
                .andExpect(jsonPath("$.message").value("Review not found for this id: 1"));
    }

}
