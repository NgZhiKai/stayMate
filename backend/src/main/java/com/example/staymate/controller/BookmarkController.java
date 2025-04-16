package com.example.staymate.controller;

import com.example.staymate.service.BookmarkService;
import com.example.staymate.dto.bookmark.BookmarkRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @Autowired
    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    /**
     * Adds a new bookmark (user -> hotel)
     *
     * @param bookmarkRequestDTO DTO containing userId and hotelIds to be bookmarked
     * @return HTTP status indicating success
     */
    @PostMapping("/add")
    public ResponseEntity<String> addBookmark(@RequestBody BookmarkRequestDTO bookmarkRequestDTO) {
        // Loop over the list of hotelIds and add each one as a bookmark for the user
        for (Long hotelId : bookmarkRequestDTO.getHotelIds()) {
            bookmarkService.addBookmark(bookmarkRequestDTO.getUserId(), hotelId);
        }
        return ResponseEntity.ok("Bookmarks added successfully");
    }

    /**
     * Gets a list of hotel IDs bookmarked by the user.
     *
     * @param userId The userId to fetch bookmarked hotels for
     * @return A list of hotel IDs
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Long>> getHotelIdsByUserId(@PathVariable Long userId) {
        List<Long> hotelIds = bookmarkService.getHotelIdsByUserId(userId);
        return ResponseEntity.ok(hotelIds);
    }
}
