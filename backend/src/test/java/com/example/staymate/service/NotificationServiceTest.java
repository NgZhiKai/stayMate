package com.example.staymate.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.entity.notification.Notification;
import com.example.staymate.entity.user.User;
import com.example.staymate.repository.NotificationRepository;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L); // Setting up a mock user
    }

    @Test
    void testCreateNotification() {
        // Prepare mock notification
        Notification notification = new Notification();
        notification.setMessage("Test Notification");
        notification.setUser(user);
        notification.setType(NotificationType.PROMOTION);

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        // Call the service method
        Notification createdNotification = notificationService.createNotification(notification);

        // Validate the result
        assertNotNull(createdNotification);
        assertEquals("Test Notification", createdNotification.getMessage());
        verify(notificationRepository, times(1)).save(notification);
    }

    @Test
    void testFindByUserId() {
        // Prepare mock notification list
        Notification notification = new Notification();
        notification.setMessage("Test Notification");
        notification.setUser(user);
        notification.setType(NotificationType.PROMOTION);

        List<Notification> notifications = List.of(notification);

        when(notificationRepository.findByUserId(anyLong())).thenReturn(notifications);

        // Call the service method
        List<Notification> foundNotifications = notificationService.findByUserId(user.getId());

        // Validate the result
        assertNotNull(foundNotifications);
        assertEquals(1, foundNotifications.size());
        assertEquals("Test Notification", foundNotifications.get(0).getMessage());
    }

    @Test
    void testFindByUserIdAndIsRead() {
        // Prepare mock notification list
        Notification notification = new Notification();
        notification.setMessage("Read Notification");
        notification.setUser(user);
        notification.setType(NotificationType.PROMOTION);
        notification.setRead(true);

        List<Notification> notifications = List.of(notification);

        when(notificationRepository.findByUserIdAndIsRead(anyLong(), anyBoolean())).thenReturn(notifications);

        // Call the service method
        List<Notification> foundNotifications = notificationService.findByUserIdAndIsRead(user.getId(), true);

        // Validate the result
        assertNotNull(foundNotifications);
        assertEquals(1, foundNotifications.size());
        assertTrue(foundNotifications.get(0).isRead());
    }

    @Test
    void testMarkAsRead_Success() {
        // Prepare mock notification
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUser(user);
        notification.setRead(false);

        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        // Call the service method
        boolean result = notificationService.markAsRead(1L);

        // Validate the result
        assertTrue(result);
        assertTrue(notification.isRead());
        verify(notificationRepository, times(1)).save(notification);
    }

    @Test
    void testMarkAsRead_Failure() {
        // Mock the repository to return an empty Optional
        when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

        // Call the service method
        boolean result = notificationService.markAsRead(1L);

        // Validate the result
        assertFalse(result);
        verify(notificationRepository, times(0)).save(any());
    }
}
