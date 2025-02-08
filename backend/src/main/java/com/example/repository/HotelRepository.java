package com.example.repository;

import com.example.entity.Hotel;
import com.example.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByOrderByPricePerNightAsc();
    List<Hotel> findByOrderByPricePerNightDesc();
    List<Hotel> findByNameContaining(String name);
}
