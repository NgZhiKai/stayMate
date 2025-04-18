package com.example.staymate.controller;

import static org.mockito.Mockito.lenient;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.staymate.entity.Review.Review;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.user.User;
import com.example.staymate.service.HotelService;
import com.example.staymate.service.ReviewService;
import com.example.staymate.service.UserService;

@ExtendWith(MockitoExtension.class)
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private ReviewService reviewService;

    @Mock
    private HotelService hotelService;

    @Mock
    private UserService userService;

    @InjectMocks
    private ReviewController reviewController;

    private Hotel hotel;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(reviewController).build();

        hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Sample Hotel");

        user = new User();
        user.setId(1L);
        user.setFirstName("john_doe");
    }

    @Test
    void testGetAllReviews() throws Exception {
        // Arrange
        Review review = new Review();  // Mock a Review entity
        review.setHotel(hotel);  // Assuming the Review has a Hotel object
        review.setUser(user);  // Assuming the Review has a User object
        review.setComment("Great stay!");
        review.setCreatedAt(LocalDateTime.now());
        review.setRating(5);

        List<Review> reviews = Arrays.asList(review, review);  // Create a list of Review entities

        // Mocking reviewService to return the list of Review entities
        lenient().when(reviewService.getAllReviews()).thenReturn(reviews);

        // Act & Assert
        mockMvc.perform(get("/reviews"))
                .andExpect(status().isOk())  // Expect HTTP status 200 OK
                .andExpect(jsonPath("$.message").value("Reviews retrieved successfully"));
    }

    
}
