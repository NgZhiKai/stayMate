package com.example.staymate.repository;

import com.example.staymate.entity.bookmark.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    // Custom query to return a list of hotelIds for a given userId from the bookmark table
    @Query("SELECT b.hotel.id FROM Bookmark b WHERE b.user.id = :userId")
    List<Long> findHotelIdsByUserId(Long userId);

    // Custom query to insert a new bookmark entry (userId, hotelId)
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO bookmark (user_id, hotel_id) VALUES (:userId, :hotelId)", nativeQuery = true)
    void addBookmark(Long userId, Long hotelId);
}
