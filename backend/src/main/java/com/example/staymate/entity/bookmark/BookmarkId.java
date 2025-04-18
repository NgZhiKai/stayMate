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

    // equals and hashCode are required for composite keys
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BookmarkId that)) return false;
        return Objects.equals(user, that.user) && Objects.equals(hotel, that.hotel);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, hotel);
    }
}
