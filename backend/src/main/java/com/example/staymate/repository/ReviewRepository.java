package com.example.staymate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.staymate.entity.Review.Review;
import com.example.staymate.entity.hotel.Hotel;
import com.example.staymate.entity.user.User;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Find reviews by hotel
    List<Review> findByHotel(Hotel hotel);

    // Find reviews by user
    List<Review> findByUser(User user);

    // Find reviews by hotel and user
    List<Review> findByHotelAndUser(Hotel hotel, User user);
}
