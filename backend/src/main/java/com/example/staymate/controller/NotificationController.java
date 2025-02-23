package com.example.staymate.controller;

import com.example.staymate.dto.notification.NotificationResponseDTO;
import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.entity.notification.Notification;
import com.example.staymate.entity.user.User;
import com.example.staymate.service.NotificationService;
import com.example.staymate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.staymate.dto.custom.CustomResponse;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<CustomResponse<List<NotificationResponseDTO>>> getNotificationsByUserId(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.findByUserId(userId);

        // Convert notifications to DTO
        List<NotificationResponseDTO> responseDTOs = notifications.stream()
            .map(NotificationResponseDTO::new)
            .toList();

        // If no notifications found, return a custom message with an empty list
        if (responseDTOs.isEmpty()) {
            return ResponseEntity.ok(new CustomResponse<>("No notifications found for user ID: " + userId, responseDTOs));
        }

        // Return notifications with a custom success message
        return ResponseEntity.ok(new CustomResponse<>("Notifications retrieved successfully for user ID: " + userId + ", Total notifications: " + responseDTOs.size(), responseDTOs));
    }

    // API to get all read notifications for a user
    @GetMapping("/user/{userId}/read")
    public ResponseEntity<CustomResponse<List<NotificationResponseDTO>>> getReadNotificationsByUserId(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.findByUserIdAndIsRead(userId, true);

        // Convert notifications to DTO
        List<NotificationResponseDTO> responseDTOs = notifications.stream()
            .map(NotificationResponseDTO::new)
            .toList();

        // If no read notifications found, return a custom message with an empty list
        if (responseDTOs.isEmpty()) {
            return ResponseEntity.ok(new CustomResponse<>("No read notifications found for user ID: " + userId, responseDTOs));
        }

        // Return read notifications with a custom success message
        return ResponseEntity.ok(new CustomResponse<>("Read notifications retrieved successfully for user ID: " + userId + ", Total read notifications: " + responseDTOs.size(), responseDTOs));
    }

    // API to get all unread notifications for a user
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<CustomResponse<List<NotificationResponseDTO>>> getUnreadNotificationsByUserId(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.findByUserIdAndIsRead(userId, false);

        // Convert notifications to DTO
        List<NotificationResponseDTO> responseDTOs = notifications.stream()
            .map(NotificationResponseDTO::new)
            .toList();

        // If no unread notifications found, return a custom message with an empty list
        if (responseDTOs.isEmpty()) {
            return ResponseEntity.ok(new CustomResponse<>("No unread notifications found for user ID: " + userId, responseDTOs));
        }

        // Return unread notifications with a custom success message
        return ResponseEntity.ok(new CustomResponse<>("Unread notifications retrieved successfully for user ID: " + userId + ", Total unread notifications: " + responseDTOs.size(), responseDTOs));
    }

    // API to mark a notification as read (optional feature)
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<CustomResponse<String>> markNotificationAsRead(@PathVariable Long notificationId) {
        boolean updated = notificationService.markAsRead(notificationId);

        if (updated) {
            return ResponseEntity.ok(new CustomResponse<>("Notification marked as read successfully", null));
        } else {
            return ResponseEntity.badRequest().body(new CustomResponse<>("Failed to mark notification as read", null));
        }
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<CustomResponse<List<NotificationResponseDTO>>> getNotificationsByUserIdAndType(@PathVariable Long userId, @PathVariable NotificationType type) {
        List<Notification> notifications = notificationService.findByUserIdAndType(userId, type);

        // Convert notifications to DTO
        List<NotificationResponseDTO> responseDTOs = notifications.stream()
            .map(NotificationResponseDTO::new)
            .toList();

        // Return response
        return ResponseEntity.ok(new CustomResponse<>("Notifications of type " + type + " retrieved", responseDTOs));
    }

    @PostMapping("/promotion")
    public ResponseEntity<CustomResponse<String>> sendPromotionNotificationToAllUsers(@RequestBody String promotionMessage) {
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
