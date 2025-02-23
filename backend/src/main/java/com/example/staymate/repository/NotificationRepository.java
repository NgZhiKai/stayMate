package com.example.staymate.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.staymate.entity.enums.NotificationType;
import com.example.staymate.entity.notification.Notification;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);

    List<Notification> findByUserIdAndIsRead(Long userId, boolean isRead);

    List<Notification> findByUserIdAndType(Long userId, NotificationType type);

}
