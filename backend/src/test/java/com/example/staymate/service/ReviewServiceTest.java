package com.example.staymate.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.staymate.entity.Review.Review;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.user.User;
import com.example.staymate.repository.ReviewRepository;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ReviewService reviewService;

    private Review review;
    private Hotel hotel;
    private User user;

    @BeforeEach
    public void setUp() {
        // Initialize mock objects
        hotel = new Hotel();
        hotel.setId(1L);

        user = new User();
        user.setId(1L);

        review = new Review();
        review.setId(1L);
        review.setHotel(hotel);
        review.setUser(user);
        review.setRating(5);
        review.setComment("Great stay!");
    }

    @Test
    public void testSaveReview() {
        when(reviewRepository.save(any(Review.class))).thenReturn(review); // Mocking the save method

        Review savedReview = reviewService.saveReview(review);

        assertNotNull(savedReview);
        assertEquals(1L, savedReview.getId());
        assertEquals(5, savedReview.getRating());
        verify(reviewRepository, times(1)).save(any(Review.class)); // Verifying save method was called once
    }

    @Test
    public void testGetAllReviews() {
        when(reviewRepository.findAll()).thenReturn(Arrays.asList(review)); // Mocking the findAll method

        List<Review> reviews = reviewService.getAllReviews();

        assertNotNull(reviews);
        assertEquals(1, reviews.size());
        assertEquals(1L, reviews.get(0).getId());
        verify(reviewRepository, times(1)).findAll(); // Verifying that findAll method was called once
    }

    @Test
    public void testGetReviewById() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review)); // Mocking findById

        Review fetchedReview = reviewService.getReviewById(1L);

        assertNotNull(fetchedReview);
        assertEquals(1L, fetchedReview.getId());
        verify(reviewRepository, times(1)).findById(1L); // Verifying that findById method was called once
    }

    @Test
    public void testDeleteReview() {
        when(reviewRepository.existsById(1L)).thenReturn(true); // Mocking existsById

        reviewService.deleteReview(1L);

        verify(reviewRepository, times(1)).deleteById(1L); // Verifying that deleteById method was called once
    }

    @Test
    public void testFindReviewsByHotel() {
        when(reviewRepository.findByHotel(hotel)).thenReturn(Arrays.asList(review)); // Mocking findByHotel

        List<Review> reviews = reviewService.findReviewsByHotel(hotel);

        assertNotNull(reviews);
        assertEquals(1, reviews.size());
        assertEquals(hotel, reviews.get(0).getHotel());
        verify(reviewRepository, times(1)).findByHotel(hotel); // Verifying that findByHotel method was called once
    }

    @Test
    public void testFindReviewsByUser() {
        when(reviewRepository.findByUser(user)).thenReturn(Arrays.asList(review)); // Mocking findByUser

        List<Review> reviews = reviewService.findReviewsByUser(user);

        assertNotNull(reviews);
        assertEquals(1, reviews.size());
        assertEquals(user, reviews.get(0).getUser());
        verify(reviewRepository, times(1)).findByUser(user); // Verifying that findByUser method was called once
    }

    @Test
    public void testFindReviewsByHotelAndUser() {
        when(reviewRepository.findByHotelAndUser(hotel, user)).thenReturn(Arrays.asList(review)); // Mocking findByHotelAndUser

        List<Review> reviews = reviewService.findReviewsByHotelAndUser(hotel, user);

        assertNotNull(reviews);
        assertEquals(1, reviews.size());
        assertEquals(hotel, reviews.get(0).getHotel());
        assertEquals(user, reviews.get(0).getUser());
        verify(reviewRepository, times(1)).findByHotelAndUser(hotel, user); // Verifying findByHotelAndUser was called once
    }
}
