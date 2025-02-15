
package com.example.staymate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.staymate.entity.enums.UserRole;
import com.example.staymate.entity.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Find user by email
    Optional<User> findByEmail(String email);

    // Find users by role
    List<User> findByRole(UserRole role);

    // Custom queries (example)
    List<User> findByLastNameContaining(String lastName);
}
