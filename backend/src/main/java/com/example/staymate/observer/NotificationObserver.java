package com.example.staymate.observer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.staymate.entity.notification.Notification;
import com.example.staymate.service.NotificationService;

@Component
public class NotificationObserver implements Observer {

    @Autowired
    private NotificationService notificationService;

    public NotificationObserver(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public void update(Notification notification) {
        notificationService.createNotification(notification);
    }
}

