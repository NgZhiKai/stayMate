package com.example.staymate.entity.bookmark;

import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.user.User;
import jakarta.persistence.*;

@Entity
@IdClass(BookmarkId.class)
@Table(name = "bookmark")
public class Bookmark {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", referencedColumnName = "id", nullable = false)
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotelid", referencedColumnName = "id", nullable = false)
    private Hotel hotel;

    public Bookmark() {}

    public Bookmark(User user, Hotel hotel) {
        this.user = user;
        this.hotel = hotel;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }
}
