package com.example.staymate.dto.bookmark;

import java.util.List;

public class BookmarkRequestDTO {
    private Long userId;       // Use Long for BIGINT column in MySQL
    private List<Long> hotelIds; // List of hotel IDs that the user has bookmarked

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Long> getHotelIds() {
        return hotelIds;
    }

    public void setHotelIds(List<Long> hotelIds) {
        this.hotelIds = hotelIds;
    }
}
