package com.example.staymate.entity.bookmark;

import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.user.User;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "bookmark")
@IdClass(BookmarkId.class)
public class Bookmark implements Serializable {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", referencedColumnName = "id", nullable = false)
    private Hotel hotel;

    public Bookmark() {}

    public Bookmark(User user, Hotel hotel) {
        this.user = user;
        this.hotel = hotel;
    }

    // Getters and setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Hotel getHotel() { return hotel; }
    public void setHotel(Hotel hotel) { this.hotel = hotel; }
}
