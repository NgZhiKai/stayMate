package com.example.staymate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.entity.notification.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);

    List<Notification> findByUserIdAndIsRead(Long userId, boolean isRead);

    List<Notification> findByUserIdAndType(Long userId, NotificationType type);

}
