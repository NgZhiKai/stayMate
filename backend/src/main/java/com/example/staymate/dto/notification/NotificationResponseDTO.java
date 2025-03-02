package com.example.staymate.dto.notification;

import java.time.LocalDateTime;

import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.entity.notification.Notification;

public class NotificationResponseDTO {
    private Long notificationId;
    private Long userId;
    private String message;
    private NotificationType notificationType;
    private boolean isread;
    private LocalDateTime createdAt;

    public NotificationResponseDTO(Notification notification) {
        this.notificationId = notification.getId();
        this.userId = notification.getUser().getId();
        this.message = notification.getMessage();
        this.notificationType = notification.getType();
        this.isread = notification.isRead();
        this.createdAt = notification.getCreatedAt();
    }

    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public boolean isIsread() {
        return isread;
    }

    public void setIsread(boolean isread) {
        this.isread = isread;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    
}
