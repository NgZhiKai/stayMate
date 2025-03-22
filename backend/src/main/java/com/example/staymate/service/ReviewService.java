package com.example.staymate.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.staymate.entity.Review.Review;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.user.User;
import com.example.staymate.exception.ResourceNotFoundException; // Import the custom exception
import com.example.staymate.repository.ReviewRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    // Save or update a review
    public Review saveReview(Review review) {
        if (review.getHotel() == null || review.getUser() == null) {
            throw new ResourceNotFoundException("Hotel or User must be provided.");
        }
        return reviewRepository.save(review);
    }

    // Get all reviews
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Get review by ID
    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found for this id: " + id));
    }

    // Delete a review by ID
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review not found for this id: " + id);
        }
        reviewRepository.deleteById(id);

    }

    // Find reviews by hotel
    public List<Review> findReviewsByHotel(Hotel hotel) {
        if (hotel == null) {
            throw new ResourceNotFoundException("Hotel must be provided.");
        }
        return reviewRepository.findByHotel(hotel);
    }

    // Find reviews by user
    public List<Review> findReviewsByUser(User user) {
        if (user == null) {
            throw new ResourceNotFoundException("User must be provided.");
        }
        return reviewRepository.findByUser(user);
    }

    // Find reviews by both hotel and user
    public List<Review> findReviewsByHotelAndUser(Hotel hotel, User user) {
        if (hotel == null || user == null) {
            throw new ResourceNotFoundException("Hotel and User must be provided.");
        }
        return reviewRepository.findByHotelAndUser(hotel, user);
    }
}
