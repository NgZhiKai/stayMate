package com.example.staymate.service;

import com.example.staymate.repository.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    @Autowired
    public BookmarkService(BookmarkRepository bookmarkRepository) {
        this.bookmarkRepository = bookmarkRepository;
    }

    /**
     * Adds a bookmark (userId -> hotelId)
     *
     * @param userId   The ID of the user
     * @param hotelId  The ID of the hotel to be bookmarked
     */
    public void addBookmark(Long userId, Long hotelId) {
        bookmarkRepository.addBookmark(userId, hotelId);
    }

    /**
     * Retrieves a list of hotel IDs for a given user ID.
     *
     * @param userId The ID of the user
     * @return A list of hotel IDs bookmarked by the user
     */
    public List<Long> getHotelIdsByUserId(Long userId) {
        return bookmarkRepository.findHotelIdsByUserId(userId);
    }
}
