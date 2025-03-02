package com.example.staymate.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.entity.notification.Notification;
import com.example.staymate.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> findByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public List<Notification> findByUserIdAndIsRead(Long userId, boolean isRead) {
        return notificationRepository.findByUserIdAndIsRead(userId, isRead);
    }

    public List<Notification> findByUserIdAndType(Long userId, NotificationType type) {
        return notificationRepository.findByUserIdAndType(userId, type);
    }

    public boolean markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        
        if (notification == null) {
            return false;
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        return true;
    }
    
}

