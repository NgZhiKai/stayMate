package com.example.staymate.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.entity.notification.Notification;
import com.example.staymate.entity.user.User;
import com.example.staymate.service.NotificationService;
import com.example.staymate.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
public class NotificationControllerTest {

    @Mock
    private NotificationService notificationService;

    @Mock
    private UserService userService;

    @InjectMocks
    private NotificationController notificationController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(notificationController).build();
        objectMapper = new ObjectMapper();
    }

    // Test case for getting notifications by user ID
    @Test
    void testGetNotificationsByUserId_Success() throws Exception {
        Long userId = 1L;
        
        // Create a mock user
        User user = new User();
        user.setId(userId);
        user.setFirstName("John");
        user.setLastName("Doe");
        
        // Mock data for notifications
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUser(user);  // Set the user object directly
        notification.setMessage("Test Notification");
        notification.setCreatedAt(LocalDateTime.now());

        List<Notification> notifications = List.of(notification);
        when(notificationService.findByUserId(userId)).thenReturn(notifications);

        mockMvc.perform(get("/notifications/user/{userId}", userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Notifications retrieved successfully for user ID: 1, Total notifications: 1"))
            .andExpect(jsonPath("$.data[0].notificationId").value(1))
            .andExpect(jsonPath("$.data[0].message").value("Test Notification"));
    }

    @Test
    void testGetNotificationsByUserId_NoNotifications() throws Exception {
        Long userId = 1L;
        
        // Mock empty list for no notifications
        when(notificationService.findByUserId(userId)).thenReturn(List.of());

        mockMvc.perform(get("/notifications/user/{userId}", userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("No notifications found for user ID: 1"))
            .andExpect(jsonPath("$.data").isEmpty());
    }

    // Test case for getting read notifications by user ID
    @Test
    void testGetReadNotificationsByUserId_Success() throws Exception {
        Long userId = 1L;
        
        // Create a mock user
        User user = new User();
        user.setId(userId);
        user.setFirstName("John");
        user.setLastName("Doe");
        
        // Mock data for read notifications
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUser(user);  // Set the user object directly
        notification.setMessage("Read Notification");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(true);

        List<Notification> notifications = List.of(notification);
        when(notificationService.findByUserIdAndIsRead(userId, true)).thenReturn(notifications);

        mockMvc.perform(get("/notifications/user/{userId}/read", userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Read notifications retrieved successfully for user ID: 1, Total read notifications: 1"))
            .andExpect(jsonPath("$.data[0].message").value("Read Notification"));
    }

    @Test
    void testGetReadNotificationsByUserId_NoReadNotifications() throws Exception {
        Long userId = 1L;
        
        // Mock empty list for no read notifications
        when(notificationService.findByUserIdAndIsRead(userId, true)).thenReturn(List.of());

        mockMvc.perform(get("/notifications/user/{userId}/read", userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("No read notifications found for user ID: 1"))
            .andExpect(jsonPath("$.data").isEmpty());
    }

    // Test case for getting unread notifications by user ID
    @Test
    void testGetUnreadNotificationsByUserId_Success() throws Exception {
        Long userId = 1L;
        
        // Create a mock user
        User user = new User();
        user.setId(userId);
        user.setFirstName("John");
        user.setLastName("Doe");
        
        // Mock data for unread notifications
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUser(user);  // Set the user object directly
        notification.setMessage("Unread Notification");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);

        List<Notification> notifications = List.of(notification);
        when(notificationService.findByUserIdAndIsRead(userId, false)).thenReturn(notifications);

        mockMvc.perform(get("/notifications/user/{userId}/unread", userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Unread notifications retrieved successfully for user ID: 1, Total unread notifications: 1"))
            .andExpect(jsonPath("$.data[0].message").value("Unread Notification"));
    }

    @Test
    void testGetUnreadNotificationsByUserId_NoUnreadNotifications() throws Exception {
        Long userId = 1L;
        
        // Mock empty list for no unread notifications
        when(notificationService.findByUserIdAndIsRead(userId, false)).thenReturn(List.of());

        mockMvc.perform(get("/notifications/user/{userId}/unread", userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("No unread notifications found for user ID: 1"))
            .andExpect(jsonPath("$.data").isEmpty());
    }

    // Test case for marking a notification as read
    @Test
    void testMarkNotificationAsRead_Success() throws Exception {
        Long notificationId = 1L;

        // Mock successful update for marking notification as read
        when(notificationService.markAsRead(notificationId)).thenReturn(true);

        mockMvc.perform(put("/notifications/{notificationId}/read", notificationId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Notification marked as read successfully"));
    }

    @Test
    void testMarkNotificationAsRead_Failure() throws Exception {
        Long notificationId = 1L;

        // Mock failed update for marking notification as read
        when(notificationService.markAsRead(notificationId)).thenReturn(false);

        mockMvc.perform(put("/notifications/{notificationId}/read", notificationId))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Failed to mark notification as read"));
    }

    // Test case for getting notifications by user ID and type
    @Test
    void testGetNotificationsByUserIdAndType_Success() throws Exception {
        Long userId = 1L;
        NotificationType type = NotificationType.PROMOTION;
        
        // Create a mock user
        User user = new User();
        user.setId(userId);
        user.setFirstName("John");
        user.setLastName("Doe");
        
        // Mock data for notifications
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUser(user);  // Set the user object directly
        notification.setMessage("Promotion Notification");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setType(type);

        List<Notification> notifications = List.of(notification);
        when(notificationService.findByUserIdAndType(userId, type)).thenReturn(notifications);

        mockMvc.perform(get("/notifications/user/{userId}/type/{type}", userId, type))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Notifications of type PROMOTION retrieved"))
            .andExpect(jsonPath("$.data[0].message").value("Promotion Notification"));
    }

    // Test case for sending promotion notifications to all users
    @Test
    void testSendPromotionNotificationToAllUsers_Success() throws Exception {
        String promotionMessage = "Special promotion for all users!";
        
        // Mock data for users
        User user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        
        List<User> allUsers = List.of(user);
        when(userService.getAllUsers()).thenReturn(allUsers);

        mockMvc.perform(post("/notifications/promotion")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(promotionMessage)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Promotion notification sent to all users."));
    }
}
