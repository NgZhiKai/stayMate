package com.example.staymate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.staymate.dto.custom.CustomResponse;
import com.example.staymate.entity.Review.Review;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.user.User;
import com.example.staymate.exception.ResourceNotFoundException;
import com.example.staymate.service.HotelService;
import com.example.staymate.service.ReviewService;
import com.example.staymate.service.UserService;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final HotelService hotelService;
    private final UserService userService;

    @Autowired
    public ReviewController(ReviewService reviewService, HotelService hotelService, UserService userService) {
        this.reviewService = reviewService;
        this.hotelService = hotelService;
        this.userService = userService;
    }

    // Get all reviews
    @GetMapping
    public ResponseEntity<CustomResponse<List<Review>>> getAllReviews() {
        try {
            List<Review> reviews = reviewService.getAllReviews();
            return ResponseEntity.ok(new CustomResponse<>("Reviews retrieved successfully", reviews));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while fetching reviews", null));
        }
    }

    // Get review by ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<Review>> getReviewById(@PathVariable Long id) {
        try {
            Review review = reviewService.getReviewById(id);
            if (review == null) {
                throw new ResourceNotFoundException("Review not found for this id: " + id);
            }
            return ResponseEntity.ok(new CustomResponse<>("Review retrieved successfully", review));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while fetching the review", null));
        }
    }

    // Create a new review
    @PostMapping
    public ResponseEntity<CustomResponse<Review>> createReview(@RequestBody Review review) {
        try {
            Hotel hotel = hotelService.getHotelById(review.getHotel().getId());
            if (hotel == null) {
                throw new ResourceNotFoundException("Hotel not found for this id: " + review.getHotel().getId());
            }

            User user = userService.getUserById(review.getUser().getId());
            if (user == null) {
                throw new ResourceNotFoundException("User not found for this id: " + review.getUser().getId());
            }

            review.setHotel(hotel);
            review.setUser(user);

            Review savedReview = reviewService.saveReview(review);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CustomResponse<>("Review created successfully", savedReview));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while creating the review", null));
        }
    }

    // Update an existing review
    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse<Review>> updateReview(@PathVariable Long id, @RequestBody Review review) {
        try {
            Review existingReview = reviewService.getReviewById(id);
            if (existingReview == null) {
                throw new ResourceNotFoundException("Review not found for this id: " + id);
            }

            Hotel hotel = hotelService.getHotelById(review.getHotel().getId());
            if (hotel == null) {
                throw new ResourceNotFoundException("Hotel not found for this id: " + review.getHotel().getId());
            }

            User user = userService.getUserById(review.getUser().getId());
            if (user == null) {
                throw new ResourceNotFoundException("User not found for this id: " + review.getUser().getId());
            }

            review.setHotel(hotel);
            review.setUser(user);
            review.setId(id);

            Review updatedReview = reviewService.saveReview(review);
            return ResponseEntity.ok(new CustomResponse<>("Review updated successfully", updatedReview));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while updating the review", null));
        }
    }

    // Delete a review by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse<String>> deleteReview(@PathVariable Long id) {
        try {
            Review review = reviewService.getReviewById(id);
            if (review == null) {
                throw new ResourceNotFoundException("Review not found for this id: " + id);
            }
            reviewService.deleteReview(id);
            return ResponseEntity
                    .ok(new CustomResponse<>("Review deleted successfully", "Review with id " + id + " was deleted"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while deleting the review", null));
        }
    }

    // Get reviews for a specific hotel
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<CustomResponse<List<Review>>> getReviewsByHotel(@PathVariable Long hotelId) {
        try {
            Hotel hotel = hotelService.getHotelById(hotelId);
            if (hotel == null) {
                throw new ResourceNotFoundException("Hotel not found for this id: " + hotelId);
            }
            List<Review> reviews = reviewService.findReviewsByHotel(hotel);
            return ResponseEntity.ok(new CustomResponse<>("Reviews for hotel retrieved successfully", reviews));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while fetching reviews for the hotel", null));
        }
    }

    // Get reviews by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<CustomResponse<List<Review>>> getReviewsByUser(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) {
                throw new ResourceNotFoundException("User not found for this id: " + userId);
            }
            List<Review> reviews = reviewService.findReviewsByUser(user);
            return ResponseEntity.ok(new CustomResponse<>("Reviews by user retrieved successfully", reviews));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while fetching reviews by user", null));
        }
    }

    // Get reviews for a specific hotel by a specific user
    @GetMapping("/hotel/{hotelId}/user/{userId}")
    public ResponseEntity<CustomResponse<List<Review>>> getReviewsByHotelAndUser(@PathVariable Long hotelId,
            @PathVariable Long userId) {
        try {
            Hotel hotel = hotelService.getHotelById(hotelId);
            if (hotel == null) {
                throw new ResourceNotFoundException("Hotel not found for this id: " + hotelId);
            }

            User user = userService.getUserById(userId);
            if (user == null) {
                throw new ResourceNotFoundException("User not found for this id: " + userId);
            }

            List<Review> reviews = reviewService.findReviewsByHotelAndUser(hotel, user);
            return ResponseEntity.ok(new CustomResponse<>("Reviews for hotel by user retrieved successfully", reviews));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while fetching reviews for the hotel by user", null));
        }
    }
}
