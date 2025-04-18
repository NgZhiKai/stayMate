package com.example.staymate.controller;

import com.example.staymate.dto.bookmark.BookmarkRequestDTO;
import com.example.staymate.service.BookmarkService;
import org.springframework.transaction.annotation.Transactional;
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

    // Add bookmarks for a user
    @PostMapping("/add")
    public ResponseEntity<String> addBookmark(@RequestBody BookmarkRequestDTO dto) {
        for (Long hotelId : dto.getHotelIds()) {
            bookmarkService.addBookmark(dto.getUserId(), hotelId);
        }
        return ResponseEntity.ok("Bookmarks added successfully.");
    }

    // Get all hotel ids for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Long>> getBookmarks(@PathVariable Long userId) {
        return ResponseEntity.ok(bookmarkService.getHotelIdsByUserId(userId));
    }

    // Remove a bookmark for a user and hotel
    @DeleteMapping("/remove")
    @Transactional
    public ResponseEntity<String> removeBookmark(@RequestParam Long userId, @RequestParam Long hotelId) {
        bookmarkService.removeBookmark(userId, hotelId);
        return ResponseEntity.ok("Bookmark removed.");
    }
}
