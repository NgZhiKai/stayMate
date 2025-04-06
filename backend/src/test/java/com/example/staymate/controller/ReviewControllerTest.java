// package com.example.staymate.controller;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertNotNull;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.doReturn;
// import static org.mockito.Mockito.doThrow;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;
// import static
// org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
// import static
// org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
// import static
// org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// import static
// org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
// import static
// org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
// import static
// org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// import java.util.Arrays;
// import java.util.List;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.setup.MockMvcBuilders;

// import com.example.staymate.dto.review.ReviewDTO;
// import com.example.staymate.entity.booking.Booking;
// import com.example.staymate.entity.hotel.Hotel;
// import com.example.staymate.entity.user.User;
// import com.example.staymate.exception.ResourceNotFoundException;
// import com.example.staymate.service.HotelService;
// import com.example.staymate.service.ReviewService;
// import com.example.staymate.service.UserService;

// @ExtendWith(MockitoExtension.class)
// class ReviewControllerTest {

// @Mock
// private ReviewService reviewService;

// @Mock
// private HotelService hotelService;

// @Mock
// private UserService userService;

// @InjectMocks
// private ReviewController reviewController;

// private MockMvc mockMvc;

// private Hotel hotel;
// private User user;

// @BeforeEach
// void setUp() {
// mockMvc = MockMvcBuilders.standaloneSetup(reviewController).build();

// hotel = new Hotel();
// hotel.setId(1L);
// hotel.setName("Sample Hotel");

// user = new User();
// user.setId(1L);
// user.setFirstName("john_doe");
// }

// @Test
// void testGetAllReviews() throws Exception {
// // Arrange
// ReviewDTO reviewDTO = new ReviewDTO(1L, 1L, "Great stay!", null, 5);
// List<ReviewDTO> reviews = Arrays.asList(reviewDTO, reviewDTO);
// when(reviewService.createBooking(any(Booking.class))).thenReturn(booking);
// doReturn(reviews).when(reviewService).getAllReviews();

// // Act & Assert
// mockMvc.perform(get("/reviews"))
// .andExpect(status().isOk())
// .andExpect(jsonPath("$.message").value("Reviews retrieved successfully"))
// .andExpect(jsonPath("$.data[0].rating").value(5))
// .andExpect(jsonPath("$.data[0].comment").value("Great stay!"));
// }

// @Test
// void testGetReviewById() throws Exception {
// // Arrange
// ReviewDTO reviewDTO = new ReviewDTO(1L, 1L, "Great stay!", null, 5);
// doReturn(reviewDTO).when(reviewService).getReviewById(1L);

// // Act & Assert
// mockMvc.perform(get("/reviews/{id}", 1L))
// .andExpect(status().isOk())
// .andExpect(jsonPath("$.message").value("Review retrieved successfully"))
// .andExpect(jsonPath("$.data.rating").value(5))
// .andExpect(jsonPath("$.data.comment").value("Great stay!"));
// }

// @Test
// void testGetReviewById_NotFound() throws Exception {
// // Arrange
// doThrow(new ResourceNotFoundException("Review not found for this id: 999"))
// .when(reviewService).getReviewById(999L);

// // Act & Assert
// mockMvc.perform(get("/reviews/{id}", 999L))
// .andExpect(status().isNotFound())
// .andExpect(jsonPath("$.message").value("Review not found for this id: 999"));
// }

// // @Test
// // void testCreateReview() throws Exception {
// // // Arrange
// // ReviewDTO reviewDTO = new ReviewDTO(1L, 1L, "Great stay!", null, 5);
// // doReturn(hotel).when(hotelService).getHotelById(1L);
// // doReturn(user).when(userService).getUserById(1L);
// // doReturn(reviewDTO).when(reviewService).saveReview(any(ReviewDTO.class));

// // // Act & Assert
// // mockMvc.perform(post("/reviews")
// // .contentType("application/json")
// // .content("{\"hotel\": {\"id\": 1}, \"user\": {\"id\": 1}, \"rating\": 5,
// \"comment\": \"Great stay!\"}"))
// // .andExpect(status().isCreated())
// // .andExpect(jsonPath("$.data.id").value(1L))
// // .andExpect(jsonPath("$.data.rating").value(5))
// // .andExpect(jsonPath("$.data.comment").value("Great stay!"));
// // }

// // @Test
// // void testCreateReview_HotelNotFound() throws Exception {
// // // Arrange
// // doReturn(null).when(hotelService).getHotelById(1L);

// // // Act & Assert
// // mockMvc.perform(post("/reviews")
// // .contentType("application/json")
// // .content("{\"hotel\": {\"id\": 1}, \"user\": {\"id\": 1}, \"rating\": 5,
// \"comment\": \"Great stay!\"}"))
// // .andExpect(status().isNotFound())
// // .andExpect(jsonPath("$.message").value("Hotel not found for this id: 1"));
// // }

// // @Test
// // void testCreateReview_UserNotFound() throws Exception {
// // // Arrange
// // doReturn(hotel).when(hotelService).getHotelById(1L);
// // doReturn(null).when(userService).getUserById(1L);

// // // Act & Assert
// // mockMvc.perform(post("/reviews")
// // .contentType("application/json")
// // .content("{\"hotel\": {\"id\": 1}, \"user\": {\"id\": 1}, \"rating\": 5,
// \"comment\": \"Great stay!\"}"))
// // .andExpect(status().isNotFound())
// // .andExpect(jsonPath("$.message").value("User not found for this id: 1"));
// // }

// // @Test
// // void testUpdateReview() throws Exception {
// // // Arrange
// // ReviewDTO updatedReviewDTO = new ReviewDTO(1L, 1L, "Nice stay!", null, 4);
// // doReturn(updatedReviewDTO).when(reviewService).getReviewById(1L);
// // doReturn(hotel).when(hotelService).getHotelById(1L);
// // doReturn(user).when(userService).getUserById(1L);
// //
// doReturn(updatedReviewDTO).when(reviewService).saveReview(any(ReviewDTO.class));

// // // Act & Assert
// // mockMvc.perform(put("/reviews/{id}", 1L)
// // .contentType("application/json")
// // .content("{\"hotel\": {\"id\": 1}, \"user\": {\"id\": 1}, \"rating\": 4,
// \"comment\": \"Nice stay!\"}"))
// // .andExpect(status().isOk())
// // .andExpect(jsonPath("$.data.id").value(1L))
// // .andExpect(jsonPath("$.data.rating").value(4))
// // .andExpect(jsonPath("$.data.comment").value("Nice stay!"));
// // }

// @Test
// void testDeleteReview() throws Exception {
// // Arrange
// doReturn(new ReviewDTO(1L, 1L, "Great stay!", null,
// 5)).when(reviewService).getReviewById(1L);

// // Act & Assert
// mockMvc.perform(delete("/reviews/{id}", 1L))
// .andExpect(status().isOk())
// .andExpect(jsonPath("$.message").value("Review deleted successfully"))
// .andExpect(jsonPath("$.data").value("Review with id 1 was deleted"));

// verify(reviewService).deleteReview(1L);
// }

// @Test
// void testDeleteReview_NotFound() throws Exception {
// // Arrange
// doThrow(new ResourceNotFoundException("Review not found for this id: 1"))
// .when(reviewService).getReviewById(1L);

// // Act & Assert
// mockMvc.perform(delete("/reviews/1"))
// .andExpect(status().isNotFound())
// .andExpect(jsonPath("$.message").value("Review not found for this id: 1"));
// }
// }
