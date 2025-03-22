package com.example.staymate.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.staymate.dto.custom.CustomResponse;
import com.example.staymate.dto.notification.NotificationResponseDTO;
import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.entity.notification.Notification;
import com.example.staymate.entity.user.User;
import com.example.staymate.service.NotificationService;
import com.example.staymate.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @Operation(summary = "Get all notifications by user ID", description = "Retrieve all notifications for a user by their user ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<CustomResponse<List<NotificationResponseDTO>>> getNotificationsByUserId(
            @Parameter(description = "ID of the user to fetch notifications for") @PathVariable Long userId) {
        List<Notification> notifications = notificationService.findByUserId(userId);

        // Convert notifications to DTO
        List<NotificationResponseDTO> responseDTOs = notifications.stream()
                .map(NotificationResponseDTO::new)
                .toList();

        // If no notifications found, return a custom message with an empty list
        if (responseDTOs.isEmpty()) {
            return ResponseEntity
                    .ok(new CustomResponse<>("No notifications found for user ID: " + userId, responseDTOs));
        }

        // Return notifications with a custom success message
        return ResponseEntity.ok(new CustomResponse<>("Notifications retrieved successfully for user ID: " + userId
                + ", Total notifications: " + responseDTOs.size(), responseDTOs));
    }

    @Operation(summary = "Get all read notifications by user ID", description = "Retrieve all read notifications for a user by their user ID")
    @GetMapping("/user/{userId}/read")
    public ResponseEntity<CustomResponse<List<NotificationResponseDTO>>> getReadNotificationsByUserId(
            @Parameter(description = "ID of the user to fetch read notifications for") @PathVariable Long userId) {
        List<Notification> notifications = notificationService.findByUserIdAndIsRead(userId, true);

        // Convert notifications to DTO
        List<NotificationResponseDTO> responseDTOs = notifications.stream()
                .map(NotificationResponseDTO::new)
                .toList();

        // If no read notifications found, return a custom message with an empty list
        if (responseDTOs.isEmpty()) {
            return ResponseEntity
                    .ok(new CustomResponse<>("No read notifications found for user ID: " + userId, responseDTOs));
        }

        // Return read notifications with a custom success message
        return ResponseEntity.ok(new CustomResponse<>("Read notifications retrieved successfully for user ID: " + userId
                + ", Total read notifications: " + responseDTOs.size(), responseDTOs));
    }

    @Operation(summary = "Get all unread notifications by user ID", description = "Retrieve all unread notifications for a user by their user ID")
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<CustomResponse<List<NotificationResponseDTO>>> getUnreadNotificationsByUserId(
            @Parameter(description = "ID of the user to fetch unread notifications for") @PathVariable Long userId) {
        List<Notification> notifications = notificationService.findByUserIdAndIsRead(userId, false);

        // Convert notifications to DTO
        List<NotificationResponseDTO> responseDTOs = notifications.stream()
                .map(NotificationResponseDTO::new)
                .toList();

        // If no unread notifications found, return a custom message with an empty list
        if (responseDTOs.isEmpty()) {
            return ResponseEntity
                    .ok(new CustomResponse<>("No unread notifications found for user ID: " + userId, responseDTOs));
        }

        // Return unread notifications with a custom success message
        return ResponseEntity.ok(new CustomResponse<>("Unread notifications retrieved successfully for user ID: "
                + userId + ", Total unread notifications: " + responseDTOs.size(), responseDTOs));
    }

    @Operation(summary = "Mark a notification as read", description = "Mark a specific notification as read by its ID")
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<CustomResponse<String>> markNotificationAsRead(
            @Parameter(description = "ID of the notification to be marked as read") @PathVariable Long notificationId) {
        boolean updated = notificationService.markAsRead(notificationId);

        if (updated) {
            return ResponseEntity.ok(new CustomResponse<>("Notification marked as read successfully", null));
        } else {
            return ResponseEntity.badRequest().body(new CustomResponse<>("Failed to mark notification as read", null));
        }
    }

    @Operation(summary = "Get notifications by user ID and type", description = "Retrieve notifications for a user filtered by type")
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<CustomResponse<List<NotificationResponseDTO>>> getNotificationsByUserIdAndType(
            @Parameter(description = "ID of the user to fetch notifications for") @PathVariable Long userId,
            @Parameter(description = "Type of notifications to fetch for the user") @PathVariable NotificationType type) {
        List<Notification> notifications = notificationService.findByUserIdAndType(userId, type);

        // Convert notifications to DTO
        List<NotificationResponseDTO> responseDTOs = notifications.stream()
                .map(NotificationResponseDTO::new)
                .toList();

        // Return response
        return ResponseEntity.ok(new CustomResponse<>("Notifications of type " + type + " retrieved", responseDTOs));
    }

    @Operation(summary = "Send a promotion notification to all users", description = "Send a promotion message to all users")
    @PostMapping("/promotion")
    public ResponseEntity<CustomResponse<String>> sendPromotionNotificationToAllUsers(
            @Parameter(description = "Promotion message to be sent to all users") @RequestBody String promotionMessage) {
        // Fetch all users (assuming UserService exists)
        List<User> allUsers = userService.getAllUsers(); // This should return a list of all users

        // Create the promotion notification for each user
        for (User user : allUsers) {
            Notification notification = new Notification();
            notification.setMessage(promotionMessage);
            notification.setUser(user); // Set the full user object
            notification.setType(NotificationType.PROMOTION);
            notification.setRead(false); // New notification, not read
            notification.setCreatedAt(LocalDateTime.now());
            notificationService.createNotification(notification); // Save the notification to the database
        }

        // Return a success response with a custom message
        return ResponseEntity.ok(new CustomResponse<>("Promotion notification sent to all users.", null));
    }
}
