package com.example.staymate.dto.review;

import java.time.LocalDateTime;

import com.example.staymate.entity.Review.Review;

public class ReviewDTO {
    private Long hotelId;
    private Long userId;
    private String comment;
    private LocalDateTime created;
    private int rating;

    public ReviewDTO() {
    }

    public ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setHotelId(review.getHotel().getId());
        dto.setUserId(review.getUser().getId());
        return dto;
    }

    public ReviewDTO(Long hotelId, Long userId, String comment, LocalDateTime created, int rating) {
        this.hotelId = hotelId;
        this.userId = userId;
        this.comment = comment;
        this.created = created;
        this.rating = rating;
    }

    // Getters and Setters
    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
