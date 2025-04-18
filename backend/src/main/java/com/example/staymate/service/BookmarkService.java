package com.example.staymate.service;

import com.example.staymate.entity.bookmark.Bookmark;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.user.User;
import com.example.staymate.repository.BookmarkRepository;
import com.example.staymate.repository.HotelRepository;
import com.example.staymate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;

    @Autowired
    public BookmarkService(BookmarkRepository bookmarkRepository,
                           UserRepository userRepository,
                           HotelRepository hotelRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
    }

    // Add a bookmark for a user and a hotel
    public void addBookmark(Long userId, Long hotelId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new RuntimeException("Hotel not found"));

        Bookmark bookmark = new Bookmark(user, hotel);
        bookmarkRepository.save(bookmark);
    }

    // Get all hotel ids for a specific user
    public List<Long> getHotelIdsByUserId(Long userId) {
        return bookmarkRepository.findHotelIdsByUserId(userId);
    }

    // Remove a bookmark based on userId and hotelId
    public void removeBookmark(Long userId, Long hotelId) {
        bookmarkRepository.deleteByUserIdAndHotelId(userId, hotelId);
    }
}
