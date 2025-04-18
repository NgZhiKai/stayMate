package com.example.staymate.repository;

import com.example.staymate.entity.bookmark.Bookmark;
import com.example.staymate.entity.bookmark.BookmarkId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookmarkRepository extends JpaRepository<Bookmark, BookmarkId> {

    @Query("SELECT b.hotel.id FROM Bookmark b WHERE b.user.id = :userId")
    List<Long> findHotelIdsByUserId(Long userId);

    void deleteByUserIdAndHotelId(Long userId, Long hotelId);
}
