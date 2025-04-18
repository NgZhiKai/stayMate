package com.example.staymate.repository;

import com.example.staymate.entity.bookmark.Bookmark;
import com.example.staymate.entity.bookmark.BookmarkId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookmarkRepository extends JpaRepository<Bookmark, BookmarkId> {

    // Find all hotel ids for a specific user
    @Query("SELECT b.hotel.id FROM Bookmark b WHERE b.user.id = :userId")
    List<Long> findHotelIdsByUserId(Long userId);

    // Delete a bookmark based on userId and hotelId
    void deleteByUserIdAndHotelId(Long userId, Long hotelId);
}
