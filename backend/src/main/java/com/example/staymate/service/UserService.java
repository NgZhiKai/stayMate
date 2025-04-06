package com.example.staymate.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.staymate.entity.enums.UserRole;
import com.example.staymate.entity.user.User;
import com.example.staymate.exception.InvalidUserException;
import com.example.staymate.exception.ResourceNotFoundException;
import com.example.staymate.observer.EmailObserver;
import com.example.staymate.observer.Observer;
import com.example.staymate.observer.Subject;
import com.example.staymate.repository.UserRepository;

@Service
public class UserService implements Subject {

    @Autowired
    private UserRepository userRepository;

    @Value("${frontend.host_ip}")
    private String baseUrl;

    @Value("${frontend.port}")
    private String serverPort;

    private final List<Observer> observers = new ArrayList<>();

    public User registerUser(User user) {
        if (user == null) {
            throw new InvalidUserException("User cannot be null.");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        user.setVerified(false);
        User savedUser = userRepository.save(user);

        String token = generateVerificationToken(savedUser);
        String verificationLink = baseUrl + ":" + serverPort + "/verify?token=" + token;

        notifyObservers(savedUser, verificationLink);

        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        if (id == null) {
            throw new InvalidUserException("User ID cannot be null.");
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID " + id));
    }

    public User getUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new InvalidUserException("Email cannot be null or empty.");
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
    }

    public List<User> getUsersByRole(UserRole role) {
        if (role == null) {
            throw new InvalidUserException("Role cannot be null.");
        }
        return userRepository.findByRole(role);
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        if (id == null || updatedUser == null) {
            throw new InvalidUserException("User ID and updated user data cannot be null.");
        }

        // Fetch the existing user by ID
        User existingUser = getUserById(id);

        // If user is not found, throw an exception
        if (existingUser == null) {
            throw new InvalidUserException("User not found for ID: " + id);
        }
        updatedUser.setVerified(true);
        // Save the updated user
        return userRepository.save(updatedUser);
    }

    public void deleteUser(Long id) {
        if (id == null) {
            throw new InvalidUserException("User ID cannot be null.");
        }
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    public String generateVerificationToken(User user) {
        if (user == null) {
            throw new InvalidUserException("User cannot be null when generating a verification token.");
        }
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        userRepository.save(user);
        return token;
    }

    public boolean verifyUser(String token) {
        if (token == null || token.isBlank()) {
            throw new InvalidUserException("Verification token cannot be null or empty.");
        }
        User user = userRepository.findByVerificationToken(token);
        if (user == null || user.isVerified()) {
            return false;
        }
        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        return true;
    }

    @Override
    public void addObserver(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void removeObserver(Observer observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers(Map<String, Object> data) {
        for (Observer observer : observers) {
            observer.update(data);
        }
    }

    public void notifyObservers(User user, String verificationLink) {
        if (user == null || verificationLink == null || verificationLink.isBlank()) {
            throw new InvalidUserException("User and verification link cannot be null or empty.");
        }
        Map<String, Object> data = new HashMap<>();
        data.put("verificationLink", verificationLink);
        data.put("user", user);
        notifyObservers(data);
    }

    @Autowired
    public void setEmailObserver(EmailObserver emailObserver) {
        addObserver(emailObserver);
    }

    public String loginUser(String email, String password, String role) {
        if (email == null || password == null) {
            throw new InvalidUserException("Email and password cannot be null.");
        }

        // Fetch the user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));

        // Check if the password matches
        if (!user.checkPassword(password)) {
            throw new InvalidUserException("Invalid email or password.");
        }

        // Check if the user's email is verified
        if (!user.isVerified()) {
            throw new InvalidUserException("User email is not verified.");
        }

        UserRole requestedRole = UserRole.valueOf(role.toUpperCase());

        // Optional: Check if the role matches. You can customize this as needed.
        if (!requestedRole.equals(user.getRole())) {
            throw new InvalidUserException("Role mismatch: The provided role does not match the user's role.");
        }

        // Generate JWT token for the user
        String token = generateVerificationToken(user);

        return token;
    }

}
