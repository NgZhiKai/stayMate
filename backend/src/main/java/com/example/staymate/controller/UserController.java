package com.example.staymate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.staymate.dto.custom.CustomResponse;
import com.example.staymate.entity.user.User;
import com.example.staymate.exception.ResourceNotFoundException;
import com.example.staymate.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<CustomResponse<User>> registerUser(@Valid @RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(new CustomResponse<>("User registered successfully", savedUser));
    }

    // Get all users
    @GetMapping
    public ResponseEntity<CustomResponse<List<User>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(new CustomResponse<>("Users retrieved successfully", users));
    }

    // Get user by ID with error handling
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<User>> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id); // Now returns a User, not Optional
            return ResponseEntity.ok(new CustomResponse<>("User retrieved successfully", user));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("User not found with ID: " + id, null));
        }
    }

    // Get user by email (better naming)
    @GetMapping("/by-email/{email}")
    public ResponseEntity<CustomResponse<User>> getUserByEmail(@PathVariable String email) {
        try {
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(new CustomResponse<>("User retrieved successfully", user));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("User not found with email: " + email, null));
        }
    }

    // Update user information
    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse<User>> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        try {
            user.setId(id);
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(new CustomResponse<>("User updated successfully", updatedUser));
        } catch (ResourceNotFoundException e) {
            // Add a log to ensure the exception is caught
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("User not found with ID: " + id, null));
        }
    }


    // Delete user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse<Void>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body(new CustomResponse<>("User deleted successfully", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("User not found with ID: " + id, null));
        }
    }
}
