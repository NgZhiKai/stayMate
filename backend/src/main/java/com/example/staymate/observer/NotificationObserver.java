package com.example.staymate.observer;

import java.util.Map;

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
    public void update(Map<String, Object> data) {
        notificationService.createNotification((Notification) data.get("notification"));
    }

}
