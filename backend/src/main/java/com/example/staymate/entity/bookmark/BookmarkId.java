package com.example.staymate.entity.bookmark;

import java.io.Serializable;
import java.util.Objects;

public class BookmarkId implements Serializable {
    private Long user;
    private Long hotel;

    public BookmarkId() {}

    public BookmarkId(Long user, Long hotel) {
        this.user = user;
        this.hotel = hotel;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BookmarkId)) return false;
        BookmarkId that = (BookmarkId) o;
        return Objects.equals(user, that.user) &&
                Objects.equals(hotel, that.hotel);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, hotel);
    }
}
