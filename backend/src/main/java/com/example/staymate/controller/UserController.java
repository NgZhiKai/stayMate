package com.example.staymate.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.staymate.dto.custom.CustomResponse;
import com.example.staymate.dto.user.UserCreationRequestDTO;
import com.example.staymate.dto.user.UserLoginRequestDTO;
import com.example.staymate.dto.user.UserRequestUpdateDto;
import com.example.staymate.entity.user.User;
import com.example.staymate.exception.InvalidUserException;
import com.example.staymate.exception.ResourceNotFoundException;
import com.example.staymate.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Register a new user", description = "Creates a new user and sends a verification email.")
    @PostMapping("/register")
    public ResponseEntity<CustomResponse<User>> registerUser(
            @Valid @RequestBody @Parameter(description = "User details for registration") UserCreationRequestDTO userDto) {

        try {
            // Convert DTO to User entity
            User user = new User();
            user.setFirstName(userDto.getFirstName());
            user.setLastName(userDto.getLastName());
            user.setEmail(userDto.getEmail());
            user.setPassword(userDto.getPassword());
            user.setPhoneNumber(userDto.getPhoneNumber());
            user.setRole(userDto.getRole());

            // Attempt to register the user
            User savedUser = userService.registerUser(user);

            // Return success response
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CustomResponse<>(
                            "User registered successfully. Please check your email to verify your account.",
                            savedUser));
        } catch (IllegalArgumentException | InvalidUserException ex) {
            // Handle exceptions like email already registered or invalid user input
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        } catch (Exception ex) {
            // Handle unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An unexpected error occurred. Please try again later.", null));
        }
    }

    @Operation(summary = "Login a user", description = "Validates user credentials and returns a token for authenticated sessions.")
    @PostMapping("/login")
    public ResponseEntity<CustomResponse<Map<String, Object>>> loginUser(
            @Valid @RequestBody @Parameter(description = "User login credentials") UserLoginRequestDTO loginDto) {

        // Ensure the user is trying to login with the correct role
        String token = userService.loginUser(loginDto.getEmail(), loginDto.getPassword(), loginDto.getRole());

        if (token != null) {
            // Fetch user details (name, email, role, isVerified)
            User user = userService.getUserByEmail(loginDto.getEmail());

            if (user != null && user.isVerified()) {
                // Create a response with user details and token
                Map<String, Object> responseData = new HashMap<>();
                responseData.put("token", token);
                responseData.put("user", user); // Add user object to the response
                return ResponseEntity.ok(new CustomResponse<>("Login successful", responseData));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new CustomResponse<>("Account is not verified or role mismatch", null));
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new CustomResponse<>("Invalid email or password", null));
        }
    }

    // Get all users
    @Operation(summary = "Retrieve all users", description = "Fetches a list of all users.")
    @GetMapping
    public ResponseEntity<CustomResponse<List<User>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(new CustomResponse<>("Users retrieved successfully", users));
    }

    // Get user by ID with error handling
    @Operation(summary = "Retrieve user by ID", description = "Fetches user details by their unique ID.")
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<User>> getUserById(
            @PathVariable @Parameter(description = "ID of the user to be retrieved") Long id) {

        try {
            User user = userService.getUserById(id); // Now returns a User, not Optional
            return ResponseEntity.ok(new CustomResponse<>("User retrieved successfully", user));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("User not found with ID: " + id, null));
        }
    }

    // Get user by email (better naming)
    @Operation(summary = "Retrieve user by email", description = "Fetches user details by their email address.")
    @GetMapping("/by-email/{email}")
    public ResponseEntity<CustomResponse<User>> getUserByEmail(
            @PathVariable @Parameter(description = "Email of the user to be retrieved") String email) {

        try {
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(new CustomResponse<>("User retrieved successfully", user));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("User not found with email: " + email, null));
        }
    }

    // Update user information
    @Operation(summary = "Update user details", description = "Updates the user's information.")
    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse<User>> updateUser(
            @PathVariable @Parameter(description = "ID of the user to be updated") Long id,
            @Valid @RequestBody @Parameter(description = "Updated user details") UserRequestUpdateDto userRequestUpdateDto) {

        try {
            // Map UserRequestUpdateDto to the existing User entity
            User user = new User();
            user.setId(id);
            user.setFirstName(userRequestUpdateDto.getFirstName());
            user.setLastName(userRequestUpdateDto.getLastName());
            user.setEmail(userRequestUpdateDto.getEmail());
            user.setPassword(userRequestUpdateDto.getPassword());
            user.setPhoneNumber(userRequestUpdateDto.getPhoneNumber());
            user.setRole(userRequestUpdateDto.getRole());

            // Call the service to update the user
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(new CustomResponse<>("User updated successfully", updatedUser));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("User not found with ID: " + id, null));
        }
    }

    // Delete user by ID
    @Operation(summary = "Delete user by ID", description = "Deletes a user from the system by their unique ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse<Void>> deleteUser(
            @PathVariable @Parameter(description = "ID of the user to be deleted") Long id) {

        try {
            userService.deleteUser(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body(new CustomResponse<>("User deleted successfully", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("User not found with ID: " + id, null));
        }
    }

    // Verify user with token
    @Operation(summary = "Verify user account", description = "Verifies the user account using a token from the registration email.")
    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(
            @RequestParam @Parameter(description = "Verification token for user verification") String token) {

        boolean isVerified = userService.verifyUser(token);
        if (isVerified) {
            return ResponseEntity.ok("User verified successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
        }
    }
}
