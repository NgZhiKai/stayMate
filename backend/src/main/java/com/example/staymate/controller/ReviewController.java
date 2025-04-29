package com.example.staymate.controller;

import java.util.List;
import java.util.stream.Collectors;

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
import com.example.staymate.dto.review.ReviewDTO;
import com.example.staymate.entity.Review.Review;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.user.User;
import com.example.staymate.exception.ResourceNotFoundException;
import com.example.staymate.service.HotelService;
import com.example.staymate.service.ReviewService;
import com.example.staymate.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

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

    @Operation(summary = "Get all reviews", description = "Retrieve all reviews from the system.")
    @GetMapping
    public ResponseEntity<CustomResponse<List<ReviewDTO>>> getAllReviews() {
        try {
            List<Review> reviews = reviewService.getAllReviews();

            List<ReviewDTO> reviewDTOs = reviews.stream()
                    .map(review -> new ReviewDTO(
                            review.getHotel().getId(),
                            review.getUser().getId(),
                            review.getComment(),
                            review.getCreatedAt(),
                            review.getRating()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new CustomResponse<>("Reviews retrieved successfully", reviewDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while fetching reviews", null));
        }
    }

    @Operation(summary = "Get review by ID", description = "Retrieve a review by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<ReviewDTO>> getReviewById(
            @Parameter(description = "ID of the review to retrieve") @PathVariable Long id) {
        try {
            Review review = reviewService.getReviewById(id);

            if (review == null) {
                throw new ResourceNotFoundException("Review not found for this id: " + id);
            }

            ReviewDTO reviewDTO = new ReviewDTO(
                    review.getHotel().getId(),
                    review.getUser().getId(),
                    review.getComment(),
                    review.getCreatedAt(),
                    review.getRating());

            return ResponseEntity.ok(new CustomResponse<>("Review retrieved successfully", reviewDTO));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while fetching the review", null));
        }
    }

    @Operation(summary = "Create a new review", description = "Create and save a new review for a hotel by a user.")
    @PostMapping
    public ResponseEntity<CustomResponse<ReviewDTO>> createReview(
            @Parameter(description = "The review details to be created") @RequestBody ReviewDTO reviewDTO) {
        try {
            Hotel hotel = hotelService.getHotelById(reviewDTO.getHotelId());
            if (hotel == null) {
                throw new ResourceNotFoundException("Hotel not found for this id: " + reviewDTO.getHotelId());
            }

            User user = userService.getUserById(reviewDTO.getUserId());
            if (user == null) {
                throw new ResourceNotFoundException("User not found for this id: " + reviewDTO.getUserId());
            }

            Review review = new Review();
            review.setHotel(hotel);
            review.setUser(user);
            review.setComment(reviewDTO.getComment());
            review.setCreatedAt(reviewDTO.getCreated());
            review.setRating(reviewDTO.getRating());

            Review savedReview = reviewService.saveReview(review);

            ReviewDTO savedReviewDTO = new ReviewDTO(
                    savedReview.getHotel().getId(),
                    savedReview.getUser().getId(),
                    savedReview.getComment(),
                    savedReview.getCreatedAt(),
                    savedReview.getRating());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CustomResponse<>("Review created successfully", savedReviewDTO));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while creating the review", null));
        }
    }

    @Operation(summary = "Update an existing review", description = "Update the details of an existing review by its ID.")
    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse<ReviewDTO>> updateReview(
            @Parameter(description = "ID of the review to update") @PathVariable Long id,
            @Parameter(description = "The updated review details") @RequestBody ReviewDTO reviewDTO) {
        try {
            Review existingReview = reviewService.getReviewById(id);
            if (existingReview == null) {
                throw new ResourceNotFoundException("Review not found for this id: " + id);
            }

            Hotel hotel = hotelService.getHotelById(reviewDTO.getHotelId());
            if (hotel == null) {
                throw new ResourceNotFoundException("Hotel not found for this id: " + reviewDTO.getHotelId());
            }

            User user = userService.getUserById(reviewDTO.getUserId());
            if (user == null) {
                throw new ResourceNotFoundException("User not found for this id: " + reviewDTO.getUserId());
            }

            existingReview.setHotel(hotel);
            existingReview.setUser(user);
            existingReview.setComment(reviewDTO.getComment());
            existingReview.setCreatedAt(reviewDTO.getCreated());
            existingReview.setRating(reviewDTO.getRating());

            Review updatedReview = reviewService.saveReview(existingReview);

            ReviewDTO updatedReviewDTO = new ReviewDTO(
                    updatedReview.getHotel().getId(),
                    updatedReview.getUser().getId(),
                    updatedReview.getComment(),
                    updatedReview.getCreatedAt(),
                    updatedReview.getRating());

            return ResponseEntity.ok(new CustomResponse<>("Review updated successfully", updatedReviewDTO));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while updating the review", null));
        }
    }

    @Operation(summary = "Delete a review by ID", description = "Delete a review by its ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse<String>> deleteReview(
            @Parameter(description = "ID of the review to delete") @PathVariable Long id) {
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

    @Operation(summary = "Get reviews by hotel ID", description = "Retrieve all reviews for a specific hotel by its ID.")
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<CustomResponse<List<ReviewDTO>>> getReviewsByHotelId(
            @Parameter(description = "ID of the hotel to retrieve reviews for") @PathVariable Long hotelId) {
        try {
            // Fetch hotel by ID to validate if the hotel exists
            Hotel hotel = hotelService.getHotelById(hotelId);
            if (hotel == null) {
                throw new ResourceNotFoundException("Hotel not found for this id: " + hotelId);
            }

            // Fetch reviews for the hotel
            List<Review> reviews = reviewService.findReviewsByHotel(hotel);

            // Map reviews to ReviewDTO
            List<ReviewDTO> reviewDTOs = reviews.stream()
                    .map(review -> new ReviewDTO(
                            review.getHotel().getId(),
                            review.getUser().getId(),
                            review.getComment(),
                            review.getCreatedAt(),
                            review.getRating()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new CustomResponse<>("Reviews retrieved successfully", reviewDTOs));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An error occurred while fetching reviews", null));
        }
    }

}
